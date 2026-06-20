import type { ReactNode } from 'react'
import type {
  DiceKind,
  RotationAction,
} from '../../features/calendar/model/types'
import confirmIconUrl from '../../assets/icons/check.svg'
import downArrowIconUrl from '../../assets/icons/down_arrow.svg'
import rightMoveIconUrl from '../../assets/icons/rigit_move.svg'
import rightSpinIconUrl from '../../assets/icons/rigit_spin.svg'

type SelectionOverlayProps = {
  canMoveLeft: boolean
  canMoveRight: boolean
  selectedDiceId: DiceKind | null
  onConfirm: () => void
  onMoveLeft: () => void
  onMoveRight: () => void
  onRotate: (action: RotationAction) => void
}

const overlayButtons: {
  action: RotationAction
  className: string
  iconClassName?: string
  iconSrc: string
  label: string
}[] = [
  {
    action: 'tiltUp',
    className: 'overlay-up',
    iconClassName: 'overlay-icon-up',
    iconSrc: downArrowIconUrl,
    label: 'rotate up',
  },
  {
    action: 'tiltDown',
    className: 'overlay-down',
    iconClassName: 'overlay-icon-down',
    iconSrc: downArrowIconUrl,
    label: 'rotate down',
  },
  {
    action: 'tiltLeft',
    className: 'overlay-left',
    iconClassName: 'overlay-icon-left',
    iconSrc: downArrowIconUrl,
    label: 'rotate left',
  },
  {
    action: 'tiltRight',
    className: 'overlay-right',
    iconClassName: 'overlay-icon-right',
    iconSrc: downArrowIconUrl,
    label: 'rotate right',
  },
  {
    action: 'spinCcw',
    className: 'overlay-spin-left',
    iconClassName: 'overlay-icon-spin-left',
    iconSrc: rightSpinIconUrl,
    label: 'spin counterclockwise',
  },
  {
    action: 'spinCw',
    className: 'overlay-spin-right',
    iconClassName: 'overlay-icon-spin-right',
    iconSrc: rightSpinIconUrl,
    label: 'spin clockwise',
  },
]

export function SelectionOverlay({
  canMoveLeft,
  canMoveRight,
  selectedDiceId,
  onConfirm,
  onMoveLeft,
  onMoveRight,
  onRotate,
}: SelectionOverlayProps) {
  if (!selectedDiceId) {
    return null
  }

  return (
    <div className="selection-overlay" aria-live="polite">
      <div className="selection-overlay__cluster">
        {overlayButtons.map((button) => (
          <OverlayGlassButton
            key={button.action}
            className={button.className}
            onClick={() => onRotate(button.action)}
            label={button.label}
          >
            <img
              src={button.iconSrc}
              alt=""
              aria-hidden="true"
              className={`selection-overlay__icon ${button.iconClassName ?? ''}`}
            />
          </OverlayGlassButton>
        ))}
        <OverlayGlassButton
          className="overlay-move-left"
          onClick={onMoveLeft}
          disabled={!canMoveLeft}
          label="move dice left"
        >
          <img
            src={rightMoveIconUrl}
            alt=""
            aria-hidden="true"
            className="selection-overlay__icon overlay-icon-move-left"
          />
        </OverlayGlassButton>
        <OverlayGlassButton
          className="overlay-move-right"
          onClick={onMoveRight}
          disabled={!canMoveRight}
          label="move dice right"
        >
          <img
            src={rightMoveIconUrl}
            alt=""
            aria-hidden="true"
            className="selection-overlay__icon"
          />
        </OverlayGlassButton>
        <OverlayGlassButton
          className="selection-overlay__confirm"
          onClick={onConfirm}
          label="confirm selection"
        >
          <img
            src={confirmIconUrl}
            alt=""
            aria-hidden="true"
            className="selection-overlay__icon selection-overlay__icon--confirm"
          />
        </OverlayGlassButton>
      </div>
    </div>
  )
}

type OverlayGlassButtonProps = {
  children: ReactNode
  className: string
  disabled?: boolean
  label: string
  onClick: () => void
}

function OverlayGlassButton({
  children,
  className,
  disabled = false,
  label,
  onClick,
}: OverlayGlassButtonProps) {
  return (
    <button
      type="button"
      className={`selection-overlay__button ${className}`}
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
