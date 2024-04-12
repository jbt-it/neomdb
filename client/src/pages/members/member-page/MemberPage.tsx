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
import { MemberDirectorPositions } from "../../../types/membersTypes";

const MemberProfile: React.FunctionComponent = () => {
  const params = useParams();
  const [members, setMembers] = useState<membersTypes.Member[]>([]);
  const { auth, dispatchAuth } = useContext(AuthContext);
  const [departments, setDepartments] = useState<membersTypes.Department[]>([]);
  const [languages, setLanguages] = useState<membersTypes.Language[]>([]);
  const [edvSkills, setEdvSkills] = useState<membersTypes.EDVSkill[]>([]);
  const [memberDetails, setMembersDetails] = useState<membersTypes.MemberDetails>();
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [memberDirectorPositions, setMemberDirectorPositions] = useState<MemberDirectorPositions[]>([]);
  const [directorPositions, setDirectorPositions] = useState<membersTypes.DirectorPosition[]>([]);

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

  const getDirectorPositions: VoidFunction = useCallback(() => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api
      .get(`/members/director-positions?includeDirectorMembers=false`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setDirectorPositions(res.data);
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

  const getMemberDirectorPositions: VoidFunction = useCallback(() => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api
      .get(`/members/${params.id}/director-positions?current=false`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setMemberDirectorPositions(res.data);
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
   * Updates the member details
   */
  const updateMemberDetails = (data: membersTypes.MemberDetails) => {
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
  useEffect(() => getMemberDirectorPositions(), [getMemberDirectorPositions]);
  useEffect(() => getDirectorPositions(), [getDirectorPositions]);
  useEffect(getMemberDetails, [params.id, dispatchAuth]);

  const addDirectorPosition = async (evpostenID: number, mitgliedID: number, von: string, bis: string) => {
    return new Promise<void>((resolve, reject) => {
      if (evpostenID >= 0 && von && bis) {
        const data = { von, bis };
        api
          .post(`/members/${mitgliedID}/director-positions/${evpostenID}`, data, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          })
          .then((res) => {
            if (res.status === 201) {
              resolve(); // Resolve the promise when the operation is successful
            } else {
              reject(new Error("Failed to add director position")); // Reject the promise if the status is not 201
            }
          })
          .catch((err) => {
            if (err.response && err.response.status === 401) {
              dispatchAuth({ type: authReducerActionType.deauthenticate });
            }
            reject(err); // Reject the promise if there is an error
          });
      } else {
        reject(new Error("Invalid parameters")); // Reject the promise if parameters are invalid
      }
    });
  };

  /**
   * Deletes the director position from the member
   * @param evpostenID
   * @param mitgliedID
   */
  const deleteDirectorPosition = (evpostenID: number, mitgliedID: number) => {
    return new Promise<void>((resolve, reject) => {
      api
        .delete(`/members/${mitgliedID}/director-positions/${evpostenID}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => {
          if (res.status === 204) {
            resolve(); // Resolve the promise when the operation is successful
          } else {
            reject(new Error("Failed to delete director position")); // Reject the promise if the status is not 204
          }
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            dispatchAuth({ type: authReducerActionType.deauthenticate });
          }
          reject(err); // Reject the promise if there is an error
        });
    });
  };

  /**
   * Changes the director position of the member
   * @param evpostenID
   * @param mitgliedID
   * @param von
   * @param bis
   */
  const changeDirectorPosition = async (evpostenID: number, mitgliedID: number, von: string, bis: string) => {
    return new Promise<void>((resolve, reject) => {
      if (evpostenID >= 0 && von && bis) {
        const data = { von, bis };
        api
          .patch(`/members/${mitgliedID}/director-positions/${evpostenID}`, data, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          })
          .then((res) => {
            if (res.status === 200) {
              resolve(); // Resolve the promise when the operation is successful
            } else {
              reject(new Error("Failed to add director position")); // Reject the promise if the status is not 201
            }
          })
          .catch((err) => {
            if (err.response && err.response.status === 401) {
              dispatchAuth({ type: authReducerActionType.deauthenticate });
            }
            reject(err); // Reject the promise if there is an error
          });
      } else {
        reject(new Error("Invalid parameters")); // Reject the promise if parameters are invalid
      }
    });
  };

  return (
    <div>
      <div className="content-page">
        {memberDetails ? (
          <DisplayMemberDetails
            mitgliedID={parseInt(params.id!, 10)}
            members={members}
            listOfPermissions={auth.permissions}
            departments={departments}
            listOfLanguages={languages}
            listOfEDVSkills={edvSkills}
            memberDetails={memberDetails}
            isOwner={isOwner}
            getMemberDetails={getMemberDetails}
            updateMemberDetails={updateMemberDetails}
            memberDirectorPositions={memberDirectorPositions}
            directorPositions={directorPositions}
            deleteDirectorPosition={deleteDirectorPosition}
            addDirectorPosition={addDirectorPosition}
            changeDirectorPosition={changeDirectorPosition}
            getMemberDirectorPositions={getMemberDirectorPositions}
          />
        ) : null}
      </div>
      <PageBar pageTitle="Profilseite" />
    </div>
  );
};

export default MemberProfile;
