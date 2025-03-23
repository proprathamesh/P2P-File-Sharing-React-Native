// src/services/TcpClientService.ts
import TcpSocket from 'react-native-tcp-socket';
import RNFS from 'react-native-fs';
import dgram from 'react-native-udp';

type SendFileOptions = {
  filePath: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
};

let serverIp: string | null = null;
let serverPort: number | null = null;

// Listen for server IP broadcast
const udpSocket = dgram.createSocket({ type: 'udp4' });
const broadcastPort = 41234; // Same port as the server's broadcast

udpSocket.bind(broadcastPort, () => {
  udpSocket.on('message', (message: Buffer) => {
    const data = JSON.parse(message.toString());
    if (data.type === 'SERVER_IP') {
      serverIp = data.ip;
      serverPort = data.port;
      console.log('Discovered server:', serverIp, serverPort);
    }
  });
});

export const sendFile = async (options: SendFileOptions) => {
  const { filePath, onSuccess, onError } = options;

  if (!serverIp || !serverPort) {
    if (onError) onError('Server not found. Please wait for the server to broadcast its IP.');
    return;
  }

  try {
    const fileData = await RNFS.readFile(filePath, 'utf8');

    const client = TcpSocket.createConnection({ port: serverPort, host: serverIp }, () => {
      console.log('Connected to server');
      client.write(fileData);
      if (onSuccess) onSuccess();
    });

    client.on('error', (error: Error) => {
      console.error('Client error:', error);
      if (onError) onError('Failed to send file. Please try again.');
    });

    client.on('close', () => {
      console.log('Connection closed');
    });
  } catch (err) {
    console.error('Error reading file:', err);
    if (onError) onError('Failed to read file. Please check the file path.');
  }
};