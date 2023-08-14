import { Message, User } from '../../db/models';

const map = new Map();

const connectionCb = (socket, request) => {
  const userId = request.session.user.id;

  map.set(userId, { ws: socket, user: request.session.user });
  socket.on('error', console.error);

  map.forEach(({ ws }) => {
    ws.send(
      JSON.stringify({
        type: 'SET_USERS',
        payload: [...map.values()].map(({ user }) => user),
      }),
    );
  });

  socket.on('message', async (message) => {
    const actionFromFront = JSON.parse(message);
    const { type, payload } = actionFromFront;
    switch (type) {
      case 'NEW_MESSAGE':
        Message.create({ text: payload, authorId: userId }).then(async (newMessage) => {
          const messageWithAuthor = await Message.findOne({
            where: { id: newMessage.id },
            include: User,
          });
          map.forEach(({ ws }) => {
            ws.send(
              JSON.stringify({
                type: 'ADD_MESSAGE',
                payload: messageWithAuthor,
              }),
            );
          });
        });
        break;
      case 'STARTED_TYPING':
        map.forEach(({ ws }) => {
          ws.send(
            JSON.stringify({
              type: 'SET_WRITER',
              payload: request.session.user,
            }),
          );
        });
        break;
      case 'STOPPED_TYPING':
        map.forEach(({ ws }) => {
          ws.send(
            JSON.stringify({
              type: 'SET_WRITER',
              payload: null,
            }),
          );
        });
        break;
      default:
        break;
    }
    console.log(`Received message ${message} from user ${userId}`);
  });

  socket.on('close', () => {
    map.delete(userId);
    map.forEach(({ ws }) => {
      ws.send(
        JSON.stringify({
          type: 'SET_USERS',
          payload: [...map.values()].map(({ user }) => user),
        }),
      );
    });
  });
};

export default connectionCb;
