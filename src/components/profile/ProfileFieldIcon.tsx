import type { ReactNode } from "react";

type ProfileFieldIconProps = {
  children: ReactNode;
};

export default function ProfileFieldIcon({ children }: ProfileFieldIconProps) {
  return (
    <span className="flex h-4 w-4 shrink-0 items-center justify-center text-brand-red">
      {children}
    </span>
  );
}
