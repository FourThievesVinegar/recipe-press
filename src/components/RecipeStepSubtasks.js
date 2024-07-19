import React from 'react'
import {
  BASE_TASKS_TO_SUB_TASKS_MAP,
  MAINTAIN_COOL_TASK,
  MAINTAIN_HEAT_TASK,
  STIR_TASK,
} from '../constants'

export const RecipeStepSubtasks = ({ step, updateStep, stepIndex }) => {
  const couldHaveStirringSubtask = BASE_TASKS_TO_SUB_TASKS_MAP[step.baseTask]?.includes(STIR_TASK)
  const couldHaveTemperatureSubtask =
    BASE_TASKS_TO_SUB_TASKS_MAP[step.baseTask]?.includes(MAINTAIN_COOL_TASK) ||
    BASE_TASKS_TO_SUB_TASKS_MAP[step.baseTask]?.includes(MAINTAIN_HEAT_TASK)

  const [showTempOptions, setShowTempOptions] = React.useState(
    step.andMaintainTemp !== undefined || false
  )

  const handleAndStirChange = checked => {
    // Rather than setting up sub-tasks here (which could require syncing duration between the baseTask)
    // We will add a flag and add/update the stirring subtask at recipe export.
    updateStep({ ...step, andStir: checked }, stepIndex)
  }

  const handleAndMaintainTempChange = checked => {
    setShowTempOptions(checked)
  }

  const handleTempSubtaskChange = ({ heatOrCool, temp }) => {
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
          <label for="heat">
            <input
              id="heat"
              name="and-maintain-temp"
              type="radio"
              value={MAINTAIN_HEAT_TASK}
              checked={step.andMaintainTemp === MAINTAIN_HEAT_TASK}
              onChange={e =>
                handleTempSubtaskChange({
                  heatOrCool: MAINTAIN_HEAT_TASK,
                  temp: step.andMaintainTempTemp || 0,
                })
              }
            />
            Heat
          </label>
          <label for="cool">
            <input
              id="cool"
              name="and-maintain-temp"
              type="radio"
              value={MAINTAIN_COOL_TASK}
              checked={step.andMaintainTemp === MAINTAIN_COOL_TASK}
              onChange={e =>
                handleTempSubtaskChange({
                  heatOrCool: MAINTAIN_COOL_TASK,
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
