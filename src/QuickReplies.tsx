import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { useCallbackOne } from 'use-memo-one'
import { IMessage, Reply } from './Models'
import Color from './Color'
import { warning } from './utils/logging'

export interface QuickRepliesProps {
  nextMessage?: IMessage
  currentMessage: IMessage
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

const QuickReplies = ({
  currentMessage,
  nextMessage,
  color = Color.peterRiver,
  quickReplyStyle,
  quickReplyTextStyle,
  onQuickReply,
  sendText = 'Send',
  renderQuickReplySend,
}: QuickRepliesProps) => {
  const { type } = currentMessage!.quickReplies!
  const [replies, setReplies] = useState<Reply[]>([])

  const shouldComponentDisplay = useMemo(() => {
    const hasReplies = !!currentMessage && !!currentMessage!.quickReplies
    const hasNext = !!nextMessage && !!nextMessage!._id
    const { keepIt } = currentMessage!.quickReplies!

    if (hasReplies && !hasNext) {
      return true
    }

    if (hasReplies && hasNext && keepIt) {
      return true
    }

    return false
  }, [currentMessage, nextMessage])

  const handlePress = useCallbackOne(
    (reply: Reply) => () => {
      if (currentMessage) {
        const { type } = currentMessage.quickReplies!

        switch (type) {
          case 'radio': {
            handleSend([reply])()
            return
          }
          case 'checkbox': {
            if (replies.find(sameReply(reply))) {
              setReplies(replies.filter(diffReply(reply)))
            } else {
              setReplies([...replies, reply])
            }
            return
          }
          default: {
            warning(`onQuickReply unknown type: ${type}`)
          }
        }
      }
    },
    [replies, currentMessage],
  )

  const handleSend = (repliesData: Reply[]) => () => {
    onQuickReply?.(
      repliesData.map((reply: Reply) => ({
        ...reply,
        messageId: currentMessage!._id,
      })),
    )
  }

  if (!shouldComponentDisplay) {
    return null
  }

  return (
    <View style={styles.container}>
      {currentMessage!.quickReplies!.values.map(
        (reply: Reply, index: number) => {
          const selected = type === 'checkbox' && replies.find(sameReply(reply))

          return (
            <TouchableOpacity
              onPress={handlePress(reply)}
              style={[
                styles.quickReply,
                quickReplyStyle,
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
                  quickReplyTextStyle,
                ]}
              >
                {reply.title}
              </Text>
            </TouchableOpacity>
          )
        },
      )}
      {replies.length > 0 && (
        <TouchableOpacity
          style={[styles.quickReply, styles.sendLink]}
          onPress={handleSend(replies)}
        >
          {renderQuickReplySend?.() || (
            <Text style={styles.sendLinkText}>{sendText}</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  )
}

QuickReplies.defaultProps = {
  nextMessage: undefined,
  onQuickReply: () => null,
  color: Color.peterRiver,
  sendText: 'Send',
  renderQuickReplySend: undefined,
  quickReplyStyle: undefined,
  quickReplyTextStyle: undefined,
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
