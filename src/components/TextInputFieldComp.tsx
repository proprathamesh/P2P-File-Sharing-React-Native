import React from 'react';
import { View, Text, TextInput, TextInputProps, TextStyle, ViewStyle } from 'react-native';

// Define the props for the TextInputFieldComp component
type TextInputFieldCompProps = {
  title: string;
  placeholder: string;
  keyboard?: TextInputProps['keyboardType']; // Optional, defaults to 'default'
  security?: boolean; // Optional, defaults to false
  onChangeText: (text: string) => void;
  value: string;
};

export default function TextInputFieldComp({
  title,
  placeholder,
  keyboard = 'default',
  security = false,
  onChangeText,
  value,
}: TextInputFieldCompProps) {
  return (
    <View>
      <Text style={{ marginTop: 20 }}>{title}</Text>
      <View
        style={{
          backgroundColor: '#E5E8E8',
          height: 40,
          justifyContent: 'center',
          paddingHorizontal: 15,
          marginTop: 3,
          borderRadius: 5,
        }}
      >
        <TextInput
          value={value}
          keyboardType={keyboard}
          placeholder={placeholder}
          secureTextEntry={security}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
}