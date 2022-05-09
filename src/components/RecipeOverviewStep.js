import React from 'react'
import { useRecipeContext } from '../contexts/RecipeContext'

export const RecipeOverviewStep = ({ step, index }) => {
  const { setCurrentStep } = useRecipeContext()
  return (
    <div
      className={`recipe-overview-step ${!step.baseTask ? 'human-task' : 'automated-task'}`}
      onClick={() => setCurrentStep(index)}
    >
      <p>{step.nr}</p>
      <p>{step.message}</p>
    </div>
  )
}
