import { createContext, useContext } from 'react'

export interface IEasyChatContext {
  actionSheet(): {
    showActionSheetWithOptions: (option?: unknown, cb?: unknown) => unknown
  }
  getLocale(): string
}

export const EasyChatContext = createContext<IEasyChatContext>({
  getLocale: () => 'en',
  actionSheet: () => ({
    showActionSheetWithOptions: () => null,
  }),
})

export const useChatContext = () => useContext(EasyChatContext)
