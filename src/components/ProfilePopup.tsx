import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import React from 'react';
import {BlurView} from '@react-native-community/blur';
import {Image} from '@rneui/base';
import {Button, Divider, Icon, MD2Colors} from 'react-native-paper';
import {profileStoryList} from '../utils/constants';
import {usePopup} from '../config/custom-providers/ProfileProvider';
import {useUser} from '@realm/react';
import FeatherIcon from 'react-native-vector-icons/Feather';
import ImageCropPicker from 'react-native-image-crop-picker';
import {colors} from '../utils/colors';
import {apiRequest} from '../utils/apiClient';
import { AdvancedImage } from 'cloudinary-react-native';
import { cloudinary } from '../config/cloudinary';
import { CloudinaryImage } from '@cloudinary/url-gen/index';

export default function ProfilePopup() {
  const {isVisible, hidePopup} = usePopup();

  const popupScale = React.useRef(new Animated.Value(0)).current;

  const user = useUser();

  const [profileImage, setProfileImage] = React.useState<CloudinaryImage>(cloudinary.image(`${user.customData?.avatar_id ?? 'samples/upscale-face-1'}`))

  React.useEffect(() => {
    if (isVisible) {
      Animated.timing(popupScale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(popupScale, {
        toValue: 700,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        hidePopup();
      });
    }
  }, [isVisible]);

  function handleAvatarUpdate() {
    try {
      ImageCropPicker.openPicker({
        mediaType: 'photo',
        compressImageQuality: 0.8,
      }).then(pickedImage => {
        ImageCropPicker.openCropper({
          path: pickedImage.path,
          mediaType: 'photo',
          width: 300,
          height: 300,
          cropping: true,
          compressImageQuality: 0.8,
          cropperCircleOverlay: true,
          cropperToolbarTitle: 'Crop your profile picture',
          cropperActiveWidgetColor: colors.primary,
          cropperStatusBarColor: '#000000',
          cropperToolbarColor: '#ffffff',
          cropperToolbarWidgetColor: colors.secondary,
        }).then(cropedImage => {
          const formData = new FormData();
          formData.append('avatar', {
            uri: cropedImage.path,
            type: cropedImage.mime, // e.g., 'image/jpeg'
            name: cropedImage.filename || 'photo.jpg',
          });

          apiRequest(
            '/user/avatar',
            formData,
            'PATCH',
            {
              'Content-Type': 'multipart/form-data',
            },
            {
              secure: true,
            },
          )
            .then(async apiResponse => {
              console.log('apiResponse', apiResponse);
              const {avatar_id} = await user.refreshCustomData();
              setProfileImage(cloudinary.image(`${avatar_id ?? 'samples/upscale-face-1'}`))
            })
            .catch(apiError => {
              console.error('apiError', apiError);
            });
        });
      });
    } catch (error) {
      console.error(error);
    }
  }
  if (!isVisible) {
    return null;
  }
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
      }}>
      <BlurView
        onTouchEndCapture={hidePopup}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 5,
          opacity: 0.5,
        }}
        blurType="dark"
        blurAmount={2}
      />
      <Animated.View
        style={[
          {
            minHeight: '70%',
            backgroundColor: 'white',
            borderRadius: 30,
            borderBottomEndRadius: 0,
            borderBottomStartRadius: 0,
            flexDirection: 'column',
            flex: 1,
            position: 'absolute',
            elevation: 0,
            bottom: 0,
            left: 5,
            right: 5,
            zIndex: 20,
          },
          {
            transform: [{translateY: popupScale}],
          },
        ]}>
        <View
          style={{
            padding: 5,
          }}>
          <View
            style={{
              alignItems: 'flex-end',
              margin: 20,
              marginBottom: 0,
            }}>
            <TouchableOpacity
              onPress={() => {
                Animated.timing(popupScale, {
                  toValue: 1000,
                  duration: 300,
                  useNativeDriver: true,
                }).start(() => {
                  hidePopup();
                });
              }}
              activeOpacity={0.8}>
              <Image
                style={{
                  width: 15,
                  height: 15,
                }}
                source={require('../assets/images/close.png')}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              alignItems: 'center',
              rowGap: 10,
              paddingVertical: 20,
            }}>
            <View
              style={{
                position: 'relative',
              }}>
              <AdvancedImage
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                }}
                cldImg={profileImage}
              />

              <TouchableOpacity
                onPress={handleAvatarUpdate}
                activeOpacity={0.7}
                style={{
                  marginLeft: 'auto',
                  position: 'absolute',
                  bottom: -3,
                  right: 0,
                }}>
                <FeatherIcon
                  name="edit"
                  size={20}
                  color={'#000'}
                  style={{
                    backgroundColor: MD2Colors.grey200,
                    borderRadius: 20,
                    padding: 5,
                  }}
                />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: 'black',
              }}>
              {`${user.customData.name}`}
            </Text>
            {user.customData.quote ? (
              <Text
                style={{
                  color: 'black',
                }}>
                {`${user.customData.quote}`}
              </Text>
            ) : null}
            <View
              style={{
                flexDirection: 'row',
              }}>
              {user.customData.location ? (
                <Button
                  labelStyle={{
                    color: 'black',
                    fontSize: 12,
                  }}
                  icon="map-marker">
                  Bekasi, indonesia
                </Button>
              ) : null}
              <Button
                labelStyle={{
                  color: 'black',
                  fontSize: 12,
                }}
                icon="dialpad">
                +{`${user.customData.phone_number}`}
              </Button>
            </View>
            <View
              style={{
                flexDirection: 'row',
                columnGap: 5,
              }}>
              <Button
                contentStyle={{
                  backgroundColor: 'black',
                }}
                labelStyle={{
                  color: 'white',
                }}
                icon="phone-outline">
                Audio
              </Button>
              <Button
                contentStyle={{
                  backgroundColor: 'black',
                }}
                labelStyle={{
                  color: 'white',
                }}
                icon="video-outline">
                Video
              </Button>
              <Button
                contentStyle={{
                  backgroundColor: MD2Colors.grey200,
                }}
                labelStyle={{
                  color: 'black',
                }}
                icon="magnify">
                Search
              </Button>
            </View>
          </View>
          <Divider />
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Button
                labelStyle={{
                  color: 'black',
                  fontSize: 14,
                  fontWeight: 'bold',
                }}>
                Story
              </Button>
              <Button
                onPress={() => {}}
                labelStyle={{
                  color: 'black',
                }}>
                View all story
              </Button>
            </View>
            <View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{
                  columnGap: 10,
                }}>
                {profileStoryList.map((story, idx) => (
                  <TouchableOpacity activeOpacity={0.7} key={story.id}>
                    <ImageBackground
                      source={{
                        uri: story.backgroundImage,
                      }}
                      style={{
                        backgroundColor: MD2Colors.grey200,
                        width: 130,
                        height: 200,
                        borderRadius: 20,
                        overflow: 'hidden',
                        position: 'relative',
                        marginHorizontal: 5,
                      }}>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={{
                          position: 'absolute',
                          bottom: 5,
                          left: 0,
                          color: 'white',
                          fontSize: 12,
                          paddingHorizontal: 10,
                          textShadowColor: '#000',
                        }}>
                        {story.label}
                      </Text>
                    </ImageBackground>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View
              style={{
                alignItems: 'flex-start',
                marginVertical: 10,
              }}>
              <Button
                labelStyle={{
                  color: 'black',
                  fontWeight: 'bold',
                }}>
                Preferences
              </Button>
            </View>
            <View>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                }}>
                <Icon size={20} source="image-outline" />
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: 'black',
                    marginHorizontal: 15,
                    marginRight: 'auto',
                  }}>
                  Media
                </Text>
                <Icon size={20} source="chevron-right" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
