"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface VideoModalProps {
  videoId: string;
  productName: string;
  onClose: () => void;
}

export default function VideoModal({
  videoId,
  productName,
  onClose,
}: VideoModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-400 truncate pr-4">{productName}</p>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            aria-label="Close video"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-900">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={productName}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
