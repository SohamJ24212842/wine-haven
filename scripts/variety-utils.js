// Utility functions for variety detection (Node.js version)
function normalizeProductName(name) {
  // Remove common volume patterns: 500ml, 700ml, 1L, 750ml, etc.
  // Also remove trailing spaces and common separators
  return name
    .replace(/\s*\d+\s*(ml|mL|ML|L|l)\s*/gi, "")
    .replace(/\s*-\s*$/, "")
    .replace(/\s+$/, "")
    .trim();
}

module.exports = { normalizeProductName };

