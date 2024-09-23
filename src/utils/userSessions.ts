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
        console.log('@tokenFunctions[storeUserSession]: ', 'User session stored success.');
    } catch (error) {
        console.error('@tokenFunctions[storeUserSession]:', error);
    }
}

async function removeUserSession() {
    try {
        await EncryptedStorage.removeItem('user_session');
        console.log('@tokenFunctions[removeUserSession]:', 'User session removed success');
    } catch (error) {
        console.error('@tokenFunctions[removeUserSession]:', error);
    }
}

async function retrieveUserSession(logOut: Function) {
    try {
        const session = await EncryptedStorage.getItem('user_session');

        if (session !== null) {
            console.log('@tokenFunctions[retriveUserSession]:', 'User session retrived success');
            return JSON.parse(session);
        } else {
            console.log('@tokenFunctions[retriveUserSession]:', 'loging out...');
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
