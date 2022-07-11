import React from 'react'
import { HeaderMenu } from './HeaderMenu'
import { useRecipeContext } from '../contexts/RecipeContext'
import { useRecipeSimulatorContext } from '../contexts/RecipeSimulatorContext'

export const HeaderControls = () => {
  const { exportRecipe } = useRecipeContext()
  const { simulateRecipe } = useRecipeSimulatorContext()
  return (
    <span className="header-controls">
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
      <HeaderMenu />
    </span>
  )
}
