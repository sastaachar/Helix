const parseOptions = (msg: string): string[] => {
  const options = msg.split(" ");
  options.shift();
  return options;
};

export { parseOptions };
