const encode_url = (counter) => {
  const baseString =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let hashString = "";

  while (counter > 0) {
    hashString += baseString.charAt(counter % 62);
    counter = parseInt(counter / 62);
  }
  return hashString;
};

export default encode_url;
