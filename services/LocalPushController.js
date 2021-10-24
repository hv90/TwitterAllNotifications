import PushNotification from "react-native-push-notification";

PushNotification.configure({
  // (required) Called when a remote or local notification is opened or received
  onNotification: function (notification) {
    console.log("LOCAL NOTIFICATION ==>", notification);
  },
  onAction: function (notification) {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION:", notification);

    // process the action
  },
  popInitialNotification: true,
  requestPermissions: true,
});

const lastTweets = [];

export const LocalNotification = (userName, userProfile, text, createdAt) => {
  const channel_id = "TUNChannel";

  lastTweetsData = {
    bigText: `${text} ${createdAt}`,
    subText: createdAt,
    title: userName,
    largeIconUrl: userProfile,
    message: text,
  };

  const data = {
    channelId: channel_id, // (required) channelId, if the channel doesn't exist, notification will not trigger.
    autoCancel: true,
    bigText: text,
    subText: createdAt,
    title: userName,
    largeIconUrl: userProfile,
    message: text,
    vibrate: true,
    vibration: 300,
    playSound: true,
    soundName: "default",
  };

  PushNotification.channelExists(channel_id, (exists) => {
    if (!exists) {
      /* console.log(`exists = ${exists}`); */
      PushNotification.createChannel(
        {
          channelId: channel_id, // (required)
          channelName: channel_id, // (required)
        },
        (created) => {
          /* console.log(`createChannel 1 returned '${created}'`); // (optional) callback returns whether the channel was created, false means it already existed. */
          PushNotification.channelExists(channel_id, (exists) => {
            /* console.log("after created 1, exists: ", exists); */
          });
          /* console.log(
            "delete returns... ",
            PushNotification.deleteChannel(channel_id)
          ); */
          PushNotification.channelExists(channel_id, (exists) => {
            /* console.log("after delete 1, exists: ", exists); */
          });
          PushNotification.createChannel(
            {
              channelId: channel_id, // (required)
              channelName: channel_id, // (required)
            },
            (created) => {
              /* console.log(`createChannel 2 returned '${created}'`); // (optional) callback returns whether the channel was created, false means it already existed. */
              PushNotification.localNotification(data);
            }
          );
        }
      );
    }
  });

  PushNotification.getDeliveredNotifications((notifications) => {
    lastTweets.push(lastTweetsData);
    /* console.log("length: ", notifications.length);
    console.log("tweets: ", lastTweets.length); */
    if (lastTweets.length > 47) {
      PushNotification.removeAllDeliveredNotifications();
      PushNotification.deleteChannel(channel_id);
      PushNotification.createChannel(
        {
          channelId: channel_id, // (required)
          channelName: channel_id, // (required)
        },
        (created) => {
          /* console.log(`createChannel 3 returned '${created}'`); */ // (optional) callback returns whether the channel was created, false means it already existed.
          PushNotification.localNotification(data);
        }
      );
    }
  });

  /*  if (lastTweets.length <= 47) {
    lastTweets.push({
      bigText: `${text} ${createdAt}`,
      subText: text,
      title: source,
      message: text,
    });

    PushNotification.localNotification({
      channelId: channel_id, // (required) channelId, if the channel doesn't exist, notification will not trigger.
      autoCancel: true,
      bigText: `${text} ${createdAt}`,
      subText: text,
      title: source,
      message: text,
      vibrate: true,
      vibration: 300,
      playSound: true,
      soundName: "default",
    });
  } else {
    lastTweets.length = 0;
    PushNotification.removeAllDeliveredNotifications();
    PushNotification.localNotification({
      channelId: channel_id, // (required) channelId, if the channel doesn't exist, notification will not trigger.
      autoCancel: true,
      bigText: `${text} ${createdAt}`,
      subText: text,
      title: source,
      message: text,
      vibrate: true,
      vibration: 300,
      playSound: true,
      soundName: "default",
    });
  } */
};
