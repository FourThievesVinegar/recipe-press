import { useState } from 'react'
import { useRecipeContext } from '../contexts/RecipeContext'

import './NewRecipeForm.css'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const NewRecipeForm = () => {
  const { t } = useTranslation()
  const [newRecipeTitle, setNewRecipeTitle] = useState('')
  const { createRecipe } = useRecipeContext()

  return (
    <div className="new-recipe-form">
      <input
        name="new-recipe-title"
        value={newRecipeTitle}
        placeholder={t('new-recipe-title')}
        onChange={e => {
          setNewRecipeTitle(e.target.value)
        }}
      />
      <button
        onClick={() => {
          createRecipe(newRecipeTitle)
        }}
      >
        {t('new-recipe')}
      </button>
    </div>
  )
}
