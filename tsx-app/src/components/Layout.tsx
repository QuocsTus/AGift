import { type PropsWithChildren } from "react";
import { Outlet } from "react-router-dom";
import { SiteHeader } from "./SiteHeader";

export function Layout({ children }: PropsWithChildren) {
  return (
    <main className="site-shell">
      <SiteHeader />
      {children ?? <Outlet />}
    </main>
  );
}
