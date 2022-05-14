import React, { useState } from 'react'
import { useRecipeContext } from '../contexts/RecipeContext'
import './HeaderMenu.css'

export const HeaderMenu = () => {
  const { createRecipe, recipes, currentRecipe, setCurrentRecipe } = useRecipeContext()

  const [menuOpen, setMenuOpen] = useState(false)
  const [newRecipeTitle, setNewRecipeTitle] = useState('')

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
          <h4>Recipes</h4>
          <ul>
            {recipes.map((recipe, index) => {
              return (
                <li className="header-menu-recipe">
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
