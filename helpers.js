export const signatureBaseBuilder = (oauth, method, url) => {
  const base_url = url;

  let stringParam = "";

  Object.entries(oauth)
    .sort()
    .map(([key, value]) => (stringParam += `${key}=${value}&`));

  stringParam = stringParam.slice(0, -1);

  return `${method}&${twitterPercentEncoder(base_url)}&${twitterPercentEncoder(
    stringParam
  )}`;
};

export const randomStringBuilder = (length, chars) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

export const headerStringBuilder = (oauth) => {
  let str = "Oauth ";
  Object.entries(oauth)
    .sort()
    .map(([key, value]) => (str += `${key}="${value}", `));

  return str.slice(0, -2);
};

export const twitterPercentEncoder = (word) => {
  const index = {
    "!": "%21",
    "*": "%2a",
    "'": "%27",
    "(": "%28",
    ")": "%29",
  };

  let temp = encodeURIComponent(word);
  let temp2 = "";

  for (let i = 0; i < temp.length; i++) {
    if (index[temp[i]]) temp2 += index[temp[i]];
    else temp2 += temp[i];
  }
  return temp2;
};
