import React, { useEffect, useState } from 'react'

import { recipeStepBaseTasks } from '../constants'
import { useRecipeContext } from '../contexts/RecipeContext'

import './RecipeStep.css'

export const RecipeStep = ({ step, position }) => {
  const { updateStep } = useRecipeContext()

  const stepParameters = step.parameters
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
          return <option value={task.value}>{task.label}</option>
        })}
      </select>
      {stepParameters &&
        Object.keys(stepParameters).map(key => {
          return (
            <p key={key}>
              {key}: {stepParameters[key]}
            </p>
          )
        })}
    </div>
  )
}
