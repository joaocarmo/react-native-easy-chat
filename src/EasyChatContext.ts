import { createContext, useContext } from 'react'

export interface IGiftedChatContext {
  actionSheet(): {
    showActionSheetWithOptions: (option?: unknown, cb?: unknown) => unknown
  }
  getLocale(): string
}

export const EasyChatContext = createContext<IGiftedChatContext>({
  getLocale: () => 'en',
  actionSheet: () => ({
    showActionSheetWithOptions: () => null,
  }),
})

export const useChatContext = () => useContext(EasyChatContext)
