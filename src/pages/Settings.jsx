import { useApp } from '../context/appContext.js'
import './Pages.css'

const controls = [
  { key: 'language', label: 'Display language', type: 'select', options: ['English', 'Español', 'Français', '日本語'] },
  { key: 'subtitles', label: 'Show subtitles when available', type: 'toggle' },
  { key: 'autoplay', label: 'Autoplay previews', type: 'toggle' },
  { key: 'dataUsage', label: 'Data usage', type: 'select', options: ['Auto', 'Low', 'Medium', 'High'] },
  { key: 'notifications', label: 'Product updates and recommendations', type: 'toggle' },
]

export default function Settings() {
  const { settings, updateSetting } = useApp()
  return <main className="page-wrap settings-page"><div className="page-intro"><span className="section-kicker">PERSONALIZE YOUR EXPERIENCE</span><h1>Settings</h1><p>Playback preferences are saved in this browser for your profile.</p></div><section className="settings-list" aria-label="Playback and account preferences">{controls.map((control) => <label className="settings-row" key={control.key}><span>{control.label}</span>{control.type === 'select' ? <select value={settings[control.key]} onChange={(event) => updateSetting(control.key, event.target.value)} aria-label={control.label}>{control.options.map((option) => <option key={option}>{option}</option>)}</select> : <input type="checkbox" checked={Boolean(settings[control.key])} onChange={(event) => updateSetting(control.key, event.target.checked)} aria-label={control.label} />}</label>)}</section><p className="settings-note">Settings are a local prototype and do not change any external account.</p></main>
}
