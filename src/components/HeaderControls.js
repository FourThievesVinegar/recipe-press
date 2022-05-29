import React from 'react'
import { useRecipeContext } from '../contexts/RecipeContext'
import { useRecipeSimulatorContext } from '../contexts/RecipeSimulatorContext'

export const HeaderControls = () => {
  const { exportRecipe } = useRecipeContext()
  const { simulateRecipe } = useRecipeSimulatorContext()
  return (
    <div className="header-controls">
      <button
        onClick={() => {
          simulateRecipe()
        }}
      >
        Simulate
      </button>
      <button
        onClick={() => {
          exportRecipe()
        }}
      >
        Download Recipe
      </button>
    </div>
  )
}
