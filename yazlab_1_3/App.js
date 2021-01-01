import React, {useState} from 'react';
import {SafeAreaView, TouchableOpacity, Text, Image} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {Dimensions} from 'react-native';

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
  const [imageURL, setImageURL] = useState('');

  return (
    <SafeAreaView>
      <Image
        source={{uri: imageURL}}
        style={{
          width: Dimensions.get('window').width - 16,
          height: Dimensions.get('window').width - 16,
          backgroundColor: '#333',
          margin: 8
        }}
        resizeMode={'stretch'}
      />
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
            })
              .then((response) => response.json())
              .then((response) => {
                console.log('http://192.168.1.33:3000' + response.url);
                setImageURL('http://192.168.1.33:3000' + response.url);
              })
              .catch((error) => {
                console.warn(error);
              });
          });
        }}>
        <Text style={{color: '#fff'}}>Fotoğraf Yükle</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
