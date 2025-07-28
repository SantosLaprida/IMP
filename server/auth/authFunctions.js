import {
  collection,
  deleteDoc,
  updateDoc,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  getDoc,
  addDoc,
  getFirestore,
} from "firebase/firestore";
import { auth, db, firestore } from "../config/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  deleteUser,
} from "firebase/auth";

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User logged in:", userCredential.user);

    const uid = userCredential.user.uid;
    const userRef = doc(firestore, "I_Members", uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      console.log("User data:", userDoc.data());
      return { ...userCredential.user, ...userDoc.data() };
    } else {
      console.log("No such user document!");
      return userCredential.user;
    }
  } catch (error) {
    console.error("Error logging in user:", error.code, error.message);
    throw error;
  }
};

export const registerUser = async (
  email,
  password,
  firstName,
  lastName,
  username
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User registered:", userCredential.user);

    // Store additional user data in Firestore
    const uid = userCredential.user.uid;
    const userRef = doc(firestore, "I_Members", uid);
    await setDoc(userRef, {
      email: email,
      firstName: firstName,
      lastName: lastName,
      username: username,
    });

    return userCredential.user;
  } catch (error) {
    console.error("Error registering user:", error.code, error.message);
    throw error;
  }
};

export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent!");
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully.");
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export const deleteAccount = async () => {
  const user = auth.currentUser;

  if (!user) {
    console.error("No user is currently signed in.");
    return;
  }

  try {
    // Delete user data from Firestore
    const userRef = doc(firestore, "I_Members", user.uid);
    await deleteDoc(userRef);
    console.log("User data deleted from Firestore.");

    // Delete user from Firebase Auth
    await deleteUser(user);
    console.log("User account deleted from Firebase Auth.");
  } catch (error) {
    console.error("Error deleting account:", error.code, error.message);

    // Special handling: if the user's credential is too old
    if (error.code === "auth/requires-recent-login") {
      alert("Please log in again to delete your account.");
    }

    throw error;
  }
};

export const checkNotifiactionToggle = async (userId) => {
  try {
    const userRef = doc(firestore, "I_Members", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const data = userDoc.data();

      if (data.emailNotifications === undefined) {
        await updateDoc(userRef, { emailNotifications: false });
        return false;
      }
      return data.emailNotifications;
    } else {
      console.log("No such user document!");
      return false;
    }
  } catch (error) {
    console.error("Error checking notification toggle:", error);
  }
  return false;
};

export const updateEmailNotificationPreference = async (userId, newValue) => {
  try {
    const userRef = doc(firestore, "I_Members", userId);
    await updateDoc(userRef, { emailNotifications: newValue });
    console.log("Email notification preference updated:", newValue);
  } catch (error) {
    console.error("Error updating email notification preference:", error);
  }
};
