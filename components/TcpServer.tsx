// src/components/TcpServer.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { startTcpServer } from '../server/TcpServer'; // Correct import

const TcpServer: React.FC = () => {
  const [serverStatus, setServerStatus] = useState<string>('Not started');
  const [receivedFile, setReceivedFile] = useState<string | null>(null);

  useEffect(() => {
    const server = startTcpServer({
      onClientConnected: (socket) => {
        console.log('Client connected:', socket.address());
      },
      onFileReceived: (filePath) => {
        setReceivedFile(filePath);
      },
      onError: (error) => {
        console.error('Server error:', error);
      },
    });

    setServerStatus('Listening on port 3000');

    return () => {
      server.close();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.status}>Server Status: {serverStatus}</Text>
      {receivedFile && (
        <Text style={styles.file}>Received file saved at: {receivedFile}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  status: {
    fontSize: 18,
    marginBottom: 16,
  },
  file: {
    fontSize: 16,
    color: 'green',
  },
});

export default TcpServer;