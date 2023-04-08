import { initializeApp } from "firebase-admin/app";
import { credential } from "firebase-admin";
import { getMessaging } from "firebase-admin/messaging";
import type { Message } from "firebase-admin/lib/messaging/messaging-api";

const firebaseApp = initializeApp({
  credential: credential.cert(
    JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS)
  ),
});

const sendMessage = async (message: Message) => {
  const messaging = getMessaging();
  return messaging.send(message);
};

const subscribeToTopic = async (token: string, topic: string) => {
  const messaging = getMessaging(firebaseApp);
  return messaging.subscribeToTopic(token, topic);
};

const unsubscribeFromTopic = async (token: string, topic: string) => {
  const messaging = getMessaging(firebaseApp);
  return messaging.unsubscribeFromTopic(token, topic);
};

const FirebaseService = {
  sendMessage,
  subscribeToTopic,
  unsubscribeFromTopic
};

export default FirebaseService;