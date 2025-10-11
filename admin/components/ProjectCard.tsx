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

export default function ProjectCard({ p }: { p: Project }) {
  const img =
    p.imageUrl?.[0] || p.afterImageUrl?.[0] || p.beforeImageUrl?.[0] || "";

  return (
    <div className="rounded-2xl border bg-white p-3 md:p-4">
      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-4 items-start">
        <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-200">
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={img}
              alt={p.title}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>

        <div className="grid gap-2 text-sm">
          <Row k="Title" v={p.title} />
          <Row k="Project Type" v={p.propertyType || "—"} />
          <Row k="Area" v={p.area || "—"} />
          <Row k="Location" v={p.location || "—"} />
          <div className="mt-2 leading-relaxed text-gray-700">
            <b>Description</b>
            <span className="mx-2">:</span>
            <span className="text-gray-600">{p.description || "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[140px_12px_1fr] gap-2 text-gray-800">
      <span className="font-medium">{k}</span>
      <span className="text-gray-500">:</span>
      <span className="text-gray-700">{v}</span>
    </div>
  );
}
