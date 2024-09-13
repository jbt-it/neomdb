import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import MemberSelection from "../../general/MemberSelection";
import useMembers from "../../../hooks/members/useMembers";
import { ProjectMembersDto } from "../../../types/projectTypes";
import { MembersFieldDto } from "../../../types/membersTypes";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

/**
 * ProjectDataDialog component to edit the project members and qms
 */
interface ProjectDataDialogProps {
  projectDataDialogOpen: boolean;
  handleProjectDataDialogClose: () => void;
  saveProjectData: () => void;
  projectMembers: ProjectMembersDto[];
  qms: MembersFieldDto[];
  projectSignatureDate: Date | null;
  projectConditions: number | null;
  projectSoldBT: number | null;
  projectSoldExpenses: number | null;
}

const ProjectDataDialog = ({
  projectDataDialogOpen,
  handleProjectDataDialogClose,
  saveProjectData,
  projectMembers,
  qms,
  projectSignatureDate,
  projectConditions,
  projectSoldBT,
  projectSoldExpenses,
}: ProjectDataDialogProps) => {
  const { members } = useMembers();

  const [selectedProjectMembers, setSelectedProjectMembers] = useState<MembersFieldDto[]>(
    projectMembers.map((member) => ({
      memberId: member.memberId,
      firstname: member.firstname,
      lastname: member.lastname,
    }))
  );
  const [selectedQms, setSelectedQms] = useState<MembersFieldDto[]>(qms);
  const [signatureDate, setSignatureDate] = useState<Dayjs | null>(dayjs(projectSignatureDate));
  const [conditions, setConditions] = useState<number | null>(projectConditions || 0);
  const [soldBT, setSoldBT] = useState<number | null>(projectSoldBT || 0);
  const [soldExpenses, setSoldExpenses] = useState<number | null>(projectSoldExpenses || 0);

  // save the project data and close the dialog
  const handleProjectDataSave = () => {
    handleProjectDataDialogClose();
    saveProjectData();
  };

  // add a new project member field
  const addProjectMember = () => {
    setSelectedProjectMembers((prev) => [...prev, [] as unknown as MembersFieldDto]);
  };

  // remove a project member
  const removeProjectMember = (memberId: number) => {
    setSelectedProjectMembers(selectedProjectMembers.filter((m) => m.memberId !== memberId));
  };

  // handle the change of a project member selection
  const handleMemberSelectionChange = (event: React.SyntheticEvent, value: MembersFieldDto | null) => {
    event.persist();
    const index = Number(event.currentTarget.id.split("-")[1]);
    if (value !== null) {
      const updatedMembers = [...selectedProjectMembers];
      updatedMembers[index] = value;
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
    setSelectedProjectMembers(
      projectMembers.map((member) => ({
        memberId: member.memberId,
        firstname: member.firstname,
        lastname: member.lastname,
      }))
    );
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

  return (
    <Dialog open={projectDataDialogOpen}>
      <DialogTitle fontWeight={"bold"} minWidth={500}>
        Projektdaten bearbeiten
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography fontWeight={"bold"}>Projektmitglieder:</Typography>
          <MemberSelection
            selectableMembers={members.filter((m) => qms.every((pm) => pm.memberId !== m.memberId))}
            selectedMembers={selectedProjectMembers}
            onChangeCallback={handleMemberSelectionChange}
            addMember={addProjectMember}
            removeMember={removeProjectMember}
          />
          <Typography fontWeight={"bold"}>QMs:</Typography>
          <MemberSelection
            selectableMembers={members.filter((m) => projectMembers.every((pm) => pm.memberId !== m.memberId))}
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
            />
          </Stack>
          <Typography fontWeight={"bold"}>Verkaufte BT:</Typography>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            type="number"
            value={soldBT}
            onChange={handleSoldBTChange}
          />
          <Typography fontWeight={"bold"}>Verkaufte Spesen:</Typography>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            type="number"
            value={soldExpenses}
            onChange={handleSoldExpensesChange}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ borderTop: 1, color: "primary.main" }}>
        <Button onClick={handleProjectDataDialogCancle}>Abbrechen</Button>
        <Button onClick={handleProjectDataSave}>Speichern</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectDataDialog;
