import { useSocket } from '../context/SocketContext'
import type { Channel } from 'phoenix'
import { useEffect, useRef } from 'react'

export function useChannel(
  topicName: string,
  eventCallback: (response?: never) => void | Promise<void>,
) {
  const { socket } = useSocket()
  const channel = useRef<Channel | null>(null)

  useEffect(() => {
    if (!socket) return

    const chan = socket.channel(topicName, {})
    channel.current = chan

    chan.on('new_msg', eventCallback)

    chan.join()
      .receive('ok', (resp) => {
        console.log('Joined successfully', resp)
      })
      .receive('error', (resp) => {
        console.log('Unable to join', resp)
      })

    return () => {
      chan.leave()
    }
  }, [socket, topicName, eventCallback])

  const pushMessage = (event: string, payload: object) => {
    if (channel.current) {
      channel.current
        .push(event, payload)
        .receive('ok', (res) => console.log('Message pushed', res))
        .receive('error', (err) => console.log('Push failed', err))
    } else {
      console.log('no channel!', channel.current)
    }
  }

  return { pushMessage, channel }
}
