import { Component, createRef, RefObject } from 'react'
import type { ReactNode } from 'react'
import PropTypes from 'prop-types'
import {
  Animated,
  Platform,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  SafeAreaView,
  FlatList,
  TextStyle,
  KeyboardAvoidingView,
} from 'react-native'
import type { LayoutChangeEvent, KeyboardEvent } from 'react-native'
import {
  ActionSheetProvider,
  ActionSheetOptions,
} from '@expo/react-native-action-sheet'
import uuid from 'uuid'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import type { ParseShape } from 'react-native-parsed-text'
import type { LightboxProps } from 'react-native-lightbox-v2'

import * as utils from './utils/utils'
import Actions from './Actions'
import type { ActionsProps } from './Actions'
import Avatar from './Avatar'
import type { AvatarProps } from './Avatar'
import Bubble from './Bubble'
import SystemMessage from './SystemMessage'
import type { SystemMessageProps } from './SystemMessage'
import MessageImage from './MessageImage'
import type { MessageImageProps } from './MessageImage'
import MessageText from './MessageText'
import type { MessageTextProps } from './MessageText'
import Composer from './Composer'
import type { ComposerProps } from './Composer'
import Day from './Day'
import type { DayProps } from './Day'
import InputToolbar from './InputToolbar'
import type { InputToolbarProps } from './InputToolbar'
import LoadEarlier from './LoadEarlier'
import type { LoadEarlierProps } from './LoadEarlier'
import Message from './Message'
import MessageContainer from './MessageContainer'
import Send from './Send'
import type { SendProps } from './Send'
import Time from './Time'
import type { TimeProps } from './Time'
import type { QuickRepliesProps } from './QuickReplies'
import EasyAvatar from './EasyAvatar'
import { EasyChatContext } from './EasyChatContext'

import {
  DATE_FORMAT,
  DEFAULT_INPUT_TOOLBAR_HEIGHT,
  DEFAULT_PLACEHOLDER,
  MAX_COMPOSER_HEIGHT,
  MIN_COMPOSER_HEIGHT,
  TIME_FORMAT,
} from './Constant'
import type {
  IMessage,
  User,
  Reply,
  LeftRightStyle,
  MessageVideoProps,
  MessageAudioProps,
} from './Models'

dayjs.extend(localizedFormat)

const safeAreaSupport = (bottomOffset?: number) => {
  return bottomOffset != null ? bottomOffset : 1
}

export interface EasyChatProps<TMessage extends IMessage = IMessage> {
  /* Messages to display */
  messages?: TMessage[]
  /* Typing Indicator state */
  isTyping?: boolean
  /* Messages container style */
  messagesContainerStyle?: StyleProp<ViewStyle>
  /* Input text; default is undefined, but if specified, it will override EasyChat's internal state */
  text?: string
  /* Controls whether or not the message bubbles appear at the top of the chat */
  alignTop?: boolean
  /* Determine whether is wrapped in a SafeAreaView */
  wrapInSafeArea?: boolean
  /* enables the scrollToBottom Component */
  scrollToBottom?: boolean
  /* Scroll to bottom wrapper style */
  scrollToBottomStyle?: StyleProp<ViewStyle>
  initialText?: string
  /* Placeholder when text is empty; default is 'Type a message...' */
  placeholder?: string
  /* Makes the composer not editable */
  disableComposer?: boolean
  /* User sending the messages: { _id, name, avatar } */
  user?: User
  /*  Locale to localize the dates */
  locale?: string
  /* Format to use for rendering times; default is 'LT' */
  timeFormat?: string
  /* Format to use for rendering dates; default is 'll' */
  dateFormat?: string
  /* Enables the "Load earlier messages" button */
  loadEarlier?: boolean
  /* Display an ActivityIndicator when loading earlier messages */
  isLoadingEarlier?: boolean
  /* Whether to render an avatar for the current user; default is false, only show avatars for other users */
  showUserAvatar?: boolean
  /* When false, avatars will only be displayed when a consecutive message is from the same user on the same day; default is false */
  showAvatarForEveryMessage?: boolean
  /* Render the message avatar at the top of consecutive messages, rather than the bottom; default is false */
  isKeyboardInternallyHandled?: boolean
  /* Determine whether to handle keyboard awareness inside the plugin. If you have your own keyboard handling outside the plugin set this to false; default is true */
  renderAvatarOnTop?: boolean
  inverted?: boolean
  /* Extra props to be passed to the <Image> component created by the default renderMessageImage */
  imageProps?: Message<TMessage>['props']
  /* Extra props to be passed to the MessageImage's Lightbox */
  lightboxProps?: LightboxProps
  /* Distance of the chat from the bottom of the screen (e.g. useful if you display a tab bar) */
  bottomOffset?: number
  /* Minimum height of the input toolbar; default is 44 */
  minInputToolbarHeight?: number
  /* Extra props to be passed to the messages <ListView>; some props can't be overridden, see the code in MessageContainer.render() for details */
  listViewProps?: any
  /*  Extra props to be passed to the <TextInput> */
  textInputProps?: any
  /* Determines whether the keyboard should stay visible after a tap; see <ScrollView> docs */
  keyboardShouldPersistTaps?: any
  /* Max message composer TextInput length */
  maxInputLength?: number
  /* Force getting keyboard height to fix some display issues */
  forceGetKeyboardHeight?: boolean
  /* Force send button */
  alwaysShowSend?: boolean
  /* Image style */
  imageStyle?: StyleProp<ViewStyle>
  /* This can be used to pass any data which needs to be re-rendered */
  extraData?: any
  /* composer min Height */
  minComposerHeight?: number
  /* composer min Height */
  maxComposerHeight?: number
  options?: Record<string, any>
  optionTintColor?: string
  quickReplyStyle?: StyleProp<ViewStyle>
  quickReplyTextStyle?: StyleProp<TextStyle>
  /* optional prop used to place customView below text, image and video views; default is false */
  isCustomViewBottom?: boolean
  /* infinite scroll up when reach the top of messages container, automatically call onLoadEarlier function if exist */
  infiniteScroll?: boolean
  timeTextStyle?: LeftRightStyle<TextStyle>
  /* Custom action sheet */
  actionSheet?(): {
    showActionSheetWithOptions: (
      options: ActionSheetOptions,
      callback: (i: number) => void,
    ) => void
  }
  /* Callback when a message avatar is tapped */
  onPressAvatar?(user: User): void
  /* Callback when a message avatar is tapped */
  onLongPressAvatar?(user: User): void
  /* Generate an id for new messages. Defaults to UUID v4, generated by uuid */
  messageIdGenerator?(message?: TMessage): string
  /* Callback when sending a message */
  onSend?(messages: TMessage[]): void
  /* Callback when loading earlier messages */
  onLoadEarlier?(): void
  /*  Render a loading view when initializing */
  renderLoading?(): ReactNode
  /* Custom "Load earlier messages" button */
  renderLoadEarlier?(props: LoadEarlierProps): ReactNode
  /* Custom message avatar; set to null to not render any avatar for the message */
  renderAvatar?(props: AvatarProps<TMessage>): ReactNode | null
  /* Custom message bubble */
  renderBubble?(props: Bubble<TMessage>['props']): ReactNode
  /* Custom system message */
  renderSystemMessage?(props: SystemMessageProps<TMessage>): ReactNode
  /* Callback when a message bubble is long-pressed; default is to show an ActionSheet with "Copy Text" (see example using showActionSheetWithOptions()) */
  onLongPress?(context: any, message: any): void
  /* Reverses display order of messages; default is true */
  /* Custom message container */
  renderMessage?(message: Message<TMessage>['props']): ReactNode
  /* Custom message text */
  renderMessageText?(messageText: MessageTextProps<TMessage>): ReactNode
  /* Custom message image */
  renderMessageImage?(props: MessageImageProps<TMessage>): ReactNode
  /* Custom message video */
  renderMessageVideo?(props: MessageVideoProps<TMessage>): ReactNode
  /* Custom message video */
  renderMessageAudio?(props: MessageAudioProps<TMessage>): ReactNode
  /* Custom view inside the bubble */
  renderCustomView?(props: Bubble<TMessage>['props']): ReactNode
  /* Custom day above a message */
  renderDay?(props: DayProps<TMessage>): ReactNode
  /* Custom time inside a message */
  renderTime?(props: TimeProps<TMessage>): ReactNode
  /* Custom footer component on the ListView, e.g. 'User is typing...' */
  renderFooter?(): ReactNode
  /* Custom component to render in the ListView when messages are empty */
  renderChatEmpty?(): ReactNode
  /* Custom component to render below the MessageContainer (separate from the ListView) */
  renderChatFooter?(): ReactNode
  /* Custom message composer container */
  renderInputToolbar?(props: InputToolbarProps<TMessage>): ReactNode
  /*  Custom text input message composer */
  renderComposer?(props: ComposerProps): ReactNode
  /* Custom action button on the left of the message composer */
  renderActions?(props: ActionsProps): ReactNode
  /* Custom send button; you can pass children to the original Send component quite easily, for example to use a custom icon (example) */
  renderSend?(props: SendProps<TMessage>): ReactNode
  /* Custom second line of actions below the message composer */
  renderAccessory?(props: InputToolbarProps<TMessage>): ReactNode
  /* Callback when the Action button is pressed (if set, the default actionSheet will not be used) */
  onPressActionButton?(): void
  /* Callback when the input text changes */
  onInputTextChanged?(text: string): void
  /* Custom parse patterns for react-native-parsed-text used to linking message content (like URLs and phone numbers) */
  parsePatterns?(linkStyle: TextStyle): ParseShape[]
  onQuickReply?(replies: Reply[]): void
  renderQuickReplies?(quickReplies: QuickRepliesProps): ReactNode
  renderQuickReplySend?(): ReactNode
  /* Scroll to bottom custom component */
  scrollToBottomComponent?(): ReactNode
  shouldUpdateMessage?(
    props: Message<TMessage>['props'],
    nextProps: Message<TMessage>['props'],
  ): boolean
}

export interface EasyChatState<TMessage extends IMessage = IMessage> {
  isInitialized: boolean
  composerHeight?: number
  messagesContainerHeight?: number | Animated.Value
  typingDisabled: boolean
  text?: string
  messages?: TMessage[]
}

class EasyChat<TMessage extends IMessage = IMessage> extends Component<
  EasyChatProps<TMessage>,
  EasyChatState
> {
  static childContextTypes = {
    actionSheet: PropTypes.func,
    getLocale: PropTypes.func,
  }

  static contextType = SafeAreaInsetsContext

  static defaultProps = {
    actionSheet: null,
    alignTop: false,
    alwaysShowSend: false,
    audioProps: {},
    bottomOffset: null,
    dateFormat: DATE_FORMAT,
    disableComposer: false,
    extraData: null,
    forceGetKeyboardHeight: false,
    imageProps: {},
    imageStyle: undefined,
    infiniteScroll: false,
    initialText: undefined,
    inverted: true,
    isCustomViewBottom: false,
    isKeyboardInternallyHandled: true,
    isLoadingEarlier: false,
    isTyping: false,
    keyboardShouldPersistTaps: Platform.select({
      ios: 'never',
      android: 'always',
      default: 'never',
    }),
    lightboxProps: {},
    listViewProps: {},
    loadEarlier: false,
    locale: null,
    maxComposerHeight: MAX_COMPOSER_HEIGHT,
    maxInputLength: null,
    messageIdGenerator: () => uuid.v4(),
    messages: [],
    messagesContainerStyle: undefined,
    minComposerHeight: MIN_COMPOSER_HEIGHT,
    minInputToolbarHeight: DEFAULT_INPUT_TOOLBAR_HEIGHT,
    onInputTextChanged: null,
    onLoadEarlier: () => null,
    onLongPress: null,
    onLongPressAvatar: null,
    onPressActionButton: null,
    onPressAvatar: null,
    onQuickReply: undefined,
    onSend: () => null,
    options: undefined,
    optionTintColor: undefined,
    parsePatterns: undefined,
    placeholder: DEFAULT_PLACEHOLDER,
    quickReplyStyle: undefined,
    quickReplyTextStyle: undefined,
    renderAccessory: null,
    renderActions: null,
    renderAvatar: undefined,
    renderAvatarOnTop: false,
    renderBubble: null,
    renderChatEmpty: null,
    renderChatFooter: null,
    renderComposer: null,
    renderCustomView: null,
    renderDay: null,
    renderFooter: null,
    renderInputToolbar: null,
    renderLoadEarlier: null,
    renderLoading: null,
    renderMessage: null,
    renderMessageAudio: null,
    renderMessageImage: null,
    renderMessageText: null,
    renderMessageVideo: null,
    renderQuickReplies: undefined,
    renderQuickReplySend: undefined,
    renderSend: null,
    renderSystemMessage: null,
    renderTime: null,
    renderUsernameOnMessage: false,
    scrollToBottom: false,
    scrollToBottomComponent: undefined,
    scrollToBottomStyle: undefined,
    shouldUpdateMessage: undefined,
    showAvatarForEveryMessage: false,
    showUserAvatar: false,
    text: undefined,
    textInputProps: {},
    timeFormat: TIME_FORMAT,
    timeTextStyle: undefined,
    user: {},
    videoProps: {},
    wrapInSafeArea: true,
  }

  static propTypes = {
    actionSheet: PropTypes.func,
    alignTop: PropTypes.bool,
    audioProps: PropTypes.object,
    bottomOffset: PropTypes.number,
    dateFormat: PropTypes.string,
    disableComposer: PropTypes.bool,
    extraData: PropTypes.object,
    forceGetKeyboardHeight: PropTypes.bool,
    imageProps: PropTypes.object,
    initialText: PropTypes.string,
    inverted: PropTypes.bool,
    isCustomViewBottom: PropTypes.bool,
    isKeyboardInternallyHandled: PropTypes.bool,
    isLoadingEarlier: PropTypes.bool,
    keyboardShouldPersistTaps: PropTypes.oneOf(['always', 'never', 'handled']),
    lightboxProps: PropTypes.object,
    listViewProps: PropTypes.object,
    loadEarlier: PropTypes.bool,
    locale: PropTypes.string,
    maxComposerHeight: PropTypes.number,
    maxInputLength: PropTypes.number,
    messageIdGenerator: PropTypes.func,
    messages: PropTypes.arrayOf(PropTypes.object),
    messagesContainerStyle: utils.StylePropType,
    minComposerHeight: PropTypes.number,
    minInputToolbarHeight: PropTypes.number,
    onInputTextChanged: PropTypes.func,
    onLoadEarlier: PropTypes.func,
    onLongPress: PropTypes.func,
    onLongPressAvatar: PropTypes.func,
    onPressActionButton: PropTypes.func,
    onPressAvatar: PropTypes.func,
    onSend: PropTypes.func,
    placeholder: PropTypes.string,
    renderAccessory: PropTypes.func,
    renderActions: PropTypes.func,
    renderAvatar: PropTypes.func,
    renderAvatarOnTop: PropTypes.bool,
    renderBubble: PropTypes.func,
    renderChatEmpty: PropTypes.func,
    renderChatFooter: PropTypes.func,
    renderComposer: PropTypes.func,
    renderCustomView: PropTypes.func,
    renderDay: PropTypes.func,
    renderFooter: PropTypes.func,
    renderInputToolbar: PropTypes.func,
    renderLoadEarlier: PropTypes.func,
    renderLoading: PropTypes.func,
    renderMessage: PropTypes.func,
    renderMessageImage: PropTypes.func,
    renderMessageText: PropTypes.func,
    renderSend: PropTypes.func,
    renderSystemMessage: PropTypes.func,
    renderTime: PropTypes.func,
    renderUsernameOnMessage: PropTypes.bool,
    showUserAvatar: PropTypes.bool,
    text: PropTypes.string,
    textInputProps: PropTypes.object,
    timeFormat: PropTypes.string,
    user: PropTypes.object,
    videoProps: PropTypes.object,
    wrapInSafeArea: PropTypes.bool,
  }

  static append<TTMessage extends IMessage>(
    currentMessages: TTMessage[],
    messages: TTMessage[],
    inverted = true,
  ) {
    const existingMessages = currentMessages || []
    let parsedMessages = messages

    if (!Array.isArray(parsedMessages)) {
      parsedMessages = [parsedMessages]
    }

    return inverted
      ? parsedMessages.concat(existingMessages)
      : existingMessages.concat(parsedMessages)
  }

  static prepend<TTMessage extends IMessage>(
    currentMessages: TTMessage[],
    messages: TTMessage[],
    inverted = true,
  ) {
    const existingMessages = currentMessages || []
    let parsedMessages = messages

    if (!Array.isArray(parsedMessages)) {
      parsedMessages = [parsedMessages]
    }

    return inverted
      ? existingMessages.concat(parsedMessages)
      : parsedMessages.concat(existingMessages)
  }

  _isMounted = false

  _keyboardHeight = 0

  _bottomOffset = 0

  _maxHeight?: number = undefined

  _isFirstLayout = true

  _locale = 'en'

  invertibleScrollViewProps: any = undefined

  _actionSheetRef: any = undefined

  _messageContainerRef?: RefObject<FlatList<IMessage>> = createRef()

  _isTextInputWasFocused = false

  textInput?: any

  constructor(props: EasyChatProps<TMessage>) {
    super(props)

    this.state = {
      isInitialized: false, // initialization will calculate maxHeight before rendering the chat
      composerHeight: props.minComposerHeight,
      messagesContainerHeight: undefined,
      typingDisabled: false,
      text: undefined,
      messages: undefined,
    }

    this.invertibleScrollViewProps = {
      inverted: props.inverted,
      keyboardShouldPersistTaps: props.keyboardShouldPersistTaps,
      onKeyboardWillShow: this.onKeyboardWillShow,
      onKeyboardWillHide: this.onKeyboardWillHide,
      onKeyboardDidShow: this.onKeyboardDidShow,
      onKeyboardDidHide: this.onKeyboardDidHide,
    }
  }

  getChildContext() {
    const { actionSheet } = this.props

    return {
      actionSheet: actionSheet || (() => this._actionSheetRef.getContext()),
      getLocale: this.getLocale,
    }
  }

  componentDidMount() {
    const { messages, text } = this.props
    this.setIsMounted(true)
    this.initLocale()
    this.setMessages(messages || [])
    this.setTextFromProp(text)
  }

  componentDidUpdate(prevProps: EasyChatProps<TMessage> = {}) {
    const { messages, text, inverted } = this.props

    if (this.props !== prevProps) {
      this.setMessages(messages || [])
    }

    if (
      inverted === false &&
      messages &&
      prevProps.messages &&
      messages.length !== prevProps.messages.length
    ) {
      setTimeout(() => this.scrollToBottom(false), 200)
    }

    if (text !== prevProps.text) {
      this.setTextFromProp(text)
    }
  }

  componentWillUnmount() {
    this.setIsMounted(false)
  }

  /**
   * Store text input focus status when keyboard hide to retrieve
   * it after wards if needed.
   * `onKeyboardWillHide` may be called twice in sequence so we
   * make a guard condition (eg. showing image picker)
   */
  handleTextInputFocusWhenKeyboardHide() {
    if (!this._isTextInputWasFocused) {
      this._isTextInputWasFocused = this.textInput?.isFocused() || false
    }
  }

  /**
   * Refocus the text input only if it was focused before showing keyboard.
   * This is needed in some cases (eg. showing image picker).
   */
  handleTextInputFocusWhenKeyboardShow() {
    if (
      this.textInput &&
      this._isTextInputWasFocused &&
      !this.textInput.isFocused()
    ) {
      this.textInput.focus()
    }

    // Reset the indicator since the keyboard is shown
    this._isTextInputWasFocused = false
  }

  setLocale(locale: string) {
    this._locale = locale
  }

  getLocale = () => this._locale

  setTextFromProp(textProp?: string) {
    const { text } = this.state

    // Text prop takes precedence over state.
    if (textProp !== undefined && textProp !== text) {
      this.setState({ text: textProp })
    }
  }

  getTextFromProp(fallback: string) {
    const { text } = this.props

    if (text === undefined) {
      return fallback
    }

    return text
  }

  setMessages(messages: TMessage[]) {
    this.setState({ messages })
  }

  getMessages() {
    const { messages } = this.state

    return messages as TMessage[]
  }

  setMaxHeight(height: number) {
    this._maxHeight = height
  }

  getMaxHeight() {
    return this._maxHeight || 0
  }

  setKeyboardHeight(height: number) {
    this._keyboardHeight = height
  }

  getKeyboardHeight() {
    const { forceGetKeyboardHeight } = this.props

    if (Platform.OS === 'android' && !forceGetKeyboardHeight) {
      // For android: on-screen keyboard resized main container and has own height.
      // @see https://developer.android.com/training/keyboard-input/visibility.html
      // So for calculate the messages container height ignore keyboard height.
      return 0
    }

    return this._keyboardHeight
  }

  setBottomOffset(value: number) {
    this._bottomOffset = value
  }

  getBottomOffset() {
    return this._bottomOffset
  }

  setIsFirstLayout(value: boolean) {
    this._isFirstLayout = value
  }

  getIsFirstLayout() {
    return this._isFirstLayout
  }

  setIsTypingDisabled(value: boolean) {
    this.setState({
      typingDisabled: value,
    })
  }

  getIsTypingDisabled() {
    const { typingDisabled } = this.state

    return typingDisabled
  }

  setIsMounted(value: boolean) {
    this._isMounted = value
  }

  getIsMounted() {
    return this._isMounted
  }

  getMinInputToolbarHeight() {
    const {
      renderAccessory,
      minInputToolbarHeight = DEFAULT_INPUT_TOOLBAR_HEIGHT,
    } = this.props

    return renderAccessory ? minInputToolbarHeight * 2 : minInputToolbarHeight
  }

  /**
   * Returns the height, based on current window size, without taking the keyboard into account.
   */
  getBasicMessagesContainerHeight(argComposerHeight?: number) {
    const { composerHeight: stateComposerHeight } = this.state

    const composerHeight = argComposerHeight || stateComposerHeight || 0

    return (
      this.getMaxHeight() - this.calculateInputToolbarHeight(composerHeight)
    )
  }

  /**
   * Returns the height, based on current window size, taking the keyboard into account.
   */
  getMessagesContainerHeightWithKeyboard(argComposerHeight?: number) {
    const { composerHeight: stateComposerHeight } = this.state

    const composerHeight = argComposerHeight || stateComposerHeight || 0

    return (
      this.getBasicMessagesContainerHeight(composerHeight) -
      this.getKeyboardHeight() +
      this.getBottomOffset()
    )
  }

  onKeyboardWillShow = (e: KeyboardEvent) => {
    const { bottomOffset, isKeyboardInternallyHandled } = this.props

    this.handleTextInputFocusWhenKeyboardShow()

    if (isKeyboardInternallyHandled) {
      this.setIsTypingDisabled(true)
      this.setKeyboardHeight(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        e.endCoordinates ? e.endCoordinates.height : e.end.height,
      )
      this.setBottomOffset(safeAreaSupport(bottomOffset))
      const newMessagesContainerHeight =
        this.getMessagesContainerHeightWithKeyboard()

      this.setState({
        messagesContainerHeight: newMessagesContainerHeight,
      })
    }
  }

  onKeyboardWillHide = (_e: KeyboardEvent) => {
    const { isKeyboardInternallyHandled } = this.props

    this.handleTextInputFocusWhenKeyboardHide()

    if (isKeyboardInternallyHandled) {
      this.setIsTypingDisabled(true)
      this.setKeyboardHeight(0)
      this.setBottomOffset(0)
      const newMessagesContainerHeight = this.getBasicMessagesContainerHeight()

      this.setState({
        messagesContainerHeight: newMessagesContainerHeight,
      })
    }
  }

  onKeyboardDidShow = (e: KeyboardEvent) => {
    if (Platform.OS === 'android') {
      this.onKeyboardWillShow(e)
    }
    this.setIsTypingDisabled(false)
  }

  onKeyboardDidHide = (e: KeyboardEvent) => {
    if (Platform.OS === 'android') {
      this.onKeyboardWillHide(e)
    }
    this.setIsTypingDisabled(false)
  }

  onSend = (messages: TMessage[] = [], shouldResetInputToolbar = false) => {
    const { messageIdGenerator, onSend, user } = this.props

    let validatedMessages = messages

    if (!Array.isArray(validatedMessages)) {
      validatedMessages = [validatedMessages]
    }

    const newMessages: TMessage[] = validatedMessages.map((message) => {
      return {
        ...message,
        user,
        createdAt: new Date(),
        _id: messageIdGenerator?.(),
      }
    })

    if (shouldResetInputToolbar === true) {
      this.setIsTypingDisabled(true)
      this.resetInputToolbar()
    }

    if (typeof onSend === 'function') {
      onSend(newMessages)
    }

    if (shouldResetInputToolbar === true) {
      setTimeout(() => {
        if (this.getIsMounted() === true) {
          this.setIsTypingDisabled(false)
        }
      }, 100)
    }
  }

  onInputSizeChanged = (size: { height: number }) => {
    const {
      minComposerHeight = MIN_COMPOSER_HEIGHT,
      maxComposerHeight = MAX_COMPOSER_HEIGHT,
    } = this.props

    const newComposerHeight = Math.max(
      minComposerHeight,
      Math.min(maxComposerHeight, size.height),
    )
    const newMessagesContainerHeight =
      this.getMessagesContainerHeightWithKeyboard(newComposerHeight)

    this.setState({
      composerHeight: newComposerHeight,
      messagesContainerHeight: newMessagesContainerHeight,
    })
  }

  onInputTextChanged = (text: string) => {
    const { onInputTextChanged, text: propText } = this.props

    if (this.getIsTypingDisabled()) {
      return
    }

    if (typeof onInputTextChanged === 'function') {
      onInputTextChanged(text)
    }

    // Only set state if it's not being overridden by a prop.
    if (propText === undefined) {
      this.setState({ text })
    }
  }

  onInitialLayoutViewLayout = (e: LayoutChangeEvent) => {
    const { layout } = e.nativeEvent

    const { minComposerHeight, initialText: propInitialText } = this.props

    if (layout.height <= 0) {
      return
    }

    this.notifyInputTextReset()
    this.setMaxHeight(layout.height)
    const newComposerHeight = minComposerHeight
    const newMessagesContainerHeight =
      this.getMessagesContainerHeightWithKeyboard(newComposerHeight)
    const initialText = propInitialText || ''

    this.setState({
      isInitialized: true,
      text: this.getTextFromProp(initialText),
      composerHeight: newComposerHeight,
      messagesContainerHeight: newMessagesContainerHeight,
    })
  }

  onMainViewLayout = (e: LayoutChangeEvent) => {
    // Fix an issue when keyboard is dismissing during the initialization
    const { layout } = e.nativeEvent

    if (
      this.getMaxHeight() !== layout.height ||
      this.getIsFirstLayout() === true
    ) {
      this.setMaxHeight(layout.height)
      this.setState({
        messagesContainerHeight:
          this._keyboardHeight > 0
            ? this.getMessagesContainerHeightWithKeyboard()
            : this.getBasicMessagesContainerHeight(),
      })
    }

    if (this.getIsFirstLayout() === true) {
      this.setIsFirstLayout(false)
    }
  }

  initLocale() {
    const { locale } = this.props

    if (locale === null) {
      this.setLocale('en')
    } else {
      this.setLocale(locale || 'en')
    }
  }

  // eslint-disable-next-line react/no-unused-class-component-methods
  focusTextInput() {
    this.textInput?.focus()
  }

  calculateInputToolbarHeight(composerHeight: number) {
    const { minComposerHeight = MIN_COMPOSER_HEIGHT } = this.props

    return (
      composerHeight + (this.getMinInputToolbarHeight() - minComposerHeight)
    )
  }

  notifyInputTextReset() {
    const { onInputTextChanged } = this.props

    if (typeof onInputTextChanged === 'function') {
      onInputTextChanged('')
    }
  }

  scrollToBottom(animated = true) {
    if (this._messageContainerRef?.current) {
      const { inverted } = this.props

      if (!inverted) {
        this._messageContainerRef.current.scrollToEnd({ animated })
      } else {
        this._messageContainerRef.current.scrollToOffset({
          offset: 0,
          animated,
        })
      }
    }
  }

  resetInputToolbar() {
    const { minComposerHeight } = this.props

    if (this.textInput) {
      this.textInput.clear()
    }

    this.notifyInputTextReset()

    const newComposerHeight = minComposerHeight
    const newMessagesContainerHeight =
      this.getMessagesContainerHeightWithKeyboard(newComposerHeight)

    this.setState({
      text: this.getTextFromProp(''),
      composerHeight: newComposerHeight,
      messagesContainerHeight: newMessagesContainerHeight,
    })
  }

  renderMessages() {
    const { messagesContainerHeight } = this.state
    const {
      isKeyboardInternallyHandled,
      isTyping,
      messagesContainerStyle,
      ...messagesContainerProps
    } = this.props
    const viewStyle = [
      {
        height: messagesContainerHeight,
      },
      messagesContainerStyle,
    ] as ViewStyle

    const fragment = (
      <View style={viewStyle}>
        <MessageContainer<TMessage>
          {...messagesContainerProps}
          invertibleScrollViewProps={this.invertibleScrollViewProps}
          messages={this.getMessages()}
          forwardRef={this._messageContainerRef}
          isTyping={isTyping}
        />
        {this.renderChatFooter()}
      </View>
    )

    return isKeyboardInternallyHandled ? (
      <KeyboardAvoidingView enabled>{fragment}</KeyboardAvoidingView>
    ) : (
      fragment
    )
  }

  renderInputToolbar() {
    const { composerHeight = 0, text = '' } = this.state
    const {
      maxInputLength,
      minComposerHeight = MIN_COMPOSER_HEIGHT,
      renderInputToolbar,
      textInputProps,
    } = this.props

    const inputToolbarProps = {
      ...this.props,
      text: this.getTextFromProp(text),
      composerHeight: Math.max(minComposerHeight, composerHeight),
      onSend: this.onSend,
      onInputSizeChanged: this.onInputSizeChanged,
      onTextChanged: this.onInputTextChanged,
      textInputProps: {
        ...textInputProps,
        ref: (textInput: any) => (this.textInput = textInput),
        maxLength: this.getIsTypingDisabled() ? 0 : maxInputLength,
      },
    }

    if (typeof renderInputToolbar === 'function') {
      return renderInputToolbar(inputToolbarProps)
    }

    return <InputToolbar {...inputToolbarProps} />
  }

  renderChatFooter() {
    const { renderChatFooter } = this.props

    if (typeof renderChatFooter === 'function') {
      return renderChatFooter()
    }

    return null
  }

  renderLoading() {
    const { renderLoading } = this.props

    if (typeof renderLoading === 'function') {
      return renderLoading()
    }

    return null
  }

  render() {
    const { isInitialized } = this.state

    if (isInitialized === true) {
      const { wrapInSafeArea } = this.props
      const Wrapper = wrapInSafeArea ? SafeAreaView : View
      const actionSheet =
        this.props.actionSheet ||
        (() => this._actionSheetRef.current?.getContext()!)
      const { getLocale } = this

      return (
        <EasyChatContext.Provider
          value={{
            actionSheet,
            getLocale,
          }}
        >
          <Wrapper style={styles.safeArea}>
            <ActionSheetProvider ref={this._actionSheetRef}>
              <View style={styles.container} onLayout={this.onMainViewLayout}>
                {this.renderMessages()}
                {this.renderInputToolbar()}
              </View>
            </ActionSheetProvider>
          </Wrapper>
        </EasyChatContext.Provider>
      )
    }
    return (
      <View style={styles.container} onLayout={this.onInitialLayoutViewLayout}>
        {this.renderLoading()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
})

export * from './Models'

export {
  EasyChat,
  Actions,
  Avatar,
  Bubble,
  SystemMessage,
  MessageImage,
  MessageText,
  Composer,
  Day,
  InputToolbar,
  LoadEarlier,
  Message,
  MessageContainer,
  Send,
  Time,
  EasyAvatar,
  utils,
}
