import React, { useState, useContext, ChangeEvent } from "react";
import {
  useTheme,
  TextField,
  Grid,
  Typography,
  FormControlLabel,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Checkbox,
} from "@mui/material";
import { AuthContext } from "../context/auth-context/AuthContext";
import useMemberDetails from "../hooks/members/useMemberDetails";

const Compliance: React.FunctionComponent = () => {
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

  const [complianceMessage, setComplianceMessage] = useState<string>("");
  const { auth } = useContext(AuthContext);
  const { memberDetails } = useMemberDetails(auth.userID!);
  const [complianceMail, setComplianceMail] = useState<string>("");
  const [checkedAnonymous, setCheckedAnonymous] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState<string>("");

  const handleDialogClose = () => {
    setOpenDialog(false);
    setError("");
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setCheckedAnonymous(checked);
  };

  const handleSubmit = () => {
    if (complianceMessage.trim() === "") {
      setError("Bitte gebe eine Nachricht ein.");
      return;
    }
    const complianceContent = `
Absender: ${memberDetails?.firstname} ${memberDetails?.lastname}
Absenderadresse: ${memberDetails?.jbtEmail}
Anonym: ${checkedAnonymous}

Folgender Compliance-Verstoß liegt vor:
${complianceMessage}
    `;
    setComplianceMail(complianceContent);
    setOpenDialog(true);
  };

  return (
    <div>
      <Grid container spacing={2} sx={{ paddingTop: "30px" }}>
        <Grid item container alignItems="center" spacing={0} xs={12}>
          <Grid item sx={{ width: "80px" }}>
            <Typography variant="body1">Absender:</Typography>
          </Grid>
          <Grid item xs>
            <Typography>
              {memberDetails?.firstname} {memberDetails?.lastname}
            </Typography>
          </Grid>
        </Grid>
        <Grid item container alignItems="center" spacing={0} xs={12}>
          <Grid item sx={{ width: "140px" }}>
            <Typography variant="body1">Absenderadresse:</Typography>
          </Grid>
          <Grid item xs>
            <Typography>{memberDetails?.jbtEmail}</Typography>
          </Grid>
        </Grid>
        <Grid item container alignItems="center" spacing={2} xs={12}>
          <Grid item xs>
            <FormControlLabel
              control={<Checkbox checked={checkedAnonymous} onChange={handleChange} />}
              label="Anonym versenden"
            />
          </Grid>
        </Grid>
        <Grid item container alignItems="center" spacing={2} xs={12}>
          <Grid item xs>
            <Typography variant="body1">
              Bitte beschreibe den Compliance-Verstoß / dein Anliegen an die/den Compliance Beauftragte*n:
            </Typography>
          </Grid>
        </Grid>
        <Grid item container alignItems="center" spacing={2} xs={12}>
          <Grid item xs>
            <TextField
              variant="outlined"
              fullWidth
              multiline
              rows={8}
              value={complianceMessage}
              onChange={(e) => setComplianceMessage(e.target.value)}
              sx={{
                "& .MuiInputBase-input": {
                  padding: "8px 14px",
                },
              }}
            />
            {error && <Typography color="error">{error}</Typography>}
          </Grid>
        </Grid>
        <Grid item>
          <Button
            sx={styles.button}
            variant="contained"
            onClick={() => {
              handleSubmit();
            }}
          >
            Compliance-Beschwerde abschicken
          </Button>
        </Grid>
      </Grid>
      <Dialog open={openDialog} onClose={() => handleDialogClose()}>
        <DialogTitle>Bestätigung</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Folgende Mail wird gesendet:`}
            <div dangerouslySetInnerHTML={{ __html: complianceMail.replace(/\n/g, "<br />") }} />
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

export default Compliance;
