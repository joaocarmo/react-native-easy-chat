<h3 align="center">
  💬 Easy Chat
</h3>

<p align="center">
  The easiest chat UI for React Native & Web
</p>

## About

[![npm version](https://badge.fury.io/js/react-native-easy-chat.svg)][npmjs]

This is a chat UI for React Native & Web. It started as a fork of
[react-native-gifted-chat][react-native-gifted-chat] and then diverged into
something different. It's a simple chat UI that is easy to use and integrate.
The original project was something I came to rely on for my own projects, but
I decided to make it my own after the author and the maintainers stopped
actively supporting it. Feel free to fork and contribute!

## Installation

```sh
yarn add react-native-easy-chat

# or

npm install react-native-easy-chat
```

## Requirements

You need to be using, at least, React v17 or higher with the new
[JSX transform][jsx-transform].

## Example

```jsx
import React, { useState, useCallback, useEffect } from 'react'
import { EasyChat } from 'react-native-easy-chat'

export function Example() {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ])
  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      EasyChat.append(previousMessages, messages),
    )
  }, [])

  return (
    <EasyChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  )
}
```

### Advanced example

See [`App.tsx`][app] for a working demo!

### "Slack" example

See the files in [`example-slack-message`][example-slack-message] for an example
of how to override the default UI to make something that looks more like Slack -
with usernames displayed and all messages on the left.

## Notes for local development

### Native

1. Install `yarn global add expo-cli`
2. Install dependencies `yarn install`
3. `expo start`

### react-native-web

#### With expo

1. Install `yarn global add expo-cli`
2. Install dependencies `yarn install`
3. `expo start -w`

## More documentation

This documentation is a work in progress. You can check the full detailed docs
[here][old-readme].

## License

- [MIT][license]

<!-- References -->

[app]: ./App.tsx
[example-slack-message]: ./example-slack-message
[jsx-transform]: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html
[license]: ./LICENSE
[npmjs]: https://www.npmjs.com/package/react-native-easy-chat
[old-readme]: ./OLD_README.md
[react-native-gifted-chat]: https://github.com/FaridSafi/react-native-gifted-chat
