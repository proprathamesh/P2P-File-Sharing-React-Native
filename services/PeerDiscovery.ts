// src/services/PeerDiscovery.ts
import dgram from 'react-native-udp';

type Peer = {
  ip: string;
  port: number;
};

export const startPeerDiscovery = (onPeerDiscovered: (peer: Peer) => void) => {
  const udpSocket = dgram.createSocket({ type: 'udp4' });
  const broadcastAddress = '255.255.255.255';
  const broadcastPort = 41234;

  // Listen for peer broadcasts
  udpSocket.bind(broadcastPort, () => {
    udpSocket.setBroadcast(true);

    udpSocket.on('message', (message: Buffer) => {
      const data = JSON.parse(message.toString());
      if (data.type === 'PEER_DISCOVERY') {
        onPeerDiscovered({ ip: data.ip, port: data.port });
      }
    });
  });

  // Broadcast own presence every 5 seconds
  setInterval(() => {
    const message = JSON.stringify({
      type: 'PEER_DISCOVERY',
      ip: '192.168.1.100', // Replace with the peer's actual IP address
      port: 3000, // Replace with the peer's actual port
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

  return udpSocket;
};