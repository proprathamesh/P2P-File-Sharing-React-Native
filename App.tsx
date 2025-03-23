import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import TcpSocket from 'react-native-tcp-socket';
import dgram from 'react-native-udp';
import RNFS from 'react-native-fs';

// Main App Component
const App: React.FC = () => {
  const [mode, setMode] = useState<'idle' | 'send' | 'receive'>('idle'); // Current mode: idle, send, or receive
  const [peers, setPeers] = useState<{ ip: string; port: number }[]>([]); // List of discovered peers
  const [fileSent, setFileSent] = useState<boolean>(false); // File sent status
  const [error, setError] = useState<string | null>(null); // Error message
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false); // Whether the device is broadcasting
  const [isSearching, setIsSearching] = useState<boolean>(false); // Whether the device is searching for peers

  // Start broadcasting as a receiver
  const startBroadcasting = () => {
    setIsBroadcasting(true);
    setMode('receive');

    const udpSocket = dgram.createSocket({ type: 'udp4' });
    const broadcastAddress = '255.255.255.255';
    const broadcastPort = 41234;

    udpSocket.bind(broadcastPort, () => {
      udpSocket.setBroadcast(true);

      // Broadcast own presence every 5 seconds
      setInterval(() => {
        const message = JSON.stringify({
          type: 'PEER_DISCOVERY',
          ip: '192.168.1.100', // Replace with the device's actual IP address
          port: 3000, // Replace with the device's actual port
        });

        udpSocket.send(
          message,
          0,
          message.length,
          broadcastPort,
          broadcastAddress,
          (error?: Error) => {
            if (error) console.error('Broadcast error:', error);
          }
        );
      }, 5000);
    });

    // Cleanup on unmount
    return () => {
      udpSocket.close();
    };
  };

  // Start searching for peers as a sender
  const startSearching = () => {
    setIsSearching(true);
    setMode('send');

    const udpSocket = dgram.createSocket({ type: 'udp4' });
    const broadcastPort = 41234;

    udpSocket.bind(broadcastPort, () => {
      udpSocket.on('message', (message: Buffer) => {
        const data = JSON.parse(message.toString());
        if (data.type === 'PEER_DISCOVERY') {
          setPeers((prevPeers) => {
            // Avoid adding duplicate peers
            if (!prevPeers.some((p) => p.ip === data.ip && p.port === data.port)) {
              return [...prevPeers, { ip: data.ip, port: data.port }];
            }
            return prevPeers;
          });
        }
      });
    });

    // Cleanup on unmount
    return () => {
      udpSocket.close();
    };
  };

  // Send a file to a selected peer
  const handleSendFile = (peerIp: string, peerPort: number) => {
    const filePath = `${RNFS.DocumentDirectoryPath}/example.txt`; // Replace with the file you want to send

    sendFileToPeer({
      filePath,
      peerIp,
      peerPort,
      onSuccess: () => {
        setFileSent(true);
        setError(null);
      },
      onError: (error) => {
        setError(error);
      },
    });
  };

  // P2P Client Logic
  const sendFileToPeer = async (options: {
    filePath: string;
    peerIp: string;
    peerPort: number;
    onSuccess?: () => void;
    onError?: (error: string) => void;
  }) => {
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

  // Render the appropriate UI based on the mode
  return (
    <View style={styles.container}>
      <Text style={styles.title}>P2P File Sharing App</Text>

      {mode === 'idle' ? (
        // Home screen with Send and Receive buttons
        <View style={styles.modeSelection}>
          <Button title="Send" onPress={() => startSearching()} />
          <Button title="Receive" onPress={() => startBroadcasting()} />
        </View>
      ) : mode === 'send' ? (
        // Sender mode: Search for peers and send files
        <View>
          <Text style={styles.subtitle}>Discovered Peers:</Text>
          {isSearching ? (
            peers.length > 0 ? (
              <FlatList
                data={peers}
                keyExtractor={(item) => `${item.ip}:${item.port}`}
                renderItem={({ item }) => (
                  <View style={styles.peerItem}>
                    <Text style={styles.peerText}>{`${item.ip}:${item.port}`}</Text>
                    <Button
                      title="Send File"
                      onPress={() => handleSendFile(item.ip, item.port)}
                    />
                  </View>
                )}
              />
            ) : (
              <Text style={styles.status}>Searching for peers...</Text>
            )
          ) : (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
        </View>
      ) : (
        // Receiver mode: Broadcast and wait for files
        <View>
          <Text style={styles.status}>
            {isBroadcasting ? 'Broadcasting...' : 'Waiting for files...'}
          </Text>
        </View>
      )}

      {fileSent && <Text style={styles.success}>File sent successfully!</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  modeSelection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  status: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  peerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  peerText: {
    fontSize: 16,
  },
  success: {
    fontSize: 16,
    color: 'green',
    textAlign: 'center',
    marginTop: 16,
  },
  error: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default App;