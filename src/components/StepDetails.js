import React from 'react'
import { useRecipeContext } from '../contexts/RecipeContext'
import { NewStep } from './NewStep'
import { RecipeStep } from './RecipeStep'
import './StepDetails.css'

export const StepDetails = () => {
  const { recipes, currentRecipe, currentStep, setCurrentStep } = useRecipeContext()

  const step = recipes[currentRecipe].steps[currentStep]

  return (
    <>
      <div className="step-details-buttons">
        <button
          onClick={() => {
            setCurrentStep(-1)
          }}
        >
          New Step
        </button>
      </div>
      <div className="step-details">
        {step ? <RecipeStep step={step} index={currentStep} /> : <NewStep />}
      </div>
    </>
  )
}
