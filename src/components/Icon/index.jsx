import React from 'react';

const paths = {
  dashboard: ['M4 13h7V4H4v9Z', 'M13 20h7V4h-7v16Z', 'M4 20h7v-5H4v5Z'],
  categories: ['M4 7h16', 'M4 12h16', 'M4 17h10'],
  expense: ['M12 5v14', 'M18 13l-6 6-6-6'],
  income: ['M12 19V5', 'M6 11l6-6 6 6'],
  event: ['M7 7h10v10H7z', 'M9 3v4', 'M15 3v4'],
  calendar: ['M7 3v4', 'M17 3v4', 'M4 8h16', 'M5 5h14v16H5z'],
  bank: ['M3 10l9-6 9 6', 'M5 10h14', 'M6 10v8', 'M10 10v8', 'M14 10v8', 'M18 10v8', 'M4 18h16'],
  home: ['M4 11l8-7 8 7', 'M6 10v10h12V10', 'M10 20v-6h4v6'],
  openFinance: ['M7 12a5 5 0 0 1 8-4', 'M17 8h-3V5', 'M17 12a5 5 0 0 1-8 4', 'M7 16h3v3'],
  user: ['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z', 'M4 21a8 8 0 0 1 16 0'],
  logout: ['M10 17l5-5-5-5', 'M15 12H3', 'M21 4v16'],
  menu: ['M4 7h16', 'M4 12h16', 'M4 17h16'],
  close: ['M6 6l12 12', 'M18 6 6 18'],
  edit: ['M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z', 'M13 7l4 4'],
  trash: ['M4 7h16', 'M10 11v6', 'M14 11v6', 'M6 7l1 14h10l1-14', 'M9 7V4h6v3'],
  plus: ['M12 5v14', 'M5 12h14'],
  search: ['M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z', 'M16 16l4 4'],
  wallet: ['M4 7h16v12H4z', 'M16 12h4', 'M7 7V5h10'],
  card: ['M4 6h16v12H4z', 'M4 10h16'],
  chart: ['M4 19V5', 'M8 16v-5', 'M12 16V8', 'M16 16v-8', 'M20 19H4'],
  trend: ['M4 16l5-5 4 4 7-8', 'M16 7h4v4'],
  alert: ['M12 4l9 16H3L12 4Z', 'M12 10v4', 'M12 17h.01'],
  arrowUpRight: ['M7 17 17 7', 'M9 7h8v8'],
  people: ['M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z', 'M2 20a7 7 0 0 1 14 0', 'M17 11a3 3 0 0 0 0-6', 'M16 14a6 6 0 0 1 6 6'],
  settings: ['M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z', 'M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.5-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.5 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.5 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.5-2-1.5c.1-.4.1-.8.1-1.2Z'],
  shield: ['M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Z', 'M9 12l2 2 4-5'],
  chevronDown: ['M6 9l6 6 6-6'],
};

export default function Icon({ name, size = 20, strokeWidth = 1.8, ...props }) {
  const iconPaths = paths[name] || paths.dashboard;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {iconPaths.map((d) => <path key={d} d={d} />)}
    </svg>
  );
}
