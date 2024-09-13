import React, { useState, useContext } from "react";
import {
  useTheme,
  TextField,
  Grid,
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { AuthContext } from "../context/auth-context/AuthContext";
import useMemberDetails from "../hooks/members/useMemberDetails";

const Kvp: React.FunctionComponent = () => {
  const theme = useTheme();

  /**
   * Function which proivdes the styles of the MembershipFee
   */
  const styles = {
    amountOfEntries: {
      marginBottom: "10px",
      padding: "7px",
      textAlign: "center",
      fontWeight: "bold",
    },
    filterContainer: {
      marginBottom: "10px",
    },
    filterElement: {
      [theme.breakpoints.up("md")]: {
        margin: "7px",
        width: "155px",
      },
      [theme.breakpoints.down("xl")]: {
        margin: "7px",
        width: "120px",
      },
      [theme.breakpoints.down("lg")]: {
        margin: "7px",
        width: "120px",
      },
    },
    statusFilter: {
      [theme.breakpoints.up("md")]: {
        margin: "7px",
        width: "165px",
      },
      [theme.breakpoints.down("xl")]: {
        margin: "7px",
        width: "100px",
      },
    },
    filterBtn: {
      [theme.breakpoints.up("md")]: {
        marginTop: "12px",
        marginBottom: "7px",
        marginRight: "5px",
        marginLeft: "50px",
      },
      [theme.breakpoints.down("xl")]: {
        marginTop: "15px",
        marginBottom: "7px",
        marginRight: "5px",
        marginLeft: "25px",
      },
    },
    button: {
      marginTop: "20px",
      marginBottom: "20px",
      border: "0",
      backgroundColor: theme.palette.primary.main,
      color: "white",
      "&:hover": {
        color: "black",
      },
    },
    sortElement: {
      margin: "7px",
      width: "205px",
    },
    tableContainer: {
      maxHeight: (window.screen.height - 75) * 0.8,
    },
    tableHeadCell: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
    tableHeadSortBtn: {
      display: "flex",
      alignItems: "center",
    },
    statusFilterMain: {
      display: "block",
      "@media screen and (max-width: 350px)": {
        display: "none",
      },
    },
    statusFilterAdditional: {
      display: "none",
      "@media screen and (max-width: 350px)": {
        display: "block",
      },
    },
    accountFilterMain: {
      "@media screen and (orientation:landscape)": {
        display: "block",
      },
      "@media screen and (orientation:portrait)": {
        display: "none",
      },
    },
    accountFilterAdditional: {
      "@media screen and (orientation:landscape)": {
        display: "none",
      },
      "@media screen and (orientation:portrait)": {
        display: "block",
      },
    },
  };

  const [radioState, setRadioState] = useState<string>("unwichtig");
  const [errorField, setErrorField] = useState<string>("");
  const [errorDescriptionField, setErrorDescriptionField] = useState<string>("");
  const [suggestionField, setSuggestionField] = useState<string>("");
  const { auth } = useContext(AuthContext);
  const { memberDetails } = useMemberDetails(auth.userID!);
  const [kvpMail, setKvpMail] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadioState((event.target as HTMLInputElement).value);
  };

  const handleSubmit = () => {
    const kvpContent = `
Absender: ${memberDetails?.firstname} ${memberDetails?.lastname}
Absenderadresse: ${memberDetails?.jbtEmail}

An folgender Stelle befindet sich ein Fehler:
${errorField}

Es handelt sich um den Fehler:
${errorDescriptionField}

Verbesserungsvorschlag:
${suggestionField}

Diesen Fehler bewerte ich als:
${radioState}
    `;
    setKvpMail(kvpContent);
  };

  return (
    <div>
      <Grid container spacing={2} sx={{ paddingTop: "50px" }}>
        <Grid item container alignItems="center" spacing={0} xs={12} sx={{ paddingBottom: "50px" }}>
          <Grid item sx={{ width: "80px" }}>
            <Typography variant="body1">Absender:</Typography>
          </Grid>
          <Grid item xs>
            <Typography>
              {memberDetails?.firstname} {memberDetails?.lastname}
            </Typography>
          </Grid>
          <Grid item sx={{ width: "140px" }}>
            <Typography variant="body1">Absenderadresse:</Typography>
          </Grid>
          <Grid item xs>
            <Typography>{memberDetails?.jbtEmail}</Typography>
          </Grid>
        </Grid>
        <Grid item container alignItems="center" spacing={2} xs={12}>
          <Grid item sx={{ width: "340px" }}>
            <Typography variant="body1">An folgender Stelle befindet sich ein Fehler:</Typography>
          </Grid>
          <Grid item xs>
            <TextField
              variant="outlined"
              fullWidth
              value={errorField}
              onChange={(e) => setErrorField(e.target.value)}
              sx={{
                "& .MuiInputBase-root": {
                  height: "36px",
                },
                "& .MuiInputBase-input": {
                  padding: "8px 14px",
                },
              }}
            />
          </Grid>
        </Grid>
        <Grid item container alignItems="center" spacing={2} xs={12}>
          <Grid item sx={{ width: "340px" }}>
            <Typography variant="body1">Es handelt sich um den Fehler:</Typography>
          </Grid>
          <Grid item xs>
            <TextField
              variant="outlined"
              fullWidth
              value={errorDescriptionField}
              onChange={(e) => setErrorDescriptionField(e.target.value)}
              sx={{
                "& .MuiInputBase-root": {
                  height: "36px",
                },
                "& .MuiInputBase-input": {
                  padding: "8px 14px",
                },
              }}
            />
          </Grid>
        </Grid>
        <Grid item container alignItems="center" spacing={2} xs={12}>
          <Grid item sx={{ width: "340px" }}>
            <Typography variant="body1">Verbesserungsvorschlag:</Typography>
          </Grid>
          <Grid item xs>
            <TextField
              variant="outlined"
              fullWidth
              value={suggestionField}
              onChange={(e) => setSuggestionField(e.target.value)}
              sx={{
                "& .MuiInputBase-root": {
                  height: "36px",
                },
                "& .MuiInputBase-input": {
                  padding: "8px 14px",
                },
              }}
            />
          </Grid>
        </Grid>
        <Grid item container alignItems="center" spacing={2} xs={12}>
          <Grid item sx={{ width: "340px" }}>
            <Typography variant="body1">Diesen Fehler bewerte ich als:</Typography>
          </Grid>
          <Grid item xs>
            <RadioGroup row value={radioState} onChange={handleRadioChange}>
              <FormControlLabel value="unwichtig" control={<Radio />} label="Unwichtig" />
              <FormControlLabel value="mittel" control={<Radio />} label="Mittel" />
              <FormControlLabel value="wichtig" control={<Radio />} label="Wichtig" />
            </RadioGroup>
          </Grid>
        </Grid>
        <Grid item>
          <Button
            sx={styles.button}
            variant="contained"
            onClick={() => {
              handleSubmit();
              setOpenDialog(true);
            }}
          >
            Kvp-Report abschicken
          </Button>
        </Grid>
      </Grid>
      <Dialog open={openDialog} onClose={() => handleDialogClose()}>
        <DialogTitle>Bestätigung</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Folgende Mail wird gesendet:`}
            <div dangerouslySetInnerHTML={{ __html: kvpMail.replace(/\n/g, "<br />") }} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose()} color="primary">
            Abbrechen
          </Button>
          <Button onClick={() => handleDialogClose()} color="primary">
            Bestätigen
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Kvp;
