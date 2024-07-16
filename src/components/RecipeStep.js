import React from 'react'

import { recipeStepBaseTasks, iconMap, taskToIconMap, HUMAN_TASK } from '../constants'
import { useRecipeContext } from '../contexts/RecipeContext'

import './RecipeStep.css'
import { RecipeStepParameters } from './RecipeStepParameters'
import { RecipeStepSubtasks } from './RecipeStepSubtasks'

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
        placeholder='The text you enter here will be shown to the user while the step is running.'
      />
      <div className="recipe-step-task-section">
        <div className="recipe-step-task">
          <div>
            <label htmlFor="base-task">Task type</label>
            <select
              value={step.baseTask || HUMAN_TASK}
              name="base-task"
              onChange={e => {
                const task = e.target.value
                updateStep({ ...step, baseTask: task, parameters: {}, icon: taskToIconMap[task]}, index)
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
          <RecipeStepSubtasks step={step} updateStep={updateStep} stepIndex={index} />
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
        placeholder='Additional details of the step that can be shown while reviewing the recipe on the Microlab.'
      />
    </div>
  )
}
