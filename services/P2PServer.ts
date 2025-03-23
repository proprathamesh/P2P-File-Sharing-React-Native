// src/services/P2PServer.ts
import TcpSocket from 'react-native-tcp-socket';
import RNFS from 'react-native-fs';

type ServerCallbacks = {
  onFileReceived?: (filePath: string) => void;
  onError?: (error: Error) => void;
};

export const startP2PServer = (callbacks: ServerCallbacks) => {
  const server = TcpSocket.createServer((socket: TcpSocket.Socket) => {
    console.log('Peer connected:', socket.address());

    socket.on('data', (data: string | Buffer) => {
      const fileName = `received_file_${Date.now()}.txt`;
      const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      const fileContent = typeof data === 'string' ? data : data.toString();

      RNFS.writeFile(filePath, fileContent, 'utf8')
        .then(() => {
          console.log('File saved:', filePath);
          if (callbacks.onFileReceived) {
            callbacks.onFileReceived(filePath);
          }
        })
        .catch((err: Error) => {
          console.error('Error saving file:', err);
          if (callbacks.onError) {
            callbacks.onError(err);
          }
        });
    });

    socket.on('error', (error: Error) => {
      console.error('Socket error:', error);
      if (callbacks.onError) {
        callbacks.onError(error);
      }
    });

    socket.on('close', () => {
      console.log('Peer disconnected');
    });
  });

  server.listen({ port: 3000, host: '0.0.0.0' });
  server.on('listening', () => {
    console.log('P2P server listening on port 3000');
  });

  return server;
};