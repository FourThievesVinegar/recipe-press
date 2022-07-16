import React, { useState } from 'react'
import { NewRecipeForm } from './NewRecipeForm'
import { useRecipeContext } from '../contexts/RecipeContext'
import './HeaderMenu.css'

export const HeaderMenu = () => {
  const { recipes, setCurrentRecipe } = useRecipeContext()

  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => {
          setMenuOpen(!menuOpen)
        }}
      >
        Menu
      </button>
      {menuOpen && (
        <nav className="header-menu">
          <div className="header-menu-buttons">
            <NewRecipeForm />
          </div>
          <h4>Recipes</h4>
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
