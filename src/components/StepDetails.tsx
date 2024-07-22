import React from 'react'
import { useRecipeContext } from '../contexts/RecipeContext'
import { NewStep } from './NewStep'
import { RecipeStep } from './RecipeStep'
import './StepDetails.css'

export const StepDetails = () => {
  const { embedded, recipes, currentRecipe, currentStep } = useRecipeContext()

  const step = recipes[currentRecipe]?.steps[currentStep]

  if (step === null) return

  if (!embedded && recipes.length === 0) {
    return <p>Create a recipe in order to add steps!</p>
  }

  return (
    <section>
      {currentStep > -1 && step !== undefined ? <h2>Editing Step {currentStep}</h2> : null}

      <div className="step-details">
        {step ? <RecipeStep step={step} index={currentStep} /> : <NewStep />}
      </div>
    </section>
  )
}
