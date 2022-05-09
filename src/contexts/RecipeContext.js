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
  return (
    <RecipeContext.Provider
      value={{ currentRecipe, setCurrentRecipe, currentStep, setCurrentStep, recipes }}
    >
      {children}
    </RecipeContext.Provider>
  )
}
