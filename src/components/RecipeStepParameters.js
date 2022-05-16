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
      <label for={parameter}>{parameter}</label>
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

export const RecipeStepParameters = ({ step, updateStep, stepPosition }) => {
  const { parameters } = step

  const stepParameters = parameters
  const defaultParameters = baseStepParameters[step?.baseTask]
  const updateParameter = (parameter, value) => {
    updateStep({ ...step, parameters: { ...step.parameters, [parameter]: value } }, stepPosition)
  }

  return (
    <>
      {defaultParameters?.map(parameter => {
        return (
          <div key={parameter} className="recipe-step-parameter">
            <ParameterField
              parameter={parameter}
              value={stepParameters[parameter] || ''}
              updateParameter={updateParameter}
            />
          </div>
        )
      })}
    </>
  )
}
