import React, { useState } from 'react'
import { useRecipeContext } from '../contexts/RecipeContext'
import logo from '../logo.png'
import './Header.css'

export const AppHeader = () => {
  return (
    <header className="App-header">
      <HeaderMenu />
      <img src={logo} className="App-logo" alt="logo" />
    </header>
  )
}

const HeaderMenu = () => {
  const { recipes, currentRecipe, setCurrentRecipe } = useRecipeContext()

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
        <nav>
          <ul>
            {recipes.map((recipe, index) => {
              return (
                <li>
                  <a
                    href={`#recipe-${index}`}
                    onClick={() => {
                      setCurrentRecipe(index)
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
