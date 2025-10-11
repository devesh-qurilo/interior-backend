"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getCloudinarySignature,
  uploadFileToCloudinary,
} from "@/components/cloudinaryUpload";

type Props = { open: boolean; onClose: () => void; onCreated: () => void };

export default function AddProjectModal({ open, onClose, onCreated }: Props) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("adm_token") : null;
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

  // form state
  const [title, setTitle] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [area, setArea] = useState("");
  const [layout, setLayout] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [highlightsText, setHighlightsText] = useState("");

  const designHighlights = useMemo(
    () =>
      highlightsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [highlightsText]
  );

  // images
  const [beforeUrls, setBeforeUrls] = useState<string[]>([]);
  const [afterUrls, setAfterUrls] = useState<string[]>([]);
  const [selectedAfter, setSelectedAfter] = useState<Set<string>>(new Set());

  // ui
  const [busy, setBusy] = useState(false);
  const [uploadingBefore, setUploadingBefore] = useState(false);
  const [uploadingAfter, setUploadingAfter] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!open) return;
    // reset when opened fresh
    setTitle("");
    setPropertyType("");
    setArea("");
    setLayout("");
    setLocation("");
    setDescription("");
    setHighlightsText("");
    setBeforeUrls([]);
    setAfterUrls([]);
    setSelectedAfter(new Set());
    setErr("");
    setBusy(false);
    setUploadingBefore(false);
    setUploadingAfter(false);
  }, [open]);

  async function handleUpload(
    kind: "before" | "after",
    files: FileList | null
  ) {
    if (!files || !token) return;
    setErr("");
    const setUploading =
      kind === "before" ? setUploadingBefore : setUploadingAfter;
    setUploading(true);
    try {
      const sig = await getCloudinarySignature(token);
      const tasks = Array.from(files).map((f) =>
        uploadFileToCloudinary(f, sig)
      );
      const urls = await Promise.all(tasks);
      if (kind === "before") setBeforeUrls((prev) => [...prev, ...urls]);
      else setAfterUrls((prev) => [...prev, ...urls]);
    } catch (e: any) {
      setErr(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function toggleAfter(url: string) {
    const next = new Set(selectedAfter);
    next.has(url) ? next.delete(url) : next.add(url);
    setSelectedAfter(next);
  }

  async function onSubmit() {
    setErr("");

    // validation
    if (!title.trim() || !location.trim()) {
      setErr("Please fill required fields: Title and Location.");
      return;
    }
    const featured = Array.from(selectedAfter);
    if (featured.length < 3 || featured.length > 6) {
      setErr("Select 3 to 6 images from ‘After’ to feature.");
      return;
    }

    if (!token) {
      setErr("Not authenticated");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`${base}/api/admin/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          propertyType,
          area,
          layout,
          location,
          designHighlights,
          beforeImageUrl: beforeUrls,
          afterImageUrl: afterUrls,
          imageUrl: featured,
        }),
      });
      const json = await res.json();
      if (!json.status) throw new Error(json.message || "Create failed");
      onCreated();
      onClose();
    } catch (e: any) {
      setErr(e.message || "Create failed");
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-5xl rounded-2xl bg-[#fbfaf6] border shadow-lg">
        {/* header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Add a Project</h2>
          <button onClick={onClose} className="text-2xl leading-none px-2">
            ×
          </button>
        </div>

        {/* body */}
        <div className="p-4 space-y-5">
          {/* Details */}
          <section className="rounded-xl border bg-white p-4 space-y-3">
            <h3 className="font-semibold">Project Details</h3>
            <div className="grid gap-3">
              <Input
                placeholder="Project Title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="grid md:grid-cols-3 gap-3">
                <Input
                  placeholder="Project Type * (e.g., Apartment)"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                />
                <Input
                  placeholder="Location *"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <Input
                  placeholder="Area (e.g., 2500 sq. ft.)"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <Input
                  placeholder="Layout (e.g., 3BHK)"
                  value={layout}
                  onChange={(e) => setLayout(e.target.value)}
                />
                <Input
                  placeholder="Design Highlights (comma separated)"
                  value={highlightsText}
                  onChange={(e) => setHighlightsText(e.target.value)}
                />
              </div>
              <textarea
                placeholder="Description *"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px] rounded-lg border px-3 py-2 text-sm"
              />
            </div>
          </section>

          {/* Images */}
          <section className="rounded-xl border bg-green-300 p-4 space-y-5">
            <h3 className="font-semibold">Images</h3>

            {/* BEFORE */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-medium">Before the transformation *</div>
                {uploadingBefore && (
                  <div className="text-xs text-gray-500">Uploading…</div>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {beforeUrls.map((u) => (
                  <Thumb key={u} url={u} />
                ))}
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleUpload("before", e.target.files)}
              />
            </div>

            {/* AFTER */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-medium">After the transformation *</div>
                <div className="text-xs text-gray-500">
                  Selected <b>{selectedAfter.size}</b> (need 3–6)
                  {uploadingAfter && <span className="ml-2">Uploading…</span>}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {afterUrls.map((u) => (
                  <Thumb
                    key={u}
                    url={u}
                    selectable
                    selected={selectedAfter.has(u)}
                    onToggle={() => toggleAfter(u)}
                  />
                ))}
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleUpload("after", e.target.files)}
              />
              <p className="text-xs text-gray-500">
                Click images to select 3–6 featured ones. Those become{" "}
                <code>imageUrl</code>.
              </p>
            </div>
          </section>

          {err && <div className="text-sm text-red-600">{err}</div>}

          {/* footer */}
          <div className="flex items-center justify-end gap-3">
            <Button
              className="bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
              onClick={onClose}
              disabled={busy}
            >
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={busy}>
              {busy ? "Saving…" : "Save Project"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Thumb({
  url,
  selectable = false,
  selected = false,
  onToggle,
}: {
  url: string;
  selectable?: boolean;
  selected?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div
      className={`relative aspect-[4/3] w-full overflow-hidden rounded-xl border bg-gray-100 ${
        selectable ? "cursor-pointer" : ""
      } ${selected ? "ring-2 ring-amber-600" : ""}`}
      onClick={() => selectable && onToggle && onToggle()}
      title={selectable ? "Click to select" : ""}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="" className="h-full w-full object-cover" />
      {selectable && (
        <div className="absolute left-2 top-2 grid place-items-center h-5 w-5 rounded bg-white/90 text-[12px]">
          {selected ? "✓" : ""}
        </div>
      )}
    </div>
  );
}
