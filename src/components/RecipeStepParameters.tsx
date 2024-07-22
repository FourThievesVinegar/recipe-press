import React from 'react'

import { TASK_PARAMETERS, PUMP_NAMES, TaskParameterFieldNames, TaskType } from '../constants'

import './RecipeStepParameters.css'
import { RecipeStepType } from '../contexts/RecipeContext'

const parameterFieldMap = {
  time: 'number',
  pump: 'text',
  volume: 'number',
  temp: 'number',
  tolerance: 'number',
}

const parameterFieldHelpText = {
  time: 'seconds',
  pump: '',
  volume: 'mL',
  temp: 'degrees C',
  tolerance: 'degrees C',
}

const ParameterField = ({
  parameter,
  value,
  updateParameter,
}: {
  parameter: TaskParameterFieldNames
  value: any
  updateParameter: any
}) => {
  return (
    <div className="parameter-data-row">
      <label htmlFor={parameter}>{parameter}</label>
      {parameter === 'pump' ? (
        <select
          name={parameter}
          value={value}
          onChange={e => {
            const value =
              parameterFieldMap[parameter] === 'number' ? parseInt(e.target.value) : e.target.value
            updateParameter(parameter, value)
          }}
        >
          {['-', ...PUMP_NAMES].map(value => (
            <option value={value} key={value}>
              {value}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={parameter}
          type={parameterFieldMap[parameter]}
          value={value}
          onChange={e => {
            const value =
              parameterFieldMap[parameter] === 'number' ? parseInt(e.target.value) : e.target.value
            updateParameter(parameter, value)
          }}
        />
      )}
      <p>{parameterFieldHelpText[parameter]}</p>
    </div>
  )
}

const OptionField = ({ index, option, updateOption, deleteOption }: any) => {
  return (
    <>
      <p>User Option {index}: </p>
      <div className="option-data-row">
        <label htmlFor={`${option}-text`}>Button Text:</label>
        <input
          name={`${option}-text`}
          type="text"
          value={option.text}
          onChange={e => {
            updateOption({ ...option, text: e.target.value }, index)
          }}
          onBlur={() => {
            // Trim text when done editing
            updateOption({ ...option, text: option.text.trim() }, index)
          }}
        />
        <label htmlFor={`${option}-next`}>Next step:</label>
        <input
          name={`${option}-text`}
          type="number"
          value={option.next}
          onChange={e => {
            updateOption({ ...option, next: parseInt(e.target.value) }, index)
          }}
        />
        <button
          className="delete-option"
          onClick={() => {
            deleteOption(index)
          }}
          title="Delete User Option"
        >
          X
        </button>
      </div>
    </>
  )
}

export const RecipeStepParameters = ({
  step,
  updateStep,
  stepIndex,
}: {
  step: RecipeStepType
  updateStep: any
  stepIndex: number
}) => {
  const { parameters = [], options = [], baseTask } = step

  const stepParameters = parameters
  const defaultParameters = TASK_PARAMETERS[step?.baseTask]
  const updateParameter = (parameter: TaskParameterFieldNames, value: any) => {
    updateStep({ ...step, parameters: { ...step.parameters, [parameter]: value } }, stepIndex)
  }
  const deleteOption = (index: number) => {
    //@ts-ignore
    const newOptions = [...step.options]
    newOptions.splice(index, 1)
    updateStep({ ...step, options: [...newOptions] }, stepIndex)
  }

  const updateOption = (newOption: any, newOptionIndex: number) => {
    const newOptionsBeginning = step?.options?.slice(0, newOptionIndex) || []
    const newOptionsEnding = step?.options?.slice(newOptionIndex + 1, options.length) || []

    const newOptions = [...newOptionsBeginning, newOption, ...newOptionsEnding]
    updateStep({ ...step, options: [...newOptions] }, stepIndex)
  }

  return (
    <>
      {baseTask !== TaskType.HUMAN_TASK && (
        <ul className="parameters-list">
          {defaultParameters?.map(parameter => {
            return (
              <li key={parameter} className="recipe-step-parameter">
                <ParameterField
                  parameter={parameter}
                  value={stepParameters[parameter] || ''}
                  updateParameter={updateParameter}
                />
              </li>
            )
          })}
        </ul>
      )}
      {(!baseTask || baseTask === TaskType.HUMAN_TASK) && (
        <ul className="options-list">
          {options?.map((option, index) => {
            return (
              <li key={`option-${index}`} className="recipe-step-option">
                <OptionField
                  index={index}
                  option={option}
                  updateOption={updateOption}
                  deleteOption={deleteOption}
                />
              </li>
            )
          })}
          <li>
            <button
              onClick={() => {
                updateOption({ text: '', next: stepIndex + 1 }, options.length)
              }}
            >
              New Option +
            </button>
          </li>
        </ul>
      )}
    </>
  )
}
