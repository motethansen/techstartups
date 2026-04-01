interface Env {
  SURVEY_KV: KVNamespace;
  SESSION_SECRET: string;
}

async function verifyToken(token: string, secret: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const decoded = Uint8Array.from(atob(token), (c) => c.charCodeAt(0));
    return await crypto.subtle.verify(
      "HMAC",
      key,
      decoded,
      encoder.encode("admin-session")
    );
  } catch {
    return false;
  }
}

export const onRequestDelete: PagesFunction<Env> = async ({
  env,
  request,
}) => {
  const auth = request.headers.get("Authorization") ?? "";
  if (!auth.startsWith("Bearer ")) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const valid = await verifyToken(auth.slice(7), env.SESSION_SECRET);
  if (!valid) {
    return Response.json({ ok: false }, { status: 401 });
  }

  await env.SURVEY_KV.delete("submissions");
  return Response.json({ ok: true });
};
