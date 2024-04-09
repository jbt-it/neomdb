import { Avatar, AvatarGroup, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import React from "react";
import { stringAvatar } from "../../../utils/stringUtils";
import { Link } from "react-router-dom";
import { MembersField } from "../../../types/membersTypes";
import { makeStyles, createStyles } from "@mui/styles";

const useStyles = makeStyles(() =>
  createStyles({
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
  })
);

interface ProjectMemberListProps {
  projectMembers: MembersField[];
}

const ProjectMemberList = ({ projectMembers }: ProjectMemberListProps) => {
  const classes = useStyles();

  if (projectMembers.length === 0) {
    return <Typography>Keine Projektmitglieder</Typography>;
  }

  if (projectMembers.length > 3) {
    return (
      <Box display="flex" justifyItems={"start"}>
        <AvatarGroup max={4}>
          {projectMembers.map((member) => (
            <Avatar
              alt={`${member.vorname} ${member.nachname}`}
              {...stringAvatar(`${member.vorname} ${member.nachname}`)}
              className={classes.groupedAvatar}
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
            key={`Projektmitglied-${member.mitgliedID}`}
            component={Link}
            to={`/gesamtuebersicht/${member.mitgliedID}`}
            sx={{ padding: 0.5, margin: 0 }}
          >
            <ListItemAvatar>
              <Avatar
                alt={`${member.vorname} ${member.nachname}`}
                {...stringAvatar(`${member.vorname} ${member.nachname}`)}
                className={classes.avatar}
              />
            </ListItemAvatar>
            <ListItemText sx={{ marginLeft: -2, color: "black" }}>
              <Typography fontSize={16}>
                {member.vorname} {member.nachname}
              </Typography>
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ProjectMemberList;
