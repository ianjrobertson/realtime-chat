import { SocketProvider } from '#/context/SocketContext'
import { useChannel } from '#/hooks/useChannel'
import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useState } from 'react'
import type { ChangeEvent } from 'react'

export const Route = createFileRoute('/')({ component: Home })

type Message = {
  body: string
}

function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [typedMessage, setTypedMessage] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTypedMessage(event.target.value)
  }

  const handleMessage = useCallback((msg: Message) => {
    setMessages((prev) => [...prev, msg])
  }, [])

  // Connect to the "room:lobby" channel
  const { pushMessage } = useChannel('room:lobby', handleMessage)

  const sendMessage = () => {
    pushMessage('new_msg', { body: typedMessage })
    setTypedMessage("");
  }

  return (
      <div className="p-8">
        <ul>
          {messages.map((m, idx) => (
            <li key={idx}>{m.body}</li>
          ))}
        </ul>
        <input
          id="chat-input"
          type="text"
          className="bg-white border-2 border-black rounded"
          value={typedMessage}
          onChange={handleChange}
        ></input>
        <button onClick={sendMessage}>Send Message</button>
      </div>
  )
}

function Home() {
  <SocketProvider>
    <Chat/>
    <div>Hello?</div>
  </SocketProvider>
}
