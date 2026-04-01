interface Env {
  SURVEY_KV: KVNamespace;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, { headers: corsHeaders });

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const data = await env.SURVEY_KV.get("submissions");
  const submissions = data ? JSON.parse(data) : [];
  return Response.json(submissions, { headers: corsHeaders });
};

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  const submission = await request.json();
  const data = await env.SURVEY_KV.get("submissions");
  const submissions: unknown[] = data ? JSON.parse(data) : [];
  submissions.push(submission);
  await env.SURVEY_KV.put("submissions", JSON.stringify(submissions));
  return Response.json({ ok: true }, { headers: corsHeaders });
};
