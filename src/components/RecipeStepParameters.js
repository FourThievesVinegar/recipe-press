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
          updateParameter(parameter, e.target.value)
        }}
      />
      <p>{parameterFieldHelpText[parameter]}</p>
    </>
  )
}

const OptionField = ({ index, option, updateOptions }) => {
  return (
    <>
      <p>Button {index}: </p>
      <label htmlFor={`${option}-text`}>Text:</label>
      <input
        name={`${option}-text`}
        type="text"
        value={option.text}
        onChange={e => {
          updateOptions(option + e.target.value)
        }}
      />
      <label htmlFor={`${option}-next`}>Next step:</label>
      <input
        name={`${option}-text`}
        type="text"
        value={option.next}
        onChange={e => {
          updateOptions(option + e.target.value)
        }}
      />
    </>
  )
}

export const RecipeStepParameters = ({ step, updateStep, stepPosition }) => {
  const { parameters = [], options = [], baseTask } = step

  const stepParameters = parameters
  const defaultParameters = baseStepParameters[step?.baseTask]
  const updateParameter = (parameter, value) => {
    updateStep({ ...step, parameters: { ...step.parameters, [parameter]: value } }, stepPosition)
  }

  const updateOptions = options => {
    console.log(options)
  }

  return (
    <>
      {(baseTask !== '' || baseTask !== 'noTask') &&
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
      {(!baseTask || baseTask === '' || baseTask === 'noTask') &&
        options?.map((option, index) => {
          return (
            <div key={option} className="recipe-step-parameter">
              <OptionField index={index} option={option} updateOptions={updateOptions} />
            </div>
          )
        })}
    </>
  )
}
