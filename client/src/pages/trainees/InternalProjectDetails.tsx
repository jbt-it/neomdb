import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  styled,
  Paper,
  Typography,
  Box,
  IconButton,
} from "@mui/material";

import { makeStyles } from "@mui/styles";
import FieldSection, { Field } from "../../components/general/FieldSection";
import dayjs, { Dayjs } from "dayjs";
import { transformDateToReadableString } from "../../utils/dateUtils";
import InfoSection, { InformationField } from "../../components/general/InfoSection";
import { InternalProjectType } from "./traineesTypes";
import { Edit } from "@mui/icons-material";

/**
 * Function which provides the styles
 */

const styles = {
  dialog: {
    margin: "auto",
  },
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  margin: "auto",
  marginTop: theme.spacing(3),
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "80%",
}));

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
}));

console.log("HERE");

interface InternalProjectDetailsProps {
  internalProject: InternalProjectType;
  hasPermission: boolean;
  updateInternalProjectDetails: (data: InternalProjectType) => void;
}

const DisplayInternalProjectDetails: React.FunctionComponent<InternalProjectDetailsProps> = (
  props: InternalProjectDetailsProps
) => {
  console.log("Display Internal Project Details");
  const classes = useStyles();

  // States
  const [internalProjectDetails, setInternalProjectDetails] = useState<InternalProjectType | null>(null);
  const [name, setName] = useState<string>("");
  const [kuerzel, setKuerzel] = useState<string>("");
  const [traineegeneration, setTraineegeneration] = useState<string>("");
  const [kickoff, setKickoff] = useState<Date | undefined>();
  const [angebotAbgegeben, setAngebotAbgegeben] = useState<boolean>();
  const [apDatum, setApDatum] = useState<Date | undefined>();
  const [apAbgegeben, setApAbgegeben] = useState<boolean>();
  const [zpDatum, setZpDatum] = useState<Date | undefined>();
  const [zpAbgegeben, setZpAbgegeben] = useState<boolean>();
  const [dlAbgegeben, setDlAbgegeben] = useState<boolean>();
  const [projektmitglieder, setProjektmitglieder] = useState<string>("");
  const [qualitaetsmanager, setQualitaetsmanager] = useState<string>("");

  const [internalProjectInfoDialogOpen, setInternalProjectInfoDialogOpen] = useState<boolean>(false);

  setInternalProjectDetails(props.internalProject);
  setName(props.internalProject?.name);
  setKuerzel(props.internalProject?.kuerzel);
  setTraineegeneration(props.internalProject?.traineegeneration);
  setKickoff(props.internalProject?.kickoff);
  setAngebotAbgegeben(props.internalProject?.angebotAbgegeben);
  setApDatum(props.internalProject?.apDatum);
  setApAbgegeben(props.internalProject?.apAbgegeben);
  setZpDatum(props.internalProject?.zpDatum);
  setZpAbgegeben(props.internalProject?.zpAbgegeben);
  setDlAbgegeben(props.internalProject?.dlAbgegeben);
  setProjektmitglieder(props.internalProject?.projektmitglieder);
  setQualitaetsmanager(props.internalProject?.qualitaetsmanager);

  /**
   * Handles the click on the edit button of the internal project information section
   * @param event MouseEvent
   */
  const handleInternalProjectInfoDialogOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    setInternalProjectInfoDialogOpen(true);
  };

  /**
   * Handles the closing of the internal project information dialog
   * @param event FormEvent
   * TODO: Default-Werte wiederherstellen
   */
  const handleInternalProjectInfoDialogClose: VoidFunction = () => {
    setName(props.internalProject.name);
    setKuerzel(props.internalProject.kuerzel);
    setTraineegeneration(props.internalProject.traineegeneration);
    setKickoff(props.internalProject.kickoff);
    setAngebotAbgegeben(props.internalProject.angebotAbgegeben);
    setApDatum(props.internalProject.apDatum);
    setApAbgegeben(props.internalProject.apAbgegeben);
    setZpDatum(props.internalProject.zpDatum);
    setZpAbgegeben(props.internalProject.zpAbgegeben);
    setDlAbgegeben(props.internalProject.dlAbgegeben);
    setProjektmitglieder(props.internalProject.projektmitglieder);
    setQualitaetsmanager(props.internalProject.qualitaetsmanager);
    setInternalProjectInfoDialogOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = {
      name,
      kuerzel,
      traineegeneration,
      kickoff,
      angebotAbgegeben,
      apAbgegeben,
      apDatum,
      zpDatum,
      projektmitglieder,
      dlAbgegeben,
      zpAbgegeben,
      qualitaetsmanager,
    };
    //props.updateInternalProjectDetails(data);
    setInternalProjectInfoDialogOpen(false);
  };

  // functions to change the state in the update dialog
  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const onChangeKuerzel = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKuerzel(event.target.value);
  };

  const onChangeKickoff = (value: unknown) => {
    const dateValue = (value as Dayjs).toDate();
    setKickoff(dateValue);
  };

  const onChangeApDatum = (value: unknown) => {
    const dateValue = (value as Dayjs).toDate();
    setApDatum(dateValue);
  };

  const onChangeZpDatum = (value: unknown) => {
    const dateValue = (value as Dayjs).toDate();
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

  // Fields of the update dialog
  const InternalProjectDialogFields: Array<Field> = [
    {
      label: "Name",
      state: name,
      width: "half",
      onChangeCallback: onChangeName,
      type: "Text",
    },
    { label: "Kürzel", state: kuerzel, width: "half", onChangeCallback: onChangeKuerzel, type: "Text" },
    {
      label: "Traineegeneration",
      state: traineegeneration,
      width: "full",
      onChangeCallback: onChangeName,
      type: "Text",
    },
    { label: "Kickoff", state: dayjs(kickoff), width: "full", onChangeCallback: onChangeKickoff, type: "Date" },
    {
      label: "AP Datum",
      state: dayjs(apDatum),
      width: "full",
      onChangeCallback: onChangeApDatum,
      type: "Date",
    },
    { label: "ZP Datum", state: dayjs(zpDatum), width: "full", onChangeCallback: onChangeZpDatum, type: "Date" },
  ];

  const FieldDocuments: Array<Field> = [
    {
      label: "Angebot abgegeben",
      state: angebotAbgegeben,
      width: "full",
      onChangeCallback: onChangeAngebotAbgegeben,
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
      label: "ZP abgegeben",
      state: dlAbgegeben,
      width: "full",
      onChangeCallback: onChangeZpAbgegeben,
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

  const InternalProjectMembers: Array<Field> = [
    {
      label: "Projektmitglieder",
      state: projektmitglieder,
      width: "full",
      onChangeCallback: onChangeDlAbgegeben,
      type: "Text",
    },
    {
      label: "Qualitätsmanager",
      state: qualitaetsmanager,
      width: "full",
      onChangeCallback: onChangeDlAbgegeben,
      type: "Text",
    },
  ];

  const internalProjectDetailsFields: Array<InformationField> = [
    {
      label: "Internesprojekt",
      value: internalProjectDetails?.name,
      type: "text",
    },
    {
      label: "Kürzel",
      value: internalProjectDetails?.kuerzel,
      type: "text",
    },
    {
      label: "Traineegeneration",
      value: internalProjectDetails?.traineegeneration,
      type: "text",
    },
    {
      label: "Kickoff",
      value: internalProjectDetails?.kickoff ? transformDateToReadableString(internalProjectDetails?.kickoff) : "",
      type: "text",
    },
    {
      label: "Angebot abgegeben",
      value: internalProjectDetails?.angebotAbgegeben ? true : false,
      type: "checkbox",
    },
    {
      label: "AP abgegeben",
      value: internalProjectDetails?.apAbgegeben ? true : false,
      type: "checkbox",
    },
    {
      label: "AP Datum",
      value: internalProjectDetails?.apDatum ? transformDateToReadableString(internalProjectDetails?.apDatum) : "",
      type: "text",
    },
    {
      label: "ZP Datum",
      value: internalProjectDetails?.zpDatum ? transformDateToReadableString(internalProjectDetails?.zpDatum) : "",
      type: "text",
    },
    {
      label: "ZP abgegeben",
      value: internalProjectDetails?.zpAbgegeben ? true : false,
      type: "checkbox",
    },
    {
      label: "DL abgegeben",
      value: internalProjectDetails?.dlAbgegeben ? true : false,
      type: "checkbox",
    },
    {
      label: "Projektmitglieder",
      value: internalProjectDetails?.projektmitglieder,
      type: "text",
    },
    {
      label: "Qualitätsmanager",
      value: internalProjectDetails?.qualitaetsmanager,
      type: "text",
    },
  ];

  return (
    <div>
      <Dialog
        sx={styles.dialog}
        open={internalProjectInfoDialogOpen}
        onClose={handleInternalProjectInfoDialogClose}
        aria-labelledby="general-dialog-title"
      >
        <DialogTitle>Internes Projekt bearbeiten</DialogTitle>
        <DialogContent dividers={true}>
          <div className={classes.fieldSectionBox}>
            <FieldSection title={"Details"} fields={InternalProjectDialogFields}></FieldSection>
          </div>
          <div className={classes.fieldSectionBox}>
            <FieldSection title={"Dokumente"} fields={FieldDocuments}></FieldSection>
          </div>
          <div className={classes.fieldSectionBox}>
            <FieldSection title={"Mitglieder"} fields={InternalProjectMembers}></FieldSection>
          </div>
        </DialogContent>
        <DialogActions>
          {/* TODO: State bei Abbrechen zurücksetzen */}
          <Button
            className={classes.cancelButton}
            variant="contained"
            fullWidth
            color="primary"
            onClick={handleInternalProjectInfoDialogClose}
          >
            Abbrechen
          </Button>
          <Button>Speichern</Button>
        </DialogActions>
      </Dialog>

      <div className="content-page">
        <Box sx={{ margin: "auto" }}>
          <StyledPaper>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: 2,
              }}
            >
              <Typography variant="h6">
                <strong>Informationen zum internen Projekt</strong>
              </Typography>
              {props.hasPermission} ? (
              <IconButton onClick={(event) => handleInternalProjectInfoDialogOpen(event)}>
                <Edit fontSize="inherit" />
              </IconButton>
              ) : null;
            </Box>
            <Box>
              <InfoSection fields={internalProjectDetailsFields} />
            </Box>
          </StyledPaper>
        </Box>
      </div>
    </div>
  );
};

export default DisplayInternalProjectDetails;
