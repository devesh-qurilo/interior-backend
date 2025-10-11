export default function SettingsPage() {
  return (
    <div className="rounded-xl border bg-white p-5">
      <h2 className="text-lg font-semibold mb-4">Settings</h2>
      <div className="grid gap-3 max-w-md">
        <input
          className="border rounded-lg px-3 py-2"
          placeholder="Site name"
        />
        <input
          className="border rounded-lg px-3 py-2"
          placeholder="Contact email"
        />
        <input className="border rounded-lg px-3 py-2" placeholder="Logo URL" />
        <button className="px-4 py-2 rounded-lg bg-amber-700 text-white w-fit">
          Save
        </button>
      </div>
    </div>
  );
}
