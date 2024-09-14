import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import MemberSelection from "../../general/MemberSelection";
import useMembers from "../../../hooks/members/useMembers";
import { ProjectMembersDto } from "../../../types/projectTypes";
import { MembersFieldDto } from "../../../types/membersTypes";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { Clear, Person } from "@mui/icons-material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

/**
 * QualificationWarning Interface for the QM qualification warning dialog
 */
interface WarningDialogProps {
  open: boolean;
  handleAccept: () => void;
  handleCancel: () => void;
  type: "QM" | "PL" | "Mitglied";
}

/**
 * Warning component to display a warning if a member has no QM qualification
 * @param open - boolean if the dialog is open
 * @param handleAccept - function to close the dialog and continue the process
 * @param handleCancel - function to cancel the dialog
 * @returns a dialog to display a warning if a member has no QM qualification, PL qualification or signed the confidentiality agreement
 */
const WarningDialog = ({ open, handleAccept, handleCancel, type }: WarningDialogProps) => {
  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogContent>
        {type === "QM" ? (
          <Box>
            <Typography>
              Dieses Mitglied hat noch keine QM-Befähigung, das heißt es muss vom EV eine außerordentliche Befähigung
              erteilt werden.
            </Typography>
            <br />
            <Typography>Soll der Vorgang fortgesetzt werden?</Typography>
          </Box>
        ) : type === "PL" ? (
          <Box>
            <Typography>
              Dieses Mitglied hat noch keine PL-Befähigung, das heißt es muss vom EV eine außerordentliche Befähigung
              erteilt werden.
            </Typography>
            <br />
            <Typography>Soll der Vorgang fortgesetzt werden?</Typography>
          </Box>
        ) : (
          <Typography>Wurde die Geheimhaltungserklärung unterschrieben?</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Abbrechen</Button>
        <Button onClick={handleAccept}>OK</Button>
      </DialogActions>
    </Dialog>
  );
};

/**
 * ProjectDataDialog component to edit the project members and qms
 */
interface ProjectDataDialogProps {
  projectDataDialogOpen: boolean;
  handleProjectDataDialogClose: () => void;
  projectMembers: ProjectMembersDto[];
  qms: MembersFieldDto[];
  projectSignatureDate: Date | null;
  projectConditions: number | null;
  projectSoldBT: number | null;
  projectSoldExpenses: number | null;
  saveProjectData: (
    projectMembers: ProjectMembersDto[],
    qms: MembersFieldDto[],
    signatureDate: Date | null,
    conditions: number | null,
    soldBT: number | null,
    soldExpenses: number | null
  ) => void;
  checkHasPlQualification: (memberId: number) => boolean;
  checkHasQMQualification: (memberId: number) => boolean;
}

/**
 * ProjectDataDialog component to edit the project members and qms
 * @param projectDataDialogOpen - boolean if the dialog is open
 * @param handleProjectDataDialogClose - function to close the dialog
 * @param projectMembers - array of project members
 * @param qms - array of qms
 * @param projectSignatureDate - the signature date of the project
 * @param projectConditions - the conditions of the project
 * @param projectSoldBT - the sold BT of the project
 * @param projectSoldExpenses - the sold expenses of the project
 * @param saveProjectData - function to save the project data
 * @param checkHasPlQualification - function to check if a member has a PL qualification
 * @param checkHasQMQualification - function to check if a member has a QM qualification
 * @returns A dialog to edit the project members and qms
 */
const ProjectDataDialog = ({
  projectDataDialogOpen,
  handleProjectDataDialogClose,
  projectMembers,
  qms,
  projectSignatureDate,
  projectConditions,
  projectSoldBT,
  projectSoldExpenses,
  saveProjectData,
  checkHasPlQualification,
  checkHasQMQualification,
}: ProjectDataDialogProps) => {
  const { members } = useMembers();

  const [selectedProjectMembers, setSelectedProjectMembers] = useState<ProjectMembersDto[]>(projectMembers);
  const [selectedQms, setSelectedQms] = useState<MembersFieldDto[]>(qms);
  const [signatureDate, setSignatureDate] = useState<Dayjs | null>(dayjs(projectSignatureDate));
  const [conditions, setConditions] = useState<number | null>(projectConditions || 0);
  const [soldBT, setSoldBT] = useState<number | null>(projectSoldBT || 0);
  const [soldExpenses, setSoldExpenses] = useState<number | null>(projectSoldExpenses || 0);
  const [qmWarningOpen, setQMWarningOpen] = useState(false);
  const [plWarningOpen, setPLWarningOpen] = useState(false);
  const [selectedPL, setSelectedPL] = useState<number | null>(null);
  const [ndaWarningOpen, setNDAWarningOpen] = useState(false);
  const selectableMembers = members.filter(
    (member) =>
      selectedProjectMembers.every((pm) => pm.memberId !== member.memberId) &&
      selectedQms.every((qm) => qm.memberId !== member.memberId)
  );

  // save the project data and close the dialog
  const handleProjectDataSave = () => {
    // remove empty members
    setSelectedProjectMembers(selectedProjectMembers.filter((m) => m.memberId !== 0 && m.firstname && m.lastname));
    setSelectedQms(selectedQms.filter((m) => m.memberId !== 0 && m.firstname && m.lastname));
    handleProjectDataDialogClose();
    saveProjectData(
      selectedProjectMembers,
      selectedQms,
      signatureDate?.toDate() || null,
      conditions,
      soldBT,
      soldExpenses
    );
  };

  // add a new project member field
  const addProjectMember = () => {
    setSelectedProjectMembers((prev) => [...prev, [] as unknown as ProjectMembersDto]);
  };

  // remove a project member
  const removeProjectMember = (memberId: number) => {
    setSelectedProjectMembers(selectedProjectMembers.filter((m) => m.memberId !== memberId));
  };

  // handle the change of a project member selection
  const handleMemberSelectionChange = (event: React.SyntheticEvent, value: MembersFieldDto | null) => {
    setNDAWarningOpen(true);
    event.persist();
    const index = Number(event.currentTarget.id.split("-")[1]);
    if (value !== null) {
      const newValue = {
        ...value,
        type: "Mitglied",
        date: new Date(),
        applicationDate: new Date(),
        btAllocation: null,
        expensesAllocation: null,
        moneyTransferred: null,
        freelancerContract: null,
      } as ProjectMembersDto;
      const updatedMembers = [...selectedProjectMembers];
      updatedMembers[index] = newValue;
      setSelectedProjectMembers(updatedMembers);
    }
  };

  // add a new qm field
  const addQm = () => {
    setSelectedQms((prev) => [...prev, [] as unknown as MembersFieldDto]);
  };

  // remove a qm
  const removeQm = (memberId: number) => {
    setSelectedQms(selectedQms.filter((m) => m.memberId !== memberId));
  };

  // handle the change of a qm selection
  const handleQMSelectionChange = (event: React.SyntheticEvent, value: MembersFieldDto | null) => {
    if (!checkHasQMQualification(value?.memberId || 0)) {
      setQMWarningOpen(true);
    }
    event.persist();
    const index = Number(event.currentTarget.id.split("-")[1]);
    if (value !== null) {
      const updatedQms = [...selectedQms];
      updatedQms[index] = value;
      setSelectedQms(updatedQms);
    }
  };

  // close the dialog and restore the previous state
  const handleProjectDataDialogCancle = () => {
    handleProjectDataDialogClose();
    // restore the previous state
    setSelectedProjectMembers(projectMembers);
    setSelectedQms(qms);
  };

  // handle the change of the signature date
  const handleSignatureDateChange = (date: Dayjs | null) => {
    setSignatureDate(date);
  };

  // handle the change of the conditions
  const handleConditionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConditions(Number(event.target.value));
  };

  // handle the change of the sold BT
  const handleSoldBTChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSoldBT(Number(event.target.value));
  };

  // handle the change of the sold expenses
  const handleSoldExpensesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSoldExpenses(Number(event.target.value));
  };

  // set a new PL and remove the old PL
  const setPL = (memberId: number | null) => {
    if (memberId === null) {
      return;
    }
    const updatedMembers = selectedProjectMembers.map((m) => {
      if (m.memberId === memberId) {
        return { ...m, type: "PL" } as ProjectMembersDto;
      } else if (m.type === "PL") {
        return { ...m, type: "Mitglied" } as ProjectMembersDto;
      }
      return m;
    });
    setSelectedProjectMembers(updatedMembers);
    setSelectedPL(null);
  };

  // handle the PL warning dialog accept
  const handlePLWarningAccept = () => {
    setPL(selectedPL);
    setPLWarningOpen(false);
  };

  // handle the PL warning dialog cancel
  const hadlePLWarningCancle = () => {
    setPLWarningOpen(false);
  };

  // set a new PL and remove the old PL
  const handleSetNewPL = async (memberId: number) => {
    if (!checkHasPlQualification(memberId)) {
      setSelectedPL(memberId);
      setPLWarningOpen(true);
    } else {
      setPL(memberId);
    }
  };

  // handle the QM warning dialog cancel
  const handleQMWarningCancle = () => {
    // remove the last added qm
    setSelectedQms(selectedQms.slice(0, selectedQms.length - 1));
    setQMWarningOpen(false);
  };

  // handle the QM warning dialog accept
  const handleQMWarningAccept = () => {
    setQMWarningOpen(false);
  };

  // handle the NDA warning dialog accept
  const handleNDAWarningAccept = () => {
    setNDAWarningOpen(false);
  };

  // handle the NDA warning dialog cancel
  const handleNDAWarningCancle = () => {
    // remove the last added project member
    setSelectedProjectMembers(selectedProjectMembers.slice(0, selectedProjectMembers.length - 1));
    setNDAWarningOpen(false);
  };

  return (
    <Dialog open={projectDataDialogOpen} onClose={handleProjectDataDialogCancle}>
      <DialogTitle fontWeight={"bold"} minWidth={500}>
        Projektdaten bearbeiten
      </DialogTitle>
      <DialogContent>
        <WarningDialog
          open={qmWarningOpen}
          handleAccept={handleQMWarningAccept}
          handleCancel={handleQMWarningCancle}
          type="QM"
        />
        <WarningDialog
          open={plWarningOpen}
          handleAccept={handlePLWarningAccept}
          handleCancel={hadlePLWarningCancle}
          type="PL"
        />
        <WarningDialog
          open={ndaWarningOpen}
          handleAccept={handleNDAWarningAccept}
          handleCancel={handleNDAWarningCancle}
          type="Mitglied"
        />
        <Stack spacing={1}>
          <Typography fontWeight={"bold"}>Projektmitglieder:</Typography>
          <Stack direction={"column"} spacing={2}>
            {selectedProjectMembers.map((member, index) => (
              <Stack key={index} direction="row" spacing={2} alignItems="center">
                <Autocomplete
                  sx={{ width: "100%", flex: 14 }}
                  disablePortal
                  autoSelect
                  id={`members-${index}`}
                  options={selectableMembers}
                  size="small"
                  getOptionLabel={(option: MembersFieldDto) =>
                    option.firstname && option.lastname ? `${option.firstname} ${option.lastname}` : ""
                  }
                  noOptionsText={"Keine Auswahl verfügbar"}
                  value={
                    {
                      memberId: member.memberId,
                      firstname: member.firstname,
                      lastname: member.lastname,
                      memberStatus: member.memberStatus,
                    } as MembersFieldDto
                  }
                  isOptionEqualToValue={(option: MembersFieldDto, value: MembersFieldDto) =>
                    option.memberId === value.memberId
                  }
                  onChange={handleMemberSelectionChange}
                  renderInput={(params) => <TextField {...params} label="Name" variant="outlined" size="small" />}
                />
                {member.type === "PL" ? (
                  <Stack direction={"row"} flex={5} alignItems={"center"} spacing={2}>
                    <Person fontSize="large" color="info" />
                    <Typography fontWeight={"bold"}>(PL)</Typography>
                  </Stack>
                ) : (
                  <Button
                    variant="outlined"
                    sx={{ flex: 5, p: 0, pt: 0.5, pb: 0.5 }}
                    onClick={() => {
                      handleSetNewPL(member.memberId);
                    }}
                  >
                    <Person fontSize="inherit" sx={{ mr: 0.5 }} /> <Typography fontSize={10}>Zum PL machen</Typography>
                  </Button>
                )}
                <IconButton onClick={() => removeProjectMember(member.memberId)} sx={{ flex: 1 }} size="small">
                  <Clear color="primary" />
                </IconButton>
              </Stack>
            ))}
            <Box sx={{ alignContent: "start" }}>
              <IconButton
                onClick={() => addProjectMember()}
                aria-label="add"
                color="primary"
                disabled={selectableMembers.length === 0}
              >
                <AddCircleOutlineIcon />
              </IconButton>
            </Box>
          </Stack>
          <Typography fontWeight={"bold"}>QMs:</Typography>
          <MemberSelection
            selectableMembers={selectableMembers}
            selectedMembers={selectedQms}
            onChangeCallback={handleQMSelectionChange}
            addMember={addQm}
            removeMember={removeQm}
          />
          <Typography fontWeight={"bold"}>Unterschriftsdatum:</Typography>
          <DatePicker
            slotProps={{
              textField: {
                variant: "outlined",
                size: "small",
              },
            }}
            maxDate={dayjs()}
            value={signatureDate}
            onChange={handleSignatureDateChange}
          />
          <Stack direction={"column"}>
            <Typography fontWeight={"bold"}>Konditionen:</Typography>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={conditions}
              onChange={handleConditionsChange}
              type="number"
              inputProps={{ min: 0 }}
            />
            {conditions !== null && isNaN(conditions) ? (
              <Typography color={"error"} fontSize={12}>
                Bitte gib einen Wert ein.
              </Typography>
            ) : null}
          </Stack>
          <Typography fontWeight={"bold"}>Verkaufte BT:</Typography>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            type="number"
            value={soldBT}
            onChange={handleSoldBTChange}
            inputProps={{ min: 0 }}
          />
          {soldBT !== null && isNaN(soldBT) ? (
            <Typography color={"error"} fontSize={12}>
              Bitte gib einen Wert ein.
            </Typography>
          ) : null}
          <Typography fontWeight={"bold"}>Verkaufte Spesen:</Typography>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            type="number"
            value={soldExpenses}
            onChange={handleSoldExpensesChange}
            inputProps={{ min: 0 }}
          />
          {soldExpenses !== null && isNaN(soldExpenses) ? (
            <Typography color={"error"} fontSize={12}>
              Bitte gib einen Wert ein.
            </Typography>
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ borderTop: 1, color: "primary.main" }}>
        <Button onClick={handleProjectDataDialogCancle}>Abbrechen</Button>
        <Button
          onClick={handleProjectDataSave}
          disabled={selectedProjectMembers.length === 0 || !selectedProjectMembers.some((m) => m.type === "PL")}
        >
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectDataDialog;
