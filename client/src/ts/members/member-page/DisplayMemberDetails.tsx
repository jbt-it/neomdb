/**
 * The DislpayMemberDetails-Component displays details of a member
 */

import React from "react";
import {
  makeStyles,
  createStyles,
  Theme,
} from "@material-ui/core/styles";
import {
  Grid,
  Paper,
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from "@material-ui/core";

/**
 * Function which proivdes the styles of the MemberPage
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      padding: "5px",
      marginTop: "58px",
      [theme.breakpoints.up("md")]: {
        marginTop: "65px",
        marginLeft: "287px",
        marginRight: "7px",
      },
      [theme.breakpoints.up("sm")]: {
        marginTop: "65px",
      },
    },
    category: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
    categoryTitle: {
      textAlign: "center",
    },
    expandCategoryTitle: {
      display: "flex",
      justifyContent: "center",
    },
  })
);

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
 * Interface for the props of the DisplayMemberDetails
 */
interface DisplayMemberDetailsProps {
  memberDetails: MemberDetails | undefined;
}

/**
 * Displays the member details
 */
const DisplayMemberDetails: React.FunctionComponent<DisplayMemberDetailsProps> = (props:DisplayMemberDetailsProps) => {
  const classes = useStyles();

  const {memberDetails} = props;
  /**
   * Renders the category for payment informations
   */
  const renderPaymentInformation = () => {
    if (memberDetails) {
      return (<Grid item xs={12} sm={12}>
                <Paper className={classes.category}>
                  <Typography className={classes.categoryTitle}>Zahlungsinformationen</Typography>
                  <Typography>Kontoinhaber: {memberDetails.kontoinhaber}</Typography>
                  <Typography>IBAN: {memberDetails.iban}</Typography>
                  <Typography>BIC: {memberDetails.bic}</Typography>
                </Paper>
              </Grid>);
    }
    return null;
  };

  /**
   * Renders the category for general information
   */
  const renderGeneralInformation = () => {
    if (memberDetails) {
      return (<Grid item xs={12} sm={4}>
                <Paper className={classes.category}>
                  <Typography className={classes.categoryTitle}>Allgemeine Angaben</Typography>
                  <Typography>Vorname: {memberDetails.vorname}</Typography>
                  <Typography>Nachname: {memberDetails.nachname}</Typography>
                  <Typography>Geschlecht: {memberDetails.geschlecht}</Typography>
                  <Typography>Geburtsdatum: {memberDetails.geburtsdatum}</Typography>
                  <Typography>Handy: {memberDetails.handy}</Typography>
                  <Typography>JBT-E-Mail: {memberDetails.jbt_email}</Typography>
                </Paper>
              </Grid>);
    }
    return null;
  };

  /**
   * Renders the category for club information
   */
  const renderClubInformation = () => {
    if(memberDetails) {
      return (<Grid item xs={12} sm={4}>
                <Paper className={classes.category}>
                  <Typography className={classes.categoryTitle}>Verein</Typography>
                  <Typography>Status: {memberDetails.mitgliedstatus}</Typography>
                  <Typography>
                    {(memberDetails.trainee_seit !== null)
                      ? `Trainee seit: ${memberDetails.trainee_seit}`
                      : null}
                  </Typography>
                  <Typography>
                    {(memberDetails.mitglied_seit !== null)
                    ? `Mitglied seit: ${memberDetails.mitglied_seit}`
                    : null}
                  </Typography>
                  <Typography>
                    {(memberDetails.aktiv_seit !== null)
                    ? `Aktiv seit: ${memberDetails.aktiv_seit}`
                    : null}
                  </Typography>
                  <Typography>Ressort: {memberDetails.ressort}</Typography>
                  <Typography>Mentor: {memberDetails.mentor}</Typography>
                  <Typography>Mentee: </Typography>
                  <Typography>Arbeitgeber: {memberDetails.arbeitgeber}</Typography>
                </Paper>
              </Grid>);
    }
    return null;
  };

  /**
   * Renders the category for club information
   */
  const renderStudyInformation = () => {
    if (memberDetails) {
      return (<Grid item xs={12} sm={4}>
                <Paper className={classes.category}>
                  <Typography className={classes.categoryTitle}>Studium</Typography>
                  <Typography>Hochschule: {memberDetails.hochschule}</Typography>
                  <Typography>Studiengang: {memberDetails.studiengang}</Typography>
                  <Typography>Studienbeginn: {memberDetails.studienbeginn}</Typography>
                  <Typography>Studienende: {memberDetails.studienende}</Typography>
                  <Typography>Vertiefungen: {memberDetails.vertiefungen}</Typography>
                </Paper>
              </Grid>);
    }
    return null;
  };

  /**
   * Renders the category for qualification information
   */
  const renderQualificationInformation = () => {
    if (memberDetails) {
      return (<Grid item xs={12} sm={12}>
                <Paper className={classes.category}>
                  <Typography className={classes.categoryTitle}>Qualifikationen</Typography>
                  <Typography>Sprachen: </Typography>
                  <Typography>Ausbildung: {memberDetails.ausbildung}</Typography>
                </Paper>
              </Grid>);
    }
    return null;
  };

  /**
   * Renders the category for work address information
   */
  const renderWorkAddressInformation = () => {
    if (memberDetails) {
      return (<Grid item xs={12} sm={4}>
                <Paper className={classes.category}>
                  <Typography className={classes.categoryTitle}>Studien- oder Büroanschrift</Typography>
                  <Typography>Straße: {memberDetails.strasse1}</Typography>
                  <Typography>PLZ: {memberDetails.plz1}</Typography>
                  <Typography>Ort: {memberDetails.ort1}</Typography>
                  <Typography>Telefon: {memberDetails.tel1}</Typography>
                  <Typography>E-Mail geschäftlich: {memberDetails.email1}</Typography>
                </Paper>
              </Grid>);
    }
    return null;
  };

  /**
   * Renders the category for home address information
   */
  const renderHomeAdressInformation = () => {
    if (memberDetails) {
      return (<Grid item xs={12} sm={4}>
                <Paper className={classes.category}>
                  <Typography className={classes.categoryTitle}>Heimatanschrift</Typography>
                  <Typography>Straße: {memberDetails.strasse2}</Typography>
                  <Typography>PLZ: {memberDetails.plz2}</Typography>
                  <Typography>Ort: {memberDetails.ort2}</Typography>
                  <Typography>Telefon: {memberDetails.tel2}</Typography>
                  <Typography>E-Mail privat: {memberDetails.email2}</Typography>
                </Paper>
              </Grid>);
    }
    return null;
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Paper className={classes.category}>Bild</Paper>
        </Grid>
          {renderGeneralInformation()}
          {renderClubInformation()}
        <Grid item xs={12} sm={12}>
          <ExpansionPanel >
            <ExpansionPanelSummary
              aria-controls="project-list-of-member"
              id="project-list"
              classes={{
                content: classes.expandCategoryTitle
              }}
            >
              <div>
                <Typography>Projekte (Anzahl #)</Typography>
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
        <Grid item xs={12} sm={12}>
        <ExpansionPanel >
            <ExpansionPanelSummary
              aria-controls="workshop-list-of-member"
              id="workshop-list"
              classes={{
                content: classes.expandCategoryTitle
              }}
              >
              <div>
                <Typography>Workshops (Anzahl #)</Typography>
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
          {renderQualificationInformation()}
          {renderPaymentInformation()}
          {renderStudyInformation()}
          {renderWorkAddressInformation()}
          {renderHomeAdressInformation()}
      </Grid>
    </div>
  );
};

export default DisplayMemberDetails;