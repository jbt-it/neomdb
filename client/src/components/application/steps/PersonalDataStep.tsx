import React, { useRef } from "react";
import useResponsive from "../../../hooks/useResponsive";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { FileUpload } from "@mui/icons-material";
import { useApplicationContext } from "../../../context/ApplicationContext";
import ApplicationTextInput from "../inputs/ApplicationTextInput";
import ApplicationDateInput from "../inputs/ApplicationDateInput";
import { convertToBase64 } from "../../../utils/imageUtils";

/**
 * The personal data step of the application form
 * @returns The personal data step
 */
const PersonalDataStep = () => {
  const isMobile = useResponsive("down", "md");
  const minBirthDate = dayjs().subtract(40, "year");
  const maxBirthDate = dayjs().subtract(17, "year");
  const {
    applicationState,
    updateApplicationState,
    applicationErrorState,
    updateApplicationErrorState,
    updateApplicationImage,
  } = useApplicationContext();
  /**
   * Reference to the file input element used to propagate the click event
   */
  const inputFileRef = useRef<HTMLInputElement>(null);

  const [imageName, setImageName] = React.useState<string | undefined>(undefined);

  /**
   * Handles the birth date change
   * @param date - The new birth date
   */
  const handleBirthDateChange = (date: Dayjs | null) => {
    updateApplicationState("birthDate", date?.toDate());
  };

  /**
   * Handles the phone number change
   * @param  event - The change event
   */
  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    updateApplicationState("mobilePhone", value);

    // Regex for German mobile phone number validation
    const germanPhoneNumberRegex = /^(?:\+49|0)[1][0-9]{7,10}$/;
    updateApplicationErrorState({ mobilePhone: !germanPhoneNumberRegex.test(value) });
  };

  /**
   * Handles the email change
   * @param event - The change event
   */
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Update the email state
    updateApplicationState("email", value);

    // Check if email and confirm email match
    const confirmEmailError = value !== applicationState.confirmEmail;
    const isEmailValid = emailRegex.test(value);

    updateApplicationErrorState({
      confirmEmail: confirmEmailError,
      email: !isEmailValid,
    });
  };

  /**
   * Handles the confirm email change
   * @param event - The change event
   */
  const handleConfirmEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    updateApplicationState("confirmEmail", value);

    // Check if email and confirm email match
    const confirmEmailError = value !== applicationState.email;
    updateApplicationErrorState({ confirmEmail: confirmEmailError });
  };

  /**
   * Handles the file change
   * @param event - The change event
   */
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const validTypes = ["image/jpeg", "image/png"];
      const maxSize = 20 * 1024 * 1024; // 20 MB

      let pictureError = false;

      if (!validTypes.includes(file.type) || file.size > maxSize) {
        pictureError = true;
      }

      updateApplicationErrorState({ picture: pictureError });

      if (!pictureError) {
        const mimeType = file.name.includes(".") ? file.name.split(".").pop() : undefined;
        if (mimeType) {
          const base64 = await convertToBase64(file);
          updateApplicationImage(mimeType, base64);
          updateApplicationState("picture", mimeType);
          setImageName(file.name);
        } else {
          updateApplicationErrorState({ picture: true });
        }
      }
    }
  };

  return (
    <Stack direction={"column"} width={"100%"} spacing={4}>
      <Stack spacing={1}>
        <Typography fontWeight={"bold"} fontSize={20}>
          Persönliche Daten
        </Typography>
        <ApplicationTextInput
          value={applicationState.firstName}
          label="Vorname"
          attributeName="firstName"
          onChange={(e) => {
            updateApplicationState("firstName", e.target.value);
          }}
          required
          error={applicationErrorState.firstName}
          helperText={applicationErrorState.firstName ? "Bitte gib deinen Vornamen ein." : ""}
        />
        <ApplicationTextInput
          value={applicationState.lastName}
          label="Nachname"
          attributeName="lastName"
          onChange={(e) => {
            updateApplicationState("lastName", e.target.value);
          }}
          required
          error={applicationErrorState.lastName}
          helperText={applicationErrorState.lastName ? "Bitte gib deinen Nachnamen ein." : ""}
        />
        <Stack direction={"column"} alignItems={isMobile ? "normal" : "center"}>
          <Typography
            fontWeight="bold"
            flex={1}
            width={"100%"}
            color={applicationErrorState.gender ? "error" : "#7d7d7d"}
          >
            <label>
              Geschlecht <span style={{ color: "red" }}>*</span>
            </label>
          </Typography>
          <FormControl fullWidth sx={{ flex: 2 }} size="small">
            <Select
              size="small"
              value={applicationState.gender}
              onChange={(e) => updateApplicationState("gender", e.target.value)}
              error={applicationErrorState.gender}
            >
              <MenuItem value={"male"}>männlich</MenuItem>
              <MenuItem value={"female"}>weiblich</MenuItem>
              <MenuItem value={"divers"}>divers</MenuItem>
            </Select>
            <FormHelperText error>
              {applicationErrorState.gender ? " Bitte wählen Sie ein Geschlecht aus." : ""}
            </FormHelperText>
          </FormControl>
        </Stack>
        <ApplicationDateInput
          label="Geburtsdatum"
          value={applicationState.birthDate}
          onChange={handleBirthDateChange}
          minDate={minBirthDate}
          maxDate={maxBirthDate}
          error={applicationErrorState.birthDate}
          required
          helperText={"Bitte gib dein Geburtsdatum an."}
        />
      </Stack>
      <Stack spacing={1}>
        <Typography fontWeight={"bold"} fontSize={20}>
          Kontaktdaten
        </Typography>
        <ApplicationTextInput
          value={applicationState.mobilePhone}
          label="Handynummer"
          attributeName="mobilePhone"
          onChange={handlePhoneNumberChange}
          error={applicationErrorState.mobilePhone}
          helperText={applicationErrorState.mobilePhone ? "Bitte gib eine gültige deutsche Handynummer ein." : ""}
          required
        />
        <ApplicationTextInput
          value={applicationState.email}
          label="E-Mail-Adresse"
          attributeName="email"
          onChange={handleEmailChange}
          error={applicationErrorState.email}
          helperText={applicationErrorState.email ? "Bitte gib eine gültige E-Mail-Adresse ein." : ""}
          required
        />
        <ApplicationTextInput
          value={applicationState.confirmEmail}
          label="E-Mail-Adresse bestätigen"
          attributeName="confirmEmail"
          onChange={handleConfirmEmailChange}
          error={applicationErrorState.confirmEmail}
          helperText={applicationErrorState.confirmEmail ? "Die E-Mail-Adressen stimmen nicht überein." : ""}
          required
        />
      </Stack>
      <Stack spacing={1}>
        <Typography fontWeight={"bold"} fontSize={20}>
          Adresse
        </Typography>
        <Stack spacing={1}>
          <Typography fontWeight="bold" flex={1} color={"#7d7d7d"}>
            Heimatanschrift
          </Typography>
          <Stack direction={"column"} sx={{ flex: 2 }} spacing={1}>
            <Stack direction={"row"} spacing={2}>
              <TextField
                variant="outlined"
                sx={{ flex: isMobile ? 2 : 5 }}
                size="small"
                label="Straße"
                value={applicationState.homeAddressStreet}
                onChange={(e) => {
                  updateApplicationState("homeAddressStreet", e.target.value);
                }}
              />
              <TextField
                variant="outlined"
                sx={{ flex: 1 }}
                size="small"
                label="Nr."
                type="number"
                inputProps={{ min: 1 }}
                value={applicationState.homeAddressNumber}
                onChange={(e) => {
                  updateApplicationState("homeAddressNumber", e.target.value);
                }}
              />
            </Stack>
            <Stack direction={"row"} spacing={2}>
              <TextField
                variant="outlined"
                sx={{ flex: 2 }}
                size="small"
                label="PLZ"
                type="number"
                inputProps={{ min: 1 }}
                value={applicationState.homeAddressPostalCode}
                onChange={(e) => {
                  updateApplicationState("homeAddressPostalCode", e.target.value);
                }}
              />
              <TextField variant="outlined" sx={{ flex: 4 }} size="small" label="Ort" />
            </Stack>
          </Stack>
        </Stack>
        <Stack spacing={1}>
          <Typography fontWeight="bold" color={"#7d7d7d"} flex={1}>
            Studienanschrift
          </Typography>
          <Stack direction={"column"} sx={{ flex: 2 }} spacing={1}>
            <Stack direction={"row"} spacing={2}>
              <TextField
                variant="outlined"
                sx={{ flex: isMobile ? 2 : 5 }}
                size="small"
                label="Straße"
                value={applicationState.studyAddressStreet}
                onChange={(e) => {
                  updateApplicationState("studyAddressStreet", e.target.value);
                }}
              />
              <TextField
                variant="outlined"
                sx={{ flex: 1 }}
                size="small"
                label="Nr."
                type="number"
                inputProps={{ min: 1 }}
                value={applicationState.studyAddressNumber}
                onChange={(e) => {
                  updateApplicationState("studyAddressNumber", e.target.value);
                }}
              />
            </Stack>
            <Stack direction={"row"} spacing={2}>
              <TextField
                variant="outlined"
                sx={{ flex: 2 }}
                size="small"
                label="PLZ"
                type="number"
                inputProps={{ min: 1 }}
              />
              <TextField
                variant="outlined"
                sx={{ flex: 4 }}
                size="small"
                label="Ort"
                value={applicationState.studyAddressCity}
                onChange={(e) => {
                  updateApplicationState("studyAddressCity", e.target.value);
                }}
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Stack direction={"column"} spacing={1} flex={1}>
        <Typography fontWeight="bold" fontSize={20} flex={1}>
          Bild
        </Typography>
        <Box flex={2}>
          <input
            ref={inputFileRef}
            type="file"
            accept="image/*"
            id="file-upload"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload">
            <Button
              variant="contained"
              component="span"
              size="small"
              fullWidth={isMobile ? true : false}
              sx={{
                padding: 1,
                backgroundColor: "primary.main",
                color: "white",
                borderRadius: 1,
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
                fontWeight: "bold",
              }}
            >
              <FileUpload sx={{ mr: 2 }} />
              Bild hochladen *
            </Button>
          </label>
          <Typography>{imageName}</Typography>
          {applicationErrorState.picture && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {applicationErrorState.picture
                ? "Bitte laden Sie ein Bild im Format .jpg oder .png hoch mit maximal 20 MB."
                : ""}
            </Typography>
          )}
        </Box>
      </Stack>
    </Stack>
  );
};

export default PersonalDataStep;
