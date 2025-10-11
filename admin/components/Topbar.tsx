"use client";
export default function Topbar() {
  const today = new Date().toLocaleDateString();
  return (
    <header className="h-16 flex items-center justify-between border-b px-4 bg-white">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">{today}</span>
        <div className="w-8 h-8 rounded-full bg-gray-300" />
      </div>
    </header>
  );
}
