import React, { useRef } from "react";
import useResponsive from "../../hooks/useResponsive";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { FileUpload } from "@mui/icons-material";
import { useApplicationContext } from "../../context/ApplicationContext";

/**
 * The personal data step of the application form
 * @returns The personal data step
 */
const PersonalDataStep = () => {
  const isMobile = useResponsive("down", "md");
  const minBirthDate = dayjs().subtract(40, "year");
  const maxBirthDate = dayjs().subtract(17, "year");
  const { applicationState, updateApplicationState, applicationErrorState, updateApplicationErrorState } =
    useApplicationContext();
  /**
   * Reference to the file input element used to propagate the click event
   */
  const inputFileRef = useRef<HTMLInputElement>(null);

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
    updateApplicationErrorState("mobilePhone", !germanPhoneNumberRegex.test(value));
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
    if (value !== applicationState.confirmEmail) {
      updateApplicationErrorState("confirmEmail", true);
    } else {
      updateApplicationErrorState("confirmEmail", false);
    }

    // Validate the email format
    const isEmailValid = emailRegex.test(value);
    updateApplicationErrorState("email", !isEmailValid);
  };

  /**
   * Handles the confirm email change
   * @param event - The change event
   */
  const handleConfirmEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    updateApplicationState("confirmEmail", value);
    // check if email and confirm email match
    if (value !== applicationState.email) {
      updateApplicationErrorState("confirmEmail", true);
      return;
    }
    updateApplicationErrorState("confirmEmail", false);
  };

  /**
   * Handles the file change
   * @param event - The change event
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 20 * 1024 * 1024; // 20 MB

      if (!validTypes.includes(file.type)) {
        updateApplicationErrorState("picture", true);
        return;
      }

      if (file.size > maxSize) {
        updateApplicationErrorState("picture", true);
        return;
      }

      updateApplicationErrorState("picture", false);
      updateApplicationState("picture", file);
    }
  };

  return (
    <Stack direction={"column"} width={isMobile ? "100%" : "60%"} spacing={2}>
      <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
        <Typography fontWeight="bold" fontSize={18} flex={1}>
          Vorname:
        </Typography>
        <TextField
          variant="outlined"
          sx={{ flex: 2 }}
          size="small"
          required
          label="Vorname"
          value={applicationState.firstName}
          onChange={(e) => {
            updateApplicationState("firstName", e.target.value);
          }}
        />
      </Stack>
      <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
        <Typography fontWeight="bold" fontSize={18} flex={1}>
          Nachname:
        </Typography>
        <TextField
          variant="outlined"
          sx={{ flex: 2 }}
          size="small"
          required
          label="Nachname"
          value={applicationState.lastName}
          onChange={(e) => {
            updateApplicationState("lastName", e.target.value);
          }}
        />
      </Stack>
      <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
        <Typography fontWeight="bold" fontSize={18} flex={1}>
          Geschlecht:
        </Typography>
        <FormControl fullWidth sx={{ flex: 2 }} size="small">
          <InputLabel>Geschlecht *</InputLabel>
          <Select
            size="small"
            required
            label="Geschlecht"
            value={applicationState.gender}
            onChange={(e) => updateApplicationState("gender", e.target.value)}
          >
            <MenuItem value={"male"}>männlich</MenuItem>
            <MenuItem value={"female"}>weiblich</MenuItem>
            <MenuItem value={"divers"}>divers</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
        <Typography fontWeight="bold" fontSize={18} flex={1}>
          Geburtsdatum:
        </Typography>
        <DatePicker
          sx={{ flex: 2, width: "100%" }}
          slotProps={{
            textField: {
              variant: "outlined",
              size: "small",
              required: true,
              label: "Geburtsdatum",
            },
          }}
          minDate={minBirthDate}
          maxDate={maxBirthDate}
          value={applicationState.birthDate ? dayjs(applicationState.birthDate) : undefined}
          onChange={handleBirthDateChange}
        />
      </Stack>
      <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
        <Typography fontWeight="bold" fontSize={18} flex={1}>
          Handynummer:
        </Typography>
        <TextField
          variant="outlined"
          sx={{ flex: 2 }}
          size="small"
          required
          label="Handynummer"
          value={applicationState.mobilePhone}
          onChange={handlePhoneNumberChange}
          error={applicationErrorState.mobilePhone}
          helperText={applicationErrorState.mobilePhone ? "Bitte geben Sie eine gültige deutsche Handynummer ein." : ""}
        />
      </Stack>
      <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
        <Typography fontWeight="bold" fontSize={18} flex={1}>
          E-Mail-Adresse:
        </Typography>
        <TextField
          variant="outlined"
          sx={{ flex: 2 }}
          size="small"
          required
          label="E-Mail-Adresse"
          type="email"
          value={applicationState.email}
          onChange={handleEmailChange}
          error={applicationErrorState.email}
          helperText={applicationErrorState.email ? "Bitte geben Sie eine gültige E-Mail-Adresse ein." : ""}
        />
      </Stack>
      <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
        <Typography fontWeight="bold" fontSize={18} flex={1}>
          E-Mail-Adresse bestätigen:
        </Typography>
        <TextField
          variant="outlined"
          sx={{ flex: 2 }}
          size="small"
          required
          label="E-Mail-Adresse"
          type="email"
          value={applicationState.confirmEmail}
          onChange={handleConfirmEmailChange}
          error={applicationErrorState.confirmEmail}
          helperText={applicationErrorState.confirmEmail ? "Die E-Mail-Adressen stimmen nicht überein." : ""}
        />
      </Stack>
      <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
        <Typography fontWeight="bold" fontSize={18} flex={1}>
          Heimatanschrift:
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
      <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
        <Typography fontWeight="bold" fontSize={18} flex={1}>
          Studienanschrift:
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
      <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1} flex={1}>
        <Typography fontWeight="bold" fontSize={18} flex={1}>
          Bild:
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
