import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const useLiveSocket = (roomId, handlers = {}) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!roomId) return;
    const socket = io(`${SOCKET_URL}/live`, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;
    socket.emit('join-room', { roomId, ...handlers.joinData });

    Object.entries(handlers.events || {}).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const emit = (event, data) => socketRef.current?.emit(event, data);

  return { emit, socket: socketRef.current };
};
