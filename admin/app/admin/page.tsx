export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <section className="rounded-xl border bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Add Your Next Creative Story
            </h2>
            <p className="text-sm text-gray-500">
              Upload visuals, details, and let your latest project shine.
            </p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-amber-700 text-white">
            + Add a Project
          </button>
        </div>
      </section>

      <section className="rounded-xl border bg-white p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Recently Uploaded Projects</h3>
          <a href="/admin/projects" className="text-sm text-blue-600">
            See All →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-48 bg-gray-200 rounded-xl" />
          <div className="h-48 bg-gray-200 rounded-xl" />
          <div className="h-48 bg-gray-200 rounded-xl" />
        </div>
      </section>

      <section className="rounded-xl border bg-white p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Recently Enquiries</h3>
          <a href="/admin/enquiries" className="text-sm text-blue-600">
            See All →
          </a>
        </div>
        <div className="overflow-auto">
          <table className="min-w-[600px] w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2">Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Project Type</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="py-2">—</td>
                <td>—</td>
                <td>—</td>
                <td>—</td>
                <td>—</td>
                <td>—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
