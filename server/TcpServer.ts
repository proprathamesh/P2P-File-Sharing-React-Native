// src/server/TcpServer.ts
import TcpSocket from 'react-native-tcp-socket';
import RNFS from 'react-native-fs';
import dgram from 'react-native-udp';
import { Platform } from 'react-native';

type ServerCallbacks = {
  onClientConnected?: (socket: TcpSocket.Socket) => void;
  onFileReceived?: (filePath: string) => void;
  onError?: (error: Error) => void;
};

export const startTcpServer = (callbacks: ServerCallbacks) => {
  const server = TcpSocket.createServer((socket: TcpSocket.Socket) => {
    console.log('Client connected:', socket.address());

    // Notify when a client connects
    if (callbacks.onClientConnected) {
      callbacks.onClientConnected(socket);
    }

    // Handle incoming data
    socket.on('data', (data: string | Buffer) => {
        const fileName = `received_file_${Date.now()}.txt`;
        const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      
        // Convert data to string if it's a Buffer
        const fileContent = typeof data === 'string' ? data : data.toString();
      
        // Save the received data to a file
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

    // Handle errors
    socket.on('error', (error: Error) => {
      console.error('Socket error:', error);
      if (callbacks.onError) {
        callbacks.onError(error);
      }
    });

    // Handle client disconnection
    socket.on('close', () => {
      console.log('Client disconnected');
    });
  });

  // Start the TCP server
  server.listen({ port: 3000, host: '0.0.0.0' });
  server.on('listening', () => {
    console.log('Server listening on port 3000');
  });

  // Broadcast server IP using UDP
  const udpSocket = dgram.createSocket({ type: 'udp4' }); // Correct usage
  const broadcastAddress = '255.255.255.255'; // Broadcast to all devices on the network
  const broadcastPort = 41234; // Arbitrary port for broadcasting

  udpSocket.bind(broadcastPort, () => {
    udpSocket.setBroadcast(true);

    const message = JSON.stringify({
      type: 'SERVER_IP',
      ip: '192.168.1.100', // Replace with the server's actual IP address
      port: 3000,
    });

    // Broadcast every 5 seconds
    setInterval(() => {
        udpSocket.send(
            message,
            0,
            message.length,
            broadcastPort,
            broadcastAddress,
            (error?: Error) => { // Use `error?: Error` instead of `err: Error | null`
              if (error) console.error('Broadcast error:', error);
            }
          );;
    }, 5000);
  });

  return server;
};