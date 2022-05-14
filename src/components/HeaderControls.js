import React from 'react'
import { useRecipeContext } from '../contexts/RecipeContext'

export const HeaderControls = () => {
  const { exportRecipe } = useRecipeContext()
  return (
    <>
      <button
        onClick={() => {
          exportRecipe()
        }}
      >
        Download Recipe
      </button>
    </>
  )
}
