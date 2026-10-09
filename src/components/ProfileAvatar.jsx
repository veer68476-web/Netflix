import './Media.css'

export default function ProfileAvatar({ name = 'Alex', color = '#466a84', image, size }) {
  return <span className="profile-avatar" style={{ '--avatar-color': color, width: size, height: size }} aria-label={`${name}'s profile`}>{image ? <img src={image} alt="" /> : name.slice(0, 1).toUpperCase()}</span>
}
