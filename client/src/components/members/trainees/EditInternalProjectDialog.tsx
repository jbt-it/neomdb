import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import FieldSection, { Field } from "../../general/FieldSection";
import MemberSelection from "../../general/MemberSelection";
import { InternalProjectDto } from "../../../types/traineesTypes";
import { MembersFieldDto } from "../../../types/membersTypes";
import useResponsive from "../../../hooks/useResponsive";
import dayjs, { Dayjs } from "dayjs";

/**
 * Interface for the edit internal project dialog
 */
interface EditInternalProjectDialogProps {
  internalProjectDetails: InternalProjectDto;
  open: boolean;
  closeDialog: () => void;
  updateInternalProjectDetails: (data: InternalProjectDto) => void;
  selectableTrainees: MembersFieldDto[];
  selectableQMs: MembersFieldDto[];
}

/**
 * Function Component that allows editing of internal project details
 * @param internalProjectDetails - the internal project details
 * @param open - boolean that indicates if the dialog is open
 * @param closeDialog - function to close the dialog
 * @param updateInternalProjectDetails - function to update the internal project details
 * @param selectableTrainees - the selectable trainees
 * @param selectableQMs - the selectable QMs
 * @returns the dialog for editing internal project details
 */
const EditInternalProjectDialog: React.FunctionComponent<EditInternalProjectDialogProps> = ({
  internalProjectDetails,
  open,
  closeDialog,
  selectableTrainees,
  selectableQMs,
  updateInternalProjectDetails,
}: EditInternalProjectDialogProps) => {
  const theme = useTheme();

  const styles = {
    submit: {
      margin: theme.spacing(3, 0, 1),
      color: "white",
    },
    fieldSectionBox: {
      margin: theme.spacing(1),
    },
    button: {
      padding: "6px 12px",
      textAlign: "center",
      textDecoration: "none",
      display: "inline-block",
      margin: "4px 2px",
      cursor: "pointer",
      backgroundColor: "white",
      color: "black",
      border: "none",
    },
    fullWidth: {
      width: "100%",
    },
    submitContainer: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    cancelButton: {
      margin: theme.spacing(1, 1, 1, 1),
    },
    submitButton: {
      margin: theme.spacing(1, 0, 1, 1),
      color: "white",
    },
    projectMembers: {
      flexGrow: 1,
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(1),
    },
  };
  const isMobile = useResponsive("down", "sm");
  const [projectName, setProjectName] = useState<string>(internalProjectDetails.projectName);
  const [abbreviation, setAbbreviation] = useState<string>(internalProjectDetails.abbreviation);
  const [generationName, setGenerationName] = useState<string>(internalProjectDetails.generationName);
  const [kickoff, setKickoff] = useState<Dayjs | null | undefined>(dayjs(internalProjectDetails.kickoff));
  const [offerAtEV, setOfferAtEV] = useState<boolean | undefined>(internalProjectDetails.offerAtEv);
  const [zpHeld, setZpHeld] = useState<Dayjs | null | undefined>(dayjs(internalProjectDetails.zpHeld));
  const [zpAtEv, setZpAtEv] = useState<boolean | undefined>(internalProjectDetails.zpAtEv);
  const [apHeld, setApHeld] = useState<Dayjs | null | undefined>(dayjs(internalProjectDetails.apHeld));
  const [apAtEv, setApAtEv] = useState<boolean | undefined>(internalProjectDetails.apAtEv);
  const [dlAtEv, setDlAtEv] = useState<boolean | undefined>(internalProjectDetails.dlAtEv);
  const [projectMembers, setProjectMembers] = useState<MembersFieldDto[]>(internalProjectDetails.members || []);
  const [qualityManagers, setQualityManagers] = useState<MembersFieldDto[]>(
    internalProjectDetails.qualityManagers || []
  );

  const errorAP = apHeld ? (kickoff ? apHeld.isBefore(kickoff) : zpHeld ? apHeld.isBefore(zpHeld) : false) : false;
  const errorZP = zpHeld ? (kickoff ? zpHeld.isBefore(kickoff) : false) : false;

  const errorName = projectName === "";
  const errorAbbreviation = abbreviation === "";

  const errorEmptyMembers = projectMembers.some((member) => Object.keys(member).length === 0);
  const errorEmptyQMs = qualityManagers.some((member) => Object.keys(member).length === 0);

  // Function to update the internal project details
  const handleUpdateInternalProjectDetails = () => {
    if (errorAP || errorZP || errorName || errorAbbreviation || errorEmptyMembers || errorEmptyQMs) {
      return;
    }

    const data: InternalProjectDto = {
      internalProjectID: internalProjectDetails?.internalProjectID,
      generation: internalProjectDetails.generation,
      generationName: generationName,
      projectName: projectName,
      abbreviation: abbreviation,
      kickoff: kickoff ? kickoff.toDate() : null,
      offerAtEv: offerAtEV ? true : false,
      zpAtEv: zpAtEv ? true : false,
      zpHeld: zpHeld ? zpHeld.toDate() : null,
      apAtEv: apAtEv ? true : false,
      apHeld: apHeld ? apHeld.toDate() : null,
      dlAtEv: dlAtEv ? true : false,
      members: projectMembers,
      qualityManagers: qualityManagers,
    };

    updateInternalProjectDetails(data);
  };
  /**
   * Handles the closing of the internal project information dialog
   * @param event FormEvent
   */
  const handleInternalProjectInfoDialogClose: VoidFunction = () => {
    setProjectName(internalProjectDetails.projectName);
    setAbbreviation(internalProjectDetails.abbreviation);
    setGenerationName(internalProjectDetails.generationName);
    setKickoff(dayjs(internalProjectDetails.kickoff));
    setOfferAtEV(internalProjectDetails.offerAtEv);
    setApHeld(dayjs(internalProjectDetails.apHeld));
    setApAtEv(internalProjectDetails.apAtEv);
    setZpHeld(dayjs(internalProjectDetails.zpHeld));
    setZpAtEv(internalProjectDetails.zpAtEv);
    setDlAtEv(internalProjectDetails.dlAtEv);
    setProjectMembers(internalProjectDetails.members || []);
    setQualityManagers(internalProjectDetails.qualityManagers || []);
    closeDialog();
  };

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(event.target.value);
  };

  const onChangeKuerzel = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAbbreviation(event.target.value);
  };

  const onChangeTraineegeneration = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGenerationName(event.target.value);
  };

  const onChangeKickoff = (value: unknown) => {
    const dateValue = value as Dayjs;
    setKickoff(dateValue);
  };

  const onChangeApDatum = (value: unknown) => {
    const dateValue = value as Dayjs;
    setApHeld(dateValue);
  };

  const onChangeZpDatum = (value: unknown) => {
    const dateValue = value as Dayjs;
    setZpHeld(dateValue);
  };

  const onChangeAngebotAbgegeben = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOfferAtEV(event.target.checked);
  };

  const onChangeApAbgegeben = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApAtEv(event.target.checked);
  };

  const onChangeZpAbgegeben = (event: React.ChangeEvent<HTMLInputElement>) => {
    setZpAtEv(event.target.checked);
  };

  const onChangeDlAbgegeben = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDlAtEv(event.target.checked);
  };

  // Function to handle the selection of a member
  const handleMemberSelection = (event: React.SyntheticEvent, value: MembersFieldDto | null) => {
    event.persist();
    const index = Number(event.currentTarget.id.split("-")[1]);
    if (value !== null) {
      const updatedMembers = [...projectMembers];
      updatedMembers[index] = value;
      setProjectMembers(updatedMembers);
    }
  };

  // Function to add a member to the list of members
  const addMember = () => {
    setProjectMembers((prev) => [...prev, [] as unknown as MembersFieldDto]);
  };

  // Function to remove a member from the list of members
  const removeMember = (memberId: number) => {
    const updatedMembers = projectMembers.filter((member) => member.memberId !== memberId);
    setProjectMembers(updatedMembers);
  };

  // Function to handle the selection of a QM
  const handleQMSelection = (event: React.SyntheticEvent, value: MembersFieldDto | null) => {
    const index = Number(event.currentTarget.id.split("-")[1]);
    if (value !== null) {
      const updatedQMs = [...qualityManagers];
      updatedQMs[index] = value;
      setQualityManagers(updatedQMs);
    }
  };

  // Function to add a member to the list of QMs
  const addQM = () => {
    setQualityManagers((prev) => [...prev, [] as unknown as MembersFieldDto]);
  };

  // Function to remove a member from the list of QMs
  const removeQM = (memberId: number) => {
    const updatedQMs = qualityManagers.filter((member) => member.memberId !== memberId);
    setQualityManagers(updatedQMs);
  };

  // detail fields
  const internalProjectDialogFields: Array<Field> = [
    {
      label: "Name",
      state: projectName,
      width: isMobile ? "full" : "half",
      onChangeCallback: onChangeName,
      type: "Text",
      error: errorName,
      helperText: errorName ? "Name darf nicht leer sein" : "",
    },
    {
      label: "Kürzel",
      state: abbreviation,
      width: isMobile ? "full" : "half",
      onChangeCallback: onChangeKuerzel,
      type: "Text",
      error: errorAbbreviation,
      helperText: errorAbbreviation ? "Kürzel darf nicht leer sein" : "",
    },
    {
      label: "Traineegeneration",
      state: generationName,
      width: "full",
      onChangeCallback: onChangeTraineegeneration,
      type: "Text",
      disabled: true,
    },
    { label: "Kickoff", state: dayjs(kickoff), width: "full", onChangeCallback: onChangeKickoff, type: "Date" },
    {
      label: "ZP Datum",
      state: dayjs(zpHeld),
      width: "full",
      onChangeCallback: onChangeZpDatum,
      type: "Date",
      error: errorZP,
      helperText: errorZP ? "Datum der Zwischenpräsentation darf nicht vor dem Kickoff liegen" : "",
    },
    {
      label: "AP Datum",
      state: dayjs(apHeld),
      width: "full",
      onChangeCallback: onChangeApDatum,
      type: "Date",
      error: errorAP,
      helperText: errorAP ? "Datum der Abschlusspräsentation darf nicht vor dem Kickoff oder der ZP liegen" : "",
    },
  ];

  // Checkbox fields
  const fieldDocuments: Array<Field> = [
    {
      label: "Angebot abgegeben",
      state: offerAtEV,
      width: "full",
      onChangeCallback: onChangeAngebotAbgegeben,
      type: "Checkbox",
    },
    {
      label: "ZP abgegeben",
      state: zpAtEv,
      width: "full",
      onChangeCallback: onChangeZpAbgegeben,
      type: "Checkbox",
    },
    {
      label: "AP abgegeben",
      state: apAtEv,
      width: "full",
      onChangeCallback: onChangeApAbgegeben,
      type: "Checkbox",
    },
    {
      label: "DL abgegeben",
      state: dlAtEv,
      width: "full",
      onChangeCallback: onChangeDlAbgegeben,
      type: "Checkbox",
    },
  ];

  return (
    <Dialog open={open} onClose={handleInternalProjectInfoDialogClose}>
      <DialogTitle>{internalProjectDetails.projectName} bearbeiten</DialogTitle>
      <DialogContent dividers={true}>
        <Box sx={styles.fieldSectionBox}>
          <FieldSection title={"Details"} fields={internalProjectDialogFields}></FieldSection>
        </Box>
        <Box sx={styles.fieldSectionBox}>
          <FieldSection title={"Dokumente"} fields={fieldDocuments}></FieldSection>
        </Box>
        <Box sx={styles.fieldSectionBox && styles.projectMembers}>
          <Typography variant="subtitle1">Projektmitglieder</Typography>
          {errorEmptyMembers ? (
            <Typography color="error">Bitte füge ein Projektmitglied hinzu oder lösche das leere Feld</Typography>
          ) : null}
          <MemberSelection
            selectedMembers={projectMembers}
            addMember={addMember}
            onChangeCallback={handleMemberSelection}
            removeMember={removeMember}
            selectableMembers={selectableTrainees}
          />
        </Box>
        <Box className={`${styles.fieldSectionBox} ${styles.projectMembers}`}>
          <Typography variant="subtitle1">Qualitätsmanager</Typography>
          {errorEmptyQMs ? (
            <Typography color="error">Bitte füge ein Qualitätsmanager hinzu oder lösche das leere Feld</Typography>
          ) : null}
          <MemberSelection
            selectedMembers={qualityManagers}
            addMember={addQM}
            removeMember={removeQM}
            onChangeCallback={handleQMSelection}
            selectableMembers={selectableQMs}
          ></MemberSelection>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          sx={styles.cancelButton}
          variant="contained"
          fullWidth
          color="primary"
          onClick={handleInternalProjectInfoDialogClose}
        >
          Abbrechen
        </Button>
        <Button
          sx={styles.submitButton}
          variant="contained"
          fullWidth
          color="primary"
          onClick={handleUpdateInternalProjectDetails}
        >
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditInternalProjectDialog;
