import React, { createContext, useContext, useEffect, useState } from 'react'
import { saveAs } from 'file-saver'
import { HUMAN_TASK, TASK_PARAMETERS } from '../constants'

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
    // Load local recipes and/or get them from parent window (if embedded)
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
  }, [])

  useEffect(() => {
    validateRecipe()
  }, [recipes])

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
      document.getElementsByName('new-recipe-title')[0]?.focus()
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
    const newSteps = [...recipes[currentRecipe].steps]

    newSteps.push(newStep)

    updateRecipe(recipes[currentRecipe].title, newSteps)
  }

  const updateStep = (step, position) => {
    let newSteps = [...recipes[currentRecipe].steps]

    newSteps[position] = { ...step, next: position + 1 }
    updateRecipe(recipes[currentRecipe].title, newSteps)
  }

  const deleteStep = stepIndex => {
    let newSteps = [...recipes[currentRecipe].steps]
    newSteps.splice(stepIndex, 1)
    // we need to update every reference to a step after stepIndex by decrementing it
    newSteps.forEach(step => {
      step.options?.forEach(option => {
        if (option?.next > stepIndex) {
          option.next--
        }
      })
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

    if (newIndex < currentIndex) {
      // If we moved a step backwards in the arran
      // we need to update every reference to a step between newIndex and currentIndex by incrementing it
      newSteps.forEach(step => {
        step.options?.forEach(option => {
          if (option?.next >= newIndex && option?.next < currentIndex) {
            option.next++
          } else if (option?.next === currentIndex) {
            // finally we need to update every reference to currentIndex to newIndex
            option.next = newIndex
          }
        })
      })
    } else {
      // If we moved a step forwards in the array
      // we need to update every reference to a step between currentIndex and newIndex by decrementing it
      newSteps.forEach(step => {
        step.options?.forEach(option => {
          if (option?.next > currentIndex && option?.next < newIndex) {
            option.next--
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

  const validateTask = ({ baseTask, parameters, options }, stepIndex) => {
    const taskErrors = []
    switch (baseTask) {
      case HUMAN_TASK:
        if (!options || options.length === 0) {
          const errorMessage = `Step ${stepIndex} has no options`
          taskErrors.push(errorMessage)
        } else {
          options.forEach((option, optionIndex) => {
            if (typeof option.next === 'undefined' || !option?.text) {
              const errorMessage = `Step ${stepIndex} option ${optionIndex} is incomplete`
              taskErrors.push(errorMessage)
            }
            if (!recipes[currentRecipe].steps[option?.next]) {
              const errorMessage = `Step ${stepIndex} option ${optionIndex} points to missing step`
              taskErrors.push(errorMessage)
            }
          })
        }
        // TODO: Options must have unique text
        break
      default:
        TASK_PARAMETERS[baseTask]?.forEach(parameter => {
          if (!parameters[parameter]) {
            const errorMessage = `Step ${stepIndex} missing parameter ${parameter}`
            taskErrors.push(errorMessage)
          }
        })
    }

    // TODO: Validate steps
    //    Every automated step has a next [that is one more than its index unless we let the user set this.]
    //    Every step has a next or options or done (and only one of them)
    //    At least one step has a done
    //      The last step has a done
    //    Every step with andMaintainTemperature has heat/cool and temp params

    return taskErrors
  }

  const validateRecipe = () => {
    const recipe = recipes[currentRecipe]

    let newStepErrors = {}
    let currentStepErrors = null
    // The recipe must have steps and steps.length must be 1 or greater.

    recipe?.steps?.forEach((step, index) => {
      currentStepErrors = validateTask({ ...step, task: step.baseTask }, index)
      if (currentStepErrors.length > 0) {
        newStepErrors[index] = currentStepErrors
      }
    })

    setStepErrors(newStepErrors)

    // Validate title
    //    No illegal characters - alphanumeric only
    // Highlight any steps and fields with issues
  }

  const exportRecipe = () => {
    const title = recipes[currentRecipe].title
    const steps = recipes[currentRecipe].steps

    // For any step with andStir set, set the sub-tasks array to include a stirring step. Same for maintaining heat or cooling.
    steps.forEach(step => {
      step.tasks = []
      if (step.andStir && step?.parameters?.time) {
        // If we have a stirring task and it has a duration, add a stirring sub-task with the same duration
        step.tasks.push({
          baseTask: 'stir',
          parameters: { time: step.parameters.time },
        })
      }
      if (step.andMaintainTemp && step.andMaintainTempTemp && step?.parameters?.time) {
        step.tasks.push({
          baseTask: step.andMaintainTemp,
          parameters: { time: step.parameters.time, temp: step.andMaintainTempTemp, tolerance: 1 },
        })
      }
    })

    steps[steps.length - 1].done = true

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
        validateRecipe,
      }}
    >
      {children}
    </RecipeContext.Provider>
  )
}
