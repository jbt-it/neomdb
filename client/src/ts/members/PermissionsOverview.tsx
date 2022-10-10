/**
 * The PermissionsOverview-Component displays all members in a table and displays options for filtering and sorting the members
 */

import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  Paper,
  Grid,
  createStyles,
  Theme,
  makeStyles,
  Typography,
  Divider,
  Box,
  TextField,
  Chip,
} from "@material-ui/core";
import api from "../utils/api";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { AuthContext } from "../global/AuthContext";
import CustomSnackbar from "../global/CustomSnackbar";

/**
 * Interface of route get permissions-of-members
 */
interface MemberPermissions {
  name: string;
  permission: number;
  canDelegate: number;
  memberID: number;
}

/**
 * Interface of route get permissions
 */
interface Permissions {
  bezeichnung: string;
  beschreibung: string;
  berechtigungID: number;
}

/**
 * Interface used for autocomplete
 */
interface AllNames {
  name: string;
  memberID: number;
}

/**
 * Function which proivdes the styles of the PermissionsOverview
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paperRoot: {
      padding: theme.spacing(2),
      display: "inline-block",
      maxWidth: "1000px",
    },
    paperRollen: {
      marginTop: "5%",
      padding: theme.spacing(2),
      maxWidth: "1000px",
    },
    // Header text of a paper marking a section of a page
    paperHeaderText: {
      marginTop: theme.spacing(1),
    },
    // Header divider of a paper marking a section of a page
    paperHeaderDivider: {
      background: "#f6891f",
      height: "2px",
      borderRadius: 50,
    },
    lineDivider: {
      borderRadius: 50,
      margin: 1,
      background: "#aeb0b2",
    },
    contentContainer: {
      alignContent: "flex-end",
      alignItems: "center",
      padding: theme.spacing(2),
    },
    gridEntityPrimary: {
      color: "white",
      minWidth: "60px",
      display: "inline-flex",
      margin: 5,
      padding: 1,
      top: 3,
      right: 5,
    },
    gridEntityPrimaryRolls: {
      color: "white",
      display: "inline-flex",
      margin: 5,
      padding: 1,
      top: 3,
      right: 5,
    },
    gridEntitySecondary: {
      color: "white",
      display: "flex",
      margin: 1,
      padding: 3,
    },
    closeIcon: {
      color: "white",
    },
  })
);

/**
 * Implements Overview of permissions.
 */
const PermissionsOverview: React.FunctionComponent = () => {
  const classes = useStyles();
  const [memberPermissions, setMemberPermissions] = useState<MemberPermissions[]>([]);
  const [permissionsOverview, setPermissionsOverview] = useState<Permissions[]>([]);
  const [errorOpen, setErrorOpen] = useState<number>(0);
  const [errorSet, setErrorSet] = useState<number>(0);
  const [errorDelete, setErrorDelete] = useState<number>(0);
  const [successDelete, setSuccessDelete] = useState<number>(0);
  const [successSet, setSuccessSet] = useState<number>(0);
  const { auth } = useContext(AuthContext);
  let tmp: AllNames[] = [];

  /**
   * Handles the API call and cleans state thereafter
   */
  const getPermissions: VoidFunction = () => {
    console.log("Hole getPermissions");
    // Variable for checking, if the component is mounted
    let mounted = true;
    api
      .get("/users/permissions", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setPermissionsOverview(res.data);
          }
        }
      })
      .catch((error) => {
        setErrorOpen(errorOpen + 1);
        setErrorOpen(0);
      });
    // Clean-up function
    return () => {
      mounted = false;
    };
  };

  /**
   * Retrieves the permissions of all members
   */
  const getPermissionsOfMembers: VoidFunction = () => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api
      .get("/users/permissions-of-members", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setMemberPermissions(res.data);
          }
        }
      })
      .catch((error) => {
        setErrorOpen(errorOpen + 1);
        setErrorOpen(0);
      });
    // Clean-up function
    return () => {
      mounted = false;
    };
  };

  /**
   * Create a new relation between a member and a permission
   */
  const createPermission = (memberID: number, permissionID: number) => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api
      .post(
        "/users/permissions",
        { memberID, permissionID },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((res) => {
        if (res.status === 201) {
          if (mounted) {
            setSuccessSet(successSet + 1);
            setSuccessSet(0);
          }
        }
      })
      .catch((error) => {
        setErrorSet(errorSet + 1);
        setErrorSet(0);
      });
    // Clean-up function
    return () => {
      mounted = false;
    };
  };

  /**
   * Deletes a given permission
   */
  const deletePermission = (memberID: number, permissionID: number) => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api
      .delete("/users/permissions", {
        data: { memberID, permissionID },

        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setSuccessDelete(successDelete + 1);
            setSuccessDelete(0);
          }
        }
      })
      .catch((error) => {
        setErrorDelete(errorDelete + 1);
        setErrorDelete(0);
      });
    // Clean-up function
    return () => {
      mounted = false;
    };
  };

  /**
   * Check if clicked event added or removed entity from autocomplete
   */
  const handleOnChange = (newValue: AllNames[], details: any, permissionID: number) => {
    if (newValue[newValue.length - 1] === details.option) {
      createPermission(details.option.memberID, permissionID);
    } else {
      deletePermission(details.option.memberID, permissionID);
    }
  };

  /**
   * Retuns true if user can deligate permissionID else false
   */
  const checkDisable = (permissionID: number) => {
    return !(
      auth.permissions.filter((permission) => permission.permissionID === permissionID && permission.canDelegate)
        .length > 0
    );
  };

  useEffect(() => getPermissions(), []);
  useEffect(() => getPermissionsOfMembers(), []);
  useEffect(() => setSuccessSet(0), []);
  useEffect(() => setSuccessDelete(0), []);
  useEffect(() => setErrorOpen(0), []);
  useEffect(() => setErrorDelete(0), []);
  useEffect(() => setErrorSet(0), []);

  return (
    <div>
      <div className="content-page">
        <Box component="div" display="inline">
          <Paper className={classes.paperRoot}>
            <Grid container spacing={0}>
              <Grid item xs={12}>
                <Typography variant="h5" className={classes.paperHeaderText}>
                  Berechtigungen
                </Typography>
                <Divider className={classes.paperHeaderDivider} />
              </Grid>
              <Grid container spacing={0}>
                {permissionsOverview.map((permissions) => (
                  <Grid item container spacing={0} className={classes.contentContainer} key={permissions.bezeichnung}>
                    <Grid item xs={6}>
                      <Grid item xs={12}>
                        <Typography>{permissions.bezeichnung}</Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={0}>
                      {memberPermissions.map((memberP) => {
                        if (permissions.berechtigungID === memberP.permission) {
                          if (memberPermissions.map((entry) => memberP.permission === entry.permission).length > 0) {
                            tmp.push({
                              name: memberP.name,
                              memberID: memberP.memberID,
                            });
                          }
                        }
                      })}
                      {tmp.length >= 1 ? (
                        <Grid item xs>
                          <Autocomplete
                            multiple
                            disableClearable
                            filterSelectedOptions
                            id="tags-standard"
                            color="primary"
                            getOptionSelected={(option, value) => {
                              // Compare member ID of entities if not director else name
                              if (value.memberID !== -1) {
                                return option.memberID === value.memberID;
                              } else {
                                return option.name === value.name;
                              }
                            }}
                            options={
                              // Remove duplicated options
                              memberPermissions.filter(
                                (value, index, self) =>
                                  index ===
                                  self.findIndex((t) => t.memberID === value.memberID && t.name === value.name)
                              )
                            }
                            getOptionLabel={(options) => options.name}
                            defaultValue={tmp}
                            disabled={checkDisable(permissions.berechtigungID)}
                            onChange={(event, newValue, reason, details) => {
                              handleOnChange(newValue, details, permissions.berechtigungID);
                            }}
                            getOptionDisabled={(option) => option.memberID === -1}
                            renderTags={(tagValue, getTagProps) =>
                              tagValue.map((option, index) => (
                                <Chip
                                  label={option.name}
                                  {...getTagProps({ index })}
                                  disabled={checkDisable(permissions.berechtigungID) || option.memberID < 0}
                                />
                              ))
                            }
                            {...(tmp = [])}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="standard"
                                color="primary"
                                label=""
                                placeholder="Hinzufügen"
                              />
                            )}
                          />
                        </Grid>
                      ) : (
                        (tmp = [])
                      )}
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </div>
      {errorOpen ? (
        <CustomSnackbar
          snackbarMessage="Berechtigungen konnten nicht geladen werden."
          snackProps={{ variant: "error" }}
        />
      ) : null}
      {errorSet ? (
        <CustomSnackbar
          snackbarMessage="Berechtigung konnten nicht hinzugefügt werden."
          snackProps={{ variant: "error" }}
        />
      ) : null}
      {errorDelete ? (
        <CustomSnackbar
          snackbarMessage="Berechtigung konnten nicht hinzugefügt werden."
          snackProps={{ variant: "error" }}
        />
      ) : null}
      {successDelete ? (
        <CustomSnackbar
          snackbarMessage="Berechtigung wurde erfolgreich entzogen."
          snackProps={{ variant: "success" }}
        />
      ) : null}
      {successSet ? (
        <CustomSnackbar snackbarMessage="Berechtigung wurde erfolgreich erteilt." snackProps={{ variant: "success" }} />
      ) : null}
    </div>
  );
};
export default PermissionsOverview;
