export type ContentDocument = {
  title: string;
  url: string;
};

export function isSafeDocumentUrl(value: string) {
  const url = value.trim();
  if (url.startsWith("/") && !url.startsWith("//")) return true;

  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export function parseDocuments(value: FormDataEntryValue | null | unknown): ContentDocument[] {
  if (typeof value !== "string" || !value.trim()) {
    if (Array.isArray(value)) {
      return value.flatMap((item) => {
        if (item && typeof item === "object" && "title" in item && "url" in item) {
          const title = String(item.title).trim();
          const url = String(item.url).trim();
          return title && isSafeDocumentUrl(url) ? [{ title, url }] : [];
        }
        if (item && typeof item === "object" && "label" in item && "url" in item) {
          const title = String(item.label).trim();
          const url = String(item.url).trim();
          return title && isSafeDocumentUrl(url) ? [{ title, url }] : [];
        }
        return [];
      });
    }
    return [];
  }

  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, ...urlParts] = line.split("|");
      const url = urlParts.join("|").trim();

      return {
        title: title.trim(),
        url,
      };
    })
    .filter((document) => document.title && isSafeDocumentUrl(document.url));
}

export function stringifyDocuments(value: unknown) {
  if (!Array.isArray(value)) return "";

  return value
    .map((item) => {
      if (item && typeof item === "object") {
        const title = "title" in item ? item.title : "label" in item ? item.label : "";
        const url = "url" in item ? item.url : "";
        if (title && url) return `${String(title)} | ${String(url)}`;
      }
      return "";
    })
    .filter(Boolean)
    .join("\n");
}
