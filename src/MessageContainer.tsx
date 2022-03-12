import React from 'react'
import type { RefObject } from 'react'
import PropTypes from 'prop-types'

import {
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ListViewProps,
  ListRenderItemInfo,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native'

import LoadEarlier from './LoadEarlier'
import Message from './Message'
import Color from './Color'
import { User, IMessage, Reply } from './Models'
import { warning, StylePropType } from './utils'
import TypingIndicator from './TypingIndicator'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerAlignTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  emptyChatContainer: {
    flex: 1,
    transform: [{ scaleY: -1 }],
  },
  headerWrapper: {
    flex: 1,
  },
  listStyle: {
    flex: 1,
  },
  scrollToBottomStyle: {
    opacity: 0.8,
    position: 'absolute',
    right: 10,
    bottom: 30,
    zIndex: 999,
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: Color.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Color.black,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 1,
  },
})

export interface MessageContainerProps<TMessage extends IMessage> {
  messages?: TMessage[]
  isTyping?: boolean
  user?: User
  listViewProps: Partial<ListViewProps>
  inverted?: boolean
  loadEarlier?: boolean
  alignTop?: boolean
  scrollToBottom?: boolean
  scrollToBottomStyle?: StyleProp<ViewStyle>
  invertibleScrollViewProps?: any
  extraData?: any
  scrollToBottomOffset?: number
  forwardRef?: RefObject<FlatList<IMessage>>
  renderChatEmpty?(): React.ReactNode
  renderFooter?(props: MessageContainerProps<TMessage>): React.ReactNode
  renderMessage?(props: Message['props']): React.ReactNode
  renderLoadEarlier?(props: LoadEarlier['props']): React.ReactNode
  scrollToBottomComponent?(): React.ReactNode
  onLoadEarlier?(): void
  onQuickReply?(replies: Reply[]): void
  infiniteScroll?: boolean
  isLoadingEarlier?: boolean
}

interface State {
  showScrollBottom: boolean
  hasScrolled: boolean
}

const DEFAULT_SCROLL_TO_BOTTOM_OFFSET = 200
const SCROLL_DOWN_INDICADOR = 'V'

const keyExtractor = (item: IMessage) => `${item._id}`

class MessageContainer<
  TMessage extends IMessage = IMessage,
> extends React.PureComponent<MessageContainerProps<TMessage>, State> {
  static defaultProps = {
    messages: [],
    user: {},
    isTyping: false,
    renderChatEmpty: null,
    renderFooter: null,
    renderMessage: null,
    renderLoadEarlier: undefined,
    onLoadEarlier: () => null,
    onQuickReply: () => null,
    inverted: true,
    loadEarlier: false,
    listViewProps: {},
    invertibleScrollViewProps: {},
    extraData: null,
    scrollToBottom: false,
    scrollToBottomOffset: DEFAULT_SCROLL_TO_BOTTOM_OFFSET,
    scrollToBottomComponent: undefined,
    forwardRef: undefined,
    alignTop: false,
    scrollToBottomStyle: {},
    infiniteScroll: false,
    isLoadingEarlier: false,
  }

  static propTypes = {
    messages: PropTypes.arrayOf(PropTypes.object),
    isTyping: PropTypes.bool,
    user: PropTypes.object,
    renderChatEmpty: PropTypes.func,
    renderFooter: PropTypes.func,
    renderMessage: PropTypes.func,
    renderLoadEarlier: PropTypes.func,
    onLoadEarlier: PropTypes.func,
    listViewProps: PropTypes.object,
    inverted: PropTypes.bool,
    loadEarlier: PropTypes.bool,
    invertibleScrollViewProps: PropTypes.object,
    extraData: PropTypes.object,
    scrollToBottom: PropTypes.bool,
    scrollToBottomOffset: PropTypes.number,
    scrollToBottomComponent: PropTypes.func,
    alignTop: PropTypes.bool,
    scrollToBottomStyle: StylePropType,
    infiniteScroll: PropTypes.bool,
  }

  constructor(props: MessageContainerProps<TMessage>) {
    super(props)

    this.state = {
      showScrollBottom: false,
      hasScrolled: false,
    }
  }

  renderTypingIndicator = () => {
    const { isTyping } = this.props

    if (Platform.OS === 'web') {
      return null
    }

    return <TypingIndicator isTyping={isTyping || false} />
  }

  renderFooter = () => {
    const { renderFooter } = this.props

    if (typeof renderFooter === 'function') {
      return renderFooter(this.props)
    }

    return this.renderTypingIndicator()
  }

  renderLoadEarlier = () => {
    const { loadEarlier, renderLoadEarlier } = this.props

    if (loadEarlier === true) {
      const loadEarlierProps = {
        ...this.props,
      }

      if (typeof renderLoadEarlier === 'function') {
        return renderLoadEarlier(loadEarlierProps)
      }

      return <LoadEarlier {...loadEarlierProps} />
    }

    return null
  }

  scrollToBottom = (animated = true) => {
    const { forwardRef, inverted } = this.props

    if (inverted) {
      this.scrollTo({ offset: 0, animated })
    } else if (forwardRef?.current) {
      forwardRef.current.scrollToEnd({ animated })
    }
  }

  handleOnScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {
      nativeEvent: {
        contentOffset: { y: contentOffsetY },
        contentSize: { height: contentSizeHeight },
        layoutMeasurement: { height: layoutMeasurementHeight },
      },
    } = event

    const { inverted, scrollToBottomOffset = DEFAULT_SCROLL_TO_BOTTOM_OFFSET } =
      this.props

    if (inverted) {
      if (contentOffsetY > scrollToBottomOffset) {
        this.setState({ showScrollBottom: true, hasScrolled: true })
      } else {
        this.setState({ showScrollBottom: false, hasScrolled: true })
      }
    } else if (
      contentOffsetY < scrollToBottomOffset &&
      contentSizeHeight - layoutMeasurementHeight > scrollToBottomOffset
    ) {
      this.setState({ showScrollBottom: true, hasScrolled: true })
    } else {
      this.setState({ showScrollBottom: false, hasScrolled: true })
    }
  }

  onLayoutList = () => {
    const { inverted, messages } = this.props

    if (!inverted && messages && messages?.length > 0) {
      setTimeout(
        () => this.scrollToBottom && this.scrollToBottom(false),
        15 * messages.length,
      )
    }
  }

  onEndReached = ({ distanceFromEnd }: { distanceFromEnd: number }) => {
    const { hasScrolled } = this.state
    const { loadEarlier, onLoadEarlier, infiniteScroll, isLoadingEarlier } =
      this.props

    if (
      infiniteScroll &&
      (hasScrolled || distanceFromEnd > 0) &&
      distanceFromEnd <= 100 &&
      loadEarlier &&
      onLoadEarlier &&
      !isLoadingEarlier &&
      Platform.OS !== 'web'
    ) {
      onLoadEarlier()
    }
  }

  scrollTo(options: { animated?: boolean; offset: number }) {
    const { forwardRef } = this.props

    if (forwardRef?.current && options) {
      forwardRef.current.scrollToOffset(options)
    }
  }

  renderRow = ({ item: _item, index }: ListRenderItemInfo<TMessage>) => {
    const item = _item

    if (!item._id && item._id !== 0) {
      warning('EasyChat: `_id` is missing for message', JSON.stringify(item))
    }

    if (!item.user) {
      if (!item.system) {
        warning('EasyChat: `user` is missing for message', JSON.stringify(item))
      }

      item.user = { _id: 0 }
    }

    const { messages, user, inverted, renderMessage, ...restProps } = this.props

    if (messages && user) {
      const previousMessage =
        (inverted ? messages[index + 1] : messages[index - 1]) || {}
      const nextMessage =
        (inverted ? messages[index - 1] : messages[index + 1]) || {}

      const messageProps: Message['props'] = {
        ...restProps,
        user,
        key: item._id,
        currentMessage: item,
        previousMessage,
        inverted,
        nextMessage,
        position: item.user._id === user._id ? 'right' : 'left',
      }

      if (typeof renderMessage === 'function') {
        return renderMessage(messageProps)
      }

      return <Message {...messageProps} />
    }

    return null
  }

  renderChatEmpty = () => {
    const { inverted, renderChatEmpty } = this.props

    if (typeof renderChatEmpty === 'function') {
      return inverted ? (
        renderChatEmpty()
      ) : (
        <View style={styles.emptyChatContainer}>{renderChatEmpty()}</View>
      )
    }

    return <View style={styles.container} />
  }

  renderHeaderWrapper = () => (
    <View style={styles.headerWrapper}>{this.renderLoadEarlier()}</View>
  )

  renderScrollBottomComponent() {
    const { scrollToBottomComponent } = this.props

    if (scrollToBottomComponent) {
      return scrollToBottomComponent()
    }

    return <Text>{SCROLL_DOWN_INDICADOR}</Text>
  }

  renderScrollToBottomWrapper() {
    const { scrollToBottomStyle } = this.props

    const propsStyle = scrollToBottomStyle || {}

    return (
      <View style={[styles.scrollToBottomStyle, propsStyle]}>
        <TouchableOpacity
          onPress={() => this.scrollToBottom()}
          hitSlop={{ top: 5, left: 5, right: 5, bottom: 5 }}
        >
          {this.renderScrollBottomComponent()}
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { showScrollBottom } = this.state
    const {
      alignTop,
      extraData,
      forwardRef,
      inverted,
      invertibleScrollViewProps,
      isTyping,
      listViewProps,
      messages,
      scrollToBottom,
    } = this.props

    return (
      <View style={alignTop ? styles.containerAlignTop : styles.container}>
        {showScrollBottom && scrollToBottom
          ? this.renderScrollToBottomWrapper()
          : null}
        <FlatList
          ref={forwardRef}
          extraData={[extraData, isTyping]}
          keyExtractor={keyExtractor}
          enableEmptySections
          automaticallyAdjustContentInsets={false}
          inverted={inverted}
          data={messages}
          style={styles.listStyle}
          contentContainerStyle={styles.contentContainerStyle}
          renderItem={this.renderRow}
          {...invertibleScrollViewProps}
          ListEmptyComponent={this.renderChatEmpty}
          ListFooterComponent={
            inverted ? this.renderHeaderWrapper : this.renderFooter
          }
          ListHeaderComponent={
            inverted ? this.renderFooter : this.renderHeaderWrapper
          }
          onScroll={this.handleOnScroll}
          scrollEventThrottle={100}
          onLayout={this.onLayoutList}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.1}
          {...listViewProps}
        />
      </View>
    )
  }
}

export default MessageContainer
