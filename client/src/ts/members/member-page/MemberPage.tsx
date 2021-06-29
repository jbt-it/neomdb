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
 * Interface for the language of a specific member
 */
interface LanguageOfMember {
  wert: string;
  niveau: string;
}

/**
 * Interface for the edv skill
 */
interface EDVSkillOfMember {
  wert: string;
  niveau: string;
}

/**
 * Interface for a language
 */
interface Language {
  wert: string;
}

/**
 * Interface for an edv skill
 */
interface EDVSkill {
  wert: string;
}

/**
 * Interface for the department
 */
interface Department {
  ressortID: number;
  bezeichnung: string;
  kuerzel: string;
}

/**
 * Interface for mentor
 */
interface Mentor {
  mitgliedID: number | null;
  vorname: string;
  nachname: string;
}

/**
 * Interface for mentee
 */
interface Mentee {
  mitgliedID: number | null;
  vorname: string;
  nachname: string;
}

/**
 * Interface for the member
 */
interface Member {
  mitgliedID: number;
  nachname: string;
  vorname: string;
  jbt_email: string;
  ressort: string;
  mitgliedstatus: string;
}

/**
 * Interface for the member details object
 */
interface MemberDetails {
  mitgliedID: number;
  nachname: string;
  vorname: string;
  geschlecht: string;
  geburtsdatum: string | null;
  handy: string;
  jbt_email: string;
  mitgliedstatus: string;
  generation: string | null;
  internesprojekt: string | null;
  mentor: Mentor | null;
  trainee_seit: string | null;
  mitglied_seit: string | null;
  alumnus_seit: string | null;
  senior_seit: string | null;
  aktiv_seit: string | null;
  passiv_seit: string | null;
  ausgetreten_seit: string | null;
  ressort: string | null;
  arbeitgeber: string | null;
  strasse1: string;
  plz1: number;
  ort1: string;
  tel1: number;
  email1: string;
  strasse2: string | null;
  plz2: number | null;
  ort2: string | null;
  tel2: number | null;
  email2: string | null;
  hochschule: string;
  studiengang: string;
  studienbeginn: string | null;
  studienende: string | null;
  vertiefungen: string | null;
  ausbildung: string | null;
  kontoinhaber: string;
  iban: string;
  bic: string;
  engagement: string | null;
  canPL: string | null;
  canQM: string | null;
  lastchange: string;
  fuehrerschein: boolean;
  ersthelferausbildung: boolean;
  sprachen: LanguageOfMember[];
  mentees: Mentee[];
  edvkenntnisse: EDVSkillOfMember[];
}

/**
 * Interface for the match parameter of the router
 */
interface RouterMatch {
  id: string;
}

const MemberProfile: React.FunctionComponent<RouteComponentProps<RouterMatch>> = (
  props: RouteComponentProps<RouterMatch>
) => {
  const classes = useStyles();
  const [successOpen, setSuccessOpen] = useState<number>(0);
  const [errorOpen, setErrorOpen] = useState<number>(0);
  const [members, setMembers] = useState<Member[]>([]);
  const [authenticated, setAuthenticated,
    userID, setUserID, userName, setUserName] = useContext(AuthContext);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [edvSkills, setEdvSkills] = useState<EDVSkill[]>([]);
  const [memberDetails, setMembersDetails] = useState<MemberDetails>();
  const [isOwner, setIsOwner] = useState<boolean>(false);

  /**
   * Retrieves all members
   */
  const getMembers: VoidFunction = () => {

    // Variable for checking, if the component is mounted
    let mounted = true;
    api.get(`/users`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setMembers(res.data);
          }
        }
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
    api.get(`/users/departments`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setDepartments(res.data);
          }
        }
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
    api.get(`/users/languages`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setLanguages(res.data);
          }
        }
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
    api.get(`/users/edv-skills`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setEdvSkills(res.data);
          }
        }
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
    api.get(`/users/${props.match.params.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setSuccessOpen(0);
            setMembersDetails(res.data[0]);
          }
        }
      });

    // Clean-up function
    return () => {
      mounted = false;
    };
  };

  /**
   * Updates the member details
   */
  const updateMemberDetails = (data: MemberDetails) => {

    // Variable for checking, if the component is mounted
    let mounted = true;
    api.patch(`/users/${props.match.params.id}`, data, {
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
      });

    // Clean-up function
    return () => {
      mounted = false;
    };
  };

  useEffect(() =>

    // Checks if the user is the owner of the member page
    setIsOwner(userID === parseInt(props.match.params.id, 10))
  , [props.match.params.id, userID]);
  useEffect(() => getMembers(), []);
  useEffect(() => getDepartments(), []);
  useEffect(() => getLanguages(), []);
  useEffect(() => getEdvSkills(), []);
  useEffect(() => setSuccessOpen(0), []);
  useEffect(getMemberDetails, [props.match.params.id]);

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
      {successOpen ? <CustomSnackbar snackbarMessage="Aktualisierung des Profils war erfolgreich!" snackProps={{ variant: "success" }} /> : null}
      {errorOpen ? <CustomSnackbar snackbarMessage="Aktualisierung ist fehlgeschlagen!" snackProps={{ variant: "error" }} /> : null}
    </div>
  );
};

export default MemberProfile;