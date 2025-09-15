//USE THIS: https://react.dev/reference/react-dom/createPortal

import { useEffect, useRef } from "react";
import type { Item } from "../types/types";
import Button from "./Button";

type ModalContentProps = {
  onClose: () => void;
  showModal: boolean;
  children: React.ReactNode;
  item: Item;
};

export default function ModalContent({
  onClose,
  children,
  showModal,
  item,
}: ModalContentProps) {
  const modalRef = useRef(null);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
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
        "w-2/5 fixed top-[20%] left-[30%] bg-white/70 backdrop-blur-sm p-7 rounded-3xl border-black border-2"
      }
      style={{
        zIndex: "99999",
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
