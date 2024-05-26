/**
 * The MemberPage-Component displays details of a member and can be edited by the owner of this page
 */

import React, { useState, useEffect, useContext, useCallback } from "react";
import api from "../../../utils/api";
import DisplayMemberDetails from "./DisplayMemberDetails";
import { AuthContext } from "../../../context/auth-context/AuthContext";
import { showErrorMessage, showSuccessMessage } from "../../../utils/toastUtils";
import * as membersTypes from "../../../types/membersTypes";
import { authReducerActionType } from "../../../types/globalTypes";
import { useParams } from "react-router-dom";

const MemberProfile: React.FunctionComponent = () => {
  const params = useParams();
  const [members, setMembers] = useState<membersTypes.MemberPartialDto[]>([]);
  const { auth, dispatchAuth } = useContext(AuthContext);
  const [departments, setDepartments] = useState<membersTypes.DepartmentPartialDto[]>([]);
  const [languages, setLanguages] = useState<membersTypes.Language[]>([]);
  const [edvSkills, setEdvSkills] = useState<membersTypes.ItSkill[]>([]);
  const [memberDetails, setMembersDetails] = useState<membersTypes.MemberDetailsDto>();
  const [memberImage, setMemberImage] = useState<membersTypes.MemberImage | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  /**
   * Retrieves all members
   */
  const getMembers: VoidFunction = useCallback(() => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api
      .get(`/members`, {
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
      .get(`/members/departments`, {
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
      .get(`/members/${params.id}/image`, {
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
   * Retrieves the member details
   */
  const getMemberDetails: VoidFunction = () => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api
      .get(`/members/${params.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setMembersDetails(res.data);
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
  const updateMemberDetails = (data: membersTypes.MemberDetailsDto) => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api
      .patch(`/members/${params.id}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 204) {
          if (mounted) {
            showSuccessMessage("Aktualisierung des Profils war erfolgreich!");
            getMemberDetails();
          }
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
        } else if (err.response.status === 403) {
          showErrorMessage("Du hast nicht die Berechtigung dies zu tun!");
        } else if (err.response.status === 500) {
          showErrorMessage("Aktualisierung ist fehlgeschlagen!");
        }
      });

    // Clean-up function
    return () => {
      mounted = false;
    };
  };

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
          `/members/${params.id}/image`,
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
      setIsOwner(auth.userID === parseInt(params.id!, 10)),
    [params.id, auth.userID]
  );
  useEffect(() => getMembers(), [getMembers]);
  useEffect(() => getDepartments(), [getDepartments]);
  useEffect(() => getLanguages(), [getLanguages]);
  useEffect(() => getEdvSkills(), [getEdvSkills]);
  useEffect(getMemberDetails, [params.id, dispatchAuth]);
  useEffect(getMemberImage, [params.id, dispatchAuth]);

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
            memberImage={memberImage}
            updateMemberDetails={updateMemberDetails}
            saveMemberImage={saveMemberImage}
          />
        ) : null}
      </div>
    </div>
  );
};

export default MemberProfile;
