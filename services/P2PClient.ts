// src/services/P2PClient.ts
import TcpSocket from 'react-native-tcp-socket';
import RNFS from 'react-native-fs';

type SendFileOptions = {
  filePath: string;
  peerIp: string;
  peerPort: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
};

export const sendFileToPeer = async (options: SendFileOptions) => {
  const { filePath, peerIp, peerPort, onSuccess, onError } = options;

  try {
    const fileData = await RNFS.readFile(filePath, 'utf8');

    const client = TcpSocket.createConnection({ port: peerPort, host: peerIp }, () => {
      console.log('Connected to peer');
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