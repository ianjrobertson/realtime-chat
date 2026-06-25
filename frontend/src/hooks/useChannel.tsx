import { useSocket } from '#/context/SocketContext'
import type { Channel } from 'phoenix'
import { useEffect, useState } from 'react'

export function useChannel(
  topicName: string,
  
  eventCallback: (response?: any) => void | Promise<void>,
) {
  const { socket } = useSocket()
  const [channel, setChannel] = useState<Channel | null>(null)

  useEffect(() => {
    if (!socket) return

    const chan = socket.channel(topicName, {})
    setChannel(chan)

    chan.on('new_msg', eventCallback)

    return () => {
      chan.leave()
    }
  }, [topicName, eventCallback])

  const pushMessage = (event: string, payload: object) => {
    console.log("pushing message", event, payload)
    if (channel) {
      channel
        .push(event, payload)
        .receive('ok', (res) => console.log('Message pushed', res))
        .receive('error', (err) => console.log('Push failed', err))
    } else {
      console.log('no channel!')
    }
  }

  return { pushMessage, channel }
}
