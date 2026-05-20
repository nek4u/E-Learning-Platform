import logger from '../utils/logger.js';

export const initLiveSocket = (io) => {
  const liveNamespace = io.of('/live');

  liveNamespace.on('connection', (socket) => {
    logger.debug(`Live socket connected: ${socket.id}`);

    socket.on('join-room', ({ roomId, userId, userName }) => {
      socket.join(roomId);
      socket.data = { userId, userName, roomId };
      socket.to(roomId).emit('user-joined', { userId, userName });
    });

    socket.on('chat-message', ({ roomId, message, user }) => {
      liveNamespace.to(roomId).emit('chat-message', { message, user, timestamp: Date.now() });
    });

    socket.on('raise-hand', ({ roomId, user }) => {
      liveNamespace.to(roomId).emit('hand-raised', { user });
    });

    socket.on('poll', ({ roomId, poll }) => {
      liveNamespace.to(roomId).emit('poll', poll);
    });

    socket.on('poll-vote', ({ roomId, pollId, option, userId }) => {
      liveNamespace.to(roomId).emit('poll-vote', { pollId, option, userId });
    });

    socket.on('reaction', ({ roomId, emoji, user }) => {
      liveNamespace.to(roomId).emit('reaction', { emoji, user });
    });

    socket.on('whiteboard-update', ({ roomId, data }) => {
      socket.to(roomId).emit('whiteboard-update', data);
    });

    socket.on('disconnect', () => {
      if (socket.data?.roomId) {
        socket.to(socket.data.roomId).emit('user-left', {
          userId: socket.data.userId,
          userName: socket.data.userName,
        });
      }
    });
  });

  return liveNamespace;
};
