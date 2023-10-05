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
