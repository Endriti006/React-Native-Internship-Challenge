import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from '../store/store';

export function RootLayout() {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="user/[id]" />
        <Stack.Screen name="user/manage" options={{ presentation: 'modal', animation: 'fade' }} />
      </Stack>
      <StatusBar style="dark" />
    </Provider>
  );
}

export default RootLayout;
