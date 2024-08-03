import React, { createContext, useContext, useEffect, useState } from 'react'
import { saveAs } from 'file-saver'
import { TASK_PARAMETERS, TaskType } from '../constants'

export type RecipeStepType = {
  baseTask: TaskType
  parameters: any
  tasks?: {
    baseTask: TaskType
    parameters: any
  }[]
  message: string
  next?: number
  options?: {
    text: string
    next: number
  }[]
  details?: string
  icon?: string
  done?: boolean
  andStir?: boolean
  andMaintainTemp?: TaskType.MAINTAIN_COOL_TASK | TaskType.MAINTAIN_HEAT_TASK
  andMaintainTempTemp?: number
}
export type Recipe = {
  steps: RecipeStepType[]
  title: string
}

export type RecipeContext = {
  createRecipe: (title: string, steps?: RecipeStepType[]) => void
  createStep: (message: string, baseTask: TaskType, parameters?: any, description?: string) => void
  deleteStep: (stepIndex: number) => void
  currentRecipe: number
  embedded: boolean
  setCurrentRecipe: (recipeIndex: number) => void
  currentStep: number
  setCurrentStep: (stepIndex: number) => void
  exportRecipe: () => void
  recipes: Recipe[]
  reorderStep: (newIndex: number, currentIndex: number) => void
  reportStepError: (stepIndex: number, errorMessage: string) => void
  stepErrors: string[]
  updateStep: (step: RecipeStepType, position: number) => void
  validateRecipe: () => void
}
//@ts-ignore
export const RecipeContext = createContext<RecipeContext>()

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

export const RecipeProvider = ({ children }: React.PropsWithChildren) => {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [currentRecipe, setCurrentRecipe] = useState<number>(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [embedded, setEmbedded] = useState(false)

  const [stepErrors, setStepErrors] = useState<any>({})

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
    return JSON.parse(localStorage.getItem('recipes') ?? '[]')
  }

  const saveLocalRecipes = (recipes: Recipe[]) => {
    localStorage.setItem('recipes', JSON.stringify(recipes))
  }

  const requestRecipeFromParent = () => {
    const message = { messageType: MESSAGE_TYPES.RECIPE_REQUEST }
    console.log('Requesting recipe from parent', message)
    window.parent.postMessage(message, PARENT_DOMAIN)
  }

  const sendRecipeToParent = (newRecipe: Recipe) => {
    const message = { messageType: MESSAGE_TYPES.RECIPE, payload: newRecipe }
    console.log('Sending recipe message to parent', message)
    window.parent.postMessage(message, PARENT_DOMAIN)
  }

  const handleMessageFromParent = (event: any) => {
    switch (event.data.messageType) {
      case MESSAGE_TYPES.RECIPE: {
        const parentRecipe = event.data.payload
        console.log('GOT RECIPE FROM PARENT', event.data)
        createRecipe(parentRecipe.title, parentRecipe.steps)
        return
      }
      default: {
        console.log('UNHANDLED MESSAGE FROM PARENT', event)
      }
    }
  }

  const createRecipe = (title: string, steps?: RecipeStepType[]) => {
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

  const createStep = (
    message: string,
    baseTask: TaskType,
    parameters?: any,
    description?: string
  ) => {
    const newStep = { message, baseTask, parameters, description }
    const newSteps = [...recipes[currentRecipe].steps]

    newSteps.push(newStep)

    updateRecipe(recipes[currentRecipe].title, newSteps)
  }

  const updateStep = (step: RecipeStepType, position: number) => {
    const newSteps = [...recipes[currentRecipe].steps]

    newSteps[position] = { ...step, next: position + 1 }
    updateRecipe(recipes[currentRecipe].title, newSteps)
  }

  const deleteStep = (stepIndex: number) => {
    const newSteps = [...recipes[currentRecipe].steps]
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

  const reorderStep = (newIndex: number, currentIndex: number) => {
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

  const updateRecipe = (title: string, steps: RecipeStepType[]) => {
    let newRecipe = null
    const newRecipes = recipes.map((recipe, index) => {
      if (index === currentRecipe) {
        const newSteps = [...steps]
        newSteps.forEach((step, index) => {
          step.done = false
          if (!step.baseTask || step.baseTask === TaskType.HUMAN_TASK) {
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
    if (embedded && newRecipe) {
      sendRecipeToParent(newRecipe)
    } else {
      saveLocalRecipes(newRecipes)
    }
    setRecipes(newRecipes)
  }

  const reportStepError = (stepIndex: number, errorMessage: string) => {
    if (stepErrors[stepIndex] !== errorMessage) {
      setStepErrors({ ...stepErrors, [stepIndex]: errorMessage })
    }
  }

  const validateTask = ({ baseTask, parameters, options }: RecipeStepType, stepIndex: number) => {
    const taskErrors = []
    switch (baseTask) {
      case TaskType.HUMAN_TASK:
        if (
          stepIndex < recipes[currentRecipe]?.steps.length - 1 &&
          (!options || options.length === 0)
        ) {
          const errorMessage = `Step ${stepIndex} has no options`
          taskErrors.push(errorMessage)
        } else {
          options?.forEach((option, optionIndex: number) => {
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
    //    Every temp param is a number
    //    Every time param is a number

    return taskErrors
  }

  const validateRecipe = () => {
    const recipe = recipes[currentRecipe]

    const newStepErrors: any = {}
    let currentStepErrors = null
    // The recipe must have steps and steps.length must be 1 or greater.

    recipe?.steps?.forEach((step, index) => {
      //bug?
      //@ts-ignore
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
          baseTask: TaskType.STIR_TASK,
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

    const recipeString = `
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
