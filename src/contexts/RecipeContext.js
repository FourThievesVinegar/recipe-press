import React, { createContext, useContext, useEffect, useState } from 'react'
import { saveAs } from 'file-saver'
import { HUMAN_TASK } from '../constants'

export const RecipeContext = createContext({})

const MESSAGE_TYPES = {
  RECIPE: 'recipe',
  RECIPE_REQUEST: 'recipe request',
}

const PARENT_DOMAIN = 'https://vinni.fourthievesvinegar.org'

export const useRecipeContext = () => {
  const context = useContext(RecipeContext)

  if (!context) {
    console.log('ERROR! Recipe context used outside its provider')
  }

  return context
}

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([])
  const [currentRecipe, setCurrentRecipe] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [embedded, setEmbedded] = useState(false)

  const [stepErrors, setStepErrors] = useState({})

  useEffect(() => {
    const localRecipes = getLocalRecipes()

    if (window.location.search.includes('embedded=true')) {
      setEmbedded(true)
      window.addEventListener('message', handleMessageFromParent, false)
      requestRecipeFromParent()
    } else {
      if (localRecipes) {
        setRecipes(localRecipes)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getLocalRecipes = () => {
    return JSON.parse(localStorage.getItem('recipes'))
  }

  const saveLocalRecipes = recipes => {
    localStorage.setItem('recipes', JSON.stringify(recipes))
  }

  const requestRecipeFromParent = () => {
    const message = { messageType: MESSAGE_TYPES.RECIPE_REQUEST }
    console.log('Requesting recipe from parent', message)
    window.parent.postMessage(message, PARENT_DOMAIN)
  }

  const sendRecipeToParent = newRecipe => {
    const message = { messageType: MESSAGE_TYPES.RECIPE, payload: newRecipe }
    console.log('Sending recipe message to parent', message)
    window.parent.postMessage(message, PARENT_DOMAIN)
  }

  const handleMessageFromParent = event => {
    console.log(event)
    switch (event.data.messageType) {
      case MESSAGE_TYPES.RECIPE: {
        let parentRecipe = event.data.payload
        console.log('GOT RECIPE FROM PARENT', event.data)
        createRecipe(parentRecipe.title, parentRecipe.steps)
        return
      }
      default: {
        console.log('UNHANDLED MESSAGE FROM PARENT', event)
      }
    }
  }

  const createRecipe = (title, steps) => {
    if (!title) {
      document.getElementsByName("new-recipe-title")[0]?.focus()
      console.log('You must have a title!')
      return
    }
    const newRecipe = {
      title,
      steps: steps ? steps : [],
    }

    const newRecipies = [...recipes, newRecipe]

    saveLocalRecipes(newRecipies)
    setRecipes(newRecipies)
  }

  const createStep = (message, baseTask, parameters, description) => {
    const newStep = { message, baseTask, parameters, description }
    const newSteps = [...recipes[currentRecipe]?.steps]

    newSteps.push(newStep)

    updateRecipe(recipes[currentRecipe].title, newSteps)
  }

  const updateStep = (step, position) => {
    let newSteps = [...recipes[currentRecipe].steps]

    newSteps[position] = { ...step, next: position + 1 }
    updateRecipe(recipes[currentRecipe].title, newSteps)
  }

  const deleteStep = (stepIndex) => {
    let newSteps = [...recipes[currentRecipe].steps]
    newSteps.splice(stepIndex, 1)
    // we need to update every reference to a step after stepIndex by decrementing it
    newSteps.forEach(step => {
      step.options?.forEach(option => {
        if (option?.next > stepIndex) {
          option.next--;
      }})
    })
    updateRecipe(recipes[currentRecipe].title, newSteps)
  }

  const reorderStep = (newIndex, currentIndex) => {
    const oldSteps = [...recipes[currentRecipe].steps]
    const newStep = { ...oldSteps[currentIndex] }

    const newSteps =
      newIndex < currentIndex
        ? [
          ...oldSteps.slice(0, newIndex),
          newStep,
          ...oldSteps.slice(newIndex, currentIndex),
          ...oldSteps.slice(currentIndex + 1, oldSteps.length),
        ]
        : [
          ...oldSteps.slice(0, currentIndex),
          ...oldSteps.slice(currentIndex + 1, newIndex),
          newStep,
          ...oldSteps.slice(newIndex, oldSteps.length),
        ]

        console.log(newIndex, currentIndex)

    if(newIndex < currentIndex) { // If we moved a step backwards in the arran
      // we need to update every reference to a step between newIndex and currentIndex by incrementing it
      newSteps.forEach(step => {
        step.options?.forEach(option => {
          if (option?.next >= newIndex && option?.next < currentIndex) {
            console.log("incrementing", option?.next)
            option.next++;
          } else if (option?.next === currentIndex) {
                // finally we need to update every reference to currentIndex to newIndex
            console.log("updating 1", option?.next)
            option.next = newIndex
          }
        })
      })
    } else {  // If we moved a step forwards in the arrey
      // we need to update every reference to a step between currentIndex and newIndex by decrementing it
      newSteps.forEach(step => {
        step.options?.forEach(option => {
          if (option?.next > currentIndex && option?.next < newIndex) {
            option.next--;
          } else if (option?.next === currentIndex) {
            // finally we need to update every reference to currentIndex to newIndex
            option.next = newIndex - 1
          }
        })
      })
    }

    updateRecipe(recipes[currentRecipe].title, newSteps)
  }

  const updateRecipe = (title, steps) => {
    let newRecipe = null
    const newRecipes = recipes.map((recipe, index) => {
      if (index === currentRecipe) {
        const newSteps = [...steps]
        newSteps.forEach((step, index) => {
          step.done = false
          if (!step.baseTask || step.baseTask === HUMAN_TASK) {
            delete step.next
          } else {
            step.next = index + 1
          }
          // If this is the last step, it is an ending step.
          if (index === newSteps.length - 1) {
            step.done = true
            delete step.next
          }
        })
        newRecipe = { ...recipe, steps: newSteps }
        return newRecipe
      }
      return recipe
    })
    if (embedded) {
      sendRecipeToParent(newRecipe)
    } else {
      saveLocalRecipes(newRecipes)
    }
    setRecipes(newRecipes)
  }

  const reportStepError = (stepIndex, errorMessage) => {
    if (stepErrors[stepIndex] !== errorMessage) {
      setStepErrors({ ...stepErrors, [stepIndex]: errorMessage })
    }
  }

  const exportRecipe = () => {
    const title = recipes[currentRecipe].title
    const steps = recipes[currentRecipe].steps

    // For any step with andStir set, set the sub-tasks array to include (only) a stirring step.
    // This is not elegant, but it's currently the only use of sub-tasks, so it's OK for now.
    // In the future, we probably want to support human tasks with stirring and temperature control but for now we don't.
    steps.forEach(step => {
      if(step.andStir && step?.parameters?.time) {
        // If we have a stirring task and it has a duration, add a stirring sub-task with the same duration
        step.tasks = [
          {
            "baseTask": "stir",
            "parameters": { "time": step.parameters.time }
          }
        ]
      }
    })

    steps[steps.length - 1].done = true

    // TODO: Validate steps
    //    Every human task has options
    //      Every option has a text and a next
    //      Every next is a valid step
    //      Can a step loop back to itself? Probably not?
    //    Every automated step has a next [that is one more than its index unless we let the user set this.]
    //    Every step has a next or options or done (and only one of them)
    //    At least one step has a done
    //      The last step has a done
    //    Every pump step has a pump and an amount specified
    //    Every non-human task has a duration
    //    Every sub-task has a duration (for now, only stirring is going to be used)
    // Validate title
    //    No illegal characters - alphanumeric only
    // Highlight any steps and fields with issues

    var recipeString = `
    {
      "title": "${title}",
      "steps": ${JSON.stringify(steps)}
    }`

    // Sanitize title
    // Make sure numerical values are numbers

    saveAs(new Blob([recipeString], { type: 'application/json' }), `${title}.json`) //When the microlab can read it, change to .4tv
  }

  return (
    <RecipeContext.Provider
      value={{
        createRecipe,
        createStep,
        deleteStep,
        currentRecipe,
        embedded,
        setCurrentRecipe,
        currentStep,
        setCurrentStep,
        exportRecipe,
        recipes,
        reorderStep,
        reportStepError,
        stepErrors,
        updateStep,
      }}
    >
      {children}
    </RecipeContext.Provider>
  )
}
