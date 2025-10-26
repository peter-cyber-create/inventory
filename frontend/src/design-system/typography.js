// Professional Typography System for Ministry of Health Uganda
export const typography = {
  // Font Families
  fontFamily: `'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif`,
  fontFamilyMono: `'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Courier New', monospace`,
  
  // Font Weights
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 600,
  fontWeightBold: 700,
  fontWeightExtraBold: 800,
  
  // Headings
  h1: { 
    fontSize: '2.5rem', 
    fontWeight: 700, 
    lineHeight: 1.2, 
    letterSpacing: '-0.02em',
    marginBottom: '1.5rem'
  },
  h2: { 
    fontSize: '2rem', 
    fontWeight: 700, 
    lineHeight: 1.25, 
    letterSpacing: '-0.01em',
    marginBottom: '1.25rem'
  },
  h3: { 
    fontSize: '1.5rem', 
    fontWeight: 600, 
    lineHeight: 1.3, 
    letterSpacing: '-0.01em',
    marginBottom: '1rem'
  },
  h4: { 
    fontSize: '1.25rem', 
    fontWeight: 600, 
    lineHeight: 1.35, 
    marginBottom: '0.875rem'
  },
  h5: { 
    fontSize: '1.125rem', 
    fontWeight: 600, 
    lineHeight: 1.4,
    marginBottom: '0.75rem'
  },
  h6: { 
    fontSize: '1rem', 
    fontWeight: 600, 
    lineHeight: 1.4,
    marginBottom: '0.5rem'
  },
  
  // Body Text
  body: { 
    fontSize: '1rem', 
    fontWeight: 400, 
    lineHeight: 1.6,
    color: '#1A1A1A'
  },
  bodyLarge: { 
    fontSize: '1.125rem', 
    fontWeight: 400, 
    lineHeight: 1.6 
  },
  bodySmall: { 
    fontSize: '0.875rem', 
    fontWeight: 400, 
    lineHeight: 1.5 
  },
  
  // Specialized Text
  caption: { 
    fontSize: '0.75rem', 
    fontWeight: 500, 
    lineHeight: 1.4,
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  overline: { 
    fontSize: '0.75rem', 
    fontWeight: 600, 
    lineHeight: 1.4,
    textTransform: 'uppercase',
    letterSpacing: '0.1em'
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: '0.01em'
  },
  
  // Interactive Elements
  button: {
    fontSize: '0.875rem',
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '0.02em'
  },
  link: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.6,
    textDecoration: 'none'
  },
  
  // Code and Technical
  code: {
    fontFamily: `'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Courier New', monospace`,
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.5
  },
  
  // Professional Document Headers
  documentTitle: {
    fontSize: '1.875rem',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    color: '#006747'
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.3,
    color: '#006747',
    borderBottom: '2px solid #E8F5E8',
    paddingBottom: '0.5rem'
  }
};
