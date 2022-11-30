import React from 'react'
import { NewRecipeForm } from './NewRecipeForm'
import { RecipeOverviewStep } from './RecipeOverviewStep'
import { useRecipeContext } from '../contexts/RecipeContext'

import './RecipeOverview.css'

export const RecipeOverview = () => {
  const { recipes, currentRecipe, currentStep, embedded, setCurrentStep } = useRecipeContext()
  if (!embedded && recipes.length === 0) {
    return <NewRecipeForm />
  }
  return (
    <div className="recipe-overview">
      <div className="recipe-overview-steps">
        {recipes[currentRecipe]?.steps?.map((step, index) => {
          return (
            <RecipeOverviewStep
              step={step}
              index={index}
              isCurrentStep={currentStep === index}
              key={index + step.message}
            />
          )
        })}
      </div>
      <div className="recipe-overview-controls">
        <button
          onClick={() => {
            setCurrentStep(-1)
          }}
        >
          New Step
        </button>
      </div>
    </div>
  )
}
