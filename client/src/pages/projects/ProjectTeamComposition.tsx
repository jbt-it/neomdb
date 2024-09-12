import {
  Box,
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Radio,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import useProjectDetails from "../../hooks/projects/useProjectDetails";
import { Link, useParams } from "react-router-dom";
import useResponsive from "../../hooks/useResponsive";
import useProjects from "../../hooks/projects/useProjects";
import { ProjectMembersDto } from "../../types/projectTypes";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import MemberSelection from "../../components/general/MemberSelection";
import { MembersFieldDto } from "../../types/membersTypes";
import useMembers from "../../hooks/members/useMembers";
import useDepartments from "../../hooks/members/useDepartments";
import PreviousProjectAppications from "../../components/projects/projectDetails/PreviousProjectAppications";
import { Groups } from "@mui/icons-material";

/**
 * Component to display the project team composition page
 * @returns - A form to enter the project team composition data
 */
const ProjectTeamComposition = () => {
  const theme = useTheme();
  const styles = {
    tableHeaderCell: {
      color: "white",
      fontWeight: "bold",
    },
    tableHeader: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      textAlign: "center",
      whiteSpace: "nowrap",
      overflow: "hidden",
    },
    tableRow: {
      "&:nth-of-type(odd)": { backgroundColor: "#fff" },
      "&:nth-of-type(even)": { backgroundColor: "#ededed" },
      textDecoration: "none",
    },
    tableCell: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      paddingRight: 0,
    },
  };

  const { id } = useParams<{ id: string }>();
  const { projectDetails, saveProjectTeamComposition } = useProjectDetails(Number(id));
  const { allCoreCompetencies } = useProjects();
  const { members } = useMembers();
  const { currentDirectors } = useDepartments();
  const isMobile = useResponsive("down", "sm");

  if (!projectDetails || !allCoreCompetencies || !members || !currentDirectors) {
    return null;
  }

  const [projectMembers, setProjectMembers] = React.useState<ProjectMembersDto[]>([]);
  const [projectManager, setProjectManager] = React.useState<ProjectMembersDto | null>(null);

  // Map current directors to MembersFieldDto
  const ev = currentDirectors.map(
    (director) =>
      ({
        memberId: director.memberId,
        firstname: director.firstname,
        lastname: director.lastname,
      } as MembersFieldDto)
  );
  // Map members to MembersFieldDto
  const selectableStaffingCommittee = [
    ...members
      .filter((member) => member.memberStatus?.name === "Senior")
      .map(
        (member) =>
          ({
            memberId: member.memberId,
            firstname: member.firstname,
            lastname: member.lastname,
          } as MembersFieldDto)
      ),
    ...ev,
  ];

  const [staffingCommittee, setStaffingCommittee] = React.useState<MembersFieldDto[]>(
    projectDetails.staffingCommittee || []
  );
  const [notes, setNotes] = React.useState<string>(projectDetails.notes || "");
  const [kickOffDate, setKickOffDate] = React.useState<Dayjs | undefined>(dayjs(projectDetails.kickoff) || undefined);

  const [openPreviousApplications, setOpenPreviousApplications] = React.useState(false);
  const [selectedMember, setSelectedMember] = React.useState<ProjectMembersDto | null>(null);

  // Handle notes change
  const onChangeNotes = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(event.target.value);
  };

  // Function to handle the change of the kickoff date
  const onChangeEstimatedProjectStart = (date: Dayjs | null) => {
    date ? setKickOffDate(date) : setKickOffDate(undefined);
  };

  // Function to handle the selection of a member
  const handleStaffingCommitteeSelection = (event: React.SyntheticEvent, value: MembersFieldDto | null) => {
    event.persist();
    const index = Number(event.currentTarget.id.split("-")[1]);
    if (value !== null) {
      const updatedMembers = [...staffingCommittee];
      updatedMembers[index] = value;
      setStaffingCommittee(updatedMembers);
    }
  };

  // Function to add a member to the list of members
  const addStaffingCommitteeMember = () => {
    setStaffingCommittee((prev) => [...prev, [] as unknown as MembersFieldDto]);
  };

  // Function to remove a member from the list of members
  const removeStaffingCommitteeMember = (memberId: number) => {
    const updatedMembers = staffingCommittee.filter((member) => member.memberId !== memberId);
    setStaffingCommittee(updatedMembers);
  };

  // Open the dialog for the previous applications
  const handleOpenPreviousApplications = (memberId: number) => {
    setSelectedMember(projectDetails.members.find((applicant) => applicant.memberId === memberId) || null);
    setOpenPreviousApplications(true);
  };

  // Close the dialog for the previous applications
  const handleClosePreviousApplications = () => {
    setOpenPreviousApplications(false);
  };

  // Function to handle the selection of the project manager
  const onChangeProjectManager = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newProjectManager = projectDetails.members.find((member) => member.memberId === Number(event.target.value));
    if (newProjectManager) {
      setProjectManager(newProjectManager);
      if (!projectMembers.some((member) => member.memberId === newProjectManager.memberId)) {
        setProjectMembers([...projectMembers, newProjectManager]);
      }
    }
  };

  // Function to handle the selection of the project members
  const onChangeProjectMembers = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMember = projectDetails.members.find((member) => member.memberId === Number(event.target.value));
    if (newMember) {
      if (projectMembers.some((member) => member.memberId === newMember.memberId)) {
        setProjectMembers(projectMembers.filter((member) => member.memberId !== newMember.memberId));
      } else {
        setProjectMembers([...projectMembers, newMember]);
      }
    }
  };

  // Function to handle the saving of the team composition
  const handleSaveTeamComposition = () => {
    if (!kickOffDate || !staffingCommittee || !projectManager || !projectMembers) {
      return;
    }
    saveProjectTeamComposition(staffingCommittee, projectManager, projectMembers, notes, kickOffDate.toDate());
  };

  return (
    <Container>
      {openPreviousApplications && selectedMember ? (
        <Dialog onClose={handleClosePreviousApplications} open={openPreviousApplications} maxWidth="md" fullWidth>
          <DialogTitle borderBottom={1} borderColor={"primary.main"}>
            Alte Projektbewerbungen von {selectedMember.firstname} {selectedMember.lastname}
          </DialogTitle>
          <DialogContent>
            <PreviousProjectAppications memberId={selectedMember.memberId} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePreviousApplications} color="primary">
              Schließen
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}
      <Typography variant="h5" component="h1" gutterBottom fontWeight={"bold"}>
        Zusammenstellung Projektteam
      </Typography>
      <Paper sx={{ padding: 2 }}>
        <Stack spacing={1}>
          <Stack
            direction={isMobile ? "column" : "row"}
            justifyContent={"space-between"}
            alignItems={isMobile ? "start" : "center"}
          >
            <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
              Projektname:
            </Typography>
            <Typography sx={{ flex: 3 }}>{projectDetails?.projectName}</Typography>
          </Stack>
          <Stack
            direction={isMobile ? "column" : "row"}
            justifyContent={"space-between"}
            alignItems={isMobile ? "start" : "center"}
          >
            <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
              Unternehmen:
            </Typography>
            <Typography sx={{ flex: 3 }}>{projectDetails?.client.name}</Typography>
          </Stack>
          <Stack
            direction={isMobile ? "column" : "row"}
            justifyContent={"space-between"}
            alignItems={isMobile ? "start" : "center"}
          >
            <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
              Branche:
            </Typography>
            <Typography sx={{ flex: 3 }}>{projectDetails?.client.industry.description}</Typography>
          </Stack>
          <Stack
            direction={isMobile ? "column" : "row"}
            justifyContent={"space-between"}
            alignItems={isMobile ? "start" : "center"}
          >
            <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
              Kernkompetenzen:
            </Typography>
            <Typography sx={{ flex: 3 }}>
              {projectDetails.coreCompetencies.map((c) => c.designation).join(", ")}
            </Typography>
          </Stack>
          <Stack
            direction={isMobile ? "column" : "row"}
            justifyContent={"space-between"}
            alignItems={isMobile ? "start" : "center"}
          >
            <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
              Status:
            </Typography>
            <Typography sx={{ flex: 3 }}>{projectDetails?.status}</Typography>
          </Stack>
          <Stack
            direction={isMobile ? "column" : "row"}
            justifyContent={"space-between"}
            alignItems={isMobile ? "start" : "center"}
          >
            <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
              Projektmitglieder (Min):
            </Typography>
            <Typography sx={{ flex: 3 }}>{projectDetails?.estimatedProjectMemberMin}</Typography>
          </Stack>
          <Stack
            direction={isMobile ? "column" : "row"}
            justifyContent={"space-between"}
            alignItems={isMobile ? "start" : "center"}
          >
            <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
              Projektmitglieder (Max):
            </Typography>
            <Typography sx={{ flex: 3 }}>{projectDetails?.estimatedProjectMemberMax}</Typography>
          </Stack>
          <Stack
            direction={isMobile ? "column" : "row"}
            justifyContent={"space-between"}
            alignItems={isMobile ? "start" : "center"}
          >
            <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
              Bemerkungen:
            </Typography>
            <TextField
              sx={{ flex: 3, width: "100%" }}
              variant="outlined"
              size="small"
              multiline
              minRows={3}
              value={notes}
              onChange={onChangeNotes}
            />
          </Stack>
          <Stack
            direction={isMobile ? "column" : "row"}
            justifyContent={"space-between"}
            alignItems={isMobile ? "start" : "center"}
          >
            <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
              Kick-Off:
            </Typography>
            <DatePicker
              sx={{ flex: 3, width: "100%" }}
              slotProps={{
                textField: {
                  variant: "outlined",
                  size: "small",
                },
              }}
              value={kickOffDate}
              onChange={onChangeEstimatedProjectStart}
            />
          </Stack>
          <Stack direction={isMobile ? "column" : "row"} justifyContent={"space-between"} alignItems={"start"}>
            <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
              Besetzungsgremium:
            </Typography>
            <Box flex={isMobile ? 1 : 3}>
              <MemberSelection
                onChangeCallback={handleStaffingCommitteeSelection}
                addMember={addStaffingCommitteeMember}
                removeMember={removeStaffingCommitteeMember}
                selectedMembers={staffingCommittee}
                selectableMembers={selectableStaffingCommittee}
              />
            </Box>
          </Stack>
        </Stack>
      </Paper>
      <Divider sx={{ borderColor: "primary.main", mt: 2, mb: 2 }} />
      <Typography variant="h6" fontWeight={"bold"}>
        Team zusammenstellen
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={styles.tableHeader}>
            <TableRow>
              <TableCell sx={styles.tableHeaderCell}>PM?</TableCell>
              <TableCell sx={styles.tableHeaderCell}>PL?</TableCell>
              <TableCell sx={styles.tableHeaderCell}>Name, Vorname</TableCell>
              <TableCell sx={styles.tableHeaderCell}>Mitgliedstatus</TableCell>
              <TableCell sx={styles.tableHeaderCell}>Datum</TableCell>
              <TableCell sx={styles.tableHeaderCell}>Bewerbung</TableCell>
              <TableCell sx={styles.tableHeaderCell}>Vorherige Bewerbungen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projectDetails.members.map((applicant) => (
              <TableRow key={applicant.memberId} sx={styles.tableRow}>
                <TableCell>
                  <Checkbox
                    checked={
                      projectMembers.some((member) => member.memberId === applicant.memberId) ||
                      projectManager?.memberId === applicant.memberId
                    }
                    size="small"
                    onChange={onChangeProjectMembers}
                    value={applicant.memberId}
                    disabled={projectManager?.memberId === applicant.memberId}
                  />
                </TableCell>
                <TableCell>
                  <Radio
                    size="small"
                    checked={projectManager?.memberId === applicant.memberId}
                    value={applicant.memberId}
                    onChange={onChangeProjectManager}
                  />
                </TableCell>
                <TableCell>
                  <Link
                    to={`/gesamtuebersicht/${applicant.memberId}`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    {applicant.lastname}, {applicant.firstname}
                  </Link>
                </TableCell>
                <TableCell>{applicant.memberStatus.name}</TableCell>
                <TableCell>{dayjs(applicant.applicationDate).format("DD.MM.YYYY")}</TableCell>
                <TableCell>
                  <Link
                    to={`/projekte/${id}/projektbewerbungen/${applicant.memberId}`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <Button variant="outlined" color="primary" size="small">
                      Details {!isMobile && "anzeigen"}
                    </Button>
                  </Link>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="info"
                    size="small"
                    onClick={() => handleOpenPreviousApplications(applicant.memberId)}
                  >
                    Alte Bewerbungen
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {projectMembers.length === 0 ? (
        <Typography variant={"caption"} color={"error"}>
          Bitte wähle mindestens ein Mitglied aus.
        </Typography>
      ) : null}
      <Stack
        direction={isMobile ? "column" : "row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{ marginTop: 10, marginBottom: 2 }}
      >
        <Button
          variant="contained"
          color="success"
          disabled={projectMembers.length === 0 || !projectManager}
          onClick={handleSaveTeamComposition}
        >
          <Groups />
          <Typography sx={{ marginLeft: 1 }}>Teamzusammenstellung bestätigen</Typography>
        </Button>
        <Typography variant="body2" sx={{ marginTop: isMobile ? 3 : 0, marginBottom: 2 }}>
          <strong>Hinweis:</strong> Alle beteiligten Mitglieder werden per E-Mail benachrichtigt.
        </Typography>
      </Stack>
    </Container>
  );
};

export default ProjectTeamComposition;
