import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import React, { useState } from "react";
import FieldSection, { Field } from "../../general/FieldSection";
import MemberSelection from "../../general/MemberSelection";
import { IpInfoType } from "../../../types/traineesTypes";
import { MembersField } from "../../../types/membersTypes";
import useResponsive from "../../../hooks/useResponsive";
import dayjs, { Dayjs } from "dayjs";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
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
}));

/**
 * Interface for the edit internal project dialog
 */
interface EditInternalProjectDialogProps {
  internalProjectDetails: IpInfoType;
  open: boolean;
  closeDialog: () => void;
  updateInternalProjectDetails: (data: IpInfoType | null) => void;
  selectableTrainees: MembersField[];
  selectableQMs: MembersField[];
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
  const classes = useStyles();
  const isMobile = useResponsive("down", "sm");
  const [name, setName] = useState<string>(internalProjectDetails.name);
  const [kuerzel, setKuerzel] = useState<string>(internalProjectDetails.kuerzel);
  const [traineegeneration, setTraineegeneration] = useState<string>(internalProjectDetails.traineegeneration);
  const [kickoff, setKickoff] = useState<Dayjs | null | undefined>(internalProjectDetails.kickoff);
  const [angebotAbgegeben, setAngebotAbgegeben] = useState<boolean | undefined>(
    internalProjectDetails.angebotAbgegeben
  );
  const [zpDatum, setZpDatum] = useState<Dayjs | null | undefined>(internalProjectDetails.zpDatum);
  const [zpAbgegeben, setZpAbgegeben] = useState<boolean | undefined>(internalProjectDetails.zpAbgegeben);
  const [apDatum, setApDatum] = useState<Dayjs | null | undefined>(internalProjectDetails.apDatum);
  const [apAbgegeben, setApAbgegeben] = useState<boolean | undefined>(internalProjectDetails.apAbgegeben);
  const [dlAbgegeben, setDlAbgegeben] = useState<boolean | undefined>(internalProjectDetails.dlAbgegeben);
  const [projektmitglieder, setProjektmitglieder] = useState<MembersField[]>(internalProjectDetails.projektmitglieder);
  const [qualitaetsmanager, setQualitaetsmanager] = useState<MembersField[]>(internalProjectDetails.qualitaetsmanager);

  const errorAP = apDatum ? (kickoff ? apDatum.isBefore(kickoff) : zpDatum ? apDatum.isBefore(zpDatum) : false) : false;
  const errorZP = zpDatum ? (kickoff ? zpDatum.isBefore(kickoff) : false) : false;

  const errorName = name === "";
  const errorKuerzel = kuerzel === "";

  // Function to update the internal project details
  const handleUpdateInternalProjectDetails = () => {
    if (errorAP || errorZP || errorName || errorKuerzel) {
      return;
    }
    closeDialog();
    const data = internalProjectDetails
      ? {
          id: internalProjectDetails?.id,
          name,
          kuerzel,
          traineegeneration,
          kickoff,
          angebotAbgegeben,
          apAbgegeben,
          apDatum,
          zpDatum,
          dlAbgegeben,
          zpAbgegeben,
          projektmitglieder,
          qualitaetsmanager,
        }
      : null;
    internalProjectDetails ? updateInternalProjectDetails(data) : null;
  };

  /**
   * Handles the closing of the internal project information dialog
   * @param event FormEvent
   */
  const handleInternalProjectInfoDialogClose: VoidFunction = () => {
    setName(internalProjectDetails.name);
    setKuerzel(internalProjectDetails.kuerzel);
    setTraineegeneration(internalProjectDetails.traineegeneration);
    setKickoff(internalProjectDetails.kickoff);
    setAngebotAbgegeben(internalProjectDetails.angebotAbgegeben);
    setApDatum(internalProjectDetails.apDatum);
    setApAbgegeben(internalProjectDetails.apAbgegeben);
    setZpDatum(internalProjectDetails.zpDatum);
    setZpAbgegeben(internalProjectDetails.zpAbgegeben);
    setDlAbgegeben(internalProjectDetails.dlAbgegeben);
    setProjektmitglieder(internalProjectDetails.projektmitglieder);
    setQualitaetsmanager(internalProjectDetails.qualitaetsmanager);
    closeDialog();
  };

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const onChangeKuerzel = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKuerzel(event.target.value);
  };

  const onChangeTraineegeneration = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTraineegeneration(event.target.value);
  };

  const onChangeKickoff = (value: unknown) => {
    const dateValue = value as Dayjs;
    setKickoff(dateValue);
  };

  const onChangeApDatum = (value: unknown) => {
    const dateValue = value as Dayjs;
    setApDatum(dateValue);
  };

  const onChangeZpDatum = (value: unknown) => {
    const dateValue = value as Dayjs;
    setZpDatum(dateValue);
  };

  const onChangeAngebotAbgegeben = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAngebotAbgegeben(event.target.checked);
  };

  const onChangeApAbgegeben = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApAbgegeben(event.target.checked);
  };

  const onChangeZpAbgegeben = (event: React.ChangeEvent<HTMLInputElement>) => {
    setZpAbgegeben(event.target.checked);
  };

  const onChangeDlAbgegeben = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDlAbgegeben(event.target.checked);
  };

  // Function to handle the selection of a member
  const handleMemberSelection = (event: React.SyntheticEvent, value: MembersField | null) => {
    event.persist();
    const index = Number(event.currentTarget.id.split("-")[1]);
    if (value !== null) {
      const updatedMembers = [...projektmitglieder];
      updatedMembers[index] = value;
      setProjektmitglieder(updatedMembers);
    }
  };

  // Function to add a member to the list of members
  const addMember = () => {
    setProjektmitglieder((prev) => [...prev, [] as unknown as MembersField]);
  };

  // Function to remove a member from the list of members
  const removeMember = (mitgliedID: number) => {
    const updatedMembers = projektmitglieder.filter((member) => member.mitgliedID !== mitgliedID);
    setProjektmitglieder(updatedMembers);
  };

  // Function to handle the selection of a QM
  const handleQMSelection = (event: React.SyntheticEvent, value: MembersField | null) => {
    const index = Number(event.currentTarget.id.split("-")[1]);
    if (value !== null) {
      const updatedQMs = [...qualitaetsmanager];
      updatedQMs[index] = value;
      setQualitaetsmanager(updatedQMs);
    }
  };

  // Function to add a member to the list of QMs
  const addQM = () => {
    setQualitaetsmanager((prev) => [...prev, [] as unknown as MembersField]);
  };

  // Function to remove a member from the list of QMs
  const removeQM = (mitgliedID: number) => {
    const updatedQMs = qualitaetsmanager.filter((member) => member.mitgliedID !== mitgliedID);
    setQualitaetsmanager(updatedQMs);
  };

  // detail fields
  const internalProjectDialogFields: Array<Field> = [
    {
      label: "Name",
      state: name,
      width: isMobile ? "full" : "half",
      onChangeCallback: onChangeName,
      type: "Text",
      error: errorName,
      helperText: errorName ? "Name darf nicht leer sein" : "",
    },
    {
      label: "Kürzel",
      state: kuerzel,
      width: isMobile ? "full" : "half",
      onChangeCallback: onChangeKuerzel,
      type: "Text",
      error: errorKuerzel,
      helperText: errorKuerzel ? "Kürzel darf nicht leer sein" : "",
    },
    {
      label: "Traineegeneration",
      state: traineegeneration,
      width: "full",
      onChangeCallback: onChangeTraineegeneration,
      type: "Text",
      disabled: true,
    },
    { label: "Kickoff", state: dayjs(kickoff), width: "full", onChangeCallback: onChangeKickoff, type: "Date" },
    {
      label: "ZP Datum",
      state: dayjs(zpDatum),
      width: "full",
      onChangeCallback: onChangeZpDatum,
      type: "Date",
      error: errorZP,
      helperText: errorZP ? "Datum der Zwischenpräsentation darf nicht vor dem Kickoff liegen" : "",
    },
    {
      label: "AP Datum",
      state: dayjs(apDatum),
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
      state: angebotAbgegeben,
      width: "full",
      onChangeCallback: onChangeAngebotAbgegeben,
      type: "Checkbox",
    },
    {
      label: "ZP abgegeben",
      state: zpAbgegeben,
      width: "full",
      onChangeCallback: onChangeZpAbgegeben,
      type: "Checkbox",
    },
    {
      label: "AP abgegeben",
      state: apAbgegeben,
      width: "full",
      onChangeCallback: onChangeApAbgegeben,
      type: "Checkbox",
    },
    {
      label: "DL abgegeben",
      state: dlAbgegeben,
      width: "full",
      onChangeCallback: onChangeDlAbgegeben,
      type: "Checkbox",
    },
  ];

  return (
    <Dialog open={open} onClose={handleInternalProjectInfoDialogClose}>
      <DialogTitle>{internalProjectDetails.name} bearbeiten</DialogTitle>
      <DialogContent dividers={true}>
        <div className={classes.fieldSectionBox}>
          <FieldSection title={"Details"} fields={internalProjectDialogFields}></FieldSection>
        </div>
        <div className={classes.fieldSectionBox}>
          <FieldSection title={"Dokumente"} fields={fieldDocuments}></FieldSection>
        </div>
        <div className={`${classes.fieldSectionBox} ${classes.projectMembers}`}>
          <Typography variant="subtitle1">Projektmitglieder</Typography>
          <MemberSelection
            selectedMembers={projektmitglieder}
            addMember={addMember}
            onChangeCallback={handleMemberSelection}
            removeMember={removeMember}
            selectableMembers={selectableTrainees}
            memberstatus={["Trainee"]}
          ></MemberSelection>
        </div>
        <div className={`${classes.fieldSectionBox} ${classes.projectMembers}`}>
          <Typography variant="subtitle1">Qualitätsmanager</Typography>
          <MemberSelection
            selectedMembers={qualitaetsmanager}
            addMember={addQM}
            removeMember={removeQM}
            onChangeCallback={handleQMSelection}
            selectableMembers={selectableQMs}
          ></MemberSelection>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          className={classes.cancelButton}
          variant="contained"
          fullWidth
          color="primary"
          onClick={handleInternalProjectInfoDialogClose}
        >
          Abbrechen
        </Button>
        <Button
          className={classes.submitButton}
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
