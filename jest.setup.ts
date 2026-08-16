jest.mock('expo-font', () => ({
  useFonts: () => [true, null],
  isLoaded: () => true,
  loadAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('@expo-google-fonts/cormorant-garamond', () => ({
  useFonts: () => [true, null],
  CormorantGaramond_500Medium: 'CormorantGaramond_500Medium',
  CormorantGaramond_600SemiBold: 'CormorantGaramond_600SemiBold',
}));

jest.mock('@expo-google-fonts/source-sans-3', () => ({
  useFonts: () => [true, null],
  SourceSans3_400Regular: 'SourceSans3_400Regular',
  SourceSans3_600SemiBold: 'SourceSans3_600SemiBold',
}));
