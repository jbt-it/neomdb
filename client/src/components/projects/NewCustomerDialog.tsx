import {
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import useProjects from "../../hooks/projects/useProjects";
import { IndustryDto, NewCompanyDto } from "../../types/projectTypes";
import useResponsive from "../../hooks/useResponsive";

interface NewCustomerDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (newCustomer: NewCompanyDto) => void;
}

/**
 * The NewCustomerDialog component displays a dialog to create a new customer
 * @param open - boolean to open the dialog
 * @param onClose - function to close the dialog
 * @param onSave - function to save the new customer
 * @returns the dialog to create a new customer
 */
const NewCustomerDialog = ({ open, onClose, onSave }: NewCustomerDialogProps) => {
  const { allIndustries } = useProjects();

  const [customerName, setCustomerName] = React.useState("");
  const [industry, setIndustry] = React.useState<IndustryDto | null>(null);
  const [shortDescription, setShortDescription] = React.useState("");
  const [street, setStreet] = React.useState("");
  const [postalCode, setPostalCode] = React.useState("");
  const [city, setCity] = React.useState("");
  const [addressAdditional, setAddressAdditional] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [importantInformation, setImportantInformation] = React.useState("");
  const [confidential, setConfidential] = React.useState(false);
  const [contactDesired, setContactDesired] = React.useState(true);

  const [customerNameError, setCustomerNameError] = React.useState(false);
  const [industryError, setIndustryError] = React.useState(false);

  const isMobile = useResponsive("down", "sm");

  // Reset all fields
  const resetStates = () => {
    setCustomerName("");
    setShortDescription("");
    setConfidential(false);
    setIndustry(null);
    setStreet("");
    setPostalCode("");
    setCity("");
    setAddressAdditional("");
    setUrl("");
    setContactDesired(true);
    setImportantInformation("");
    setCustomerNameError(false);
    setIndustryError(false);
  };

  // Check if all required fields are filled
  const checkInput = () => {
    let error = false;
    if (!customerName) {
      setCustomerNameError(true);
      error = true;
    } else {
      setCustomerNameError(false);
    }
    if (!industry) {
      setIndustryError(true);
      error = true;
    } else {
      setIndustryError(false);
    }
    return error;
  };

  // Save new customer and close dialog then reset all fields
  const handleSave = () => {
    if (checkInput()) return;

    onSave({
      name: customerName,
      industry: industry!,
      shortDescription: shortDescription,
      street: street,
      postalCode: postalCode,
      city: city,
      addressAdditional: addressAdditional,
      url: url,
      importantInformation: importantInformation,
      contactDesired: contactDesired,
      classified: confidential,
    });
    resetStates();
  };

  // Reset all fields and close dialog
  const handleCancel = () => {
    resetStates();
    onClose();
  };

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle variant="h5" color={"primary"} sx={{ paddingBottom: 1 }}>
        Neuer Kunde
      </DialogTitle>
      <Divider sx={{ width: "95%", marginX: "auto", borderColor: "#f6891f" }} />
      <DialogContent>
        <Grid container spacing={2}>
          <Grid container item xs={12} alignItems={"center"}>
            <Grid item xs={isMobile ? 12 : 4}>
              <Typography fontWeight={"bold"}>Name</Typography>
            </Grid>
            <Grid item xs={isMobile ? 12 : 8}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                error={customerNameError}
                helperText={customerNameError ? "Bitte gib einen Namen an." : ""}
              />
            </Grid>
          </Grid>
          <Grid container item xs={12} alignItems={"center"}>
            <Grid item xs={isMobile ? 12 : 4}>
              <Typography fontWeight={"bold"}>Branche</Typography>
            </Grid>
            <Grid item xs={isMobile ? 12 : 8}>
              <Autocomplete
                renderInput={(params) => (
                  <TextField
                    variant="outlined"
                    error={industryError}
                    helperText={industryError ? "Bitte wähle eine Branche aus." : ""}
                    {...params}
                  />
                )}
                options={allIndustries}
                getOptionLabel={(option) => option.description}
                value={industry}
                onChange={(event, newValue) => setIndustry(newValue)}
                size="small"
              />
            </Grid>
          </Grid>
          <Grid container item xs={12} alignItems={"center"}>
            <Grid item xs={isMobile ? 12 : 4}>
              <Typography fontWeight={"bold"}>Kurzbeschreibung</Typography>
            </Grid>
            <Grid item xs={isMobile ? 12 : 8}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                value={shortDescription}
                onChange={(event) => setShortDescription(event.target.value)}
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
          <Grid container item xs={12} alignItems={"center"}>
            <Grid item xs={isMobile ? 12 : 4}>
              <Typography fontWeight={"bold"}>Straße</Typography>
            </Grid>
            <Grid item xs={isMobile ? 12 : 8}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                value={street}
                onChange={(event) => setStreet(event.target.value)}
              />
            </Grid>
          </Grid>
          <Grid container item xs={12} alignItems={"center"}>
            <Grid item xs={isMobile ? 12 : 4}>
              <Typography fontWeight={"bold"}>Postleitzahl</Typography>
            </Grid>
            <Grid item xs={isMobile ? 12 : 8}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                value={postalCode}
                onChange={(event) => setPostalCode(event.target.value)}
              />
            </Grid>
          </Grid>
          <Grid container item xs={12} alignItems={"center"}>
            <Grid item xs={isMobile ? 12 : 4}>
              <Typography fontWeight={"bold"}>Ort</Typography>
            </Grid>
            <Grid item xs={isMobile ? 12 : 8}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                value={city}
                onChange={(event) => setCity(event.target.value)}
              />
            </Grid>
          </Grid>
          <Grid container item xs={12} alignItems={"center"}>
            <Grid item xs={isMobile ? 12 : 4}>
              <Typography fontWeight={"bold"}>Addresszusatz</Typography>
            </Grid>
            <Grid item xs={isMobile ? 12 : 8}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                value={addressAdditional}
                onChange={(event) => setAddressAdditional(event.target.value)}
              />
            </Grid>
          </Grid>
          <Grid container item xs={12} alignItems={"center"}>
            <Grid item xs={isMobile ? 12 : 4}>
              <Typography fontWeight={"bold"}>Website</Typography>
            </Grid>
            <Grid item xs={isMobile ? 12 : 8}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                value={url}
                onChange={(event) => setUrl(event.target.value)}
              />
            </Grid>
          </Grid>
          <Grid container item xs={12} alignItems={"center"}>
            <Grid item xs={isMobile ? 12 : 4}>
              <Typography fontWeight={"bold"}>Wichtige Informationen</Typography>
            </Grid>
            <Grid item xs={isMobile ? 12 : 8}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                value={importantInformation}
                onChange={(event) => setImportantInformation(event.target.value)}
              />
            </Grid>
          </Grid>
          <Grid container item xs={isMobile ? 12 : 6} alignItems={"center"}>
            <Grid item xs={10}>
              <Typography fontWeight={"bold"}>Geheim</Typography>
            </Grid>
            <Grid item xs={2}>
              <Checkbox checked={confidential} onChange={(event) => setConfidential(event.target.checked)} />
            </Grid>
          </Grid>
          <Grid container item xs={isMobile ? 12 : 6} alignItems={"center"}>
            <Grid item xs={10}>
              <Typography fontWeight={"bold"}>Kontakt erwünscht</Typography>
            </Grid>
            <Grid item xs={2}>
              <Checkbox checked={contactDesired} onChange={(event) => setContactDesired(event.target.checked)} />
            </Grid>
          </Grid>
        </Grid>
        <Divider sx={{ width: "100%", marginX: "auto", borderColor: "#f6891f", mt: 3 }} />
        <Stack direction={"row"} spacing={4} sx={{ mt: 3 }} justifyContent={"flex-end"}>
          <Button onClick={handleCancel} variant="outlined">
            Abbrechen
          </Button>
          <Button onClick={handleSave} variant="outlined">
            Speichern
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default NewCustomerDialog;
