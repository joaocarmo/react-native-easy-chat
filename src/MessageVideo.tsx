import React from 'react'
import type { FC } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Color from './Color'
import {
  VIDEO_NOT_IMPLEMENTED_MESSAGE,
  VIDEO_NOT_IMPLEMENTED_TITLE,
} from './Constant'

const MessageVideo: FC = () => (
  <View style={styles.viewStyle}>
    <Text style={styles.textStyle}>{VIDEO_NOT_IMPLEMENTED_TITLE}</Text>
    <Text style={styles.textStyle}>{VIDEO_NOT_IMPLEMENTED_MESSAGE}</Text>
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

export default MessageVideo
