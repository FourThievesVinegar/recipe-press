import { HUMAN_TASK } from './contexts/RecipeContext'

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

export const baseStepParameters = {
  humanTask: [],
  cool: ['temp'],
  heat: ['temp'],
  maintainCool: ['temp', 'time', 'tolerance'],
  maintainHeat: ['temp', 'time', 'tolerance'],
  pump: ['pump', 'volume'],
  stir: ['time'],
}

export const recipeStepBaseTasks = [
  { label: 'Human Task', value: HUMAN_TASK },
  { label: 'Cool', value: 'cool' },
  { label: 'Heat', value: 'heat' },
  { label: 'Maintain Cooling', value: 'maintainCool' },
  { label: 'Maintain Heat', value: 'maintainHeat' },
  { label: 'Pump', value: 'pump' },
  { label: 'Stir', value: 'stir' },
]

export const pumpNames = ['X', 'Y', 'Z']

export const iconMap = {
  'reaction_complete': {
    image: <img src={complete} alt="Reaction Complete" />
  },
  'cooling': {
    image: <img src={cooling} alt="Cooling" />
  },
  'crystalisation': {
    image: <img src={crystalisation} alt="Crystalising" />
  },
  'dispensing': {
    image: <img src={syringeDispensing} alt="Dispensing" />
  },
  'dry': {
    image: <img src={dry} alt="Dry" />
  },
  'filter': {
    image: <img src={filter} alt="Filter" />
  },
  'heating': {
    image: <img src={heating} alt="Heating" />
  },
  'human_task': {
    image: <img src={humanTask} alt="Human Task" />
  },
  'inspect': {
    image: <img src={looking} alt="Inspect" />
  },
  'load_syringe': {
    image: <img src={loadSyringe} alt="Load Syringe" />
  },
  'maintain_cool': {
    image: <img src={maintainCool} alt="Maintaining Cool" />
  },
  'maintain_heat': {
    image: <img src={maintainHeat} alt="Maintaining Heat" />
  },
  'reaction_chamber': {
    image: <img src={putIngredientInReactionChamber} alt="Put Ingredient in Reaction Chamber" />
  },
  'rinse': {
    image: <img src={rinse} alt="Rinse" />
  },
  'set_up_cooling': {
    image: <img src={setUpCooling} alt="Set up cooling" />
  },
  'set_up_heating': {
    image: <img src={setUpHeating} alt="Set up heating" />
  },
  'stirring': {
    image: <img src={stirring} alt="Stirring" />
  },
  'temperature': {
    image: <img src={setUpHeating} alt="Temperature" /> // This should be deprecated for more precise icons
  }
}