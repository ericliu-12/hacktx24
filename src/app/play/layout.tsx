import React from "react";

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="m-10 h-dvh border-4 border-purple-600 bg-transparent p-10 shadow-md shadow-white">
      {children}
    </div>
  );
}
