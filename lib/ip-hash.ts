import { headers } from "next/headers";
import { createHash } from "crypto";

export async function getHashedIp(): Promise<string> {
  const headersList = await headers();
  const forwarded = headersList.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";

  const salt = process.env.IP_HASH_SALT ?? "";

  return createHash("sha256")
    .update(ip + salt)
    .digest("hex");
}
