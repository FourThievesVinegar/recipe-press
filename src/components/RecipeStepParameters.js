import React from 'react'

import { baseStepParameters } from '../constants'

import './RecipeStepParameters.css'

const parameterFieldMap = {
  temp: 'number',
  pump: 'text',
  volume: 'text',
  time: 'number',
  tolerance: 'number',
}

const parameterFieldHelpText = {
  temp: 'degrees C',
  time: 'seconds',
  tolerance: 'degrees C',
  volume: 'mL',
}

const ParameterField = ({ parameter, value, updateParameter }) => {
  return (
    <li className="parameter-data-row">
      <label htmlFor={parameter}>{parameter}</label>
      <input
        name={parameter}
        type={parameterFieldMap[parameter]}
        value={value}
        onChange={e => {
          const value = e.target.value
          if (value?.length > 0) {
            updateParameter(parameter, parseInt(value))
          }
        }}
      />
      <p>{parameterFieldHelpText[parameter]}</p>
    </li>
  )
}

const OptionField = ({ index, option, updateOption, deleteOption }) => {
  return (
    <>
      <p>Option {index}: </p>
      <div className="option-data-row">
        <label htmlFor={`${option}-text`}>Button Text:</label>
        <input
          name={`${option}-text`}
          type="text"
          value={option.text}
          onChange={e => {
            updateOption({ ...option, text: e.target.value }, index)
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
          onClick={e => {
            deleteOption(index)
          }}
        >
          X
        </button>
      </div>
    </>
  )
}

export const RecipeStepParameters = ({ step, updateStep, stepIndex }) => {
  const { parameters = [], options = [], baseTask } = step

  const stepParameters = parameters
  const defaultParameters = baseStepParameters[step?.baseTask]
  const updateParameter = (parameter, value) => {
    updateStep({ ...step, parameters: { ...step.parameters, [parameter]: value } }, stepIndex)
  }
  const deleteOption = index => {
    const newOptions = [...step.options]
    newOptions.splice(index, index)
    console.log(newOptions)
    updateStep({ ...step, options: { ...newOptions } }, stepIndex)
  }

  const updateOption = (newOption, newOptionIndex) => {
    const newOptionsBeginning = step?.options?.slice(0, newOptionIndex) || []
    const newOptionsEnding = step?.options?.slice(newOptionIndex + 1, options.length) || []

    const newOptions = [...newOptionsBeginning, newOption, ...newOptionsEnding]
    updateStep({ ...step, options: [...newOptions] }, stepIndex)
  }

  return (
    <>
      {(baseTask !== '' || baseTask !== 'humanTask') && (
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
      {(!baseTask || baseTask === '' || baseTask === 'humanTask') && (
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
