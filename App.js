import { StatusBar } from "expo-status-bar";
import hmacSha1 from "crypto-js/hmac-sha1";
import base64 from "crypto-js/enc-base64";
import utf8 from "crypto-js/enc-utf8";
import env from "./dev.env";
import axios from "axios";
import {
  signatureBaseBuilder,
  randomStringBuilder,
  headerStringBuilder,
  twitterPercentEncoder,
} from "./helpers";
import { LocalNotification } from "./services/LocalPushController";
import React, { useRef, useEffect, useState } from "react";

import BackgroundTask from "react-native-background-task";

import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  ScrollView,
  AppState,
  NativeModules,
  NativeEventEmitter,
} from "react-native";

// ********************************* background-task
/* const { LockDetection } = NativeModules;
LockDetection.registerBroadcastReceiver();
const LockDetectionEmitter = new NativeEventEmitter(LockDetection);
 */

/* console.log(NativeModules); */

const randomString = base64.stringify(
  utf8.parse(
    randomStringBuilder(
      32,
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    )
  )
);

const oauth = {
  oauth_token: twitterPercentEncoder(env.USER_ACCESS_TOKEN),
  oauth_consumer_key: twitterPercentEncoder(env.RN_APP_CONSUMER_KEY),
  oauth_nonce: twitterPercentEncoder(randomString),
  oauth_signature_method: twitterPercentEncoder("HMAC-SHA1"),
  oauth_timestamp: `${Math.round(new Date().getTime() / 1000)}`,
  oauth_version: twitterPercentEncoder("1.0"),
};

const signingKey = `${twitterPercentEncoder(
  env.RN_APP_CONSUMER_SECRET
)}&${twitterPercentEncoder(env.USER_ACCESS_TOKEN_SECRET)}`;

const url = "https://api.twitter.com/1.1/statuses/home_timeline.json";

const oauth_signature = base64.stringify(
  hmacSha1(signatureBaseBuilder(oauth, "GET", url), signingKey)
);

oauth["oauth_signature"] = twitterPercentEncoder(oauth_signature);

const headerString = headerStringBuilder(oauth);

const secondPlanTask = async () => {
  AppState.addEventListener("change", _handleAppStateChange);
  /* LockDetectionEmitter.addEventListener( 
    'LockStatusChange',
    newStatus => {
      console.log('status: ', newStatus); 
    }
  ) */

  /* await axios
    .get(url, {
      headers: { authorization: headerString },
    })
    .then((res) => {
      res.data.forEach((tweet) => {
        LocalNotification(tweet.source, tweet.text, tweet.created_at);
      });
    })
    .catch(function (e) {
      console.log("error: ", e, headerString);
    }); */
};

/* BackgroundTask.define(async () => {
  secondPlanTask();
}); */

// ********************************************  App
export default function App() {
  const handleButtonPress = (userName, userProfile, text, createdAt) => {
    LocalNotification(userName, userProfile, text, createdAt);
  };

  /* 
  const { RNLockDetection } = NativeModules;
  RNLockDetection.registerBroadcastReceiver();
  const RNLockDetectionEmitter = new NativeEventEmitter(RNLockDetection); */

  /* const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
 */

  /*   const _handleAppStateChange = (nextAppState) => {
    if (
      appState?.current?.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log("AppState", appState.current);
  }; */

  const [tweets, setTweets] = useState([]);

  const getter = async () => {
    await axios
      .get(url, {
        headers: { authorization: headerString },
      })
      .then((res) => setTweets(res.data))
      .catch(function (e) {
        console.log("error: ", e, headerString);
      });
  };

  const Section = ({ children, title, rabo }) => (
    <View style={styles.sectionContainer} key={rabo}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionDescription}>{children}</Text>
    </View>
  );

  useEffect(() => {
    getter();
    // BackgroundTask.schedule();
    /* LockDetectionEmitter.addEventListener("LockStatusChange", (newStatus) => {
      console.log("status: ", newStatus);
    }); */
    /* AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    }; */
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
          <Text>This App works better when in background!</Text>
          {tweets &&
            tweets.map((tweet, index) => (
              <Section title={tweet.user.screen_name} key={index}>
                {`${tweet.text}, ${tweet.created_at}`}

                <Button
                  title="Hello, hello"
                  onPress={() => {
                    return handleButtonPress(
                      tweet.user.name,
                      tweet.user.profile_image_url_https,
                      tweet.text,
                      new Date(tweet.created_at).toLocaleString()
                    );
                  }}
                />
              </Section>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
  },
  highlight: {
    fontWeight: "700",
  },
});
