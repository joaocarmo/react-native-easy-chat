import { Text, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export const NavBar = () => {
  if (Platform.OS === 'web') {
    return null
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
      }}
    >
      <Text>💬 Easy Chat{'\n'}</Text>
    </SafeAreaView>
  )
}
