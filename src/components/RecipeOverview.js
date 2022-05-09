import React from 'react'
import { RecipeOverviewStep } from './RecipeOverviewStep'
import { useRecipeContext } from '../contexts/RecipeContext'

import './RecipeOverview.css'

export const RecipeOverview = () => {
  const { recipes, currentRecipe } = useRecipeContext()
  return (
    <div className="recipe-overview">
      <div className="recipe-overview-steps">
        {recipes[currentRecipe].steps.map((step, index) => {
          return <RecipeOverviewStep step={step} index={index} />
        })}
      </div>
      <div className="recipe-overview-bottom-bar">
        <button>Expand / collapse</button>
      </div>
    </div>
  )
}
