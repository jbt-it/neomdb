/**
 * The PermissionsOverview-Component displays all members in a table and displays options for filtering and sorting the members
 */

import React, {
  useState,
  useEffect
} from "react";
import {
  Paper,
  IconButton,
  Grid,
  createStyles,
  Theme,
  makeStyles,
  Typography,
  Divider,
  Box,
  TextField,
} from "@material-ui/core";
import api from "../utils/api";
import AddIcon from "@material-ui/icons/Add";
import Chip from "@material-ui/core/Chip";
import CloseIcon from "@material-ui/icons/Close";
import Autocomplete from "@material-ui/lab/Autocomplete";

interface MemberPermissions {
  name: string;
  permission: number;
  canDelegate: number;
}
interface PermissionsOverview {
  bezeichnung: string;
  beschreibung: string;
  berechtigungID: number;
}
// interface DirectorPermissions {
//   ressortID: number;
//   permission: number;
//   canDelegate: number;
// }
// interface Directors {
//   ressortID: number;
//   shortName: string;
// }
// interface Posten {
//   permission: number;
//   name: string;
// }

/**
 * Function which proivdes the styles of the PermissionsOverview
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
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
    color: "white", //#f6891f
    minWidth: "60px",
    display: "inline-flex",
    margin: 5,
    padding: 1,
    top: 3,
    right: 5,
  },
  gridEntityPrimaryRolls: {
    color: "white", //#f6891f
    display: "inline-flex",
    margin: 5,
    padding: 1,
    top: 3,
    right: 5,
  },
  gridEntitySecondary: {
    color: "white", //#f6891f
    display: "flex",
    margin: 1,
    padding: 3,
  },
  closeIcon: {
    color: "white",
  },
}));
const PermissionsOverview: React.FunctionComponent = () => {
  const classes = useStyles();
  const handleDelete = () => {
    console.info("You clicked the delete icon.");
  };
  const handleClick = () => {
    console.info("You clicked the Chip.");
  };
  const [memberPermissions, setMemberPermissions] = useState<MemberPermissions[]>([]);
  //const [directorPermissions, setDirectorPermissions] = useState<DirectorPermissions[]>([]);
  const [permissionsOverview, setPermissionsOverview] = useState<PermissionsOverview[]>([]);
  // const [directors, setDirectors] = useState<Directors[]>([]);
  // const [posten, setPosten] = useState<Posten[]>([]);
  const [tmpState, setTmpState] = useState<string[] | []>([]);
  const tmp: string[] = [];
  //const allNames: string[] = [];
  const allNames = memberPermissions.map(p => p.name);

  console.log("allNames");
  console.log(allNames);
  // const allDirectors = directors.map(d => d.shortName);
  /**
   * Handles the API call and cleans state thereafter
   */
  const getPermissions: VoidFunction = () => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api.get("/users/permissions", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            console.log("PermissionsOverview");
            console.log(res.data);
            setPermissionsOverview(res.data);
          }
        }
      }).catch((error) => {
        console.log(error);
      });
    // Clean-up function
    return () => { mounted = false; };
  };

  const getPermissionsOfMembers: VoidFunction = () => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api.get("/users/permissions-of-members", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            console.log("memberPermissions");
            console.log(res.data);
            setMemberPermissions(res.data);
          }
        }
      }).catch((error) => {
        console.log(error);
      });
    // Clean-up function
    return () => { mounted = false; };
  };

  // const [mergedData, setMergedData] = useState<Posten[]>([]);

  // const mergeData = () => {
  //   permissionsOverview.map((overview) => {
  //     posten.map((postenP) => {
  //       if (permissionsOverview.berechtigungID === postenP.permission) {

  //         setMergedData(mergedData.concat(postenP));

  //       }
  //     });
  //   });
  // };

  useEffect(() => getPermissions(), []);
  //useEffect(() => mergeData(), []);
  useEffect(() => getPermissionsOfMembers(), []);

  return (
    <div>
      <div className="content-page" >
        <Box component="div" display="inline">
          <Paper className={classes.paperRoot} >
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
                        <Typography>
                          {permissions.bezeichnung}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={0} xs={10}>
                      {memberPermissions.map((memberP) => {
                        if (permissions.berechtigungID === memberP.permission) {
                          if (memberPermissions.map(entry => memberP.permission === entry.permission).length > 0) {
                            //const directorInfo = memberPermissions.filter(entry => entry.permission === memberP.permission)[0];
                            tmp.push(memberP.name);
                          }
                        }
                      })
                      }
                      {/* {posten.map((postenP) => {
                        if (permissionsOverview.berechtigungID === postenP.permission) {
                          tmp.push(postenP.name);
                        }
                      }
                      )} */}
                      {(tmp.length >= 1) ? <Grid item xs >
                        <Autocomplete
                          multiple
                          id="tags-standard"
                          options={allNames}
                          getOptionLabel={(option) => option}
                          defaultValue={tmp.splice(0, tmp.length)}
                          color="primary"
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
                      </Grid> : tmp.splice(0, tmp.length)}
                    </Grid >
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