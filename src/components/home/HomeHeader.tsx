import { View, Text, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { homeHeaderStyles} from '../../styles/homeHeaderStyles';
import { commonStyles} from '../../styles/commonStyles';
import Icon from '../global/Icon';
import QRGenerateModal from '../modals/QRGenerateModal';

const HomeHeader = () => {

    const [isVisible, setVisible] = useState(false);

    return (
        <View style={homeHeaderStyles.mainContainer}>
            <SafeAreaView />
            <View style={[commonStyles.flexRowBetween, homeHeaderStyles.container]}>
                <TouchableOpacity>
                    <Icon iconFamily='Ionicons' name='menu' size={22} color='#fff' />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setVisible(true)}>
                    <Image
                        source={require('../../assets/images/profile.jpg')}
                        style={homeHeaderStyles.profile}
                    />
                </TouchableOpacity>
            </View>

            {isVisible && <QRGenerateModal visible={isVisible} onClose={() => setVisible(false)} />}
        </View>
    )
}

export default HomeHeader;