import React from 'react'
import { useRecipeContext } from '../contexts/RecipeContext'

export const RecipeOverviewStep = ({ step, index }) => {
  const { setCurrentStep } = useRecipeContext()
  return (
    <div
      className={`recipe-overview-step ${
        !step.baseTask || step.baseTask === 'noTask' ? 'human-task' : 'automated-task'
      }`}
      onClick={() => setCurrentStep(index)}
    >
      <p>{step.message}</p>
    </div>
  )
}
