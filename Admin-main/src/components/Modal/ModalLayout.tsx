// src/components/ModalLayout.tsx
import React from 'react';

export default function ModalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full h-full">
      {children}
    </div>
  );
}
