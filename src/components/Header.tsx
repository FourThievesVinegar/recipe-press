import React from 'react'
import logo from '../logo.png'
import './Header.css'
import { HeaderControls } from './HeaderControls'
import { useRecipeContext } from '../contexts/RecipeContext'
import { useTranslation } from 'react-i18next'

export const AppHeader = () => {
  const { t } = useTranslation()
  const { currentRecipe, recipes } = useRecipeContext()

  const recipeTitle = recipes[currentRecipe]?.title

  return (
    <header className="App-header">
      <div className="title-container">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="title-font">
          {t('Recipe Press')}
          {recipeTitle ? ` - ${recipeTitle}` : ''}
        </h1>
      </div>
      <HeaderControls />
    </header>
  )
}
