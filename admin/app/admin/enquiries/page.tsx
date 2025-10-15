"use client";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Inquiry = {
  id: number;
  name: string;
  email: string;
  contactNo?: string | null;
  projectType?: string | null;
  propertyType?: string | null;
  totalArea?: string | null;
  message: string;
  status: "NEW" | "CONTACTED" | "CLOSED";
  createdAt: string;
};

export default function EnquiriesPage() {
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";
  const token =
    typeof window !== "undefined" ? localStorage.getItem("adm_token") : null;

  // filters
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("");
  const [projectType, setProjectType] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // list
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");

  // notes modals
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [noteInquiry, setNoteInquiry] = useState<Inquiry | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewNotes, setViewNotes] = useState<
    { id: number; body: string; adminName?: string | null; createdAt: string }[]
  >([]);
  const [viewInquiry, setViewInquiry] = useState<Inquiry | null>(null);

  const limit = 9;
  const qs = useMemo(() => {
    const p = new URLSearchParams();
    p.set("limit", String(limit));
    p.set("page", String(page));
    if (q.trim()) p.set("q", q.trim());
    if (status) p.set("status", status);
    if (projectType.trim()) p.set("projectType", projectType.trim());
    if (from) p.set("from", from);
    if (to) p.set("to", to);
    return p.toString();
  }, [q, status, projectType, from, to, page]);

  async function load() {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${base}/api/admin/enquiries?${qs}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const raw = await res.text();
      let json: any;
      try {
        json = JSON.parse(raw);
      } catch {
        throw new Error(`(${res.status}) ${raw.slice(0, 120)}`);
      }
      if (!res.ok || json.status === false)
        throw new Error(json.message || `Failed (${res.status})`);
      setItems(json.data.items || []);
      setTotal(json.data.total || 0);
    } catch (e: any) {
      setError(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(); /* eslint-disable-next-line */
  }, [qs, token]);

  async function changeStatus(id: number, next: Inquiry["status"]) {
    if (!token) return;
    try {
      const res = await fetch(`${base}/api/admin/enquiries/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: next }),
      });
      const j = await res.json();
      if (!j.status) throw new Error(j.message || "Failed to update");
      load();
    } catch (e: any) {
      alert(e.message || "Failed");
    }
  }

  function openAddNote(inq: Inquiry) {
    setNoteInquiry(inq);
    setNoteText("");
    setNoteOpen(true);
  }
  async function submitNote() {
    if (!noteInquiry || !noteText.trim() || !token) return;
    try {
      const res = await fetch(
        `${base}/api/admin/enquiries/${noteInquiry.id}/notes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ body: noteText }),
        }
      );
      const j = await res.json();
      if (!j.status) throw new Error(j.message || "Failed to add note");
      setNoteOpen(false);
    } catch (e: any) {
      alert(e.message || "Failed");
    }
  }

  async function openViewNotes(inq: Inquiry) {
    setViewInquiry(inq);
    if (!token) return;
    const res = await fetch(`${base}/api/admin/enquiries/${inq.id}/notes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const j = await res.json();
    setViewNotes(j?.data?.items || []);
    setViewOpen(true);
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="grid gap-4">
      {/* Filters row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative">
          <Input
            placeholder="Search"
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
            className="w-[260px] pl-9"
          />
          <span className="pointer-events-none absolute left-3 top-2.5 text-gray-400">
            🔎
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="CLOSED">Closed</option>
          </select>
          <Input
            placeholder="Project Type"
            value={projectType}
            onChange={(e) => {
              setPage(1);
              setProjectType(e.target.value);
            }}
            className="w-[160px]"
          />
          <Input
            type="date"
            value={from}
            onChange={(e) => {
              setPage(1);
              setFrom(e.target.value);
            }}
            className="w-[160px]"
          />
          <Input
            type="date"
            value={to}
            onChange={(e) => {
              setPage(1);
              setTo(e.target.value);
            }}
            className="w-[160px]"
          />
          <Button
            className="bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
            onClick={() => {
              setQ("");
              setStatus("");
              setProjectType("");
              setFrom("");
              setTo("");
              setPage(1);
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-xl border bg-white">
        <table className="min-w-[800px] w-full text-sm">
          <thead>
            <tr className="bg-amber-100/70 text-gray-700">
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email Id</th>
              <th className="px-4 py-3 text-left">Contact No.</th>
              <th className="px-4 py-3 text-left">Project Type</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No enquiries found
                </td>
              </tr>
            )}
            {!loading &&
              items.map((it) => (
                <tr key={it.id} className="border-t">
                  <td className="px-4 py-3">{it.name}</td>
                  <td className="px-4 py-3">{it.email}</td>
                  <td className="px-4 py-3">{it.contactNo || "—"}</td>
                  <td className="px-4 py-3">{it.projectType || "—"}</td>
                  <td className="px-4 py-3">{/* if you add location */ "—"}</td>
                  <td className="px-4 py-3">
                    <select
                      value={it.status}
                      onChange={(e) =>
                        changeStatus(it.id, e.target.value as Inquiry["status"])
                      }
                      className="rounded-lg border px-2 py-1"
                    >
                      <option value="NEW">New</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative inline-block">
                      <Menu
                        items={[
                          { label: "Add note", onClick: () => openAddNote(it) },
                          {
                            label: "View notes",
                            onClick: () => openViewNotes(it),
                          },
                        ]}
                      />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* footer: pagination */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>Result per page – {limit}</div>
        <div>
          Page {page} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
            onClick={() => setPage((n) => Math.max(1, n - 1))}
            disabled={page === 1}
          >
            ‹
          </Button>
          <Button
            className="bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
            onClick={() => setPage((n) => Math.min(totalPages, n + 1))}
            disabled={page >= totalPages}
          >
            ›
          </Button>
        </div>
      </div>

      {/* Add Note modal */}
      {noteOpen && (
        <Modal
          title={`Add note – #${noteInquiry?.id}`}
          onClose={() => setNoteOpen(false)}
          onPrimary={submitNote}
          primaryText="Save note"
        >
          <textarea
            className="w-full min-h-[120px] rounded-lg border px-3 py-2 text-sm"
            placeholder="Write an internal note for this enquiry…"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
        </Modal>
      )}

      {/* View Notes modal */}
      {viewOpen && (
        <Modal
          title={`Notes – #${viewInquiry?.id}`}
          onClose={() => setViewOpen(false)}
          hidePrimary
        >
          <div className="grid gap-3 max-h-[50vh] overflow-y-auto">
            {viewNotes.length === 0 && (
              <div className="text-sm text-gray-500">No notes yet.</div>
            )}
            {viewNotes.map((n) => (
              <div key={n.id} className="rounded-lg border bg-white px-3 py-2">
                <div className="text-sm">{n.body}</div>
                <div className="mt-1 text-xs text-gray-500">
                  {n.adminName || "Admin"} •{" "}
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---------- tiny UI helpers (menu + modal) ---------- */

function Menu({ items }: { items: { label: string; onClick: () => void }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        className="rounded-full px-2 py-1 hover:bg-gray-100"
        onClick={() => setOpen((o) => !o)}
      >
        ⋮
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-1 w-36 overflow-hidden rounded-lg border bg-white shadow">
          {items.map((it, i) => (
            <button
              key={i}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
              onClick={() => {
                setOpen(false);
                it.onClick();
              }}
            >
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Modal({
  title,
  children,
  onClose,
  onPrimary,
  primaryText = "Save",
  hidePrimary = false,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onPrimary?: () => void;
  primaryText?: string;
  hidePrimary?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-2xl border bg-[#fbfaf6] shadow">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button className="text-2xl leading-none px-2" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="px-4 py-4">{children}</div>
        <div className="flex items-center justify-end gap-2 border-t px-4 py-3">
          <Button
            className="bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
            onClick={onClose}
          >
            Close
          </Button>
          {!hidePrimary && <Button onClick={onPrimary}>{primaryText}</Button>}
        </div>
      </div>
    </div>
  );
}
