type CrockpotIconProps = {
  className?: string
}

export default function CrockpotIcon({ className }: CrockpotIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M27 10.5h10" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <path d="M13 23c3.7-7.2 10.7-10.8 19-10.8S47.3 15.8 51 23" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M9.5 24.5h45" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <path d="M13.5 29h37l-2.2 17.2a8 8 0 0 1-7.9 7H23.6a8 8 0 0 1-7.9-7L13.5 29Z" fill="currentColor" />
      <circle cx="32" cy="41" r="4.2" fill="var(--surface)" />
      <path d="M18 53.5v2M46 53.5v2" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}
