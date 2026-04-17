import type {
  DiceKind,
  RotationAction,
} from '../../features/calendar/model/types'

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
    iconSrc: '/down_arrow.svg',
    label: 'rotate up',
  },
  {
    action: 'tiltDown',
    className: 'overlay-down',
    iconClassName: 'overlay-icon-down',
    iconSrc: '/down_arrow.svg',
    label: 'rotate down',
  },
  {
    action: 'tiltLeft',
    className: 'overlay-left',
    iconClassName: 'overlay-icon-left',
    iconSrc: '/down_arrow.svg',
    label: 'rotate left',
  },
  {
    action: 'tiltRight',
    className: 'overlay-right',
    iconClassName: 'overlay-icon-right',
    iconSrc: '/down_arrow.svg',
    label: 'rotate right',
  },
  {
    action: 'spinCcw',
    className: 'overlay-spin-left',
    iconClassName: 'overlay-icon-spin-left',
    iconSrc: '/rigit_spin.svg',
    label: 'spin counterclockwise',
  },
  {
    action: 'spinCw',
    className: 'overlay-spin-right',
    iconClassName: 'overlay-icon-spin-right',
    iconSrc: '/rigit_spin.svg',
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
          <button
            key={button.action}
            type="button"
            className={`selection-overlay__button ${button.className}`}
            onClick={() => onRotate(button.action)}
            aria-label={button.label}
          >
            <img
              src={button.iconSrc}
              alt=""
              aria-hidden="true"
              className={`selection-overlay__icon ${button.iconClassName ?? ''}`}
            />
          </button>
        ))}
        <button
          type="button"
          className="selection-overlay__button overlay-move-left"
          onClick={onMoveLeft}
          aria-label="move dice left"
          disabled={!canMoveLeft}
        >
          <img
            src="/rigit_move.svg"
            alt=""
            aria-hidden="true"
            className="selection-overlay__icon overlay-icon-move-left"
          />
        </button>
        <button
          type="button"
          className="selection-overlay__button overlay-move-right"
          onClick={onMoveRight}
          aria-label="move dice right"
          disabled={!canMoveRight}
        >
          <img
            src="/rigit_move.svg"
            alt=""
            aria-hidden="true"
            className="selection-overlay__icon"
          />
        </button>
        <button
          type="button"
          className="selection-overlay__button selection-overlay__confirm"
          onClick={onConfirm}
          aria-label="confirm selection"
        >
          <img
            src="/check.svg"
            alt=""
            aria-hidden="true"
            className="selection-overlay__icon selection-overlay__icon--confirm"
          />
        </button>
      </div>
    </div>
  )
}
