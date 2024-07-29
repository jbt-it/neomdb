type EmailForm = {
  sender: string; // Absender
  recipient: string; // Empfänger
  subject: string; // Betreff
  body: string; // Text
  actions: EmailActions; // Aktionen
};

type EmailActions = {
  sendEmail: string; // E-Mail abschicken
  doNotSendEmail: string; // E-Mail nicht verschicken
  kvpButton: string; // KVP-Button
  reportError: string; // Fehler melden
};

const emailForm = {
  sender: "()", // Absender
  recipient: "JBT-List und JBT-Info", // Empfänger
  subject: "", // Betreff
  body: "", // Text
  actions: {
    sendEmail: "E-Mail abschicken", // E-Mail abschicken
    doNotSendEmail: "E-Mail nicht verschicken", // E-Mail nicht verschicken
    kvpButton: "KVP-Button", // KVP-Button
    reportError: "Fehler melden", // Fehler melden
  },
};
