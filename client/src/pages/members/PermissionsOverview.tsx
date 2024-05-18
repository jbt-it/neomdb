/**
 * The PermissionsOverview-Component displays all members in a table and displays options for filtering and sorting the members
 */
import React, { useContext } from "react";
import { Paper, Grid, Typography, Divider, Box, TextField, Chip, useTheme } from "@mui/material";
import Autocomplete, { AutocompleteChangeDetails } from "@mui/material/Autocomplete";
import { AuthContext } from "../../context/auth-context/AuthContext";
import useMembers from "../../hooks/members/useMembers";

/**
 * Interface used for autocomplete
 */
interface AllNames {
  name: string;
  memberID: number;
}

/**
 * Implements Overview of permissions.
 */
const PermissionsOverview: React.FunctionComponent = () => {
  const theme = useTheme();

  /**
   * Function which proivdes the styles of the PermissionsOverview
   */
  const styles = {
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
  };

  const { auth } = useContext(AuthContext);
  const { permissions, permissionAssignments, createPermission, deletePermission } = useMembers();

  /**
   * Check if clicked event added or removed entity from autocomplete
   */
  const handleOnChange = (
    newValue: AllNames[],
    details: AutocompleteChangeDetails<AllNames> | undefined,
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
  const checkDisable = (permissionID: number) => {
    return !(
      auth.permissions.filter((permission) => permission.permissionID === permissionID && permission.canDelegate)
        .length > 0
    );
  };

  return (
    <div>
      <Box component="div" display="inline">
        <Paper sx={styles.paperRoot}>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <Typography variant="h5" sx={styles.paperHeaderText}>
                Berechtigungen
              </Typography>
              <Divider sx={styles.paperHeaderDivider} />
            </Grid>
            <Grid container spacing={0}>
              {permissions.map((permission) => {
                const tmp: AllNames[] = [];

                permissionAssignments.forEach((memberP) => {
                  if (permission.berechtigungID === memberP.permission) {
                    tmp.push({
                      name: memberP.name,
                      memberID: memberP.memberID,
                    });
                  }
                });

                return (
                  <Grid item container spacing={0} sx={styles.contentContainer} key={permission.bezeichnung}>
                    <Grid item xs={6}>
                      <Grid item xs={12}>
                        <Typography>{permission.bezeichnung}</Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={0}>
                      {tmp.length >= 1 && (
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
                              permissionAssignments.filter(
                                (value, index, self) =>
                                  index ===
                                  self.findIndex((t) => t.memberID === value.memberID && t.name === value.name)
                              )
                            }
                            getOptionLabel={(options) => options.name}
                            defaultValue={tmp}
                            disabled={checkDisable(permission.berechtigungID)}
                            onChange={(event, newValue, reason, details) => {
                              handleOnChange(newValue, details, permission.berechtigungID);
                            }}
                            getOptionDisabled={(option) => option.memberID === -1}
                            renderTags={(tagValue, getTagProps) =>
                              tagValue.map((option, index) => (
                                <Chip
                                  label={option.name}
                                  {...getTagProps({ index })}
                                  disabled={checkDisable(permission.berechtigungID) || option.memberID < 0}
                                />
                              ))
                            }
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
                      )}
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </div>
  );
};
export default PermissionsOverview;
