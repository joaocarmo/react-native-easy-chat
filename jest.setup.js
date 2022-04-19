import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock'

jest.mock('@expo/react-native-action-sheet', () => 'ActionSheet')
jest.mock('react-native-safe-area-context', () => mockSafeAreaContext)
