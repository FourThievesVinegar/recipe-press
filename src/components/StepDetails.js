import React from 'react'
import { useRecipeContext } from '../contexts/RecipeContext'
import { NewStep } from './NewStep'
import { RecipeStep } from './RecipeStep'
import './StepDetails.css'

export const StepDetails = () => {
  const { recipes, currentRecipe, currentStep } = useRecipeContext()

  const step = recipes[currentRecipe].steps[currentStep]

  return (
    <>
      <div className="step-details-buttons"></div>
      <div className="step-details">
        {step ? <RecipeStep step={step} index={currentStep} /> : <NewStep />}
      </div>
    </>
  )
}
