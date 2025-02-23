const stringToColor = (str: string) => {
  let hash = 0;

  for (let i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  const BRIGHTNESS_LIMIT = 180;

  for (let i = 0; i < 3; i += 1) {
    let value = (hash >> (i * 8)) & 0xff;
    value = Math.min(value, BRIGHTNESS_LIMIT);
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
};

export default stringToColor;
