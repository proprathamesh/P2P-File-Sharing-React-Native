import { View, Text, SafeAreaView, TouchableOpacity, Image, Animated, Easing } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { useTCP } from '../service/TCPProvider';
import LinearGradient from 'react-native-linear-gradient';
import { sendStyles } from '../styles/sendStyles';
import Icon from '../components/global/Icon';
import QRScannerModal from '../components/modals/QRScannerModal';
import CustomText from '../components/global/CustomText';
import BreakerText from '../components/ui/BreakerTest';
import { Colors, screenWidth } from '../utils/Constants';
import LottieView from 'lottie-react-native';
import { goBack, navigate } from '../utils/NavigationUtil';
import dgram from 'react-native-udp';

const deviceNames = [
    'Oppo',
    'Vivo X1',
    'Redmi',
    'Samsung S56',
    'iphone 16',
    'OnePlus 9',
];

const SendScreen: FC = () => {
    const { connectToServer, isConnected } = useTCP();
    const [isScannerVisible, setIsScannerVisible] = useState(false); // Fixed: useState() instead of useState[]
    const [nearbyDevices, setNearbyDevices] = useState<any[]>([]);

    const handleScan = (data: any) => {  // Fixed: handlescan → handleScan (camelCase)
        const [connectionData, deviceName] = data.replace('tcp://', '').split('|');
        const [host, port] = connectionData.split(':');
        connectToServer(host, parseInt(port, 10), deviceName);
    };

    const getRandomPosition = (
        radius: number,
        existingPositions: {x: number; y: number}[],
        minDistance: number
    )  => {
        let position: any;
        let isOverlapping;
    
        do {
        const angle = Math.random() * 360;
        const distance = Math.random() * (radius - 50) + 50;
        const x = distance * Math.cos((angle + Math.PI) / 180);
        const y = distance * Math.sin((angle + Math.PI) / 180);
    
        position = {x, y};
        isOverlapping = existingPositions.some(pos => {
        const dx = pos.x - position.x;
        const dy = pos.y - position.y;
        return Math.sqrt(dx * dx + dy * dy) < minDistance;
        });
        } while (isOverlapping);
    
        return position;
    };

    const listenForDevices = async () => {
        const server = dgram.createSocket({
            type: 'udp4',
            reusePort: true,
        });

        const port = 57143;

        server.bind(port, () => {
            console.log('Listening for nearby devices...');
        });

        server.on('message', (msg, rinfo) => {
            const [connectionData, otherDevice] = msg
                ?.toString()
                ?.replace('tcp://', '')
                ?.split('|');

            setNearbyDevices((prevDevices) => {
                const deviceExists = prevDevices?.some(device => device?.name === otherDevice)
                if (!deviceExists) {
                    const newDevice = {
                        id: `${Date.now()}_${Math.random()}`,
                        name: otherDevice,
                        image: require('../assets/icons/device.jpeg'),
                        fullAddress: msg?.toString(),
                        position: getRandomPosition(150, prevDevices?.map((d) => d.position), 50),
                        scale: new Animated.Value(0)
                    };

                    Animated.timing(newDevice.scale, {
                        toValue: 1,
                        duration: 1500,
                        easing: Easing.out(Easing.ease),
                        useNativeDriver: true
                    }).start()
                    return [...prevDevices, newDevice]
                }
                return prevDevices;
            })
        })
    }

    useEffect(() => {
        if (isConnected) {
            navigate("ConnectionScreen")
        }
    }, [isConnected])

    useEffect(() => {
        let udpServer: any;
        const setupServer = async () => {
            udpServer = await listenForDevices()
        }
        setupServer()
    }, [])

    return (
            <LinearGradient
                colors={['#FFFFFF', '#B689ED', '#A066E5']}
                style={sendStyles.container}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
            >
                <SafeAreaView />

                <View style={sendStyles.mainContainer}>
                    <View style={sendStyles.infoContainer}>
                        <Icon
                            name="blur-on"
                            iconFamily="MaterialIcons"
                            color="#fff"
                            size={40}
                        />

                        <CustomText
                            fontFamily="Okra-Bold"
                            color="#fff"
                            fontSize={16}
                            style={{ marginTop: 20 }}
                        >
                            Receiving from nearby devices
                        </CustomText>

                        <CustomText
                            color="#fff"
                            fontSize={12}
                            fontFamily="Okra-Medium"
                            style={{ textAlign: 'center' }}
                        >
                            Ensure your device is connected to the sender's hotspot network.
                        </CustomText>

                        <BreakerText text="or" />


                        <TouchableOpacity
                            style={sendStyles.qrButton}
                            onPress={() => setIsScannerVisible(true)}
                        >
                            <Icon
                                name="qrcode"
                                iconFamily="MaterialCommunityIcons"
                                color={Colors.primary}
                                size={16}
                            />
                            <CustomText fontFamily="Okra-Bold" color={Colors.primary}>
                                Scan QR
                            </CustomText>
                        </TouchableOpacity>
                    </View>

                    <View style={sendStyles.animationContainer}>
                        <View style={sendStyles.lottieContainer}>
                            <LottieView
                                style={sendStyles.lottie}
                                source={require('../assets/animations/scanner.json')}
                                autoPlay
                                loop={true}
                                hardwareAccelerationAndroid
                            />
                            {
                                nearbyDevices?.map((device) => (
                                    <Animated.View
                                        key={device?.id}
                                        style={[
                                            sendStyles.deviceDot,
                                            {
                                                transform: [{ scale: device.scale }],
                                                left: screenWidth / 2.33 + (device.position?.x || 0),
                                                top: screenWidth / 2.2 + (device.position?.y || 0),
                                            }
                                        ]}
                                    >

                                        <TouchableOpacity
                                            style={sendStyles.popup}
                                            onPress={() => handleScan(device?.fullAddress)} // Fixed: removed extra curly braces
                                        >
                                            <Image
                                                source={device.image}
                                                style={sendStyles.deviceImage}
                                            />
                                            <CustomText
                                                numberOfLines={1} // Fixed: removed extra curly braces
                                                color="#333"
                                                fontFamily="Okra-Bold"
                                                fontSize={8} // Fixed: removed extra curly braces
                                                style={sendStyles.deviceText}
                                            >
                                                {device.name}
                                            </CustomText>
                                        </TouchableOpacity>
                                    </Animated.View>
                                ))}
                        </View>
                        <Image
                            source={require('../assets/images/profile.jpg')}
                            style={sendStyles.profileImage}
                        />
                    </View>

                    <TouchableOpacity onPress={goBack} style={sendStyles.backButton}>
                        <Icon
                            name="arrow-back"
                            iconFamily="Ionicons"
                            color="#000"
                            size={16}
                        />
                    </TouchableOpacity>


                </View>
                {
                    isScannerVisible && (
                        <QRScannerModal
                            visible={isScannerVisible}
                            onClose={() => setIsScannerVisible(false)}
                        />
                    )
                }
            </LinearGradient>
    )
}

export default SendScreen;