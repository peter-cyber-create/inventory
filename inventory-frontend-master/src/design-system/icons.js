// Central icon registry for MoH
// Usage: <Icon name="check" />
import React from 'react';

const icons = {
  check: (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M5 10.5l4 4 6-8" stroke="#006747" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  close: (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M6 6l8 8M6 14L14 6" stroke="#E53935" strokeWidth="2" strokeLinecap="round"/></svg>
  ),
  info: (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" stroke="#1976D2" strokeWidth="2"/><path d="M10 7v2m0 2v2" stroke="#1976D2" strokeWidth="2" strokeLinecap="round"/></svg>
  ),
  warning: (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M10 3l7 14H3L10 3z" stroke="#FFA000" strokeWidth="2"/><circle cx="10" cy="14" r="1" fill="#FFA000"/><path d="M10 8v3" stroke="#FFA000" strokeWidth="2" strokeLinecap="round"/></svg>
  ),
  // Add more icons as needed
};

export function Icon({ name, ...props }) {
  return icons[name] ? React.cloneElement(icons[name], props) : null;
}
