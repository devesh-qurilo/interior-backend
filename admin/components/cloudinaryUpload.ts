export async function getCloudinarySignature(token: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";
  const res = await fetch(`${base}/api/admin/uploads/cloudinary/sign`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!json.status) throw new Error(json.message || "Sign failed");
  return json.data as {
    cloudName: string;
    apiKey: string;
    timestamp: number;
    signature: string;
    folder: string;
  };
}

export async function uploadFileToCloudinary(
  file: File,
  sig: {
    cloudName: string;
    apiKey: string;
    timestamp: number;
    signature: string;
    folder: string;
  }
) {
  const url = `https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`;
  const fd = new FormData();
  fd.append("file", file);
  fd.append("api_key", sig.apiKey);
  fd.append("timestamp", String(sig.timestamp));
  fd.append("signature", sig.signature);
  fd.append("folder", sig.folder);

  const res = await fetch(url, { method: "POST", body: fd });
  const json = await res.json();
  if (!json.secure_url) throw new Error("Upload failed");
  return json.secure_url as string;
}
