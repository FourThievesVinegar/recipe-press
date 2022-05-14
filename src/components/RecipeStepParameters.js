import React from 'react'

export const RecipeStepParameters = ({ step }) => {
  const { parameters } = step
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
