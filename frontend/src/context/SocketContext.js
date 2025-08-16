import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io('http://localhost:5000');
    setSocket(s);
    
    s.on('connect', () => {
      console.log('Socket connected:', s.id);
    });
    
    s.on('disconnect', () => {
      console.log('Socket disconnected');
    });
    
    return () => {
      s.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
