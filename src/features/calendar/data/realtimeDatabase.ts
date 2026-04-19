import { get, onValue, ref, set } from 'firebase/database'
import {
  cloudCalendarStateSchema,
  fromCloudCalendarState,
  toCloudCalendarState,
} from './cloudState'
import { createInitialPersistedCalendarState } from '../model/state'
import type { PersistedCalendarState } from '../model/types'
import { getRealtimeDatabase } from '../../../lib/firebase/client'

const CALENDAR_STATE_PATH = 'calendar/current'

export function subscribeToCalendarState(
  onState: (state: PersistedCalendarState) => void,
  onError?: (error: Error) => void,
) {
  const database = getRealtimeDatabase()

  if (!database) {
    return () => undefined
  }

  const calendarStateRef = ref(database, CALENDAR_STATE_PATH)

  return onValue(
    calendarStateRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        onState(createInitialPersistedCalendarState())
        return
      }

      const parsed = cloudCalendarStateSchema.safeParse(snapshot.val())

      if (!parsed.success) {
        onError?.(new Error(parsed.error.message))
        return
      }

      onState(fromCloudCalendarState(parsed.data))
    },
    (error) => {
      onError?.(error)
    },
  )
}

export async function bootstrapCalendarState() {
  const database = getRealtimeDatabase()

  if (!database) {
    return
  }

  const calendarStateRef = ref(database, CALENDAR_STATE_PATH)
  const snapshot = await get(calendarStateRef)

  if (snapshot.exists()) {
    return
  }

  await set(calendarStateRef, toCloudCalendarState(createInitialPersistedCalendarState()))
}

export async function saveCalendarState(
  state: PersistedCalendarState,
) {
  const database = getRealtimeDatabase()

  if (!database) {
    return
  }

  await set(ref(database, CALENDAR_STATE_PATH), toCloudCalendarState(state))
}
