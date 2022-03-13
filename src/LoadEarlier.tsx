import { Component } from 'react'
import PropTypes from 'prop-types'
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
import { StylePropType } from './utils'

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

class LoadEarlier extends Component<LoadEarlierProps> {
  static defaultProps = {
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

  static propTypes = {
    onLoadEarlier: PropTypes.func,
    isLoadingEarlier: PropTypes.bool,
    label: PropTypes.string,
    containerStyle: StylePropType,
    wrapperStyle: StylePropType,
    textStyle: StylePropType,
    activityIndicatorStyle: StylePropType,
    activityIndicatorColor: PropTypes.string,
    activityIndicatorSize: PropTypes.string,
  }

  renderLoading() {
    const {
      activityIndicatorColor,
      activityIndicatorSize,
      activityIndicatorStyle,
      isLoadingEarlier,
      label,
      textStyle,
    } = this.props

    if (isLoadingEarlier === false) {
      return <Text style={[styles.text, textStyle]}>{label}</Text>
    }

    return (
      <View>
        <Text style={[styles.text, textStyle, styles.transparent]}>
          {label}
        </Text>
        <ActivityIndicator
          color={activityIndicatorColor}
          size={activityIndicatorSize}
          style={[styles.activityIndicator, activityIndicatorStyle]}
        />
      </View>
    )
  }

  render() {
    const { containerStyle, isLoadingEarlier, onLoadEarlier, wrapperStyle } =
      this.props

    return (
      <TouchableOpacity
        style={[styles.container, containerStyle]}
        onPress={() => onLoadEarlier?.()}
        disabled={isLoadingEarlier === true}
        accessibilityTraits="button"
      >
        <View style={[styles.wrapper, wrapperStyle]}>
          {this.renderLoading()}
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  transparent: {
    opacity: 0,
  },
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
