import { useCallback, useMemo } from 'react'
import { Animated, StyleSheet } from 'react-native'
import { TypingAnimation } from 'react-native-typing-animation'
import { useUpdateLayoutEffect } from './hooks/useUpdateLayoutEffect'
import Color from './Color'

const defaultDot = {
  color: 'rgba(0, 0, 0, 0.38)',
  margin: 5.5,
  radius: 4,
  style: { marginLeft: 6, marginTop: 7.2 },
}

interface TypingIndicatorProps {
  isTyping?: boolean
}

const TypingIndicator = ({ isTyping }: TypingIndicatorProps) => {
  const { yCoords, heightScale, marginScale } = useMemo(
    () => ({
      yCoords: new Animated.Value(200),
      heightScale: new Animated.Value(0),
      marginScale: new Animated.Value(0),
    }),
    [],
  )
  const indicatorStyle = useMemo(
    () => [
      styles.container,
      {
        transform: [
          {
            translateY: yCoords,
          },
        ],
        height: heightScale,
        marginBottom: marginScale,
      },
    ],
    [heightScale, marginScale, yCoords],
  )

  const slideIn = useCallback(() => {
    Animated.parallel([
      Animated.spring(yCoords, {
        toValue: 0,
        useNativeDriver: false,
      }),
      Animated.timing(heightScale, {
        toValue: 35,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(marginScale, {
        toValue: 8,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start()
  }, [heightScale, marginScale, yCoords])

  const slideOut = useCallback(() => {
    Animated.parallel([
      Animated.spring(yCoords, {
        toValue: 200,
        useNativeDriver: false,
      }),
      Animated.timing(heightScale, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(marginScale, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start()
  }, [heightScale, marginScale, yCoords])

  const callbackEffect = useCallback(() => {
    if (isTyping) {
      slideIn()
    } else {
      slideOut()
    }
  }, [isTyping, slideIn, slideOut])

  useUpdateLayoutEffect(callbackEffect, [callbackEffect])

  return (
    <Animated.View style={indicatorStyle}>
      {isTyping && (
        <TypingAnimation
          style={defaultDot.style}
          dotRadius={defaultDot.radius}
          dotMargin={defaultDot.margin}
          dotColor={defaultDot.color}
        />
      )}
    </Animated.View>
  )
}

TypingIndicator.defaultProps = {
  isTyping: false,
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 8,
    width: 45,
    borderRadius: 15,
    backgroundColor: Color.leftBubbleBackground,
  },
})

export default TypingIndicator
