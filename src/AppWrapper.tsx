import React from 'react';
import App from './App';
import Auth from './components/Authentication';
import Loading from './components/Loading';

// providers
import {Provider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppProvider, RealmProvider, UserProvider} from '@realm/react';
import {MD3LightTheme, PaperProvider} from 'react-native-paper';

//schemas
import {
  ConversationSchema,
  MessageSchema,
} from './config/realm/schemas/ConversationSchema';
import {UserSchema} from './config/realm/schemas/UserSchema';
import {requestUserPermission} from './utils/firebaseUtils';

// configs
import {store} from './config/redux/store';
import {appId, baseUrl} from './config/atlas.config.json';
import {PopupProvider} from './config/custom-providers/ProfileProvider';
import {SocketProvider} from './config/socket.io/socket';
import Toast from 'react-native-toast-message';

export default function AppWrapper() {
  React.useEffect(() => {
    requestUserPermission();
  }, []);
  return (
    <SafeAreaProvider>
      <AppProvider id={appId} baseUrl={baseUrl}>
        <UserProvider fallback={Auth}>
          <RealmProvider
            path="default.realm"
            // @ts-ignore
            schema={[MessageSchema, UserSchema, ConversationSchema]}
            fallback={Loading}>
            <Provider store={store}>
              <PaperProvider
                theme={{
                  ...MD3LightTheme,
                  colors: {
                    ...MD3LightTheme.colors,
                    primary: '#70B358',
                    secondary: '#021526',
                    primaryContainer: '#B4E380',
                    onPrimaryContainer: '#5F9A4A',
                  },
                }}>
                <SocketProvider>
                  <PopupProvider>
                    <App />
                    <Toast position='top' bottomOffset={100} topOffset={100} visibilityTime={2000} />
                  </PopupProvider>
                </SocketProvider>
              </PaperProvider>
            </Provider>
          </RealmProvider>
        </UserProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
