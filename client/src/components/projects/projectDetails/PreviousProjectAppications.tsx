import React from "react";
import useMemberDetails from "../../../hooks/members/useMemberDetails";
import { List, ListItem } from "@mui/material";
import { Link } from "react-router-dom";

/**
 * Props for the PreviousProjectAppications component
 */
interface PreviousProjectAppicationsProps {
  memberId: number;
}

/**
 * Displays the previous applications of a member
 * @param memberId - The id of the member
 * @returns The previous applications of the member
 */
const PreviousProjectAppications: React.FC<PreviousProjectAppicationsProps> = ({ memberId }) => {
  const { previousApplicationsOfMember } = useMemberDetails(memberId);
  return (
    <List sx={{ listStyleType: "square", pl: 2, flex: 3 }} disablePadding dense>
      {previousApplicationsOfMember.map((application) => (
        <ListItem key={application.projectId} sx={{ display: "list-item" }} disablePadding>
          <Link
            to={`/projekte/${application.projectId}/projektbewerbungen/${memberId}`}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {application.projectName} (
            {application.type === "Bewerbung" ? "Bewerbung war nicht erfolgreich" : application.type})
          </Link>
        </ListItem>
      ))}
    </List>
  );
};

export default PreviousProjectAppications;
