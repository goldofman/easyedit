export function getAdjustedDimensions(
  width: number,
  height: number,
): { width: number; height: number } {
  const maxDim = 1792; // Together AI max is 1792
  const minDim = 64;

  const roundToMultipleOf16 = (n: number) => Math.round(n / 16) * 16;

  const aspectRatio = width / height;

  let scaledWidth = width;
  let scaledHeight = height;

  // Scale down if either dimension exceeds maxDim
  if (width > maxDim || height > maxDim) {
    if (aspectRatio >= 1) {
      scaledWidth = maxDim;
      scaledHeight = Math.round(maxDim / aspectRatio);
    } else {
      scaledHeight = maxDim;
      scaledWidth = Math.round(maxDim * aspectRatio);
    }
  }

  // Round to multiple of 16 and clamp between min/max
  let adjustedWidth = roundToMultipleOf16(scaledWidth);
  let adjustedHeight = roundToMultipleOf16(scaledHeight);

  // Ensure within bounds AFTER rounding
  adjustedWidth = Math.min(maxDim, Math.max(minDim, adjustedWidth));
  adjustedHeight = Math.min(maxDim, Math.max(minDim, adjustedHeight));

  return { width: adjustedWidth, height: adjustedHeight };
}
