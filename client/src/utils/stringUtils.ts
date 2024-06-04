export const replaceSpecialCharacters = (str: string) => {
  const characterMap: { [key: string]: string } = {
    ä: "ae",
    ö: "oe",
    ü: "ue",
    ß: "ss",
    á: "a",
    é: "e",
    // Add more mappings as needed
  };

  // Replace umlauts, accent marks, and special characters except "-"
  const replacedStr = str.replace(/[^a-zA-Z0-9-]/g, (match) => {
    if (match === "-") {
      return match; // Keep hyphen intact
    } else if (characterMap[match.toLowerCase()]) {
      return characterMap[match.toLowerCase()];
    }
    return "";
  });

  return replacedStr;
};

/**
 * Returns a color based on a string
 * @param string The string to get the color from
 * @returns The color
 */
export const stringToColor = (string: string) => {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
};

/**
 * Returns the first and last name initials of a name
 * @param name The name to get the initials from
 * @returns The initials of the name
 */
export const stringAvatar = (name: string, sx?: any) => {
  return {
    sx: {
      bgcolor: stringToColor(name),
      ...sx,
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
};
