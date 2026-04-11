/**
 * Returns true if value is a 24-char hex MongoDB ObjectId string.
 */
export function isValidObjectId(id) {
  if (id == null || id === "") return false;
  const s = String(id).trim();
  if (s === "undefined" || s === "null") return false;
  return /^[a-fA-F0-9]{24}$/.test(s);
}
