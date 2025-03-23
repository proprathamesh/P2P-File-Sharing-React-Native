import TcpSocket from 'react-native-tcp-socket';
import RNFS from 'react-native-fs';

type SendFileOptions = {
  filePath: string;
  peerIp: string;
  peerPort: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
};

export const sendFileToPeer = async (options: SendFileOptions): Promise<void> => {
  const { filePath, peerIp, peerPort, onSuccess, onError } = options;

  try {
    // Read the file content
    const fileContent = await RNFS.readFile(filePath, 'utf8');

    // Create a TCP connection to the peer
    const client = TcpSocket.createConnection({ port: peerPort, host: peerIp }, () => {
      console.log('Connected to peer');
      client.write(fileContent); // Send the file content
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