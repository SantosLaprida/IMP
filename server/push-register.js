import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { firestore } from "./config/firebaseConfig";

export async function registerPushTokenForUser(userId) {
  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  if (!projectId) {
    throw new Error(
      "Missing EAS projectId — check your app.json/app.config.js"
    );
  }

  const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync({
    projectId,
  });

  await setDoc(
    doc(db, "I_Members", userId),
    {
      expoPushToken,
      notificationPermissionStatus: "granted",
      notificationGrantedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  return expoPushToken;
}

export async function handleNotificationDenial(userId) {
  const userDoc = await getDoc(doc(firestore, "I_Members", userId));
  const hasBeenPrompted =
    userDoc.exists() && userDoc.data()?.hasBeenPromptedForNotifications;

  if (!hasBeenPrompted) {
    await setDoc(
      doc(firestore, "I_Members", userId),
      {
        hasBeenPromptedForNotifications: true,
        notificationPermissionStatus: "denied",
        notificationDeniedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  }
  return false;
}
