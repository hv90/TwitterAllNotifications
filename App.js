import { StatusBar } from "expo-status-bar";
import hmacSha1 from "crypto-js/hmac-sha1";
import base64 from "crypto-js/enc-base64";
import env from "./dev.env";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  const oauth = {
    status: encodeURIComponent("say hello, to all the apples on the ground"),
    oauth_token: encodeURIComponent(env.USER_ACCESS_TOKEN),
    oauth_consumer_key: encodeURIComponent(env.RN_APP_API_KEY),
  };

  const signingKey = `${encodeURIComponent(
    env.RN_APP_API_SECRET_KEY
  )}&${encodeURIComponent(env.USER_ACCESS_TOKEN_SECRET)}`;

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

  const signatureBase = signatureBaseBuilder();

  const signature = base64.stringify(hmacSha1(signatureBase, signingKey));

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
