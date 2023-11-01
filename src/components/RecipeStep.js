import React from 'react'

import { recipeStepBaseTasks, iconMap } from '../constants'
import { HUMAN_TASK, useRecipeContext } from '../contexts/RecipeContext'

import './RecipeStep.css'
import { RecipeStepParameters } from './RecipeStepParameters'

export const RecipeStep = ({ step, index }) => {
  const { updateStep } = useRecipeContext()

  return (
    <div className="recipe-step">
      <label htmlFor="message">User message</label>
      <textarea
        name="message"
        value={step.message}
        onChange={e => {
          updateStep({ ...step, message: e.target.value }, index)
        }}
      />
      <div className="recipe-step-task-section">
        <div className="recipe-step-task">
          <div>
            <label htmlFor="base-task">Task type</label>
            <select
              value={step.baseTask || HUMAN_TASK}
              name="base-task"
              onChange={e => {
                updateStep({ ...step, baseTask: e.target.value }, index)
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
          </div>
          <div>
            <label htmlFor="base-task">Task icon</label>
            <select
              value={step.icon || HUMAN_TASK}
              name="icon"
              onChange={e => {
                updateStep({ ...step, icon: e.target.value }, index)
              }}
            >
              {Object.keys(iconMap).map(icon => {
                return (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                )
              })}
            </select>
          </div>
        </div>
        <RecipeStepParameters step={step} updateStep={updateStep} stepIndex={index} />
      </div>
      <label htmlFor="details">Detailed description</label>
      <textarea
        name="details"
        value={step.details || ''}
        onChange={e => {
          updateStep({ ...step, details: e.target.value }, index)
        }}
      />
    </div>
  )
}
