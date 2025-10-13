// admin/app/admin/projects/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProjectCard from "@/components/ProjectCard";
import AddProjectModal from "@/components/AddProjectModal";

type Project = {
  id: number;
  slug: string;
  title: string;
  description?: string | null;
  propertyType?: string | null;
  area?: string | null;
  layout?: string | null;
  location?: string | null;
  imageUrl?: string[] | null;
  afterImageUrl?: string[] | null;
  beforeImageUrl?: string[] | null;
  isFeatured?: boolean | null;
  featuredOrder?: number | null;
};

export default function ProjectsPage() {
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";
  const token =
    typeof window !== "undefined" ? localStorage.getItem("adm_token") : null;

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [items, setItems] = useState<Project[]>([]);
  const [page, setPage] = useState(1);

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    p.set("limit", "50");
    p.set("page", String(page));
    if (search.trim()) p.set("q", search.trim()); // (optional) if you add q in API later
    return p.toString();
  }, [search, page]);

  async function load() {
    if (!token) {
      setError("Not logged in");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${base}/api/admin/projects?${qs}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const raw = await res.text();
      let json: any;
      try {
        json = JSON.parse(raw);
      } catch {
        throw new Error(
          `Server returned non-JSON (${res.status}): ${raw.slice(0, 120)}`
        );
      }
      if (!res.ok || json.status === false)
        throw new Error(json.message || `Failed (${res.status})`);
      setItems(json?.data?.items || []);
    } catch (e: any) {
      setError(e.message || "Failed to load projects");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(); /* eslint-disable-next-line */
  }, [qs, token]);

  async function saveFeatured(
    p: Project,
    nextIsFeatured: boolean,
    nextOrder?: number
  ) {
    if (!token) return setError("Not logged in");
    try {
      const res = await fetch(`${base}/api/admin/projects/${p.id}/feature`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isFeatured: nextIsFeatured,
          featuredOrder: nextIsFeatured
            ? Number(nextOrder ?? p.featuredOrder ?? 0) || 0
            : null,
        }),
      });
      const j = await res.json();
      if (!j.status) throw new Error(j.message || "Failed to update featured");
      load();
    } catch (e: any) {
      setError(e.message || "Failed to update featured");
    }
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <Button onClick={() => setOpen(true)}>+ Add a Project</Button>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[260px] pl-9"
            />
            <span className="pointer-events-none absolute left-3 top-2.5 text-gray-400">
              🔎
            </span>
          </div>
          <Button
            className="bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
            onClick={() => alert("Filters coming soon")}
          >
            ☰ Filters
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {loading && (
          <div className="rounded-2xl border bg-white p-6 text-sm text-gray-500">
            Loading projects…
          </div>
        )}
        {!loading && items.length === 0 && !error && (
          <div className="rounded-2xl border bg-white p-6 text-sm text-gray-500">
            No projects yet. Click “Add a Project” to create one.
          </div>
        )}
        {!loading &&
          items.map((p) => (
            <div key={p.id} className="grid gap-2">
              <FeatureControls
                isFeatured={!!p.isFeatured}
                featuredOrder={p.featuredOrder ?? 0}
                onToggle={(checked) =>
                  saveFeatured(p, checked, p.featuredOrder)
                }
                onOrderChange={(val) => saveFeatured(p, true, val)}
              />
              <ProjectCard p={p} />
            </div>
          ))}
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          className="bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
          onClick={() => setPage((n) => Math.max(1, n - 1))}
          disabled={page === 1}
        >
          ← Prev
        </Button>
        <div className="text-sm text-gray-600">Page {page}</div>
        <Button
          className="bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
          onClick={() => setPage((n) => n + 1)}
        >
          Next →
        </Button>
      </div>

      {/* The modal */}
      <AddProjectModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={load}
      />
    </div>
  );
}

/* small inline controls row */
function FeatureControls({
  isFeatured,
  featuredOrder,
  onToggle,
  onOrderChange,
}: {
  isFeatured: boolean;
  featuredOrder: number;
  onToggle: (checked: boolean) => void;
  onOrderChange: (val: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-white px-3 py-2">
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="h-4 w-4"
          checked={isFeatured}
          onChange={(e) => onToggle(e.target.checked)}
        />
        <span className="font-medium">Featured</span>
      </label>
      {isFeatured && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Order</span>
          <input
            type="number"
            min={0}
            step={1}
            value={featuredOrder ?? 0}
            onChange={(e) => onOrderChange(Number(e.target.value))}
            className="w-20 rounded-lg border px-2 py-1 text-sm"
            placeholder="0"
            title="Lower numbers appear first"
          />
        </div>
      )}
    </div>
  );
}
