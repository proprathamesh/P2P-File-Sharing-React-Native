import Toast from 'react-native-toast-message';

export const toastShow = (type: 'success' | 'error' | 'info', text1: string, text2: string = ''): void => {
  Toast.show({
    type,
    text1,
    text2,
  });
};

export const toastHide = (): void => {
  Toast.hide();
};
