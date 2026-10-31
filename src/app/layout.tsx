import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MeetMind — Your Meetings Have a Memory Now | Meeting Execution Workspace",
  description:
    "Don't let commitments get lost in audio recordings. MeetMind remembers every decision, catches contradictory proposals, and turns approved decisions into real tasks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
