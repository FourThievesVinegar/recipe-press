import React, { createContext, useContext, useEffect, useState } from 'react'
import { saveAs } from 'file-saver'
// import dummyRecipeData from './DummyRecipeData.json'

export const RecipeContext = createContext({})

export const HUMAN_TASK = 'humanTask'

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

  const createStep = (message, baseStep, parameters, description) => {
    const newStep = { message, baseStep, parameters, description }
    const newSteps = [...recipes[currentRecipe].steps]

    newSteps.push(newStep)

    updateRecipe(recipes[currentRecipe].title, newSteps)
  }

  const updateStep = (step, position) => {
    let newSteps = [...recipes[currentRecipe].steps]

    newSteps[position] = { ...step, next: position + 1 }
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

    steps[steps.length - 1].done = true
    // Validate steps
    //    Every human task has options
    //      Every option has a text and a next
    //      Every next is a valid step
    //      Can a step loop back to itself? Probably not?
    //    Every automated step has a next that is one more than its index
    //    Every step has a next or options or done (and only one of them)
    //    At least one step has a done
    //      The last step has a done
    // Validate title
    //    No illegal characters - alphanumeric only

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
