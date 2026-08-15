import crypto from "crypto";

import { jazzCashConfig } from "./jazzcash";

function getHashString(
  payload: Record<string, string>
) {
  return Object.keys(payload)
    .filter(
      (key) =>
        key.startsWith("pp_") &&
        key !== "pp_SecureHash" &&
        payload[key] !== undefined &&
        payload[key] !== ""
    )
    .sort()
    .map((key) => payload[key])
    .join("&");
}

export function generateJazzCashSecureHash(
  payload: Record<string, string>
) {
  const hashString = getHashString(payload);

  return crypto
    .createHmac(
      "sha256",
      jazzCashConfig.integritySalt
    )
    .update(hashString)
    .digest("hex")
    .toUpperCase();
}

export function verifyJazzCashSecureHash(
  payload: Record<string, string>
) {
  const receivedHash = payload.pp_SecureHash;

  if (!receivedHash) {
    return false;
  }

  const payloadWithoutHash = { ...payload };

  delete payloadWithoutHash.pp_SecureHash;

  const expectedHash =
    generateJazzCashSecureHash(payloadWithoutHash);

  const receivedBuffer = Buffer.from(
    receivedHash.toUpperCase(),
    "utf8"
  );

  const expectedBuffer = Buffer.from(
    expectedHash,
    "utf8"
  );

  if (
    receivedBuffer.length !== expectedBuffer.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    receivedBuffer,
    expectedBuffer
  );
}