import { useState } from 'react'
import { useRecipeContext } from '../contexts/RecipeContext'

import './NewRecipeForm.css'
import React from 'react'

export const NewRecipeForm = () => {
  const [newRecipeTitle, setNewRecipeTitle] = useState('')
  const { createRecipe } = useRecipeContext()

  return (
    <div className="new-recipe-form">
      <input
        name="new-recipe-title"
        value={newRecipeTitle}
        placeholder="New Recipe Title"
        onChange={e => {
          setNewRecipeTitle(e.target.value)
        }}
      />
      <button
        onClick={() => {
          createRecipe(newRecipeTitle)
        }}
      >
        New Recipe
      </button>
    </div>
  )
}
