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
  temp: 'in degrees C',
  time: 'in seconds',
  tolerance: 'in degrees C',
  volume: 'in mL',
}

const ParameterField = ({ parameter, value }) => {
  return (
    <>
      <label for={parameter}>{parameter}</label>
      <input name={parameter} type={parameterFieldMap[parameter]} value={value} />
      <p>{parameterFieldHelpText[parameter]}</p>
    </>
  )
}

export const RecipeStepParameters = ({ step, updateStep }) => {
  const { parameters } = step

  const stepParameters = parameters
  const defaultParameters = baseStepParameters[step?.baseTask]

  console.log(step.baseTask, stepParameters)

  return (
    <>
      {defaultParameters?.map(parameter => {
        return (
          <div key={parameter} className="recipe-step-parameter">
            <ParameterField parameter={parameter} value={stepParameters?.parameter} />
          </div>
        )
      })}
    </>
  )
}
