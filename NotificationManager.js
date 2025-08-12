import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const KEY = 'WeeklyNotification';
const CHANNEL_ID = 'weekly';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function ensureWeeklyNotification() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Weekly Reminder',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return false;

  const existing = await AsyncStorage.getItem(KEY);
  if (!existing) {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Weekly Check-In',
        body: 'Players selection for this tournament finishes soon...',
      },
      trigger: { weekday: 4, hour: 15, minute: 0, repeats: true, channelId: CHANNEL_ID }
    });
    await AsyncStorage.setItem(KEY, id);
  }

  return true;
}
