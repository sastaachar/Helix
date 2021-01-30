const getFixedLen = (str: string, len = 50): string => {
  // check if str.len is more that len
  if (str.length <= len) {
    str.padEnd(len);
  } else {
    str = str.slice(0, len - 3).padEnd(len, ".");
  }

  return str;
};

export { getFixedLen };
