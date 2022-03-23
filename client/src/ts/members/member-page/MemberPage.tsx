/**
 * The MemberPage-Component displays details of a member and can be edited by the owner of this page
 */

import React, { useState, useEffect, useContext } from "react";
import { RouteComponentProps } from "react-router-dom";
import api from "../../utils/api";
import DisplayMemberDetails from "./DisplayMemberDetails";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { AuthContext } from "../../global/AuthContext";
import PageBar from "../../global/navigation/PageBar";
import CustomSnackbar from "../../global/CustomSnackbar";
import * as membersTypes from "../membersTypes";
import { authReducerActionType } from "../../global/globalTypes";

/**
 * Function which proivdes the styles of the MemberPage
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    memberPageRoot: {
      flexGrow: 1,
      padding: "5px",
      marginTop: "58px",
      marginBottom: "45px",
      [theme.breakpoints.up("md")]: {
        marginTop: "65px",
        marginLeft: "287px",
        marginRight: "7px",
      },
      [theme.breakpoints.up("sm")]: {
        marginTop: "65px",
      },
    },
  })
);

/**
 * Interface for the match parameter of the router
 */
interface RouterMatch {
  id: string;
}

const MemberProfile: React.FunctionComponent<RouteComponentProps<RouterMatch>> =
  (props: RouteComponentProps<RouterMatch>) => {
    const classes = useStyles();
    const [successOpen, setSuccessOpen] = useState<number>(0);
    const [errorOpen, setErrorOpen] = useState<number>(0);
    const [members, setMembers] = useState<membersTypes.Member[]>([]);
    const { auth, dispatchAuth } = useContext(AuthContext);
    const [departments, setDepartments] = useState<membersTypes.Department[]>(
      []
    );
    const [languages, setLanguages] = useState<membersTypes.Language[]>([]);
    const [edvSkills, setEdvSkills] = useState<membersTypes.EDVSkill[]>([]);
    const [memberDetails, setMembersDetails] =
      useState<membersTypes.MemberDetails>();
    const [isOwner, setIsOwner] = useState<boolean>(false);

    /**
     * Retrieves all members
     */
    const getMembers: VoidFunction = () => {
      // Variable for checking, if the component is mounted
      let mounted = true;
      api
        .get(`/users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => {
          if (res.status === 200) {
            if (mounted) {
              setMembers(res.data);
            }
          }
        })
        .catch((err) => {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
          console.log(err);
        });

      // Clean-up function
      return () => {
        mounted = false;
      };
    };

    /**
     * Retrieves all departments
     */
    const getDepartments: VoidFunction = () => {
      // Variable for checking, if the component is mounted
      let mounted = true;
      api
        .get(`/users/departments`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => {
          if (res.status === 200) {
            if (mounted) {
              setDepartments(res.data);
            }
          }
        })
        .catch((err) => {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
          console.log(err);
        });

      // Clean-up function
      return () => {
        mounted = false;
      };
    };

    /**
     * Retrieves all languages
     */
    const getLanguages: VoidFunction = () => {
      // Variable for checking, if the component is mounted
      let mounted = true;
      api
        .get(`/users/languages`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => {
          if (res.status === 200) {
            if (mounted) {
              setLanguages(res.data);
            }
          }
        })
        .catch((err) => {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
          console.log(err);
        });

      // Clean-up function
      return () => {
        mounted = false;
      };
    };

    /**
     * Retrieves all edv skills
     */
    const getEdvSkills: VoidFunction = () => {
      // Variable for checking, if the component is mounted
      let mounted = true;
      api
        .get(`/users/edv-skills`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => {
          if (res.status === 200) {
            if (mounted) {
              setEdvSkills(res.data);
            }
          }
        })
        .catch((err) => {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
          console.log(err);
        });

      // Clean-up function
      return () => {
        mounted = false;
      };
    };

    /**
     * Retrieves the member details
     */
    const getMemberDetails: VoidFunction = () => {
      // Variable for checking, if the component is mounted
      let mounted = true;
      api
        .get(`/users/${props.match.params.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => {
          if (res.status === 200) {
            if (mounted) {
              setSuccessOpen(0);
              setMembersDetails(res.data[0]);
            }
          }
        })
        .catch((err) => {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
          console.log(err);
        });

      // Clean-up function
      return () => {
        mounted = false;
      };
    };

    /**
     * Updates the member details
     */
    const updateMemberDetails = (data: membersTypes.MemberDetails) => {
      // Variable for checking, if the component is mounted
      let mounted = true;
      api
        .patch(`/users/${props.match.params.id}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => {
          if (res.status === 200) {
            if (mounted) {
              setSuccessOpen(successOpen + 1);
              getMemberDetails();
            }
          } else if (res.status === 500) {
            setErrorOpen(errorOpen + 1);
          }
        })
        .catch((err) => {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
          console.log(err);
        });

      // Clean-up function
      return () => {
        mounted = false;
      };
    };

    useEffect(
      () =>
        // Checks if the user is the owner of the member page
        setIsOwner(auth.userID === parseInt(props.match.params.id, 10)),
      [props.match.params.id, auth.userID]
    );
    useEffect(() => getMembers(), []);
    useEffect(() => getDepartments(), []);
    useEffect(() => getLanguages(), []);
    useEffect(() => getEdvSkills(), []);
    useEffect(() => setSuccessOpen(0), []);
    useEffect(getMemberDetails, [props.match.params.id, dispatchAuth]);

    return (
      <div>
        <div className={classes.memberPageRoot}>
          {memberDetails ? (
            <DisplayMemberDetails
              members={members}
              departments={departments}
              listOfLanguages={languages}
              listOfEDVSkills={edvSkills}
              memberDetails={memberDetails}
              isOwner={isOwner}
              getMemberDetails={getMemberDetails}
              updateMemberDetails={updateMemberDetails}
            />
          ) : null}
        </div>
        <PageBar pageTitle="Profilseite" />
        {successOpen ? (
          <CustomSnackbar
            snackbarMessage="Aktualisierung des Profils war erfolgreich!"
            snackProps={{ variant: "success" }}
          />
        ) : null}
        {errorOpen ? (
          <CustomSnackbar
            snackbarMessage="Aktualisierung ist fehlgeschlagen!"
            snackProps={{ variant: "error" }}
          />
        ) : null}
      </div>
    );
  };

export default MemberProfile;
