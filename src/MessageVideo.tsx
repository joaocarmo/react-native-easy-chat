import React from 'react'
import { View, Text } from 'react-native'
import Color from './Color'

export default (_props: any) => (
  <View style={{ padding: 20 }}>
    <Text style={{ color: Color.alizarin, fontWeight: '600' }}>
      Video is not implemented by EasyChat.
    </Text>
    <Text style={{ color: Color.alizarin, fontWeight: '600' }}>
      You need to provide your own implementation by using renderMessageVideo
      prop.
    </Text>
  </View>
)
