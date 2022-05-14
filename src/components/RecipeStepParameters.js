import React from 'react'

export const RecipeStepParameters = ({ step }) => {
  const { parameters, baseTask } = step
  return (
    <>
      {parameters &&
        Object.keys(parameters).map(key => {
          return (
            <p key={key}>
              {key}: {parameters[key]}
            </p>
          )
        })}
    </>
  )
}
