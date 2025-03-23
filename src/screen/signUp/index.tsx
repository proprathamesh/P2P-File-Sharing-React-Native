import React, { useState } from 'react';
import { View, Text, SafeAreaView, Image, StyleSheet } from 'react-native';
import TextInputFieldComp from '../../components/TextInputFieldComp';

export default function SignUpScreen() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarBackground}>
            <Image
              style={styles.avatarImage}
              source={require('../../assets/image/man.png')}
            />
          </View>
        </View>
        <Text style={styles.title}>Signup to join</Text>
        <View style={styles.socialButtonsContainer}>
          <View style={styles.socialButton}>
            <Image
              style={styles.socialIcon}
              source={require('../../assets/image/google.png')}
            />
          </View>
          <View style={styles.socialButton}>
            <Image
              style={styles.socialIcon}
              source={require('../../assets/image/facebook.png')}
            />
          </View>
          <View style={styles.socialButton}>
            <Image
              style={styles.socialIcon}
              source={require('../../assets/image/apple.png')}
            />
          </View>
        </View>
        <Text style={styles.subtitle}>Or register with email</Text>
        <TextInputFieldComp
          title={'Name'}
          placeholder={'user name'}
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TextInputFieldComp
          title={'Email'}
          placeholder={'email'}
          value={email}
          keyboard="email-address"
          onChangeText={(text) => setEmail(text)}
        />
        <TextInputFieldComp
          title={'Password'}
          placeholder={'password'}
          value={password}
          security={true}
          onChangeText={(text) => setPassword(text)}
        />
        <View style={styles.signUpButton}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </View>
        <View style={styles.signInContainer}>
          <Text>Already have an account?</Text>
          <Text style={styles.signInText}>Sign in</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  avatarContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  avatarBackground: {
    width: 80,
    height: 80,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  avatarImage: {
    width: 50,
    height: 50,
  },
  title: {
    marginTop: 20,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 17,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  socialButton: {
    borderWidth: 1,
    borderColor: '#CCD1D1',
    paddingHorizontal: 20,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.3,
  },
  socialIcon: {
    width: 25,
    height: 25,
  },
  subtitle: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 17,
  },
  signUpButton: {
    backgroundColor: '#52BE80',
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  signUpButtonText: {
    textAlign: 'center',
    color: 'white',
  },
  signInContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  signInText: {
    marginLeft: 5,
    color: '#52BE80',
    textDecorationLine: 'underline',
  },
});