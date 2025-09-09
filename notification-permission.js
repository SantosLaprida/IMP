import * as Notifications from "expo-notifications";
import { Platform, Linking } from "react-native";

const ANDROID_CHANNEL_ID = "weekly reminders";

export async function ensureAndroidChannel() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: "Weekly Reminders",
    importance: Notifications.AndroidImportance.MAX,
  });
}

export async function requestIfUndetermined() {
  await ensureAndroidChannel();
  const current = await Notifications.getPermissionsAsync();
  console.log('Permissions BEFORE request:', current);

  if (current.granted) return { granted: true, status: "granted" };
  if (current.status !== "undetermined") {
    return { granted: false, status: current.status };
  }

  const { status } = await Notifications.requestPermissionsAsync();
  console.log('Permissions AFTER request:', { status });
  return { granted: status === "granted", status };
}

export function openSystemSettings() {
  return Linking.openSettings?.();
}
