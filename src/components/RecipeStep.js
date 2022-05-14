import React from 'react'

import { recipeStepBaseTasks } from '../constants'
import { useRecipeContext } from '../contexts/RecipeContext'

import './RecipeStep.css'
import { RecipeStepParameters } from './RecipeStepParameters'

export const RecipeStep = ({ step, position }) => {
  const { updateStep } = useRecipeContext()

  return (
    <div className="recipe-step">
      <label htmlFor="message">User message</label>
      <textarea
        name="message"
        value={step.message}
        onChange={e => {
          updateStep({ ...step, message: e.target.value }, position)
        }}
      />
      <label htmlFor="base-task">Task type</label>
      <select
        value={step.baseTask || 'noTask'}
        name="base-task"
        onChange={e => {
          updateStep({ ...step, baseTask: e.target.value }, position)
        }}
      >
        {recipeStepBaseTasks.map(task => {
          return (
            <option key={task.value} value={task.value}>
              {task.label}
            </option>
          )
        })}
      </select>
      <RecipeStepParameters step={step} />
      <label htmlFor="details">Detailed description</label>
      <textarea
        name="details"
        value={step.details || ''}
        onChange={e => {
          updateStep({ ...step, details: e.target.value }, position)
        }}
      />
    </div>
  )
}
