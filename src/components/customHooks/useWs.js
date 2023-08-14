export default function useWs() {
  let socket = new WebSocket('ws://localhost:3000');
  let intervalId;
  socket.onopen = (e) => {
    console.log('Socket opened');
    if (intervalId) clearInterval(intervalId);
  };
  socket.onclose = (e) => {
    console.log('Socket closed');
    intervalId = setInterval(() => {
      socket = new WebSocket('ws://localhost:3000');
    }, 2000);
  };
  socket.onerror = (e) => {
    console.log('Socket error');
    intervalId = setInterval(() => {
      socket = new WebSocket('ws://localhost:3000');
    }, 2000);
  };
  return socket;
}
