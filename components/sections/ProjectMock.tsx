import type { Project } from "@/content/site";

const PANEL = "rgba(0,0,0,0.32)";
const PANEL_2 = "rgba(0,0,0,0.2)";
const LINE = "rgba(255,255,255,0.45)";
const LINE_SOFT = "rgba(255,255,255,0.22)";
const ACCENT = "rgba(200,255,46,0.7)";

function MockBody({ kind }: { kind: Project["preview"] }) {
  if (kind === "chart") {
    return (
      <svg viewBox="0 0 300 180" preserveAspectRatio="none" className="h-full w-full">
        <g fill={PANEL}>
          <rect x="0" y="0" width="92" height="38" rx="5" />
          <rect x="104" y="0" width="92" height="38" rx="5" />
          <rect x="208" y="0" width="92" height="38" rx="5" />
        </g>
        <g fill={LINE}>
          <rect x="10" y="10" width="38" height="5" rx="2.5" />
          <rect x="114" y="10" width="38" height="5" rx="2.5" />
          <rect x="218" y="10" width="38" height="5" rx="2.5" />
        </g>
        <g fill={LINE_SOFT}>
          <rect x="10" y="22" width="22" height="7" rx="3" />
          <rect x="114" y="22" width="22" height="7" rx="3" />
          <rect x="218" y="22" width="22" height="7" rx="3" />
        </g>
        <g fill={LINE_SOFT}>
          {[26, 44, 34, 58, 46, 72, 64].map((height, index) => (
            <rect
              key={index}
              x={14 + index * 40}
              y={172 - height}
              width="22"
              height={height}
              rx="3"
            />
          ))}
        </g>
        <rect x="6" y="172" width="288" height="1.5" fill={LINE_SOFT} />
      </svg>
    );
  }

  if (kind === "kanban") {
    return (
      <svg viewBox="0 0 300 180" preserveAspectRatio="none" className="h-full w-full">
        {[8, 108, 208].map((x, column) => (
          <g key={column}>
            <rect x={x} y="0" width="84" height="180" rx="5" fill={PANEL_2} />
            <rect x={x + 8} y="10" width="34" height="5" rx="2.5" fill={LINE} />
            {[0, 1, 2].map((card) => (
              <rect
                key={card}
                x={x + 8}
                y={26 + card * 40}
                width="68"
                height="30"
                rx="4"
                fill={card === 0 && column === 0 ? ACCENT : PANEL}
              />
            ))}
          </g>
        ))}
      </svg>
    );
  }

  if (kind === "grid") {
    return (
      <svg viewBox="0 0 300 180" preserveAspectRatio="none" className="h-full w-full">
        {[0, 1, 2].map((column) =>
          [0, 1].map((row) => (
            <g key={`${column}-${row}`}>
              <rect
                x={column * 100 + 4}
                y={row * 92 + 2}
                width="92"
                height="86"
                rx="5"
                fill={PANEL_2}
              />
              <rect
                x={column * 100 + 12}
                y={row * 92 + 12}
                width="76"
                height="50"
                rx="4"
                fill={PANEL}
              />
              <rect
                x={column * 100 + 12}
                y={row * 92 + 68}
                width="44"
                height="5"
                rx="2.5"
                fill={LINE}
              />
            </g>
          )),
        )}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 300 180" preserveAspectRatio="none" className="h-full w-full">
      <rect x="0" y="0" width="300" height="62" rx="5" fill={PANEL} />
      <rect x="12" y="14" width="120" height="7" rx="3.5" fill={LINE} />
      <rect x="12" y="30" width="80" height="5" rx="2.5" fill={LINE_SOFT} />
      <rect x="220" y="16" width="66" height="22" rx="4" fill={ACCENT} />
      <path
        d="M10 150 C 70 120 90 160 150 120 S 250 150 292 104"
        fill="none"
        stroke={LINE}
        strokeWidth="2"
        strokeDasharray="5 5"
      />
      {[
        [10, 150],
        [150, 120],
        [292, 104],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" fill={ACCENT} />
      ))}
    </svg>
  );
}

export default function ProjectMock({ project }: { project: Project }) {
  return (
    <div className="absolute inset-0" style={{ background: project.gradient }}>
      <div className="flex h-7 items-center gap-1.5 border-b border-white/15 bg-black/30 px-3">
        <span className="size-1.5 rounded-full bg-white/40" />
        <span className="size-1.5 rounded-full bg-white/25" />
        <span className="size-1.5 rounded-full bg-white/25" />
        <span className="ml-2 h-2.5 flex-1 rounded-full bg-white/15" />
      </div>
      <div className="absolute inset-x-0 top-7 bottom-0 p-4">
        <MockBody kind={project.preview} />
      </div>
      <span className="label absolute bottom-3 left-3 text-white/90">
        {project.name}
      </span>
    </div>
  );
}
