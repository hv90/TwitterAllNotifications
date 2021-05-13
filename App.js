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
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";

export default function App() {
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

  const [tweets, setTweets] = useState([]);

  const signingKey = `${twitterPercentEncoder(
    env.RN_APP_CONSUMER_SECRET
  )}&${twitterPercentEncoder(env.USER_ACCESS_TOKEN_SECRET)}`;

  const url = "https://api.twitter.com/1.1/statuses/home_timeline.json";

  const oauth_signature = base64.stringify(
    hmacSha1(signatureBaseBuilder(oauth, "GET", url), signingKey)
  );

  oauth["oauth_signature"] = twitterPercentEncoder(oauth_signature);

  const headerString = headerStringBuilder(oauth);

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

  useEffect(() => {
    getter();
  }, []);

  return (
    <View style={styles.container}>
      {tweets.map((tweet) => (
        <>
          <Text>{`${tweet.source}: ${tweet.text}, ${tweet.created_at}`}</Text>
          <StatusBar style="auto" />
        </>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
