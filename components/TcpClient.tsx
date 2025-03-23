// src/components/TcpClient.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { sendFile } from '../services/TcpClientService';
import RNFS from 'react-native-fs';

const TcpClient: React.FC = () => {
  const [fileSent, setFileSent] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [serverFound, setServerFound] = useState<boolean>(false);

  useEffect(() => {
    // Simulate server discovery
    const timeout = setTimeout(() => {
      setServerFound(true);
    }, 5000); // Wait 5 seconds for server discovery

    return () => clearTimeout(timeout);
  }, []);

  const handleSendFile = () => {
    sendFile({
      filePath: `${RNFS.DocumentDirectoryPath}/example.txt`,
      onSuccess: () => {
        setFileSent(true);
        setError(null);
      },
      onError: (error: string) => {
        setError(error);
      },
    });
  };

  return (
    <View style={styles.container}>
      {!serverFound ? (
        <Text style={styles.status}>Searching for server...</Text>
      ) : (
        <>
          <Button title="Send File" onPress={handleSendFile} />
          {fileSent && <Text style={styles.status}>File sent successfully!</Text>}
          {error && <Text style={styles.error}>{error}</Text>}
        </>
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
    marginTop: 16,
    color: 'green',
  },
  error: {
    fontSize: 18,
    marginTop: 16,
    color: 'red',
  },
});

export default TcpClient;