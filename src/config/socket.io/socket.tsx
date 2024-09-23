import {useAuth, useUser} from '@realm/react';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {io, Socket} from 'socket.io-client';
import {retrieveUserSession} from '../../utils/userSessions';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { envs } from '../../utils/constants';

interface SocketContextProps {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextProps>({socket: null});

export const useSocket = () => useContext(SocketContext);

interface Props {
  children: ReactNode;
}

export const SocketProvider: React.FC<Props> = ({children}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const {logOut} = useAuth();

  const user = useUser();

  const accessToken = React.useMemo(async () => {
    const {token} = await retrieveUserSession(logOut);
    return token;
  }, [user.accessToken]);

  useEffect(() => {
    let newSocket: Socket<DefaultEventsMap, DefaultEventsMap>|null = null;
    accessToken.then(token => {
      // Initialize the socket connection
      newSocket = io(`${envs.server_url}/ws`, {
        transports: ['websocket'],
        auth: {
          token: token,
        },
      });

      console.log('Socket IO initialized: ', newSocket.active, accessToken);

      setSocket(newSocket);
    });

    // Clean up on unmount
    return () => {
      if(newSocket)
      {newSocket.disconnect();}
    };
  }, []);

  return (
    <SocketContext.Provider value={{socket}}>{children}</SocketContext.Provider>
  );
};
