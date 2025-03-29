import { View, Text, TouchableOpacity } from 'react-native'
import React, { FC, useState } from 'react'
import { optionStyles } from '../../styles/optionsStyles';
import Icon from '../global/Icon';
import CustomText from '../global/CustomText';
import { Colors } from '../../utils/Constants';
import { bottomTabStyles } from '../../styles/bottomTabStyle';
import { navigate } from '../../utils/NavigationUtil';
import QRScannerModal from '../modals/QRScannerModal';

const QRBottom = () => {
    const [isVisible, setVisible] = useState(false);
    return (
        <>
            <View style={bottomTabStyles.container}>
                <TouchableOpacity style={optionStyles.subContainer} onPress={( ) => navigate('ReceivedFileScreen')}>
                    <Icon
                        name="apps-sharp"
                        iconFamily="Ionicons"
                        color="#333"
                        size={24}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={bottomTabStyles.qrCode} onPress={( ) => setVisible(true)}>
                    <Icon
                        name="qrcode-scan"
                        iconFamily="MaterialCommunityIcons"
                        color="#fff"
                        size={26}
                    />
                </TouchableOpacity>
                
                <TouchableOpacity style={optionStyles.subContainer} onPress={( ) => {}}>
                    <Icon
                        name="beer-sharp"
                        iconFamily="Ionicons"
                        color="#333"
                        size={24}
                    />
                </TouchableOpacity>

            </View>

            { isVisible && <QRScannerModal visible={isVisible} onClose={() => setVisible(false)}/> }
        </>
    )
}

export default QRBottom;