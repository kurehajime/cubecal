import { useEffect, useMemo, useRef } from 'react'
import { Euler, Group, Quaternion, Vector3 } from 'three'
import { useFrame } from '@react-three/fiber'
import type { DiceDefinition } from '../../features/calendar/model/types'
import { RoundedBox } from '@react-three/drei'
import { DiceFaceLabels } from './DiceFaceLabels'

const FORWARD_LIFT_OFFSET = new Vector3(0, 0.34, 1.08)
const ENTER_FORWARD_DURATION = 0.18
const ENTER_FRONT_DURATION = 0.24
const EXIT_FORWARD_DURATION = 0.16
const RETURN_BASE_DURATION = 0.22

type MotionPhase =
  | 'idle'
  | 'selected'
  | 'enterForward'
  | 'enterFront'
  | 'exitForward'
  | 'returnBase'

type PlaceholderDieProps = {
  basePositionValue: [number, number, number]
  definition: DiceDefinition
  isSelected: boolean
  orientationValue: [number, number, number, number]
  onSelect: (diceId: DiceDefinition['id']) => void
}

export function PlaceholderDie({
  basePositionValue,
  definition,
  isSelected,
  orientationValue,
  onSelect,
}: PlaceholderDieProps) {
  const groupRef = useRef<Group>(null)

  const basePosition = useMemo(
    () => new Vector3(...basePositionValue),
    [basePositionValue],
  )
  const selectedPosition = useMemo(() => new Vector3(0.32, 1.92, 1.72), [])
  const baseQuaternion = useMemo(
    () =>
      new Quaternion().setFromEuler(new Euler(...definition.placement.baseRotation)),
    [definition.placement.baseRotation],
  )
  const orientationQuaternion = useMemo(
    () => new Quaternion(...orientationValue),
    [orientationValue],
  )
  const previousIsSelected = useRef(isSelected)
  const motionPhase = useRef<MotionPhase>(isSelected ? 'selected' : 'idle')
  const phaseElapsed = useRef(0)
  const phaseStartPosition = useRef(new Vector3())
  const phaseEndPosition = useRef(new Vector3())
  const phaseStartQuaternion = useRef(new Quaternion())
  const phaseEndQuaternion = useRef(new Quaternion())
  const baseTargetQuaternion = useMemo(() => new Quaternion(), [])
  const selectedTargetQuaternion = useMemo(() => new Quaternion(), [])
  const phaseQuaternion = useMemo(() => new Quaternion(), [])
  const forwardPosition = useMemo(() => new Vector3(), [])
  const transitionPosition = useMemo(() => new Vector3(), [])
  const initialPosition = useRef(basePosition.clone())
  const initialQuaternion = useRef(
    baseQuaternion.clone().multiply(orientationQuaternion),
  )

  useEffect(() => {
    if (!groupRef.current) {
      return
    }

    groupRef.current.position.copy(initialPosition.current)
    groupRef.current.quaternion.copy(initialQuaternion.current)
  }, [])

  useFrame(({ camera }, delta) => {
    if (!groupRef.current) {
      return
    }

    baseTargetQuaternion.copy(baseQuaternion).multiply(orientationQuaternion)
    selectedTargetQuaternion.copy(camera.quaternion).multiply(orientationQuaternion)
    forwardPosition.copy(basePosition).add(FORWARD_LIFT_OFFSET)

    if (previousIsSelected.current !== isSelected) {
      previousIsSelected.current = isSelected
      phaseElapsed.current = 0
      phaseStartPosition.current.copy(groupRef.current.position)
      phaseStartQuaternion.current.copy(groupRef.current.quaternion)
      phaseEndPosition.current.copy(forwardPosition)
      phaseEndQuaternion.current.copy(
        isSelected ? baseTargetQuaternion : groupRef.current.quaternion,
      )
      motionPhase.current = isSelected ? 'enterForward' : 'exitForward'
    }

    switch (motionPhase.current) {
      case 'enterForward': {
        const completed = advancePhase(
          groupRef.current,
          delta,
          ENTER_FORWARD_DURATION,
          phaseElapsed.current,
          phaseStartPosition.current,
          phaseEndPosition.current,
          phaseStartQuaternion.current,
          phaseEndQuaternion.current,
          transitionPosition,
          phaseQuaternion,
        )

        phaseElapsed.current += delta

        if (completed) {
          phaseElapsed.current = 0
          phaseStartPosition.current.copy(groupRef.current.position)
          phaseStartQuaternion.current.copy(groupRef.current.quaternion)
          phaseEndPosition.current.copy(selectedPosition)
          phaseEndQuaternion.current.copy(selectedTargetQuaternion)
          motionPhase.current = 'enterFront'
        }

        return
      }

      case 'enterFront': {
        phaseEndPosition.current.copy(selectedPosition)
        phaseEndQuaternion.current.copy(selectedTargetQuaternion)

        const completed = advancePhase(
          groupRef.current,
          delta,
          ENTER_FRONT_DURATION,
          phaseElapsed.current,
          phaseStartPosition.current,
          phaseEndPosition.current,
          phaseStartQuaternion.current,
          phaseEndQuaternion.current,
          transitionPosition,
          phaseQuaternion,
        )

        phaseElapsed.current += delta

        if (completed) {
          motionPhase.current = 'selected'
        }

        return
      }

      case 'exitForward': {
        const completed = advancePhase(
          groupRef.current,
          delta,
          EXIT_FORWARD_DURATION,
          phaseElapsed.current,
          phaseStartPosition.current,
          phaseEndPosition.current,
          phaseStartQuaternion.current,
          phaseEndQuaternion.current,
          transitionPosition,
          phaseQuaternion,
        )

        phaseElapsed.current += delta

        if (completed) {
          phaseElapsed.current = 0
          phaseStartPosition.current.copy(groupRef.current.position)
          phaseStartQuaternion.current.copy(groupRef.current.quaternion)
          phaseEndPosition.current.copy(basePosition)
          phaseEndQuaternion.current.copy(baseTargetQuaternion)
          motionPhase.current = 'returnBase'
        }

        return
      }

      case 'returnBase': {
        phaseEndPosition.current.copy(basePosition)
        phaseEndQuaternion.current.copy(baseTargetQuaternion)

        const completed = advancePhase(
          groupRef.current,
          delta,
          RETURN_BASE_DURATION,
          phaseElapsed.current,
          phaseStartPosition.current,
          phaseEndPosition.current,
          phaseStartQuaternion.current,
          phaseEndQuaternion.current,
          transitionPosition,
          phaseQuaternion,
        )

        phaseElapsed.current += delta

        if (completed) {
          motionPhase.current = 'idle'
        }

        return
      }

      case 'selected': {
        const damping = 1 - Math.exp(-delta * 10)
        groupRef.current.position.lerp(selectedPosition, damping)
        groupRef.current.quaternion.slerp(selectedTargetQuaternion, damping)
        return
      }

      case 'idle': {
        const damping = 1 - Math.exp(-delta * 10)
        groupRef.current.position.lerp(basePosition, damping)
        groupRef.current.quaternion.slerp(baseTargetQuaternion, damping)
        return
      }
    }
  })

  return (
    <group
      ref={groupRef}
      onClick={(event) => {
        event.stopPropagation()
        onSelect(definition.id)
      }}
    >
      <RoundedBox
        args={[1, 1, 1]}
        castShadow
        receiveShadow
        radius={0.05}
        smoothness={6}
      >
        <meshStandardMaterial
          color={definition.color}
          metalness={0.08}
          roughness={0.35}
        />
      </RoundedBox>
      <DiceFaceLabels
        faces={definition.faces}
        textColor={definition.labelColor}
      />
    </group>
  )
}

function advancePhase(
  group: Group,
  delta: number,
  duration: number,
  elapsed: number,
  startPosition: Vector3,
  endPosition: Vector3,
  startQuaternion: Quaternion,
  endQuaternion: Quaternion,
  nextPosition: Vector3,
  nextQuaternion: Quaternion,
) {
  const progress = Math.min((elapsed + delta) / duration, 1)
  const easedProgress = easeInOutCubic(progress)

  nextPosition.copy(startPosition).lerp(endPosition, easedProgress)
  nextQuaternion.copy(startQuaternion).slerp(endQuaternion, easedProgress)
  group.position.copy(nextPosition)
  group.quaternion.copy(nextQuaternion)

  return progress >= 1
}

function easeInOutCubic(value: number) {
  if (value < 0.5) {
    return 4 * value * value * value
  }

  return 1 - Math.pow(-2 * value + 2, 3) / 2
}
