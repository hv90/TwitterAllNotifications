import { StatusBar } from "expo-status-bar";
import hmacSha1 from "crypto-js/hmac-sha1";
import base64 from "crypto-js/enc-base64";
import env from "./dev.env";
import axios from "axios";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  const signatureBaseBuilder = () => {
    const base_url = "https://api.twitter.com/1.1/";

    let stringParam = "";

    Object.entries(oauth)
      .sort()
      .map(([key, value]) => (stringParam += `${key}=${value}&`));

    stringParam = stringParam.slice(0, -1);

    return `POST&${encodeURIComponent(base_url)}&${encodeURIComponent(
      stringParam
    )}`;
  };

  const randomStringBuilder = (length, chars) => {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  };
  const randomString = randomStringBuilder(
    32,
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  );

  const headerStringBuilder = () => {
    let str = "Oauth ";
    Object.entries(oauth)
      .sort()
      .map(([key, value]) => (str += `${key}="${value}", `));

    return str.slice(0, -2);
  };

  const oauth = {
    oauth_token: env.USER_ACCESS_TOKEN,
    oauth_consumer_key: env.RN_APP_API_KEY,
    oauth_nonce: randomString,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: `${new Date().getTime()}`,
    oauth_version: "1.0",
  };

  const signingKey = `${encodeURIComponent(
    env.RN_APP_API_SECRET_KEY
  )}&${encodeURIComponent(env.USER_ACCESS_TOKEN_SECRET)}`;

  const oauth_signature = base64.stringify(
    hmacSha1(signatureBaseBuilder(), signingKey)
  );

  oauth["oauth_signature"] = oauth_signature;

  const headerString = headerStringBuilder();

  const api = axios.create({
    baseURL: "https://api.twitter.com/1.1/statuses",
    headers: { Authorization: headerString },
  });

  useEffect(() => {
    const getter = async () => {
      try {
        await fetch("https://api.twitter.com/1.1/statuses/user_timeline.json", {
          method: "get",
          headers: { Authorization: headerString },
        }).then((res) => console.log("hello: ", res));
        // api.get("/user_timeline").then((res) => window.alert(res));
      } catch {
        (e) => window.alert("not hello: ", e);
      }
    };

    getter();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
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
