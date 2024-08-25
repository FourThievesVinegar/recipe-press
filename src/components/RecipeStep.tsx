import React from 'react'

import { RECIPE_STEP_BASE_TASKS, ICON_MAP, TASK_TO_ICON_MAP, TaskType } from '../constants'
import { RecipeStepType, useRecipeContext } from '../contexts/RecipeContext'

import './RecipeStep.css'
import { RecipeStepParameters } from './RecipeStepParameters'
import { RecipeStepSubtasks } from './RecipeStepSubtasks'
import { useTranslation } from 'react-i18next'

export const RecipeStep = ({ step, index }: { step: RecipeStepType; index: number }) => {
  const { t } = useTranslation()
  const { updateStep } = useRecipeContext()

  return (
    <div className="recipe-step">
      <label htmlFor="message">{t('user-message')}</label>
      <textarea
        name="message"
        value={step.message}
        onChange={e => {
          updateStep({ ...step, message: e.target.value }, index)
        }}
        placeholder={t('recipe-step-message-explaination')}
      />
      <div className="recipe-step-task-section">
        <div className="recipe-step-task">
          <div>
            <label htmlFor="base-task">{t('task-type')}</label>
            <select
              value={step.baseTask || TaskType.HUMAN_TASK}
              name="base-task"
              onChange={e => {
                const task: TaskType = e.target.value as TaskType
                updateStep(
                  { ...step, baseTask: task, parameters: {}, icon: TASK_TO_ICON_MAP[task] },
                  index
                )
              }}
            >
              {RECIPE_STEP_BASE_TASKS.map(task => {
                return (
                  <option key={task.value} value={task.value}>
                    {task.label}
                  </option>
                )
              })}
            </select>
          </div>
          <div>
            <label htmlFor="base-task">{t('task-icon')}</label>
            <select
              value={step.icon || TaskType.HUMAN_TASK}
              name="icon"
              onChange={e => {
                updateStep({ ...step, icon: e.target.value }, index)
              }}
            >
              {Object.keys(ICON_MAP).map(icon => {
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
      <label htmlFor="details">{t('detailed-description')}</label>
      <textarea
        name="details"
        value={step.details || ''}
        onChange={e => {
          updateStep({ ...step, details: e.target.value }, index)
        }}
        placeholder={t('detailed-description-placeholder')}
      />
    </div>
  )
}
