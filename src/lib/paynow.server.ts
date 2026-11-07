// Server-only Paynow helpers. Never import in the browser.

const PAYNOW_INITIATE_URL = "https://www.paynow.co.zw/interface/initiatetransaction";
const PAYNOW_REMOTE_URL = "https://www.paynow.co.zw/interface/remotetransaction";

export function parsePaynowResponse(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of text.split("&")) {
    const idx = line.indexOf("=");
    if (idx < 0) continue;
    out[line.slice(0, idx)] = decodeURIComponent(line.slice(idx + 1).replace(/\+/g, " "));
  }
  return out;
}

export function parsePaynowResultBody(text: string): { fields: Record<string, string>; fieldValues: string[] } {
  const fields: Record<string, string> = {};
  const fieldValues: string[] = [];

  for (const line of text.split("&")) {
    const idx = line.indexOf("=");
    if (idx < 0) continue;
    const key = line.slice(0, idx);
    const value = decodeURIComponent(line.slice(idx + 1).replace(/\+/g, " "));
    fields[key] = value;
    if (key.toLowerCase() !== "hash") fieldValues.push(value);
  }

  return { fields, fieldValues };
}

// Paynow validates the hash against the order the fields are posted in, so we
// must post them in exactly the order the hash was generated from.
const FIELD_ORDER = [
  "id",
  "reference",
  "amount",
  "additionalinfo",
  "returnurl",
  "resulturl",
  "authemail",
  "phone",
  "method",
  "status",
  "hash",
];

function toForm(values: Record<string, string>): string {
  const keys = [
    ...FIELD_ORDER.filter((k) => values[k] !== undefined),
    ...Object.keys(values).filter((k) => !FIELD_ORDER.includes(k)),
  ];
  return keys.map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(values[k])}`).join("&");
}


export async function initiateWebPayment(fields: Record<string, string>) {
  const res = await fetch(PAYNOW_INITIATE_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: toForm(fields),
  });
  const parsed = parsePaynowResponse(await res.text());
  if ((parsed.status || "").toLowerCase() !== "ok") {
    throw new Error(parsed.error || "Paynow initiate failed");
  }
  return { browserUrl: parsed.browserurl, pollUrl: parsed.pollurl };
}

export async function initiateMobilePayment(fields: Record<string, string>) {
  const res = await fetch(PAYNOW_REMOTE_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: toForm(fields),
  });
  const parsed = parsePaynowResponse(await res.text());
  if ((parsed.status || "").toLowerCase() !== "ok") {
    throw new Error(parsed.error || "Paynow mobile initiate failed");
  }
  return { pollUrl: parsed.pollurl, instructions: parsed.instructions || "" };
}
