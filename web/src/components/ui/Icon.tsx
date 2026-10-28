const PATHS = {
  overview: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  laptop: 'M5 6h14v10H5z M2 19h20',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21a8 8 0 0 1 16 0',
  org: 'M10 3h4v4h-4z M3 17h4v4H3z M17 17h4v4h-4z M12 7v5 M5 17v-5h14v5',
  grid: 'M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z',
  store: 'M4 9l1-5h14l1 5 M4 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 M5 12v8h14v-8 M10 20v-5h4v5',
  wrench: 'M14 7a4 4 0 0 0 5.5 5.5l-9 9a2.1 2.1 0 0 1-3-3l9-9A4 4 0 0 0 14 7z',
  archive: 'M3 4h18v4H3z M5 8v12h14V8 M10 12h4',
  reports: 'M5 20V10 M12 20V4 M19 20v-7',
  settings: 'M4 7h10 M18 7h2 M4 17h2 M10 17h10 M16 5v4 M8 15v4',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M21 21l-5-5',
  bell: 'M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z M10 21h4',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  box: 'M12 3l8 4.5v9L12 21l-8-4.5v-9z M4 7.5l8 4.5 8-4.5 M12 12v9',
  plus: 'M12 5v14 M5 12h14',
  arrow: 'M5 12h14 M13 6l6 6-6 6',
  swap: 'M9 14L4 9l5-5 M4 9h10a6 6 0 0 1 0 12h-3',
  inventory: 'M4 4h16v16H4z M8 9h8 M8 13h8 M8 17h5',
  history: 'M3 12a9 9 0 1 0 3-6.7 M3 4v5h5 M12 8v4l3 2',
  document: 'M7 3h8l4 4v14H7z M15 3v4h4 M10 12h6 M10 16h6',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 11v5 M12 8h.01',
  edit: 'M4 20h4L19 9l-4-4L4 16z M13 7l4 4',
  more: 'M6 12h.01 M12 12h.01 M18 12h.01',
  download: 'M12 4v11 M7 10l5 5 5-5 M5 20h14',
  filter: 'M4 6h16 M7 12h10 M10 18h4',
  columns: 'M4 5h16v14H4z M10 5v14 M15 5v14',
  chevron: 'M6 9l6 6 6-6',
  check: 'M5 12l5 5 9-10',
} as const;

export type IconName = keyof typeof PATHS;

type Props = { name: IconName; size?: number; className?: string };

/** Decorative (aria-hidden): the visible label next to it carries the meaning. */
export function Icon({ name, size = 20, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {PATHS[name].split(' M').map((d, i) => (
        <path key={i} d={i === 0 ? d : `M${d}`} />
      ))}
    </svg>
  );
}
