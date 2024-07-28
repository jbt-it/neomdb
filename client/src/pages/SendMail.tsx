import React, { useState } from "react";
import FieldSection, { Field } from "../components/general/FieldSection";
import { Button, Typography, Stack } from "@mui/material";
import useResponsive from "../hooks/useResponsive";
import api from "../utils/api";

const SendMail: React.FunctionComponent = () => {
  const mobile = useResponsive("down", "md");
  const [sender, setSender] = useState("");
  const [reciever, setReciever] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  // To Do: errorState, Automatisches Ausfüllen vom Absender, einzelne Nutzer automatisch ergänzen, Mailiing Listen, Daten auf die seite mitgeben(absender, empfänger, content, betreff)
  const editFields: Array<Field> = [
    {
      label: "Absender",
      state: sender,
      width: "full",
      onChangeCallback: (event) => {
        setSender(event.target.value);
      },
      type: "Text",
    },
    {
      label: "Empfänger",
      state: reciever,
      width: "full",
      onChangeCallback: (event) => {
        setReciever(event.target.value);
      },
      type: "Text",
    },
    {
      label: "Betreff",
      state: subject,
      width: "full",
      onChangeCallback: (event) => {
        setSubject(event.target.value);
      },
      type: "Text",
    },
    {
      label: "Inhalt",
      state: content,
      width: "full",
      onChangeCallback: (event) => {
        setContent(event.target.value);
      },
      type: "TextBig",
      rows: 10,
    },
  ];

  const postMail = () => {
    if (reciever === "") {
      console.log("Error");
    }
    const data = { reciever, subject, content };
    // Patch request
    /*
    api
      .post("/mail", data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {});
    */
  };

  return (
    <div>
      <Typography variant="h3" component="h2">
        Mailing
      </Typography>
      <FieldSection fields={editFields} />
      <Stack spacing={2} direction={mobile ? "column" : "row"}>
        <Button variant="outlined">nicht senden</Button>
        <Button variant="contained" onClick={postMail}>
          senden
        </Button>
      </Stack>
    </div>
  );
};

export default SendMail;
