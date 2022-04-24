import type { ReactElement } from 'react'
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native'
import Color from './Color'

export interface LoadEarlierProps {
  isLoadingEarlier?: boolean
  label?: string
  containerStyle?: StyleProp<ViewStyle>
  wrapperStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  activityIndicatorStyle?: StyleProp<ViewStyle>
  activityIndicatorColor?: string
  activityIndicatorSize?: number | 'small' | 'large'
  onLoadEarlier?(): void
}

const LoadEarlier = ({
  isLoadingEarlier = false,
  onLoadEarlier = () => {},
  label = 'Load earlier messages',
  containerStyle,
  wrapperStyle,
  textStyle,
  activityIndicatorColor = 'white',
  activityIndicatorSize = 'small',
  activityIndicatorStyle,
}: LoadEarlierProps): ReactElement => (
  <TouchableOpacity
    style={[styles.container, containerStyle]}
    onPress={onLoadEarlier}
    disabled={isLoadingEarlier}
    accessibilityRole="button"
  >
    <View style={[styles.wrapper, wrapperStyle]}>
      {isLoadingEarlier ? (
        <View>
          <Text style={[styles.text, textStyle, { opacity: 0 }]}>{label}</Text>
          <ActivityIndicator
            color={activityIndicatorColor!}
            size={activityIndicatorSize!}
            style={[styles.activityIndicator, activityIndicatorStyle]}
          />
        </View>
      ) : (
        <Text style={[styles.text, textStyle]}>{label}</Text>
      )}
    </View>
  </TouchableOpacity>
)

LoadEarlier.defaultProps = {
  onLoadEarlier: () => null,
  isLoadingEarlier: false,
  label: 'Load earlier messages',
  containerStyle: {},
  wrapperStyle: {},
  textStyle: {},
  activityIndicatorStyle: {},
  activityIndicatorColor: 'white',
  activityIndicatorSize: 'small',
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.defaultColor,
    borderRadius: 15,
    height: 30,
    paddingLeft: 10,
    paddingRight: 10,
  },
  text: {
    backgroundColor: Color.backgroundTransparent,
    color: Color.white,
    fontSize: 12,
  },
  activityIndicator: {
    marginTop: Platform.select({
      ios: -14,
      android: -16,
      default: -15,
    }),
  },
})

export default LoadEarlier
