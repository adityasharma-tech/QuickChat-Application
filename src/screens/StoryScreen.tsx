import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React from 'react';
import {useUser} from '@realm/react';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../utils/RootStackParamList.types';
import {ActivityIndicator, IconButton, MD2Colors, TextInput} from 'react-native-paper';
import {apiRequest} from '../utils/apiClient';
import {
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import Toast from 'react-native-toast-message';

type StoryScreenProp = NativeStackScreenProps<RootStackParamList, 'Story'>;

export default function StoryScreen({navigation}: StoryScreenProp) {
  const user = useUser();

  const [selectedStory, setSelectedStory] = React.useState<{
    uri?: string;
    type?: string;
    name?: string;
  } | null>(null);
  const [caption, setCaption] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);

  async function handleStoryUpload() {
    if (selectedStory) {
      setLoading(true);
      const formData = new FormData();
      formData.append('story', selectedStory);
      formData.append('caption', caption);
      apiRequest('/user/story', formData, 'POST', {
        secure: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(async apiResponse => {
          console.log('apiResponse', apiResponse);
          if (apiResponse?.data?.success)
            Toast.show({
              text1: 'Story Uploaded',
              type: 'success',
            });
          else
            Toast.show({
              text1: 'Failed to upload story.',
              text2: apiResponse?.data?.message,
              type: 'error',
            });
            setLoading(false)
        })
        .catch(apiError => {
          console.error('apiError', apiError);
          Toast.show({
            text1: 'Failed to upload story.',
            text2: apiError.message,
            type: 'error',
          });
          setLoading(false)
        });
    } else {
      Toast.show({
        text1: 'Failed to upload story.',
        text2: 'Please select the story content first',
        type: 'info',
        onPress: handleStorySelect,
      });
      setLoading(false)
    }
  }

  async function handleStorySelect() {
    try {
      const response: ImagePickerResponse = await launchImageLibrary({
        mediaType: 'mixed',
        formatAsMp4: true,
        quality: 0.8,
        videoQuality: 'medium',
        selectionLimit: 1,
      });
      if (response.assets) {
        const asset = response.assets[0];
        setSelectedStory({
          uri: asset.uri,
          name: asset.fileName,
          type: asset.type,
        });
        return {
          uri: asset.uri,
          name: asset.fileName,
          type: asset.type,
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        text1: 'Failed to select story content.',
        type: 'error',
      });
      return null;
    }
  }
  return (
    <View
      style={{
        backgroundColor: 'white',
        height: '100%',
      }}>
      {/* headers */}
      <View
        style={{
          paddingTop: 20,
          paddingBottom: 10,
          paddingHorizontal: 20,
          elevation: 5,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            flexDirection: 'row',
            columnGap: 10,
          }}>
          <Image
            style={{
              width: 40,
              height: 40,
              borderRadius: 50,
            }}
            source={{
              uri: `${user.customData.avatar_url}`,
            }}
          />
          <Text
            style={{
              color: 'black',
              textAlignVertical: 'center',
              fontWeight: 'bold',
              fontSize: 18,
            }}>{`${user.customData.name}`}</Text>
        </View>
        <View>
          <TouchableOpacity
            disabled={loading}
            onPress={navigation.goBack}
            style={{
              marginVertical: 'auto',
            }}
            activeOpacity={0.8}>
            <FeatherIcon name="x" size={30} color={'#000'} />
          </TouchableOpacity>
        </View>
      </View>
      {/* screen */}
      <View
        style={{
          flexGrow: 1,
          padding: 10,
        }}>
        <ImageBackground
          source={{
            uri: selectedStory?.uri,
          }}
          resizeMode="contain"
          style={{
            backgroundColor: selectedStory ? 'black' : MD2Colors.grey200,
            flexGrow: 1,
            borderRadius: 15,
            overflow: 'hidden',
          }}>
          <TouchableOpacity
            onPress={handleStorySelect}
            activeOpacity={0.7}
            style={{
              alignSelf: 'center',
              marginVertical: 'auto',
              borderRadius: 20,
              borderWidth: 2,
              borderStyle: 'dashed',
              borderColor: MD2Colors.grey500,
              width: 150,
              backgroundColor: '#00000080',
              paddingVertical: 30,
              paddingHorizontal: 15,
            }}>
            {loading ? <ActivityIndicator style={{
              alignSelf: 'center',
              marginVertical: 'auto'
            }}/> :<React.Fragment>
              <FeatherIcon
                name={selectedStory ? 'rotate-cw' : 'plus'}
                size={30}
                color={'#ffffff'}
                style={{
                  alignSelf: 'center',
                }}
              />
              <Text
                style={{
                  color: 'white',
                  alignSelf: 'center',
                  marginTop: 10,
                  fontWeight: 'bold',
                }}>
                {selectedStory ? `Replace story` : `Add new story`}
              </Text>
            </React.Fragment>}
          </TouchableOpacity>
        </ImageBackground>
        {/* caption input */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 10,
            backgroundColor: 'white',
          }}>
          <View
            style={{
              flex: 1,
            }}>
            <TextInput
              disabled={loading}
              value={caption}
              onChangeText={setCaption}
              mode="outlined"
              blurOnSubmit={false}
              autoFocus={false}
              onEndEditing={handleStoryUpload}
              returnKeyType="send"
              placeholder="Type message..."
              textColor="#737373"
              cursorColor="#000"
              outlineStyle={{
                borderRadius: 50,
              }}
              contentStyle={{
                backgroundColor: MD2Colors.grey200,
                fontSize: 20,
                borderRadius: 50,
                paddingHorizontal: 20,
              }}
              style={{
                width: '100%',
                height: 50,
                marginVertical: 'auto',
              }}
            />
          </View>
          <IconButton
            loading={loading}
            onPress={handleStoryUpload}
            size={30}
            icon="send"
          />
        </View>
      </View>
    </View>
  );
}
