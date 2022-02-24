/**
 * The PermissionsOverview-Component displays all members in a table and displays options for filtering and sorting the members
 */

import React, { useState, useEffect, useContext } from "react";
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

interface MemberPermissions {
  name: string;
  permission: number;
  canDelegate: number;
  memberID: number;
}
interface PermissionsOverview {
  bezeichnung: string;
  beschreibung: string;
  berechtigungID: number;
}

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
const PermissionsOverview: React.FunctionComponent = () => {
  const classes = useStyles();
  const [memberPermissions, setMemberPermissions] = useState<MemberPermissions[]>([]);
  const [permissionsOverview, setPermissionsOverview] = useState<PermissionsOverview[]>([]);
  const memberNames = memberPermissions
    .filter((e) => e.memberID > 0)
    .map((p) => ({ name: p.name, memberID: p.memberID }))
    .filter(
      (value, index, self) => index === self.findIndex((t) => t.memberID === value.memberID && t.name === value.name)
    );
  const { auth, dispatchAuth } = useContext(AuthContext);
  let tmp: AllNames[] = [];

  /**
   * Handles the API call and cleans state thereafter
   */
  const getPermissions: VoidFunction = () => {
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
        console.log(error);
      });
    // Clean-up function
    return () => {
      mounted = false;
    };
  };

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
        console.log(error);
      });
    // Clean-up function
    return () => {
      mounted = false;
    };
  };

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
        if (res.status === 200) {
          if (mounted) {
            console.log(res.data);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
    // Clean-up function
    return () => {
      mounted = false;
    };
  };

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
            console.log(res.data);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
    // Clean-up function
    return () => {
      mounted = false;
    };
  };

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
    if (auth.permissions.filter((e) => e.permissionID === permissionID && e.canDelegate).length > 0) {
      return false;
    }
    return true;
  };

  useEffect(() => getPermissions(), []);
  useEffect(() => getPermissionsOfMembers(), []);

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
                  <Grid item container spacing={0} className={classes.contentContainer}>
                    <Grid item xs={6}>
                      <Grid item xs={12}>
                        <Typography>{permissions.bezeichnung}</Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={0} xs={10}>
                      {memberPermissions.map((memberP) => {
                        if (permissions.berechtigungID === memberP.permission) {
                          if (memberPermissions.map((entry) => memberP.permission === entry.permission).length > 0) {
                            tmp.push({ name: memberP.name, memberID: memberP.memberID });
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
                            getOptionSelected={(option, value) => option.memberID === value.memberID}
                            options={memberNames}
                            getOptionLabel={(options) => options.name}
                            defaultValue={tmp}
                            disabled={checkDisable(permissions.berechtigungID)}
                            onChange={(event, newValue, reason, details) => {
                              handleOnChange(newValue, details, permissions.berechtigungID);
                            }}
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
    </div>
  );
};
export default PermissionsOverview;
