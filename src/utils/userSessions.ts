import EncryptedStorage from 'react-native-encrypted-storage';

async function storeUserSession(ACCESS_TOKEN: string, PHONE_NUMBER: string) {
    try {
        await EncryptedStorage.setItem(
            'user_session',
            JSON.stringify({
                token: ACCESS_TOKEN,
                phoneNumber: PHONE_NUMBER,
            })
        );
    } catch (error) {
        console.error('@tokenFunctions[storeUserSession]:', error);
    }
}

async function removeUserSession() {
    try {
        await EncryptedStorage.removeItem('user_session');
    } catch (error) {
        console.error('@tokenFunctions[removeUserSession]:', error);
    }
}

async function retrieveUserSession(logOut: Function) {
    try {
        const session = await EncryptedStorage.getItem('user_session');

        if (session !== null) {
            return JSON.parse(session);
        } else {
            await logOut();
        }
    } catch (error) {
        console.error('@tokenFunctions[retriveUserSession]:', error);
    }
}

export {
    storeUserSession,
    removeUserSession,
    retrieveUserSession,
};
