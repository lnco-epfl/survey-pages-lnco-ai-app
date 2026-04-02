export type FontSize = 'small' | 'normal' | 'large' | 'extra-large';

export type ScreenCalibration = {
  fontSize?: FontSize;
};

const validFontSizes: FontSize[] = ['small', 'normal', 'large', 'extra-large'];

/**
 * Parse and validate screen calibration from localContext
 * Returns undefined if no valid calibration data exists
 */
export const parseScreenCalibration = (
  calibration: unknown,
): ScreenCalibration | undefined => {
  if (!calibration || typeof calibration !== 'object') {
    return undefined;
  }

  const { fontSize } = calibration as Record<string, unknown>;

  // Only include fontSize if it's valid
  if (fontSize && validFontSizes.includes(fontSize as FontSize)) {
    return { fontSize: fontSize as FontSize };
  }

  // Return undefined if no valid fields
  if (!fontSize) {
    return undefined;
  }

  // If fontSize was present but invalid, still return empty calibration
  // (allows graceful fallback without treating as error)
  return undefined;
};
