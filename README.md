
# QuickChat

QuickChat is a React Native application designed for seamless and instant messaging. It supports features like OTP authentication, real-time messaging, contact synchronization, and more.

## Features

- **OTP Authentication**: Secure login using OTP.
- **Real-time Messaging**: Instant messaging with real-time updates.
- **Contact Synchronization**: Sync contacts from your phone.
- **Push Notifications**: Receive notifications for new messages.
- **Profile Management**: Update and manage user profiles.
- **Media Support**: Send and receive images, videos, and documents.


## Folder Structure

QuickChat/
├── android/                # Android-specific code and configurations
├── ios/                    # iOS-specific code and configurations
├── src/                    # Main source code for the application
│   ├── assets/             # Static assets like images, fonts, etc.
│   ├── components/         # Reusable UI components
│   ├── config/             # Configuration files and custom providers
│   │   ├── redux/          # Redux store and hooks
│   │   └── firebase/       # Firebase configuration
│   ├── screens/            # Different screens of the application
│   │   ├── HomeScreen.tsx  # Home screen component
│   │   ├── ChatScreen.tsx  # Chat screen component
│   │   └── ...             # Other screens
│   ├── services/           # Services for API calls, notifications, etc.
│   ├── utils/              # Utility functions and constants
│   └── App.tsx             # Main App component
├── .gitignore              # Git ignore file
├── package.json            # NPM package configuration
├── README.md               # Project documentation
└── index.js                # Entry point for the application


## Installation

### Prerequisites

- Node.js (>= 18)
- React Native CLI
- Android Studio / Xcode (for iOS)

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/aditasharma-tech/QuickChat.git
   cd QuickChat
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following:

   ```env
   SERVER_URL=your_server_url
   MSG91_WIDGET_ID=your_msg91_widget_id
   MSG91_TOKEN_AUTH=your_msg91_token_auth
   ```

4. **Run the application:**

   For Android:

   ```bash
   npx react-native run-android
   ```

   For iOS:

   ```bash
   npx react-native run-ios
   ```

## Folder Structure

- **src**: Contains the main source code for the application.
  - **components**: Reusable UI components.
  - **config**: Configuration files and custom providers.
  - **screens**: Different screens of the application.
  - **utils**: Utility functions and constants.
- **android**: Android-specific code and configurations.
- **ios**: iOS-specific code and configurations.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.

# Saves

## Random Profile Image Url

```bash
https://i.pravatar.cc/150?u=uid
```

```bash
https://picsum.photos/200/300
```