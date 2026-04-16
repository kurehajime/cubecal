import { useEffect, useMemo, useState } from 'react'
import { CanvasTexture, LinearFilter, SRGBColorSpace } from 'three'
import type { CubeFace, DiceFaceLabels as DiceFaceLabelsMap } from '../../features/calendar/model/types'

type FaceTransform = {
  face: CubeFace
  position: [number, number, number]
  rotation: [number, number, number]
}

const faceTransforms: FaceTransform[] = [
  {
    face: 'front',
    position: [0, 0, 0.503],
    rotation: [0, 0, 0],
  },
  {
    face: 'right',
    position: [0.503, 0, 0],
    rotation: [0, Math.PI / 2, 0],
  },
  {
    face: 'back',
    position: [0, 0, -0.503],
    rotation: [0, Math.PI, 0],
  },
  {
    face: 'left',
    position: [-0.503, 0, 0],
    rotation: [0, -Math.PI / 2, 0],
  },
  {
    face: 'top',
    position: [0, 0.503, 0],
    rotation: [-Math.PI / 2, 0, 0],
  },
  {
    face: 'bottom',
    position: [0, -0.503, 0],
    rotation: [Math.PI / 2, 0, 0],
  },
]

function useArchivoBlackReady() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true

    void document.fonts.load('400 48px "Archivo Black"').then(() => {
      if (active) {
        setReady(true)
      }
    })

    return () => {
      active = false
    }
  }, [])

  return ready
}

function createFaceTexture(label: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512

  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('2D canvas context is unavailable')
  }

  context.clearRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = '#141414'
  context.textAlign = 'center'
  context.textBaseline = 'middle'

  const lines = label.split('/')
  const isNumeric = lines.length === 1 && /^\d+$/.test(lines[0])
  const maxWidth = isNumeric ? 456 : 428
  const maxHeight = isNumeric ? 442 : 410
  const lineHeightRatio = lines.length > 1 ? 0.82 : 1
  let fontSize = isNumeric ? 380 : 320

  while (fontSize > 88) {
    context.font = `400 ${fontSize}px "Archivo Black"`

    const widestLine = Math.max(
      ...lines.map((line) => context.measureText(line).width),
    )
    const lineHeight = fontSize * lineHeightRatio
    const totalHeight = fontSize + (lines.length - 1) * lineHeight

    if (widestLine <= maxWidth && totalHeight <= maxHeight) {
      break
    }

    fontSize -= 4
  }

  const lineHeight = fontSize * lineHeightRatio
  const totalHeight = fontSize + (lines.length - 1) * lineHeight
  const centerY = 256 - totalHeight / 2 + fontSize / 2

  context.font = `400 ${fontSize}px "Archivo Black"`

  lines.forEach((line, index) => {
    context.fillText(line, 256, centerY + index * lineHeight)
  })

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.minFilter = LinearFilter
  texture.magFilter = LinearFilter
  texture.needsUpdate = true

  return texture
}

type DiceFaceLabelsProps = {
  faces: DiceFaceLabelsMap
}

export function DiceFaceLabels({
  faces,
}: DiceFaceLabelsProps) {
  const fontReady = useArchivoBlackReady()

  const textures = useMemo(() => {
    if (!fontReady) {
      return null
    }

    return {
      front: createFaceTexture(faces.front),
      right: createFaceTexture(faces.right),
      back: createFaceTexture(faces.back),
      left: createFaceTexture(faces.left),
      top: createFaceTexture(faces.top),
      bottom: createFaceTexture(faces.bottom),
    }
  }, [faces, fontReady])

  useEffect(() => {
    return () => {
      if (!textures) {
        return
      }

      Object.values(textures).forEach((texture) => texture.dispose())
    }
  }, [textures])

  if (!textures) {
    return null
  }

  return (
    <>
      {faceTransforms.map((transform) => (
        <mesh
          key={transform.face}
          position={transform.position}
          rotation={transform.rotation}
        >
          <planeGeometry args={[0.82, 0.82]} />
          <meshBasicMaterial
            map={textures[transform.face]}
            toneMapped={false}
            transparent
          />
        </mesh>
      ))}
    </>
  )
}
