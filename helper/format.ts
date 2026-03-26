export const truncate = (value: string | null | undefined, max = 400): string => {
  const text = (value || "").trim();

  if (!text) {
    return "";
  }

  if (text.length <= max) {
    return text;
  }

  return `${text.slice(0, max - 1)}…`;
};

export const escapeHtml = (value: string | null | undefined): string => {
  return (value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
};

export const formatCountLine = (
  label: string,
  count: number,
  singular: string,
  plural = `${singular}s`,
): string => {
  const noun = count === 1 ? singular : plural;
  return `${label}: ${count} ${noun}`;
};
