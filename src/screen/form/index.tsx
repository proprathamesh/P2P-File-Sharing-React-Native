import React, { useState } from 'react';
import { View, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import TextInputFieldComp from '../../components/TextInputFieldComp';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';

export default function FormScreen() {
  const [firstName, setFirstName] = useState<string>('');
  const [image, setImage] = useState<DocumentPickerResponse | null>(null);

  console.log(image);

  async function openGallery() {
    try {
      const docs = await DocumentPicker.pick({
        type: DocumentPicker.types.images,
        allowMultiSelection: false,
      });

      if (docs.length > 0) {
        setImage(docs[0]);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={openGallery}>
            <Image
              style={{
                width: 100,
                height: 100,
                borderColor: 'black',
                borderWidth: 1,
              }}
              source={
                image
                  ? { uri: image.uri }
                  : require('../../assets/image/man.png')
              }
            />
          </TouchableOpacity>
        </View>
        <TextInputFieldComp
          title={'First Name'}
          placeholder={'first name'}
          value={firstName}
          onChangeText={(text: string) => setFirstName(text)}
        />
      </View>
    </SafeAreaView>
  );
}