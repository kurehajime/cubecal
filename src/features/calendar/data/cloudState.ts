import { z } from 'zod'
import { diceKinds, type DiceKind, type PersistedCalendarState, type QuarterTurnVector } from '../model/types'
import {
  createInitialPersistedCalendarState,
  createOrientationFromQuarterTurns,
} from '../model/state'

const diceKindSchema = z.enum(diceKinds)
const quarterTurnSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
])

const quarterTurnVectorSchema = z.object({
  x: quarterTurnSchema,
  y: quarterTurnSchema,
  z: quarterTurnSchema,
})

const diceOrderSchema = z
  .object({
    slot0: diceKindSchema,
    slot1: diceKindSchema,
    slot2: diceKindSchema,
    slot3: diceKindSchema,
  })
  .superRefine((value, context) => {
    const uniqueKinds = new Set(Object.values(value))

    if (uniqueKinds.size !== diceKinds.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'diceOrder must contain each dice kind exactly once.',
      })
    }
  })

export const cloudCalendarStateSchema = z.object({
  version: z.literal(1),
  diceOrder: diceOrderSchema,
  diceOrientations: z.object({
    month: quarterTurnVectorSchema,
    weekday: quarterTurnVectorSchema,
    date012678: quarterTurnVectorSchema,
    date012345: quarterTurnVectorSchema,
  }),
})

export type CloudCalendarState = z.infer<typeof cloudCalendarStateSchema>

export function toCloudCalendarState(
  state: PersistedCalendarState,
): CloudCalendarState {
  return {
    version: 1,
    diceOrder: {
      slot0: state.diceOrder[0],
      slot1: state.diceOrder[1],
      slot2: state.diceOrder[2],
      slot3: state.diceOrder[3],
    },
    diceOrientations: {
      month: state.diceStates.month.orientation.quarterTurns,
      weekday: state.diceStates.weekday.orientation.quarterTurns,
      date012678: state.diceStates.date012678.orientation.quarterTurns,
      date012345: state.diceStates.date012345.orientation.quarterTurns,
    },
  }
}

export function fromCloudCalendarState(
  state: CloudCalendarState,
): PersistedCalendarState {
  const initialState = createInitialPersistedCalendarState()
  const diceOrder = [
    state.diceOrder.slot0,
    state.diceOrder.slot1,
    state.diceOrder.slot2,
    state.diceOrder.slot3,
  ] satisfies DiceKind[]

  return {
    diceOrder,
    diceStates: {
      month: createPersistedDiceState(
        initialState,
        'month',
        state.diceOrientations.month,
      ),
      weekday: createPersistedDiceState(
        initialState,
        'weekday',
        state.diceOrientations.weekday,
      ),
      date012678: createPersistedDiceState(
        initialState,
        'date012678',
        state.diceOrientations.date012678,
      ),
      date012345: createPersistedDiceState(
        initialState,
        'date012345',
        state.diceOrientations.date012345,
      ),
    },
  }
}

function createPersistedDiceState(
  initialState: PersistedCalendarState,
  diceKind: DiceKind,
  quarterTurns: QuarterTurnVector,
) {
  return {
    ...initialState.diceStates[diceKind],
    orientation: createOrientationFromQuarterTurns(quarterTurns),
  }
}
