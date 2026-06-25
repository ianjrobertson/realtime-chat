import type {ReactNode} from 'react';
import {
  useState,
  useEffect,
  useContext,
  createContext,
} from 'react'

import { Socket } from 'phoenix'

type SocketContextType = {
    socket: Socket | null
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

type Props = { children: ReactNode }

export const SocketProvider = ({ children }: Props) => {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const wsUrl = 'ws://localhost:4000/socket'
    const phoenixSocket = new Socket(wsUrl, {})

    phoenixSocket.connect()
    setSocket(phoenixSocket)

    return () => {
      phoenixSocket.disconnect()
    }
  }, [])

  return (
    <SocketContext value={{socket}}>{children}</SocketContext>
  )
}

export const useSocket = () => {
  const context = useContext(SocketContext)

  if (!context) {
    throw new Error("It's not there!")
  }

  return context;
}
