import { useEffect, useRef } from "react";

//Project specific imports
import type { ModalContentProps } from "../types/types";

export default function ModalContent({
  onClose,
  children,
  showModal,
}: ModalContentProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showModal, onClose]);

  return (
    <div
      ref={modalRef}
      className={
        "w-4/5 sm:w-2/5 fixed top-[20%] left-[10%] sm:left-[30%] bg-white/70 backdrop-blur-sm p-7 rounded-3xl border-slate-500 border-1"
      }
      style={{
        zIndex: "99998",
      }}>
      <button
        onClick={onClose}
        className="absolute top-3 right-5 cursor-pointer text-gray-900 text-4xl">
        ×
      </button>
      <div>{children}</div>
    </div>
  );
}
