import { ReactNode } from "react";

export default function LayoutAuth({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="container flex justify-center">{children}</div>
    </>
  );
}
