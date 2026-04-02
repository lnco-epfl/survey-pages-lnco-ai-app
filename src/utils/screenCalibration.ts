export type FontSizeOption = 'small' | 'normal' | 'large' | 'extra-large';

export type ScreenCalibration = {
  fontSize?: FontSizeOption;
  scale?: number;
};

const VALID_FONT_SIZES: FontSizeOption[] = [
  'small',
  'normal',
  'large',
  'extra-large',
];

const isValidScale = (value: unknown): value is number =>
  typeof value === 'number' && value > 0.5 && value < 3;

const isValidFontSize = (value: unknown): value is FontSizeOption =>
  typeof value === 'string' &&
  VALID_FONT_SIZES.includes(value as FontSizeOption);

export const parseScreenCalibration = (
  localContext: unknown,
): ScreenCalibration | undefined => {
  console.log('Parsing screenCalibration from localContext:', localContext);
  const calibration = (localContext as { screenCalibration?: unknown })
    ?.screenCalibration;
  console.log('Raw screenCalibration from localContext:', calibration);

  if (!calibration || typeof calibration !== 'object') {
    return undefined;
  }

  const parsed: ScreenCalibration = {};
  const { fontSize, scale } = calibration as {
    fontSize?: unknown;
    scale?: unknown;
  };

  if (isValidFontSize(fontSize)) {
    parsed.fontSize = fontSize;
  }

  if (isValidScale(scale)) {
    parsed.scale = scale;
  }

  return parsed.fontSize || parsed.scale ? parsed : undefined;
};
