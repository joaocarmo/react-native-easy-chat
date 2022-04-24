import mockClipboard from '@react-native-clipboard/clipboard/jest/clipboard-mock.js'
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock'

jest.mock('@expo/react-native-action-sheet', () => 'ActionSheet')
jest.mock('@react-native-clipboard/clipboard', () => mockClipboard)
jest.mock('react-native-lightbox-v2', () => 'Lightbox')
jest.mock('react-native-safe-area-context', () => mockSafeAreaContext)
