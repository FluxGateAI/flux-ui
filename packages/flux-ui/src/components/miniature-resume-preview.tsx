/**
 * MiniatureResumePreview — renders a scaled-down resume mock with a dynamic
 * accent color. Useful for accent-color pickers / template thumbnails.
 *
 * The `data` prop is fully optional; sensible defaults render a realistic
 * single-entry sample without any consumer-side configuration.
 */
export interface MiniatureResumeData {
  name: string
  email: string
  phone: string
  location: string
  experience: Array<{
    title: string
    company: string
    location?: string
    range: string
    bullets?: string[]
  }>
}

const DEFAULT_DATA: MiniatureResumeData = {
  name: 'John Doe',
  email: 'john@email.com',
  phone: '(555) 123-4567',
  location: 'San Francisco, CA',
  experience: [
    {
      title: 'Senior Software Engineer',
      company: 'Acme Technologies',
      location: 'San Francisco, CA',
      range: '2021 – Present',
      bullets: [
        'Reduced deployment failures by 73% via automated CI/CD pipeline',
        'Architected microservices platform serving 2M daily active users',
      ],
    },
    {
      title: 'Software Engineer',
      company: 'DataCorp Inc.',
      range: '2018 – 2021',
    },
  ],
}

export interface MiniatureResumePreviewProps {
  /** Hex color string for the accent. Pass `#1a1a1a` for "black" (no color). */
  accentColor?: string
  /** Override the rendered content. Defaults to a realistic sample. */
  data?: MiniatureResumeData
}

export function MiniatureResumePreview({
  accentColor = '#1a1a1a',
  data = DEFAULT_DATA,
}: MiniatureResumePreviewProps) {
  const isBlack = accentColor === '#1a1a1a'
  const borderColor = isBlack ? '#1a1a1a' : `${accentColor}66`
  const fontFamily = '"Helvetica Neue", Helvetica, Arial, sans-serif'

  return (
    <div
      style={{
        fontFamily,
        fontSize: '9px',
        lineHeight: 1.4,
        color: '#1a1a1a',
        background: '#ffffff',
        padding: '20px 22px',
        overflow: 'hidden',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <div
          style={{
            fontFamily,
            fontSize: '18px',
            fontWeight: 700,
            color: isBlack ? '#1a1a1a' : accentColor,
            letterSpacing: '0.02em',
            marginBottom: '3px',
          }}
        >
          {data.name}
        </div>
        <div style={{ fontSize: '7.5px', color: '#555555' }}>
          {data.email}
          <span style={{ margin: '0 4px', color: '#ccc' }}>·</span>
          {data.phone}
          <span style={{ margin: '0 4px', color: '#ccc' }}>·</span>
          {data.location}
        </div>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <div
          style={{
            fontFamily,
            fontSize: '10px',
            fontWeight: 700,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.06em',
            color: accentColor,
            borderBottom: `1px solid ${borderColor}`,
            paddingBottom: '2px',
            marginBottom: '6px',
          }}
        >
          Experience
        </div>

        {data.experience.map((entry, idx) => (
          <div key={idx} style={{ marginBottom: idx === data.experience.length - 1 ? 0 : '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontWeight: 700, fontSize: '9px', color: '#1a1a1a' }}>{entry.title}</span>
              <span style={{ fontSize: '7.5px', color: '#777', whiteSpace: 'nowrap' }}>
                {entry.range}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '8px',
                color: '#555',
                fontStyle: 'italic',
                marginBottom: '2px',
              }}
            >
              <span>{entry.company}</span>
              {entry.location && (
                <span style={{ fontSize: '7.5px', color: '#777' }}>{entry.location}</span>
              )}
            </div>
            {entry.bullets && entry.bullets.length > 0 && (
              <ul
                style={{
                  marginLeft: '12px',
                  marginTop: '2px',
                  fontSize: '8px',
                  lineHeight: 1.35,
                  color: '#333',
                }}
              >
                {entry.bullets.map((bullet, bi) => (
                  <li key={bi} style={{ marginBottom: '1px' }}>
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
