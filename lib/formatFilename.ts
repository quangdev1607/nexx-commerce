export function formatFilename(filename: string) {
  // Split the filename into name and extension
  const parts = filename.split(".");
  const extension = parts.pop(); // Get the file extension
  const name = parts.join("."); // In case there are multiple dots in the name

  // Return the formatted filename
  return `${name.slice(0, 5)}...${extension}`;
}
