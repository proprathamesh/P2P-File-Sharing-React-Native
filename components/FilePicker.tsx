import React from 'react';
import { Button, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

type FilePickerProps = {
  onFileSelect: (filePath: string) => void;
};

const FilePicker = ({ onFileSelect }: FilePickerProps) => {
  const handleFileSelect = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], // Allow all file types
      });

      // res is an array, so access the first item
      if (res.length > 0 && res[0].uri) {
        onFileSelect(res[0].uri); // Pass the file URI to the callback
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled file picker');
      } else {
        console.error('Error picking file:', err);
        Alert.alert('Error', 'Failed to pick file. Please try again.');
      }
    }
  };

  return <Button title="Select File" onPress={handleFileSelect} />;
};

export default FilePicker;