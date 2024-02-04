/**
 * The MemberPage-Component displays details of a member and can be edited by the owner of this page
 */

import React, { useState, useEffect, useContext, useCallback } from "react";
import api from "../../../utils/api";
import DisplayMemberDetails from "./DisplayMemberDetails";
import { AuthContext } from "../../../context/auth-context/AuthContext";
import PageBar from "../../../components/navigation/PageBar";
import { showErrorMessage, showSuccessMessage } from "../../../utils/toastUtils";
import * as membersTypes from "../../../types/membersTypes";
import { authReducerActionType } from "../../../types/globalTypes";
import { useParams } from "react-router-dom";
import LoadingCircle from "../../../components/general/LoadingCircle";
import useMembers from "../../../hooks/members/useMembers";
import useMemberDetails from "../../../hooks/members/useMemberDetails";

const MemberProfile: React.FunctionComponent = () => {
  const { id } = useParams();
  const { auth, dispatchAuth } = useContext(AuthContext);

  const [languages, setLanguages] = useState<membersTypes.Language[]>([]);
  const [edvSkills, setEdvSkills] = useState<membersTypes.EDVSkill[]>([]);
  const [memberImage, setMemberImage] = useState<membersTypes.MemberImage | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  const { members, isMembersLoading, departments } = useMembers();
  const { memberDetails, isMemberDetailsLoading, updateMemberDetails } = useMemberDetails(Number(id));

  /**
   * Retrieves all languages
   */
  const getLanguages: VoidFunction = useCallback(() => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api
      .get(`/members/languages`, {
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
   * Retrieves the image of the member
   */
  const getMemberImage: VoidFunction = useCallback(() => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api
      .get(`/members/${id}/image`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setMemberImage(res.data);
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
      .get(`/members/edv-skills`, {
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
   * Saves the member image
   * @param file The image file
   */
  const saveMemberImage = (file: File) => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    // Extract file type (the part of the file name after the last dot)
    const mimeType = file.name.split(".").pop();

    // Transform file to base64 string
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64 = reader.result?.toString().split(",")[1];
      api
        .post(
          `/members/${id}/image`,
          { base64, mimeType },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        )
        .then((res) => {
          if (res.status === 204) {
            if (mounted) {
              showSuccessMessage("Bild wurde erfolgreich hochgeladen!");
              getMemberImage();
            }
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            dispatchAuth({ type: authReducerActionType.deauthenticate });
          } else if (err.response.status === 403) {
            showErrorMessage("Du hast nicht die Berechtigung dies zu tun!");
          } else if (err.response.status === 500) {
            showErrorMessage("Hochladen ist fehlgeschlagen!");
          }
        });
    };

    // Clean-up function
    return () => {
      mounted = false;
    };
  };

  useEffect(
    () =>
      // Checks if the user is the owner of the member page
      setIsOwner(auth.userID === Number(id)),
    [id, auth.userID]
  );
  useEffect(() => getLanguages(), [getLanguages]);
  useEffect(() => getEdvSkills(), [getEdvSkills]);
  useEffect(getMemberImage, [id, dispatchAuth]);

  if (isMembersLoading || isMemberDetailsLoading) {
    return <LoadingCircle />;
  }

  return (
    <div>
      {memberDetails && members && memberDetails && (
        <DisplayMemberDetails
          members={members}
          listOfPermissions={auth.permissions}
          departments={departments}
          listOfLanguages={languages}
          listOfEDVSkills={edvSkills}
          memberDetails={memberDetails}
          isOwner={isOwner}
          memberImage={memberImage}
          updateMemberDetails={updateMemberDetails}
          saveMemberImage={saveMemberImage}
        />
      )}
      <PageBar pageTitle="Profilseite" />
    </div>
  );
};

export default MemberProfile;
