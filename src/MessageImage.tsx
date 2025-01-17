import { Image, StyleSheet, View } from 'react-native'
import type { ImageProps, ViewStyle, StyleProp, ImageStyle } from 'react-native'
// TODO: support web
import Lightbox from 'react-native-lightbox-v2'
import type { LightboxProps } from 'react-native-lightbox-v2'
import { IMessage } from './Models'

const styles = StyleSheet.create({
  container: {},
  image: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
    resizeMode: 'cover',
  },
  imageActive: {
    flex: 1,
    resizeMode: 'contain',
  },
})

export interface MessageImageProps<TMessage extends IMessage> {
  currentMessage?: TMessage
  containerStyle?: StyleProp<ViewStyle>
  imageStyle?: StyleProp<ImageStyle>
  imageProps?: Partial<ImageProps>
  lightboxProps?: LightboxProps
}

const MessageImage = <TMessage extends IMessage = IMessage>({
  containerStyle,
  lightboxProps = {},
  imageProps = {},
  imageStyle,
  currentMessage,
}: MessageImageProps<TMessage>) => {
  if (currentMessage == null) {
    return null
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <Lightbox
        activeProps={{
          style: styles.imageActive,
        }}
        {...lightboxProps}
      >
        <Image
          {...imageProps}
          style={[styles.image, imageStyle]}
          source={{ uri: currentMessage.image }}
        />
      </Lightbox>
    </View>
  )
}

MessageImage.defaultProps = {
  currentMessage: {
    image: null,
  },
  containerStyle: {},
  imageStyle: {},
  imageProps: {},
  lightboxProps: {},
}

export default MessageImage
