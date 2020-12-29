import React from 'react';
import {SafeAreaView, TouchableOpacity, Text} from 'react-native';
import ImagePicker from 'react-native-image-picker';

const imagePickerOptions = {
  title: 'YÜKLENECEK FOTOĞRAF',
  cancelButtonTitle: 'İptal',
  takePhotoButtonTitle: 'Fotoğraf çek...',
  chooseFromLibraryButtonTitle: 'Fotoğraflarından seç...',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

export default function App() {
  return (
    <SafeAreaView>
      <TouchableOpacity
        style={{
          backgroundColor: '#333',
          padding: 8,
          margin: 8,
        }}
        onPress={() => {
          ImagePicker.showImagePicker(imagePickerOptions, async (response) => {
            if (response.didCancel) {
              console.log('User cancelled picking an image.');
              return;
            }

            fetch('http://192.168.1.33:3000/upload', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                img: response.data,
              }),
            }).catch((error) => {
              console.warn(error);
            });
          });
        }}>
        <Text style={{color: '#fff'}}>Fotoğraf Yükle</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
