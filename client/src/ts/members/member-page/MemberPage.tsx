/**
 * The MemberPage-Component displays details of a member and can be edited by the owner of this page
 */

import React, {
  useState,
  useEffect
} from "react";
import { RouteComponentProps } from "react-router-dom";
import api from "../../utils/api";
import DisplayMemberDetails from "./DisplayMemberDetails";

/**
 * Interface for the member object
 */
interface MemberDetails {
  mitgliedID: number;
  nachname: string;
  vorname: string;
  geschlecht: string;
  geburtsdatum: string;
  handy: string;
  jbt_email: string;
  mitgliedstatus: string;
  generation: string;
  internesprojekt: string;
  mentor: string;
  trainee_seit: string;
  mitglied_seit: string;
  alumnus_seit: string;
  senior_seit: string;
  aktiv_seit: string;
  passiv_seit: string;
  ausgetreten_seit: string;
  ressort: string;
  arbeitgeber: string;
  strasse1: string;
  plz1: number;
  ort1: string;
  tel1: number;
  email1: string;
  strasse2: string;
  plz2: number;
  ort2: string;
  tel2: number;
  email2: string;
  hochschule: string;
  studiengang: string;
  studienbeginn: string;
  studienende: string;
  vertiefungen: string;
  ausbildung: string;
  kontoinhaber: string;
  iban: string;
  bic: string;
  engagement: string;
  canPL: string;
  canQM: string;
  lastchange: string;
  fuehrerschein: string;
  ersthelferausbildung: string;
}

/**
 * Interface for the match parameter of the router
 */
interface RouterMatch {
  id: string;
}

const MemberPage: React.FunctionComponent<RouteComponentProps<RouterMatch>> = (props: RouteComponentProps<RouterMatch>) => {

  const [memberDetails, setMembersDetails] = useState<MemberDetails>();

  /**
   * Retrieves the member details
   */
  const getMemberDetails: VoidFunction = () => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api.get(`/users/${props.match.params.id}`, {
      headers: {Authorization : `Bearer ${localStorage.getItem("token")}`}
    })
    .then((res) => {
      if (res.status === 200){
        if (mounted){
          setMembersDetails(res.data[0]);
        }
      }
    });

    return () => {mounted = false;};
  };

  useEffect(() => getMemberDetails(), []);

  return (
    <DisplayMemberDetails memberDetails={memberDetails}/>
  );
};

export default MemberPage;