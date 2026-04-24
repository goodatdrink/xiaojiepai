import { useEffect } from 'react'
import './modal.css'

export function Modal(props: {
  open: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  const { open, title, onClose, children } = props

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <div className="modalTitle">{title}</div>
          <button type="button" className="modalClose" onClick={onClose} aria-label="关闭">
            ×
          </button>
        </div>
        <div className="modalBody">{children}</div>
      </div>
    </div>
  )
}

