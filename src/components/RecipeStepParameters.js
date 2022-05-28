import React from 'react'

import { baseStepParameters } from '../constants'

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
    <>
      <label htmlFor={parameter}>{parameter}</label>
      <input
        name={parameter}
        type={parameterFieldMap[parameter]}
        value={value}
        onChange={e => {
          updateParameter(parameter, parseInt(e.target.value))
        }}
      />
      <p>{parameterFieldHelpText[parameter]}</p>
    </>
  )
}

const OptionField = ({ index, option, updateOption }) => {
  return (
    <>
      <p>Button {index}: </p>
      <label htmlFor={`${option}-text`}>Text:</label>
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

  const updateOption = (newOption, newOptionIndex) => {
    const newOptionsBeginning = step?.options?.slice(0, newOptionIndex) || []
    const newOptionsEnding = step?.options?.slice(newOptionIndex + 1, options.length) || []

    const newOptions = [...newOptionsBeginning, newOption, ...newOptionsEnding]
    updateStep({ ...step, options: [...newOptions] }, stepIndex)
  }

  return (
    <>
      {(baseTask !== '' || baseTask !== 'humanTask') &&
        defaultParameters?.map(parameter => {
          return (
            <div key={parameter} className="recipe-step-option">
              <ParameterField
                parameter={parameter}
                value={stepParameters[parameter] || ''}
                updateParameter={updateParameter}
              />
            </div>
          )
        })}
      {(!baseTask || baseTask === '' || baseTask === 'humanTask') && (
        <>
          {options?.map((option, index) => {
            return (
              <div key={`option-${index}`} className="recipe-step-parameter">
                <OptionField index={index} option={option} updateOption={updateOption} />
              </div>
            )
          })}
          <button
            onClick={() => {
              updateOption({ text: '', next: stepIndex + 1 }, options.length)
            }}
          >
            New Option +
          </button>
        </>
      )}
    </>
  )
}
