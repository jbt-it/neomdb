import { Avatar, AvatarGroup, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import React from "react";
import { stringAvatar } from "../../../utils/stringUtils";
import { Link } from "react-router-dom";
import { MembersFieldDto } from "../../../types/membersTypes";

const styles = {
  avatar: {
    fontSize: "0.75rem",
    width: 30,
    height: 30,
  },
  groupedAvatar: {
    fontSize: "0.75rem",
    width: 40,
    height: 40,
  },
};

interface ProjectMemberListProps {
  projectMembers: MembersFieldDto[];
}

/**
 * Renders a list of project members
 * @param projectMembers List of project members as MembersFieldDto
 * @returns ProjectMemberList component
 */
const ProjectMemberList = ({ projectMembers }: ProjectMemberListProps) => {
  if (projectMembers.length === 0) {
    return <Typography>Keine Projektmitglieder</Typography>;
  }

  // If there are more than 3 members, display them in an AvatarGroup
  if (projectMembers.length > 3) {
    return (
      <Box display="flex" justifyItems={"start"}>
        <AvatarGroup max={4}>
          {projectMembers.map((member) => (
            <Avatar
              key={`Projektmitglied-Avatar-${member.memberId}`}
              alt={`${member.firstname} ${member.lastname}`}
              {...stringAvatar(`${member.firstname} ${member.lastname}`)}
              style={styles.groupedAvatar}
            />
          ))}
        </AvatarGroup>
      </Box>
    );
  }

  return (
    <Box sx={{ pl: 2, marginTop: -1, marginLeft: -2.3 }}>
      <List disablePadding>
        {projectMembers.map((member) => (
          <ListItem
            key={`Projektmitglied-${member.memberId}`}
            component={Link}
            to={`/gesamtuebersicht/${member.memberId}`}
            sx={{ padding: 0.5, margin: 0 }}
          >
            <ListItemAvatar>
              <Avatar
                alt={`${member.firstname} ${member.lastname}`}
                {...stringAvatar(`${member.firstname} ${member.lastname}`)}
                style={styles.avatar}
              />
            </ListItemAvatar>
            <ListItemText sx={{ marginLeft: -2, color: "black" }}>
              <Typography fontSize={16}>
                {member.firstname} {member.lastname}
              </Typography>
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ProjectMemberList;
