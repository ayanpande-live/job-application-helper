"use client";

import type { ReactNode } from "react";
import { CloseIcon } from "./icons";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: number;
}

export function Modal({ open, onClose, children, maxWidth = 560 }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-accent/45 px-4 py-8 animate-overlayIn">
      <button
        aria-label="Close modal overlay"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <div
        className="relative max-h-[92vh] w-full overflow-y-auto rounded-modal border border-line bg-surface p-6 shadow-modal animate-pop sm:p-7"
        style={{ maxWidth }}
      >
        {children}
      </div>
    </div>
  );
}

export function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      aria-label="Close"
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors hover:bg-soft hover:text-ink"
    >
      <CloseIcon />
    </button>
  );
}
