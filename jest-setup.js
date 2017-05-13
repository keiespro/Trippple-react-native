jest
  .mock('Geolocation')
  .mock('Settings')
  .mock('PushNotificationIOS')
  .mock('DrawerLayoutAndroid')
  .mock('./app/utils/api');

  jest.mock('Linking', () => {
    return {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      openURL: jest.fn(),
      canOpenURL: jest.fn(),
      getInitialURL: jest.fn(),
    }
  });

  jest.mock('NetInfo', () => {
    return {
      addEventListener: jest.fn(),
      isConnected: {
        addEventListener: jest.fn(),
        fetch: () => {
          return new Promise((accept, resolve) => {
            accept(true);
          })
        }
      },
      fetch: () => {
        return new Promise((accept, resolve) => {
          accept(true);
        })
      }
    }
  });
