/**
 * The PermissionsOverview-Component displays all members in a table and displays options for filtering and sorting the members
 */

import React, { useState, useEffect, useContext } from "react";
import { Paper, Grid, Theme, Typography, Divider, Box, TextField, Chip } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import api from "../../utils/api";
import Autocomplete, { AutocompleteChangeDetails } from "@mui/material/Autocomplete";
import { AuthContext } from "../../context/auth-context/AuthContext";
import { showErrorMessage, showSuccessMessage } from "../../utils/toastUtils";
import { doesPermissionsHaveSomeOf } from "../../utils/authUtils";
import { Member } from "../../types/membersTypes";

// TODO: Change interfaces to types and move to types folder

/**
 * Interface of route get permission-assignments
 */
interface MemberAssignments {
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
interface AutocompleteValue {
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
  const [permissions, setPermissions] = useState<Permissions[]>([]);
  const [permissionAssignments, setPermissionAssignments] = useState<MemberAssignments[]>([]);
  const [directorPositionsForAutocomplete, setDirectorPositionsForAutocomplete] = useState<AutocompleteValue[]>([]); // State for the director positions -> TODO: Change to directorPosition type?
  const [autocompleteValues, setAutocompleteValues] = useState<AutocompleteValue[]>([]); // State for the values of the autocomplete
  const [membersForAutocomplete, setMembersForAutocomplete] = useState<AutocompleteValue[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false); // State for checking if the user is admin
  const { auth } = useContext(AuthContext);
  let tmp: AutocompleteValue[] = [];

  /**
   * Handles the API call and cleans state thereafter
   */
  const getPermissions: VoidFunction = () => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api
      .get("/members/permissions", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setPermissions(res.data);
          }
        }
      })
      .catch(() => {
        showErrorMessage("Berechtigungen konnten nicht geladen werden");
      });
    // Clean-up function
    return () => {
      mounted = false;
    };
  };

  /**
   * Retrieves all members
   */
  const getMembers: VoidFunction = () => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api
      .get("/members", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            const tmpMembers: AutocompleteValue[] = res.data.map((member: Member) => ({
              name: member.vorname + " " + member.nachname,
              memberID: member.mitgliedID,
            }));
            setMembersForAutocomplete(tmpMembers);
          }
        }
      })
      .catch(() => {
        showErrorMessage("Mitglieder konnten nicht geladen werden");
      });
    // Clean-up function
    return () => {
      mounted = false;
    };
  };

  /**
   * Retrieves the director positions
   */
  const getDirectorPositions: VoidFunction = () => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    setDirectorPositionsForAutocomplete([
      { name: "RL IT", memberID: -1 },
      { name: "RL MAR", memberID: -1 },
    ]);
    // TODO: Wait until route is implemented
    api
      .get("/members/director-positions", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            // TODO: setDirectorPositionsForAutocomplete(res.data);
          }
        }
      })
      .catch(() => {
        showErrorMessage("Vorstände konnten nicht geladen werden");
      });
    // Clean-up function
    return () => {
      mounted = false;
    };
  };

  /**
   * Retrieves the permissions of all members
   */
  const getPermissionAssignments: VoidFunction = () => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api
      .get("/members/permission-assignments", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setPermissionAssignments(res.data);
          }
        }
      })
      .catch(() => {
        showErrorMessage("Berechtigungen konnten nicht geladen werden");
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
        "/members/permissions",
        { memberID, permissionID },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((res) => {
        if (res.status === 201) {
          if (mounted) {
            showSuccessMessage("Berechtigung wurde erfolgreich erteilt");
          }
        }
      })
      .catch(() => {
        showErrorMessage("Berechtigung konnte nicht erteilt werden");
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
      .delete("/members/permissions", {
        data: { memberID, permissionID },

        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 204) {
          if (mounted) {
            showSuccessMessage("Berechtigung wurde erfolgreich entzogen");
          }
        }
      })
      .catch(() => {
        showErrorMessage("Berechtigung konnte nicht entzogen werden");
      });
    // Clean-up function
    return () => {
      mounted = false;
    };
  };

  /**
   * Initializes the values of the autocomplete with the members and the director positions
   */
  const initAutocompleteValues = () => {
    setAutocompleteValues([...directorPositionsForAutocomplete, ...membersForAutocomplete]);
  };

  /**
   * Checks if the user is admin
   */
  const checkAdmin = () => {
    if (doesPermissionsHaveSomeOf(auth.permissions, [100])) {
      setIsAdmin(true);
    }
  };

  /**
   * Check if clicked event added or removed entity from autocomplete
   */
  const handleOnChange = (
    newValue: AutocompleteValue[],
    details: AutocompleteChangeDetails<AutocompleteValue> | undefined,
    permissionID: number
  ) => {
    // Check if details is undefined
    if (details) {
      if (newValue[newValue.length - 1] === details.option) {
        createPermission(details.option.memberID, permissionID);
      } else {
        deletePermission(details.option.memberID, permissionID);
      }
    }
  };

  /**
   * Retuns true if user can deligate permissionID else false
   */
  const checkDelegation = (permissionID: number) => {
    if (isAdmin) {
      return true;
    }
    return (
      auth.permissions.filter((permission) => permission.permissionID === permissionID && permission.canDelegate)
        .length > 0
    );
  };

  useEffect(() => checkAdmin(), []);
  useEffect(() => getPermissions(), []);
  useEffect(() => getPermissionAssignments(), []);
  useEffect(() => getMembers(), []);
  useEffect(() => getDirectorPositions(), []);
  useEffect(() => initAutocompleteValues(), [membersForAutocomplete, directorPositionsForAutocomplete]);

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
                {permissions.map((permissions) => (
                  <Grid item container spacing={0} className={classes.contentContainer} key={permissions.bezeichnung}>
                    <Grid item xs={6}>
                      <Grid item xs={12}>
                        <Typography>{permissions.bezeichnung}</Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={0}>
                      {permissionAssignments.map((memberP) => {
                        if (permissions.berechtigungID === memberP.permission) {
                          if (
                            permissionAssignments.map((entry) => memberP.permission === entry.permission).length > 0
                          ) {
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
                            isOptionEqualToValue={(option, value) => {
                              // Compare member ID of entities if not director else name
                              if (value.memberID !== -1) {
                                return option.memberID === value.memberID;
                              } else {
                                return option.name === value.name;
                              }
                            }}
                            options={
                              // Remove duplicated options
                              autocompleteValues.filter(
                                (value, index, self) =>
                                  index ===
                                  self.findIndex((t) => {
                                    return t.memberID === value.memberID && t.name === value.name;
                                  })
                              )
                            }
                            getOptionLabel={(options) => options.name}
                            defaultValue={tmp}
                            disabled={!checkDelegation(permissions.berechtigungID)}
                            onChange={(event, newValue, reason, details) => {
                              handleOnChange(newValue, details, permissions.berechtigungID);
                            }}
                            getOptionDisabled={(option) => option.memberID === -1}
                            renderTags={(tagValue, getTagProps) =>
                              tagValue.map((option, index) => (
                                <Chip
                                  label={option.name}
                                  {...getTagProps({ index })}
                                  disabled={!checkDelegation(permissions.berechtigungID) || option.memberID < 0}
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
    </div>
  );
};
export default PermissionsOverview;
