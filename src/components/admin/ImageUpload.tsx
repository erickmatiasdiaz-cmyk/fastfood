"use client";

import { ImageUp, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Uploads an image to the Supabase `images` bucket and returns its public URL
 * through `onUploaded`. Used across the admin to avoid pasting URLs by hand.
 */
export default function ImageUpload({
  onUploaded,
  label = "Subir imagen",
}: {
  onUploaded: (url: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(false);
    try {
      const supabase = createClient();
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("images").getPublicUrl(path);
      onUploaded(data.publicUrl);
    } catch {
      setError(true);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="inline-flex items-center gap-2 rounded-lg border border-black/15 bg-white px-3 py-2 text-xs font-black text-[#17130f] transition hover:border-red-600 hover:text-red-600 disabled:opacity-50"
      >
        {uploading ? (
          <Loader2 size={14} className="animate-spin" aria-hidden="true" />
        ) : (
          <ImageUp size={14} aria-hidden="true" />
        )}
        {uploading ? "Subiendo..." : label}
      </button>
      {error && (
        <span className="text-xs font-bold text-red-600">No se pudo subir</span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handleFile(file);
          event.target.value = "";
        }}
      />
    </div>
  );
}
