import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define the type for the navigation stack parameters
type RootStackParamList = {
  Home: { channel: string; listOfFruits: string[] }; // Parameters for the Home screen
  TabScreen: undefined; // No parameters for the TabScreen
  SignIn: undefined; // No parameters for the SignIn screen
};

// Define the type for the navigation prop
type SignInScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

// Define the props for the SignInScreen component
type SignInScreenProps = {
  navigation: SignInScreenNavigationProp;
};

export default function SignInScreen({ navigation }: SignInScreenProps) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>SignInScreen</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Home', {
              channel: 'code with zain',
              listOfFruits: ['Apple', 'Mango'],
            })
          }
          style={{ marginTop: 10, backgroundColor: 'orange', padding: 10 }}
        >
          <Text>Go To Home Screen</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('TabScreen')}
          style={{ marginTop: 10, backgroundColor: 'orange', padding: 10 }}
        >
          <Text>Go To Tab Screen</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}