import React from 'react'
import { BASE_TASKS_TO_SUB_TASKS_MAP, TaskType } from '../constants'
import { RecipeStepType } from '../contexts/RecipeContext'

export const RecipeStepSubtasks = ({
  step,
  updateStep,
  stepIndex,
}: {
  step: RecipeStepType
  updateStep: (step: RecipeStepType, position: number) => void
  stepIndex: number
}) => {
  const couldHaveStirringSubtask = BASE_TASKS_TO_SUB_TASKS_MAP[step.baseTask]?.includes(
    TaskType.STIR_TASK
  )
  const couldHaveTemperatureSubtask =
    BASE_TASKS_TO_SUB_TASKS_MAP[step.baseTask]?.includes(TaskType.MAINTAIN_COOL_TASK) ||
    BASE_TASKS_TO_SUB_TASKS_MAP[step.baseTask]?.includes(TaskType.MAINTAIN_HEAT_TASK)

  const [showTempOptions, setShowTempOptions] = React.useState(
    step.andMaintainTemp !== undefined || false
  )

  const handleAndStirChange = (checked: boolean) => {
    // Rather than setting up sub-tasks here (which could require syncing duration between the baseTask)
    // We will add a flag and add/update the stirring subtask at recipe export.
    updateStep({ ...step, andStir: checked }, stepIndex)
  }

  const handleAndMaintainTempChange = (checked: boolean) => {
    setShowTempOptions(checked)
  }

  const handleTempSubtaskChange = ({ heatOrCool, temp }: any) => {
    updateStep({ ...step, andMaintainTemp: heatOrCool, andMaintainTempTemp: temp }, stepIndex)
  }

  return (
    <>
      {couldHaveStirringSubtask ? (
        <>
          <input
            type="checkbox"
            name="and-stir"
            checked={step.andStir}
            onChange={e => handleAndStirChange(e.currentTarget.checked)}
          />
          <label htmlFor="and-stir">... and stir?</label>
        </>
      ) : null}
      {couldHaveTemperatureSubtask ? (
        <>
          <input
            type="checkbox"
            name="and-maintain-temp"
            checked={showTempOptions}
            onChange={e => handleAndMaintainTempChange(e.currentTarget.checked)}
          />
          <label htmlFor="and-maintain-temp">... and maintain temperature?</label>
        </>
      ) : (
        ''
      )}
      {couldHaveTemperatureSubtask && showTempOptions ? (
        <fieldset>
          <legend>Parameters:</legend>
          <label htmlFor="heat">
            <input
              id="heat"
              name="and-maintain-temp"
              type="radio"
              value={TaskType.MAINTAIN_HEAT_TASK}
              checked={step.andMaintainTemp === TaskType.MAINTAIN_HEAT_TASK}
              onChange={() =>
                handleTempSubtaskChange({
                  heatOrCool: TaskType.MAINTAIN_HEAT_TASK,
                  temp: step.andMaintainTempTemp || 0,
                })
              }
            />
            Heat
          </label>
          <label htmlFor="cool">
            <input
              id="cool"
              name="and-maintain-temp"
              type="radio"
              value={TaskType.MAINTAIN_COOL_TASK}
              checked={step.andMaintainTemp === TaskType.MAINTAIN_COOL_TASK}
              onChange={() =>
                handleTempSubtaskChange({
                  heatOrCool: TaskType.MAINTAIN_COOL_TASK,
                  temp: step.andMaintainTempTemp || 0,
                })
              }
            />
            Cool
          </label>
          <input
            type="number"
            value={step.andMaintainTempTemp || 0}
            onChange={e =>
              handleTempSubtaskChange({ heatOrCool: step.andMaintainTemp, temp: e.target.value })
            }
          />{' '}
          deg C
        </fieldset>
      ) : (
        ''
      )}
    </>
  )
}
