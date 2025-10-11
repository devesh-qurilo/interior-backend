"use client";
import { useEffect, useMemo, useState } from "react";
import AddProjectModal from "@/components/AddProjectModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProjectCard from "@/components/ProjectCard";

type Project = {
  slug: string;
  title: string;
  description?: string | null;
  propertyType?: string | null;
  area?: string | null;
  location?: string | null;
  imageUrl?: string[] | null;
  afterImageUrl?: string[] | null;
  beforeImageUrl?: string[] | null;
};

export default function ProjectsPage() {
  const base =
    process.env.NEXT_PUBLIC_API_BASE ||
    "https://d2j83cbk-4000.inc1.devtunnels.ms";
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Project[]>([]);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    p.set("limit", "12");
    p.set("page", String(page));
    if (search.trim()) p.set("q", search.trim());
    return p.toString();
  }, [search, page]);

  async function load() {
    setLoading(true);
    try {
      // Using existing PUBLIC projects API (no auth needed for now)
      const res = await fetch(`${base}/api/projects?${qs}`);
      const json = await res.json();
      setItems(json?.data?.items || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qs]);

  return (
    <div className="grid gap-4">
      {/* Top bar: Add, Search, Filters */}
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

      {/* List */}
      <div className="grid gap-4">
        {loading && (
          <div className="rounded-2xl border bg-white p-6 text-sm text-gray-500">
            Loading projects…
          </div>
        )}
        {!loading && items.length === 0 && (
          <div className="rounded-2xl border bg-white p-6 text-sm text-gray-500">
            No projects found.
          </div>
        )}
        {!loading && items.map((p) => <ProjectCard key={p.slug} p={p} />)}
      </div>

      {/* Simple pagination (optional) */}
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
      <AddProjectModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={load}
      />
    </div>
  );
}
