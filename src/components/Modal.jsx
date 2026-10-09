import { useEffect } from 'react'
import { X } from 'lucide-react'
import './Media.css'

export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    const handleKeyDown = (event) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className="trailer-modal" role="dialog" aria-modal="true" aria-label={title}><button className="modal-close" type="button" aria-label="Close dialog" onClick={onClose}><X size={20} /></button>{children}</section></div>
}
