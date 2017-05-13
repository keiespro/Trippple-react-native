jest.mock('PushNotificationIOS')

const PushNotification = jest.genMockFromModule('react-native-push-notification');

module.exports = PushNotification;
