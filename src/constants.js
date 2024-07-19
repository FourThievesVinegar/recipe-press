import complete from './icons/complete.svg'
import cooling from './icons/cooling.svg'
import crystalisation from './icons/crystalisation.svg'
import dry from './icons/dry.svg'
import filter from './icons/filter.svg'
import heating from './icons/heating.svg'
import humanTask from './icons/human-task.png'
import loadSyringe from './icons/load-syringe-with-hand.svg'
//import loadSyringe from './icons/load-syringe-with-hand-1.svg'
import looking from './icons/looking-CC-muhammad-be.svg'
import maintainCool from './icons/maintain-cool.svg'
import maintainHeat from './icons/maintain-heat.svg'
import putIngredientInReactionChamber from './icons/put-ingredient-in-reaction-chamber.svg'
import rinse from './icons/rinse.svg'
import setUpCooling from './icons/set-up-cooling.svg'
import setUpHeating from './icons/set-up-heating.svg'
import stirring from './icons/stirring.svg'
import syringeDispensing from './icons/syringe-dispense.svg'
import takeOutOfReactionChamber from './icons/take-out-of-reaction-chamber.svg'

export const HUMAN_TASK = 'humanTask'
export const COOL_TASK = 'cool'
export const HEAT_TASK = 'heat'
export const MAINTAIN_COOL_TASK = 'maintainCool'
export const MAINTAIN_HEAT_TASK = 'maintainHeat'
export const PUMP_TASK = 'pump'
export const STIR_TASK = 'stir'

export const TASK_PARAMETERS = {
  humanTask: [],
  cool: ['temp'],
  heat: ['temp'],
  maintainCool: ['temp', 'time', 'tolerance'], // These will always be a sub-task, currently only for stirring steps
  maintainHeat: ['temp', 'time', 'tolerance'], // These will always be a sub-task, currently only for stirring steps
  pump: ['pump', 'volume'],
  stir: ['time'],
}

export const RECIPE_STEP_BASE_TASKS = [
  { label: 'Human Task', value: HUMAN_TASK }, // Something a human does, or a decision for a human to make
  { label: 'Pump', value: PUMP_TASK }, // Injecting a reactant into the reaction chamber
  { label: 'Stir', value: STIR_TASK }, // Stirring the mixture
  { label: 'Cool', value: COOL_TASK }, // Cooling to a target temperature
  { label: 'Heat', value: HEAT_TASK }, // Heating to a target temperature
]

export const BASE_TASKS_TO_SUB_TASKS_MAP = {
  [HUMAN_TASK]: [], // Currently this does not support sub-tasks (no duration)
  [PUMP_TASK]: [], // Currently this does not support sub-tasks (no duration now, but hopefully this will change soon)
  [STIR_TASK]: [MAINTAIN_COOL_TASK, MAINTAIN_HEAT_TASK],
  [HEAT_TASK]: [], // Currently this does not support sub-tasks (no duration)
  [COOL_TASK]: [], // Currently this does not support sub-tasks (no duration)
}

export const PUMP_NAMES = ['X', 'Y', 'Z']

export const ICON_MAP = {
  reaction_complete: {
    image: <img src={complete} alt="Reaction Complete" />,
  },
  cooling: {
    image: <img src={cooling} alt="Cooling" />,
  },
  crystalisation: {
    image: <img src={crystalisation} alt="Crystalising" />,
  },
  dispensing: {
    image: <img src={syringeDispensing} alt="Dispensing" />,
  },
  dry: {
    image: <img src={dry} alt="Dry" />,
  },
  filter: {
    image: <img src={filter} alt="Filter" />,
  },
  heating: {
    image: <img src={heating} alt="Heating" />,
  },
  human_task: {
    image: <img src={humanTask} alt="Human Task" />,
  },
  inspect: {
    image: <img src={looking} alt="Inspect" />,
  },
  load_syringe: {
    image: <img src={loadSyringe} alt="Load Syringe" />,
  },
  maintain_cool: {
    image: <img src={maintainCool} alt="Maintaining Cool" />,
  },
  maintain_heat: {
    image: <img src={maintainHeat} alt="Maintaining Heat" />,
  },
  reaction_chamber: {
    image: <img src={putIngredientInReactionChamber} alt="Put Ingredient in Reaction Chamber" />,
  },
  rinse: {
    image: <img src={rinse} alt="Rinse" />,
  },
  set_up_cooling: {
    image: <img src={setUpCooling} alt="Set up cooling" />,
  },
  set_up_heating: {
    image: <img src={setUpHeating} alt="Set up heating" />,
  },
  stirring: {
    image: <img src={stirring} alt="Stirring" />,
  },
  temperature: {
    image: <img src={setUpHeating} alt="Temperature" />, // This should be deprecated for more precise icons
  },
  remove: {
    image: <img src={takeOutOfReactionChamber} alt="Remove from Reaction Chamber" />, // This should be deprecated for more precise icons
  },
}

export const TASK_TO_ICON_MAP = {
  [HUMAN_TASK]: 'human_task',
  [COOL_TASK]: 'cooling',
  [HEAT_TASK]: 'heating',
  [MAINTAIN_COOL_TASK]: 'maintain_cool',
  [MAINTAIN_HEAT_TASK]: 'maintain_heat',
  [PUMP_TASK]: 'dispensing',
  [STIR_TASK]: 'stirring',
}
