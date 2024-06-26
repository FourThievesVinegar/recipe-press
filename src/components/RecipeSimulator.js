import React from 'react'
import { useRecipeSimulatorContext } from '../contexts/RecipeSimulatorContext'

import './RecipeSimulator.css'

export const RecipeSimulator = () => {
  const {
    automatedStepLength,
    cancelSimulation,
    goToStep,
    isSimulating,
    setAutomatedStepLength,
    simulationStep,
    simulationStepIndex,
    startSimulation,
  } = useRecipeSimulatorContext()

  return (
    isSimulating && (
      <section className="recipe-simulator">
        <div className="recipe-simulator-backdrop" onClick={e => cancelSimulation()} />
        <div className="recipe-simulator-container">
          <div className="recipe-simulator-controls">
            <button onClick={e => startSimulation()}>Restart</button>
            <p>Step {simulationStepIndex}</p>
            <div className="recipe-simulator-controls-item">
              <label htmlFor="automated-step-length">Simulated step length</label>
              <input
                type="number"
                onChange={e => {
                  setAutomatedStepLength(e.target.value)
                }}
                value={automatedStepLength}
                min="0"
              />
            </div>
            <button onClick={e => cancelSimulation()}>Close</button>
          </div>
          <div className="recipe-simulator-window">
            {simulationStep ? (
              <>
                <h3>{simulationStep.message}</h3>
                {simulationStep.options?.map(option => (
                  <button
                    key={option.text}
                    className="recipe-simulator-option-button"
                    onClick={e => goToStep(option.next)}
                  >
                    {option.text}
                  </button>
                ))}
                <p>Type: {simulationStep.baseTask}</p>
                {simulationStep.parameters && (
                  <ul className="recipe-simulator-parameters">
                    {Object.keys(simulationStep.parameters).map(paramKey => (
                      <li key={paramKey}>
                        {paramKey}: {simulationStep.parameters[paramKey]}
                      </li>
                    ))}
                  </ul>
                )}
                {simulationStep.andStir && <p>... and stir for the duration</p>}
                {simulationStep.done && <p>The recipe simulation is complete.</p>}
              </>
            ) : (
              <p>No Simulation Step!</p>
            )}
          </div>
        </div>
      </section>
    )
  )
}
