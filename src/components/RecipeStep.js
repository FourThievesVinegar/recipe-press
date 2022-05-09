import React from 'react'

import { recipeStepBaseTasks } from '../constants'

import './RecipeStep.css'

export const RecipeStep = ({ step }) => {
  const stepParameters = step.parameters
  return (
    <div className="recipe-step">
      <h2>{`Step ${step.nr}`}</h2>
      <label for="title">Step title</label>
      <input type="text" name="title" />
      <label for="title">Step description</label>
      <textarea name="description" value={step.message} />
      <select value={step.baseTask || 'noTask'}>
        {recipeStepBaseTasks.map(task => {
          return <option value={task.value}>{task.label}</option>
        })}
      </select>
      {stepParameters &&
        Object.keys(stepParameters).map(key => {
          return (
            <p>
              {key}: {stepParameters[key]}
            </p>
          )
        })}
      <button
        onClick={() => {
          console.log('save step.')
        }}
      >
        Save Step
      </button>
    </div>
  )
}
