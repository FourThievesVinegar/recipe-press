import React from 'react'
import { HUMAN_TASK, PUMP_TASK } from '../constants'

export const RecipeStepSubtasks = ({step, updateStep, stepIndex}) => {
  const handleAndStirChange = (checked) => {
    // Rather than setting up sub-tasks here (which could require syncing duration between the baseTask)
    // We will add a flag and add/update the stirring subtask at recipe export.
    updateStep({...step, andStir: checked}, stepIndex)
  }

  if (step.baseTask === HUMAN_TASK || step.baseTask === PUMP_TASK) {
    // No subtasks on these steps for now. See exportRecipe in RecipeContext.js for more details
    return null
  }

  return (
      <>
        <input 
          type='checkbox' 
          name='and-stir' 
          checked={step.andStir} 
          onChange={e => handleAndStirChange(e.currentTarget.checked)}
        />
        <label htmlFor='and-stir' >... and stir?</label>
      </>
  )
}