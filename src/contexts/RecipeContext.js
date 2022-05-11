import React, { createContext, useContext, useState } from 'react'
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

  const createStep = (message, baseStep, parameters) => {
    const newStep = { message, baseStep, parameters }
    const newSteps = [...recipes[currentRecipe].steps]

    newSteps.push(newStep)

    updateRecipe(recipes[currentRecipe].title, newSteps)
  }

  const updateStep = (step, position) => {
    let newSteps = [...recipes[currentRecipe].steps]

    newSteps[position] = step
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

  return (
    <RecipeContext.Provider
      value={{
        createRecipe,
        createStep,
        currentRecipe,
        setCurrentRecipe,
        currentStep,
        setCurrentStep,
        recipes,
        updateStep,
      }}
    >
      {children}
    </RecipeContext.Provider>
  )
}
