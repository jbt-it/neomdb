/**
 * The MemberPage-Component displays details of a member and can be edited by the owner of this page
 */

import React, { useState, useEffect, useContext, useCallback } from "react";
import { RouteComponentProps } from "react-router-dom";
import api from "../../../utils/api";
import DisplayMemberDetails from "./DisplayMemberDetails";
import { AuthContext } from "../../../context/auth-context/AuthContext";
import PageBar from "../../../components/navigation/PageBar";
import { showErrorMessage, showSuccessMessage } from "../../../utils/toastUtils";
import * as membersTypes from "../membersTypes";
import { authReducerActionType } from "../../../context/auth-context/globalTypes";

/**
 * Interface for the match parameter of the router
 */
interface RouterMatch {
  id: string;
}

const MemberProfile: React.FunctionComponent<RouteComponentProps<RouterMatch>> = (
  props: RouteComponentProps<RouterMatch>
) => {
  const [members, setMembers] = useState<membersTypes.Member[]>([]);
  const { auth, dispatchAuth } = useContext(AuthContext);
  const [departments, setDepartments] = useState<membersTypes.Department[]>([]);
  const [languages, setLanguages] = useState<membersTypes.Language[]>([]);
  const [edvSkills, setEdvSkills] = useState<membersTypes.EDVSkill[]>([]);
  const [memberDetails, setMembersDetails] = useState<membersTypes.MemberDetails>();
  const [isOwner, setIsOwner] = useState<boolean>(false);

  /**
   * Retrieves all members
   */
  const getMembers: VoidFunction = useCallback(() => {
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
        if (err.response.status === 401) {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
        }
      });

    // Clean-up function
    return () => {
      mounted = false;
    };
  }, [dispatchAuth]);

  /**
   * Retrieves all departments
   */
  const getDepartments: VoidFunction = useCallback(() => {
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
        if (err.response.status === 401) {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
        }
      });

    // Clean-up function
    return () => {
      mounted = false;
    };
  }, [dispatchAuth]);

  /**
   * Retrieves all languages
   */
  const getLanguages: VoidFunction = useCallback(() => {
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
        if (err.response.status === 401) {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
        }
      });

    // Clean-up function
    return () => {
      mounted = false;
    };
  }, []);

  /**
   * Retrieves all edv skills
   */
  const getEdvSkills: VoidFunction = useCallback(() => {
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
        if (err.response.status === 401) {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
        }
      });

    // Clean-up function
    return () => {
      mounted = false;
    };
  }, []);

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
            setMembersDetails(res.data[0]);
          }
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
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
            showSuccessMessage("Aktualisierung des Profils war erfolgreich!");
            getMemberDetails();
          }
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
        } else if (err.response.status === 500) {
          showErrorMessage("Aktualisierung ist fehlgeschlagen!");
        }
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
  useEffect(() => getMembers(), [getMembers]);
  useEffect(() => getDepartments(), [getDepartments]);
  useEffect(() => getLanguages(), [getLanguages]);
  useEffect(() => getEdvSkills(), [getEdvSkills]);
  useEffect(getMemberDetails, [props.match.params.id, dispatchAuth]);

  return (
    <div>
      <div className="content-page">
        {memberDetails ? (
          <DisplayMemberDetails
            members={members}
            listOfPermissions={auth.permissions}
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
    </div>
  );
};

export default MemberProfile;
