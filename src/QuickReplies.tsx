import { Component } from 'react'
import type { ReactNode } from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { IMessage, Reply } from './Models'
import Color from './Color'
import { StylePropType } from './utils/utils'
import { warning } from './utils/logging'

export interface QuickRepliesProps {
  nextMessage?: IMessage
  currentMessage?: IMessage
  color?: string
  sendText?: string
  quickReplyStyle?: StyleProp<ViewStyle>
  quickReplyTextStyle?: StyleProp<TextStyle>
  onQuickReply?(reply: Reply[]): void
  renderQuickReplySend?(): ReactNode
}

export interface QuickRepliesState {
  replies: Reply[]
}

const sameReply = (currentReply: Reply) => (reply: Reply) =>
  currentReply.value === reply.value

const diffReply = (currentReply: Reply) => (reply: Reply) =>
  currentReply.value !== reply.value

class QuickReplies extends Component<QuickRepliesProps, QuickRepliesState> {
  static defaultProps = {
    nextMessage: undefined,
    onQuickReply: () => null,
    color: Color.peterRiver,
    sendText: 'Send',
    renderQuickReplySend: undefined,
    quickReplyStyle: undefined,
    quickReplyTextStyle: undefined,
  }

  static propTypes = {
    currentMessage: PropTypes.object.isRequired,
    onQuickReply: PropTypes.func,
    color: PropTypes.string,
    sendText: PropTypes.string,
    renderQuickReplySend: PropTypes.func,
    quickReplyStyle: StylePropType,
    quickReplyTextStyle: StylePropType,
  }

  constructor(props: QuickRepliesProps) {
    super(props)
    this.state = {
      replies: [],
    }
  }

  handlePress = (reply: Reply) => () => {
    const { currentMessage } = this.props
    const { replies } = this.state

    if (currentMessage?.quickReplies) {
      const { type } = currentMessage.quickReplies

      switch (type) {
        case 'radio': {
          this.handleSend([reply])()
          return
        }

        case 'checkbox': {
          if (replies.find(sameReply(reply))) {
            this.setState({
              replies: replies.filter(diffReply(reply)),
            })
          } else {
            this.setState({ replies: [...replies, reply] })
          }
          return
        }

        default: {
          warning(`onQuickReply unknown type: ${type}`)
        }
      }
    }
  }

  handleSend = (replies: Reply[]) => () => {
    const { currentMessage, onQuickReply } = this.props

    if (currentMessage && onQuickReply) {
      onQuickReply(
        replies.map((reply: Reply) => ({
          ...reply,
          messageId: currentMessage._id,
        })),
      )
    }
  }

  shouldComponentDisplay = () => {
    const { currentMessage, nextMessage } = this.props

    const hasReplies = !!currentMessage?.quickReplies
    const hasNext = !!nextMessage?._id
    const { keepIt } = currentMessage?.quickReplies || {}

    if (hasReplies && !hasNext) {
      return true
    }

    if (hasReplies && hasNext && keepIt) {
      return true
    }

    return false
  }

  renderQuickReplySend = () => {
    const { replies } = this.state
    const { sendText, renderQuickReplySend: customSend } = this.props

    return (
      <TouchableOpacity
        style={[styles.quickReply, styles.sendLink]}
        onPress={this.handleSend(replies)}
      >
        {customSend ? (
          customSend()
        ) : (
          <Text style={styles.sendLinkText}>{sendText}</Text>
        )}
      </TouchableOpacity>
    )
  }

  render() {
    const { currentMessage, color, quickReplyStyle, quickReplyTextStyle } =
      this.props
    const { replies } = this.state

    if (!this.shouldComponentDisplay()) {
      return null
    }

    const { type } = currentMessage?.quickReplies || {}

    return (
      <View style={styles.container}>
        {currentMessage?.quickReplies?.values.map(
          (reply: Reply, index: number) => {
            const selected =
              type === 'checkbox' && replies.find(sameReply(reply))

            return (
              <TouchableOpacity
                onPress={this.handlePress(reply)}
                style={[
                  styles.quickReply,
                  quickReplyStyle,
                  quickReplyTextStyle,
                  { borderColor: color },
                  selected && { backgroundColor: color },
                ]}
                // eslint-disable-next-line react/no-array-index-key
                key={`${reply.value}-${index}`}
              >
                <Text
                  numberOfLines={10}
                  ellipsizeMode="tail"
                  style={[
                    styles.quickReplyText,
                    { color: selected ? Color.white : color },
                  ]}
                >
                  {reply.title}
                </Text>
              </TouchableOpacity>
            )
          },
        )}
        {replies.length > 0 && this.renderQuickReplySend()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: 300,
  },
  quickReply: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    maxWidth: 200,
    paddingVertical: 7,
    paddingHorizontal: 12,
    minHeight: 50,
    borderRadius: 13,
    margin: 3,
  },
  quickReplyText: {
    overflow: 'visible',
  },
  sendLink: {
    borderWidth: 0,
  },
  sendLinkText: {
    color: Color.defaultBlue,
    fontWeight: '600',
    fontSize: 17,
  },
})

export default QuickReplies
