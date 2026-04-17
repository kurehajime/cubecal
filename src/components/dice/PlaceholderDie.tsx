import { useEffect, useMemo, useRef } from 'react'
import { Euler, Group, Quaternion, Vector3 } from 'three'
import { useFrame } from '@react-three/fiber'
import type { DiceDefinition } from '../../features/calendar/model/types'
import { RoundedBox } from '@react-three/drei'
import { DiceFaceLabels } from './DiceFaceLabels'
 
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
  const targetQuaternion = useMemo(() => new Quaternion(), [])
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

    const damping = 1 - Math.exp(-delta * 8)
    const targetPosition = isSelected ? selectedPosition : basePosition
    targetQuaternion
      .copy(isSelected ? camera.quaternion : baseQuaternion)
      .multiply(orientationQuaternion)

    groupRef.current.position.lerp(targetPosition, damping)
    groupRef.current.quaternion.slerp(targetQuaternion, damping)
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
        radius={0.08}
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
