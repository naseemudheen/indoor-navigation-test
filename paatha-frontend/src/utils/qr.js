export function extractQrCodePayload(value) {
  if (!value) return value;

  const rawValue = value.trim();

  try {
    const parsedUrl = new URL(rawValue);
    const queryCode = parsedUrl.searchParams.get("qr");
    if (queryCode) return queryCode.trim();

    const pathParts = parsedUrl.pathname.split("/").filter(Boolean);
    const qrSegmentIndex = pathParts.findIndex((part) => part.toLowerCase() === "qr");
    if (qrSegmentIndex >= 0 && pathParts[qrSegmentIndex + 1]) {
      return pathParts[qrSegmentIndex + 1].trim();
    }
  } catch (err) {
    // Raw QR codes are expected here.
  }

  return rawValue;
}
