import { LoaderCircle } from 'lucide-react'
import './Media.css'

export default function LoadingSpinner({ label = 'Loading titles' }) {
  return <output className="loading-spinner" aria-label={label}><LoaderCircle size={27} /><span className="sr-only">{label}</span></output>
}
