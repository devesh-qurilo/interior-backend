export default function LoginPage() {
  return (
    <div className="min-h-screen grid place-items-center">
      <div className="rounded-xl border bg-white p-6 w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-4">Admin Login</h1>
        <input
          className="border rounded-lg px-3 py-2 w-full mb-2"
          placeholder="Email"
        />
        <input
          className="border rounded-lg px-3 py-2 w-full mb-4"
          placeholder="Password"
          type="password"
        />
        <a
          href="/admin"
          className="px-4 py-2 rounded-lg bg-[#996830] text-white inline-block text-center w-full"
        >
          Login
        </a>
      </div>
    </div>
  );
}
