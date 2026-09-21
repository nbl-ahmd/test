import type { ReactNode } from "react";

type ContainerTag = "div" | "section" | "header" | "footer" | "nav";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: ContainerTag;
};

/**
 * The single layout rail for the whole page. Every section, the header and the
 * footer render their content inside this so all left edges line up with the
 * hero and the shared `--gutter` drives horizontal rhythm.
 */
export default function Container({
  children,
  className,
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag
      className={`mx-auto w-full max-w-[1600px] px-[var(--gutter)]${
        className ? ` ${className}` : ""
      }`}
    >
      {children}
    </Tag>
  );
}
