import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock'

jest.mock('@expo/react-native-action-sheet', () => 'ActionSheet')
jest.mock('react-native-lightbox-v2', () => 'Lightbox')
jest.mock('react-native-safe-area-context', () => mockSafeAreaContext)
