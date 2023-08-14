import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Grid,
  IconButton,
  Typography,
  makeStyles,
  createStyles,
  Theme,
} from "@material-ui/core";
import { AddCircleOutline, Clear } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import React from "react";

/**
 * Function which provides the styles of the FormDialog
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogListItem: {
      display: "flex",
      alignContent: "center",
    },
    addListItemBtn: {
      display: "flex",
      alignContent: "center",
    },
    fullWidth: {
      width: "100%",
    },
  })
);

const Dashboard: React.FunctionComponent = () => {
  const FormDialog = () => {
    const options = ["Option 1", "Option 2"];
    const [value, setValue] = React.useState<string | null>(options[0]);
    const [inputValue, setInputValue] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    return (
      <div>
        <Button variant="contained" onClick={handleClickOpen}>
          Internes Projekt hinzufügen
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Informationen zum internen Projekt</DialogTitle>
          <DialogContent>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={1}>
                <Grid item xs={12} md={3}>
                  <p>Name:</p>
                </Grid>
                <Grid item xs={12} md={9}>
                  <TextField fullWidth id="name" variant="outlined" size="small" />
                </Grid>
                <Grid item xs={12} md={3}>
                  <p>Kürzel:</p>
                </Grid>
                <Grid item xs={12} md={9}>
                  <TextField fullWidth id="kuerzel" variant="outlined" size="small" />
                </Grid>
                <Grid item xs={12} md={3}>
                  <p>Traineegeneration:</p>
                </Grid>
                <Grid item xs={12} md={9}>
                  <TextField
                    fullWidth
                    disabled
                    id="traineegeneration"
                    variant="outlined"
                    size="small"
                    defaultValue="Sommersemester 2023"
                  />
                </Grid>
              </Grid>
            </Box>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Typography>Projektmitglieder:</Typography>
                </Grid>

                <Grid item container spacing={1} xs={11} sm={8} md={6} lg={10} className={classes.dialogListItem}>
                  <Grid item xs={5}>
                    <Autocomplete
                      value={value}
                      onChange={(event: any, newValue: string | null) => {
                        setValue(newValue);
                      }}
                      onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                      }}
                      id="members"
                      options={options}
                      className={classes.fullWidth}
                      renderInput={(params) => <TextField {...params} label="Name" variant="outlined" size="small" />}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton
                      aria-label="delete"
                      color="primary"
                      onClick={() => {
                        console.log("Delete");
                      }}
                    >
                      <Clear />
                    </IconButton>
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12} className={classes.addListItemBtn}>
                  <IconButton
                    aria-label="add"
                    color="primary"
                    //  disabled={languages.some((lang) => lang.wert === "" || lang.niveau === "")}
                    onClick={() => {
                      console.log("Add");
                    }}
                  >
                    <AddCircleOutline />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
            <p>QMs:</p>
            <Button variant="contained">QM hinzufügen</Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Abbrechen</Button>
            <Button onClick={handleClose}>Speichern</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };
  return (
    <div className="App">
      <div className="content-page">
        <h1>Dashboard</h1>
        <FormDialog />
      </div>
    </div>
  );
};

export default Dashboard;
