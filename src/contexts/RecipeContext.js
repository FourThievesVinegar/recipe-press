import React, { createContext, useContext, useState } from 'react'
import { saveAs } from 'file-saver'
import dummyRecipeData from './DummyRecipeData.json'

export const RecipeContext = createContext({})

export const useRecipeContext = () => {
  const context = useContext(RecipeContext)

  if (!context) {
    console.log('ERROR! Recipe context used outside its provider')
  }

  return context
}

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([dummyRecipeData])
  const [currentRecipe, setCurrentRecipe] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const createRecipe = (title, steps) => {
    if (!title) {
      console.log('You must have a title!')
      return
    }
    const newRecipe = {
      title,
      steps: steps ? steps : [],
    }

    setRecipes([...recipes, newRecipe])
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

  const updateRecipe = (title, steps) => {
    const newRecipes = recipes.map((recipe, index) => {
      if (index === currentRecipe) {
        return { ...recipe, steps }
      }
      return recipe
    })

    setRecipes(newRecipes)
  }

  const exportRecipe = () => {
    const title = recipes[currentRecipe].title
    const steps = recipes[currentRecipe].steps

    steps[steps.length - 1].done = true
    // Validate steps
    // Make sure every human task has options
    // Make sure every step has a next (or options?)
    // Make sure at least one step has a done (the last one?)
    // Make sure every option has a text and a next

    var recipeString = `from recipes import base

recipe = base.Recipe(
    {
      'title': '${title}',
      'steps': ${JSON.stringify(steps)}
    }
  )
`
    recipeString = recipeString.replaceAll('true', 'True')

    // Sanitize title
    // Make sure numerical values are numbers

    saveAs(new Blob([recipeString], { type: 'application/python' }), `${title}.py`) //When the microlab can read it, change to .4tv
  }

  return (
    <RecipeContext.Provider
      value={{
        createRecipe,
        createStep,
        currentRecipe,
        setCurrentRecipe,
        currentStep,
        setCurrentStep,
        exportRecipe,
        recipes,
        updateStep,
      }}
    >
      {children}
    </RecipeContext.Provider>
  )
}
