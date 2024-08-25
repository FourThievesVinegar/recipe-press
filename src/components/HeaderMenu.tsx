import React, { useState } from 'react'
import { NewRecipeForm } from './NewRecipeForm'
import { useRecipeContext } from '../contexts/RecipeContext'
import './HeaderMenu.css'
import { useTranslation } from 'react-i18next'

export const HeaderMenu = () => {
  const { t } = useTranslation()
  const { recipes, embedded, setCurrentRecipe } = useRecipeContext()

  const [menuOpen, setMenuOpen] = useState(false)

  if (embedded) return null

  return (
    <>
      <button
        onClick={() => {
          setMenuOpen(!menuOpen)
        }}
      >
        {t('menu')}
      </button>
      {menuOpen && (
        <nav className="header-menu">
          <div className="header-menu-buttons">
            <NewRecipeForm />
          </div>
          <h4>{t('recipes')}</h4>
          <ul>
            {recipes.map((recipe, index) => {
              return (
                <li className="header-menu-recipe" key={index}>
                  <a
                    href={`#recipe-${index}`}
                    onClick={() => {
                      setCurrentRecipe(index)
                      setMenuOpen(false)
                    }}
                  >
                    {recipe.title}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </>
  )
}
