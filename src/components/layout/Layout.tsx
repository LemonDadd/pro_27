import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
  background?: string;
  flexCol?: boolean;
  extras?: ReactNode;
}

export default function Layout({
  children,
  background = "bg-gradient-to-b from-slate-50 to-white",
  flexCol = false,
  extras,
}: LayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen",
        background,
        flexCol && "flex flex-col",
      )}
    >
      <Navbar />
      {children}
      <Footer />
      {extras}
    </div>
  );
}
