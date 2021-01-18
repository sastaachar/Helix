const timeElapsed = (time: number): string => {
  const days = Math.floor(time / (24 * 60 * 60 * 1000));
  time -= days * 24 * 60 * 60 * 1000;

  const hours = Math.floor(time / (60 * 60 * 1000));
  time -= hours * 60 * 60 * 1000;

  const mins = Math.floor(time / (60 * 1000));
  time -= mins * 60 * 1000;

  const secs = Math.floor(time / 1000);
  time -= secs * 1000;

  const mSecs = time;

  return `${days} d, ${hours} h, ${mins} m, ${secs} s, ${mSecs} ms`;
};

export { timeElapsed };
