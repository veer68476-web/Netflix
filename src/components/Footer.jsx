import { CircleHelp, CirclePlay, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return <footer className="site-footer"><div className="footer-inner"><Link className="footer-brand" to="/">NEXFLIX</Link><p>Stories worth staying in for.</p><nav aria-label="Footer"><Link to="/movies">Browse</Link><Link to="/search">Search</Link><a href="mailto:hello@nexflix.example?subject=About%20NEXFLIX">About</a><a href="mailto:help@nexflix.example">Help Center</a><a href="mailto:privacy@nexflix.example">Privacy</a><a href="mailto:terms@nexflix.example">Terms</a><a href="mailto:hello@nexflix.example">Contact Us</a></nav><div className="footer-social"><a href="mailto:hello@nexflix.example" aria-label="Email"><Mail size={15} /></a><a href="https://www.youtube.com" aria-label="YouTube"><CirclePlay size={15} /></a><a href="mailto:help@nexflix.example" aria-label="Help"><CircleHelp size={15} /></a></div><span className="footer-copy">© 2026 NEXFLIX. Learning UI prototype.</span></div></footer>
}
