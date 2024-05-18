/**
 * The MemberPage-Component displays details of a member and can be edited by the owner of this page
 */

import React, { useState, useEffect, useContext } from "react";
import DisplayMemberDetails from "./DisplayMemberDetails";
import { AuthContext } from "../../../context/auth-context/AuthContext";
import { useParams } from "react-router-dom";
import LoadingCircle from "../../../components/general/LoadingCircle";
import useMembers from "../../../hooks/members/useMembers";
import useMemberDetails from "../../../hooks/members/useMemberDetails";

const MemberProfile: React.FunctionComponent = () => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);

  const [isOwner, setIsOwner] = useState<boolean>(false);

  const { members, isMembersLoading, departments, languages, edvSkills } = useMembers();
  const { memberDetails, isMemberDetailsLoading, updateMemberDetails, memberImage, saveMemberImage } = useMemberDetails(
    Number(id)
  );

  useEffect(() => {
    // Checks if the user is the owner of the member page
    setIsOwner(auth.userID === Number(id));
  }, [id, auth.userID]);

  if (isMembersLoading || isMemberDetailsLoading) {
    return <LoadingCircle />;
  }

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
