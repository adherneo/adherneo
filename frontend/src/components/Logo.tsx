interface LogoProps {
  height?: number
  dark?: boolean
  white?: boolean
}

export default function Logo({ height = 48, dark = false, white = false }: LogoProps) {
  const main  = white ? 'rgba(255,255,255,.9)' : dark ? 'rgba(255,255,255,.9)'  : '#12264e'
  const soft  = white ? 'rgba(255,255,255,.5)' : dark ? 'rgba(255,255,255,.5)'  : '#12264e'
  const stroke = white ? 'rgba(255,255,255,.9)' : dark ? 'rgba(255,255,255,.9)' : '#12264e'

  return (
    <svg viewBox="0 0 240 90" xmlns="http://www.w3.org/2000/svg" style={{ height, width: 'auto' }}>
      <circle cx="43" cy="36" r="30" fill="none" stroke={stroke} strokeWidth="2.8" />
      <text x="43" y="52" textAnchor="middle" fontFamily="Georgia,serif" fontSize="42" fontWeight="bold" fill={main}>A</text>
      <text x="90" y="55" textAnchor="start"  fontFamily="Georgia,serif" fontSize="36" fontWeight="bold" fill={main}>Adher</text>
      <text x="147" y="74" textAnchor="middle" fontFamily="Georgia,serif" fontSize="15" fill={soft} letterSpacing="4">neo</text>
    </svg>
  )
}
