interface Env {
  ADMIN_USER: string;
  ADMIN_PASS: string;
  SESSION_SECRET: string;
}

async function makeToken(secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode("admin-session")
  );
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  const { username, password } = await request.json() as {
    username: string;
    password: string;
  };

  if (username !== env.ADMIN_USER || password !== env.ADMIN_PASS) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const token = await makeToken(env.SESSION_SECRET);
  return Response.json({ ok: true, token });
};
