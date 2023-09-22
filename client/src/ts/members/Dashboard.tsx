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
import React, { useState } from "react";

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

interface UserOption {
  id: number;
  name: string;
}
//TODO: This array consists of dummy data. It needs to be changed once backend connection is established
//For the "users" trainees need to be retrieved
//For the "qms" active members need to be retrieved
const options: UserOption[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
  { id: 4, name: "Shitting Toothpaste" },
];

const Dashboard: React.FunctionComponent = () => {
  const FormDialog = () => {
    const [value, setValue] = React.useState<UserOption | null>(options[0]);
    const [inputValue, setInputValue] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [users, setUsers] = useState<UserOption[]>([]);
    const [qms, setQMs] = useState<UserOption[]>([]);
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
                {/* TODO: Once a backend connection is established, this text field needs to show the current Traineegeneration*/}
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

                <Grid container spacing={1}>
                  {users.map((user, index) => (
                    <Grid
                      item
                      container
                      spacing={1}
                      xs={11}
                      sm={8}
                      md={6}
                      lg={10}
                      className={classes.dialogListItem}
                      key={index}
                    >
                      <Grid item xs={5}>
                        <Autocomplete
                          value={user}
                          onChange={(event, newValue: UserOption | null) => {
                            if (newValue) {
                              const newUsers = [...users];
                              newUsers[index] = newValue;
                              setUsers(newUsers);
                            }
                          }}
                          id={`members-${index}`}
                          options={options.filter((option) => !users.includes(option))}
                          getOptionLabel={(option: UserOption) => option.name}
                          className={classes.fullWidth}
                          renderInput={(params) => (
                            <TextField {...params} label="Name" variant="outlined" size="small" />
                          )}
                        />
                      </Grid>

                      <Grid item xs={2}>
                        <IconButton
                          aria-label="delete"
                          color="primary"
                          onClick={() => {
                            const newUsers = [...users];
                            newUsers.splice(index, 1);
                            setUsers(newUsers);
                          }}
                        >
                          <Clear />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}

                  <Grid item xs={12} sm={12} md={12} lg={12} className={classes.addListItemBtn}>
                    <IconButton
                      aria-label="add"
                      color="primary"
                      disabled={users.some((user) => user.name === "")}
                      onClick={() => {
                        setUsers((prev) => [...prev, { id: 0, name: "" }]);
                      }}
                    >
                      <AddCircleOutline />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Typography>QMs:</Typography>
                </Grid>

                <Grid container spacing={1}>
                  {qms.map((qm, index) => (
                    <Grid
                      item
                      container
                      spacing={1}
                      xs={11}
                      sm={8}
                      md={6}
                      lg={10}
                      className={classes.dialogListItem}
                      key={index}
                    >
                      <Grid item xs={5}>
                        <Autocomplete
                          value={qm}
                          onChange={(event, newValue: UserOption | null) => {
                            if (newValue) {
                              const newQMs = [...qms];
                              newQMs[index] = newValue;
                              setQMs(newQMs);
                            }
                          }}
                          id={`members-${index}`}
                          options={options.filter((option) => !qms.includes(option))}
                          getOptionLabel={(option: UserOption) => option.name}
                          className={classes.fullWidth}
                          renderInput={(params) => (
                            <TextField {...params} label="Name" variant="outlined" size="small" />
                          )}
                        />
                      </Grid>

                      <Grid item xs={2}>
                        <IconButton
                          aria-label="delete"
                          color="primary"
                          onClick={() => {
                            const newQMs = [...qms];
                            newQMs.splice(index, 1);
                            setQMs(newQMs);
                          }}
                        >
                          <Clear />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}

                  <Grid item xs={12} sm={12} md={12} lg={12} className={classes.addListItemBtn}>
                    <IconButton
                      aria-label="add"
                      color="primary"
                      disabled={qms.some((qm) => qm.name === "")}
                      onClick={() => {
                        setQMs((prev) => [...prev, { id: 0, name: "" }]);
                      }}
                    >
                      <AddCircleOutline />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Abbrechen</Button>
            {/* TODO: Once a backend connection is established, this button needs to save the IP data into the according page*/}
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
