/** A file name that says what the pattern is and what it prints on. */
export const patternFileName = (
  slug: string,
  extension: 'pdf' | 'svg',
  paper?: string,
) => [slug, 'pattern', ...(paper ? [paper] : [])].join('-') + `.${extension}`;

/** Hands the browser a file to save. */
export const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};
