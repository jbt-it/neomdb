/**
 * The MemberPage-Component displays details of a member and can be edited by the owner of this page
 */

import React, { useState, useEffect, useContext } from "react";
import DisplayMemberDetails from "./DisplayMemberDetails";
import { AuthContext } from "../../../context/auth-context/AuthContext";
import { useParams } from "react-router-dom";
import useMembers from "../../../hooks/members/useMembers";
import useDepartments from "../../../hooks/members/useDepartments";
import useMemberDetails from "../../../hooks/members/useMemberDetails";

const MemberProfile: React.FunctionComponent = () => {
  const params = useParams();
  const { auth } = useContext(AuthContext);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  const { members, languages, itSkills } = useMembers();
  const { departments, allDirectorPositions } = useDepartments();
  const {
    memberDetails,
    memberImage,
    updateMemberDetails,
    saveMemberImage,
    memberDirectorPositions,
    addDirectorPosition,
    changeDirectorPosition,
    deleteDirectorPosition,
  } = useMemberDetails(Number(params.id));

  useEffect(
    () =>
      // Checks if the user is the owner of the member page
      setIsOwner(auth.userID === parseInt(params.id!, 10)),
    [params.id, auth.userID]
  );

  return (
    <div>
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
          directorPositions={allDirectorPositions}
          deleteDirectorPosition={deleteDirectorPosition}
          addDirectorPosition={addDirectorPosition}
          changeDirectorPosition={changeDirectorPosition}
          saveMemberImage={saveMemberImage}
        />
      ) : null}
    </div>
  );
};

export default MemberProfile;
