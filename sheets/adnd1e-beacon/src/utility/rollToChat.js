import { createRollTemplate } from '@/rollTemplates/index.js'
import { dispatchRef, initValues } from '@/relay'
import getRollResult from './getRollResults.js'

/* Example function for Rolling a basic check and showing the roll template. */
export default async ({ rollObj, customDispatch, rollType = 'base' }) => {
  const dispatch = customDispatch || dispatchRef.value // Need a different Relay instance when handling sheet-actions
  // Use Beacon to make the rolls and calculations. We end up with a Roll Result.
  // components are used to make up the roll and provide the details of the roll
  // total is the summation of the roll
  // subtitle passes success or failure to subtitle for isLess, isGreater rolls
  const { components, total, subtitle } = await getRollResult(rollObj.components, dispatch)
  // Pass in the roll result to Handlebars and get HTML to render the roll template
  const rollTemplate = createRollTemplate({
    type: rollType, // We have 2 roll templates, "roll" and "chat". We will use "roll" for this.
    parameters: {
      ...(rollObj.subtitle = subtitle),
      ...rollObj,
      components
    }
  })
  // Post the roll template HTML into Chat.
  await dispatch.post({
    characterId: initValues.character.id,
    content: rollTemplate,
    options: {
      whisper: undefined,
      secret: undefined
    }
  })
  return total
}
