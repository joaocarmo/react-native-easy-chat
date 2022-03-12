import React from 'react'
import type { FC } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Color from './Color'
import {
  AUDIO_NOT_IMPLEMENTED_MESSAGE,
  AUDIO_NOT_IMPLEMENTED_TITLE,
} from './Constant'

const MessageAudio: FC = () => (
  <View style={styles.viewStyle}>
    <Text style={styles.textStyle}>{AUDIO_NOT_IMPLEMENTED_MESSAGE}</Text>
    <Text style={styles.textStyle}>{AUDIO_NOT_IMPLEMENTED_TITLE}</Text>
  </View>
)

const styles = StyleSheet.create({
  viewStyle: {
    padding: 20,
  },
  textStyle: {
    color: Color.alizarin,
    fontWeight: '600',
  },
})

export default MessageAudio
