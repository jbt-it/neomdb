/**
 * The MemberPage-Component displays details of a member and can be edited by the owner of this page
 */

import React, { useState, useEffect, useContext, useCallback } from "react";
import DisplayMemberDetails from "./DisplayMemberDetails";
import { AuthContext } from "../../../context/auth-context/AuthContext";
import { useParams } from "react-router-dom";
import { DirectorPositionDto, MemberDirectorPositions } from "../../../types/membersTypes";
import useMembers from "../../../hooks/members/useMembers";
import useDepartments from "../../../hooks/members/useDepartments";
import useMemberDetails from "../../../hooks/members/useMemberDetails";
import api from "../../../utils/api";
import { authReducerActionType } from "../../../types/globalTypes";

const MemberProfile: React.FunctionComponent = () => {
  const params = useParams();
  const { auth, dispatchAuth } = useContext(AuthContext);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [memberDirectorPositions, setMemberDirectorPositions] = useState<MemberDirectorPositions[]>([]);
  const [directorPositions, setDirectorPositions] = useState<DirectorPositionDto[]>([]);

  /**
   * Get list of possible director positions
   */
  const getDirectorPositions: VoidFunction = useCallback(() => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api
      .get(`/members/director-positions`, {
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

  /**
   * Get director positions of the current member
   */
  const getMemberDirectorPositions: VoidFunction = useCallback(() => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api
      .get(`/members/${params.id}/director-positions`, {
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

  const { members, languages, itSkills } = useMembers();
  const { departments } = useDepartments();
  const { memberDetails, memberImage, updateMemberDetails, saveMemberImage } = useMemberDetails(Number(params.id));

  useEffect(
    () =>
      // Checks if the user is the owner of the member page
      setIsOwner(auth.userID === parseInt(params.id!, 10)),
    [params.id, auth.userID]
  );
  useEffect(() => getMemberDirectorPositions(), [getMemberDirectorPositions]);
  useEffect(() => getDirectorPositions(), [getDirectorPositions]);
  /**
   * Adds a new director position to the member
   * @param evpostenID
   * @param mitgliedID
   * @param von
   * @param bis
   * @returns
   */
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
            if (res.status === 204) {
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
            members={members}
            listOfPermissions={auth.permissions}
            departments={departments}
            listOfLanguages={languages}
            listOfItSkills={itSkills}
            memberDetails={memberDetails}
            isOwner={isOwner}
            memberImage={memberImage}
            updateMemberDetails={updateMemberDetails}
            memberDirectorPositions={memberDirectorPositions}
            directorPositions={directorPositions}
            deleteDirectorPosition={deleteDirectorPosition}
            addDirectorPosition={addDirectorPosition}
            changeDirectorPosition={changeDirectorPosition}
            getMemberDirectorPositions={getMemberDirectorPositions}
            saveMemberImage={saveMemberImage}
          />
        ) : null}
      </div>
    </div>
  );
};

export default MemberProfile;
