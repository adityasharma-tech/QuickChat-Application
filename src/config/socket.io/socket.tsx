import { useUser } from '@realm/react';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextProps {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextProps>({ socket: null });

export const useSocket = () => useContext(SocketContext);

interface Props {
  children: ReactNode;
}

export const SocketProvider: React.FC<Props> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const user = useUser();

  useEffect(() => {
    // Initialize the socket connection
    const newSocket = io(`${process.env.SERVER_URL}/ws`, {
      transports: ['websocket'],
      auth: {
        token: user.accessToken
      }
    });

    setSocket(newSocket);

    // Clean up on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
