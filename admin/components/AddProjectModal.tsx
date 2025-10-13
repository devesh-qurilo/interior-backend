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
    // reset when opened
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
      if (kind === "before") setBeforeUrls((p) => [...p, ...urls]);
      else setAfterUrls((p) => [...p, ...urls]);
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
      //   const res = await fetch(`${base}/api/admin/projects`, {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${token}`,
      //     },
      //     body: JSON.stringify({
      //       title,
      //       description,
      //       propertyType,
      //       area,
      //       layout,
      //       location,
      //       designHighlights,
      //       beforeImageUrl: beforeUrls,
      //       afterImageUrl: afterUrls,
      //       imageUrl: featured,
      //     }),
      //   });
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
      //   const json = await res.json();
      //   if (!json.status) throw new Error(json.message || "Create failed");
      const raw = await res.text();
      let json: any;
      try {
        json = JSON.parse(raw);
      } catch {
        // show first part of server reply so we know what it is
        throw new Error(
          `Server returned non-JSON (${res.status}): ${raw.slice(0, 200)}`
        );
      }

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
    <div className="fixed inset-0 z-50 bg-black/40">
      {/* modal container - mobile full width, centered on desktop */}
      <div className="absolute inset-x-0 bottom-0 top-auto mx-0 rounded-t-2xl bg-[#fbfaf6] shadow-2xl md:inset-0 md:m-auto md:h-auto md:max-h-[85vh] md:w-full md:max-w-5xl md:rounded-2xl">
        {/* sticky header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-[#fbfaf6] px-4 py-3 md:px-6">
          <h2 className="text-lg font-semibold">Add a Project</h2>
          <button onClick={onClose} className="text-2xl leading-none px-2">
            ×
          </button>
        </div>

        {/* scrollable body */}
        <div className="max-h-[70vh] overflow-y-auto px-4 py-4 md:px-6 md:py-5 space-y-5">
          {/* Details */}
          <section className="rounded-xl border bg-white p-4 md:p-5 space-y-4">
            <h3 className="font-semibold">Project Details</h3>

            <Labeled label="Project Title *">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Royal Villa Renovation"
              />
            </Labeled>

            <div className="grid gap-3 md:grid-cols-3">
              <Labeled label="Project Type *">
                <Input
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  placeholder="Apartment / Villa / Loft"
                />
              </Labeled>
              <Labeled label="Location *">
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Mumbai"
                />
              </Labeled>
              <Labeled label="Area">
                <Input
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g., 2500 sq ft"
                />
              </Labeled>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <Labeled label="Layout">
                <Input
                  value={layout}
                  onChange={(e) => setLayout(e.target.value)}
                  placeholder="e.g., 3BHK"
                />
              </Labeled>
              <Labeled label="Design Highlights (comma separated)">
                <Input
                  value={highlightsText}
                  onChange={(e) => setHighlightsText(e.target.value)}
                  placeholder="Italian marble, Smart lighting, Open kitchen"
                />
              </Labeled>
            </div>

            <Labeled
              label="Description *"
              hint="Brief overview users will read on the project page."
            >
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px] w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="Modern classic overhaul with warm palette…"
              />
            </Labeled>
          </section>

          {/* Images */}
          <section className="rounded-xl border bg-white p-4 md:p-5 space-y-6">
            <h3 className="font-semibold">Images</h3>

            {/* BEFORE */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-medium">Before the transformation *</div>
                <div className="text-xs text-gray-500">
                  {uploadingBefore
                    ? "Uploading…"
                    : `${beforeUrls.length} uploaded`}
                </div>
              </div>
              <PreviewGrid urls={beforeUrls} />
              <InputFile
                onChange={(e) => handleUpload("before", e.target.files)}
              />
              <p className="text-xs text-gray-500">
                Upload multiple images. They will appear below instantly.
              </p>
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
              <PreviewGrid
                urls={afterUrls}
                selectable
                selectedSet={selectedAfter}
                onToggle={(u) => toggleAfter(u)}
              />
              <InputFile
                onChange={(e) => handleUpload("after", e.target.files)}
              />
              <p className="text-xs text-gray-500">
                Tap/click images to select 3–6 featured ones. These become{" "}
                <code>imageUrl</code>.
              </p>
            </div>
          </section>

          {err && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {err}
            </div>
          )}
        </div>

        {/* sticky footer */}
        <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t bg-[#fbfaf6] px-4 py-3 md:px-6">
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
  );
}

/* ---------- small UI helpers ---------- */

function Labeled({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1">
      <span className="text-sm font-medium text-gray-800">{label}</span>
      {children}
      {hint && <span className="text-xs text-gray-500">{hint}</span>}
    </label>
  );
}

function InputFile({
  onChange,
}: {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border bg-gray-50 px-3 py-2 text-sm hover:bg-gray-100">
      <span>📤 Upload images</span>
      <input
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onChange}
      />
    </label>
  );
}

function PreviewGrid({
  urls,
  selectable = false,
  selectedSet,
  onToggle,
}: {
  urls: string[];
  selectable?: boolean;
  selectedSet?: Set<string>;
  onToggle?: (url: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
      {urls.map((u) => (
        <Thumb
          key={u}
          url={u}
          selectable={selectable}
          selected={!!selectedSet?.has(u)}
          onToggle={() => onToggle?.(u)}
        />
      ))}
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
      <div className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
        {/* simple domain badge for clarity */}
        {new URL(url).hostname.replace("www.", "")}
      </div>
      {selectable && (
        <div className="absolute left-2 top-2 grid h-5 w-5 place-items-center rounded bg-white/90 text-[12px]">
          {selected ? "✓" : ""}
        </div>
      )}
    </div>
  );
}
