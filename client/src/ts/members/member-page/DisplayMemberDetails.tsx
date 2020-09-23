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
  ExpansionPanelDetails, IconButton
} from "@material-ui/core";
import JBTLogoBlack from "../../../images/jbt-logo-black.png";
import { ExpandLess, ExpandMore } from "@material-ui/icons";

/**
 * Function which proivdes the styles of the MemberPage
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    displayMemberDetailsRoot: {
      flexGrow: 1,
    },
    imageSection: {
      display: "flex",
      alignItems: "center",
    },
    imageSectionStatus: {
      fontStyle: "italic"
    },
    memberImage: {
      backgroundColor: "grey",
      borderRadius: "50%",
      border: "3px solid var(--white,#fff)",
      boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      width: "40%",
    },
    category: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
    categoryTitlePaper: {
      backgroundColor: theme.palette.secondary.main,
      marginTop: "-16px",
      marginLeft: "-17px",
      marginRight: "-17px",
      paddingTop: "10px",
      paddingBottom: "10px",
      borderBottomRightRadius: "0px",
      borderBottomLeftRadius: "0px"
    },
    categoryTitle: {
      textAlign: "center",
    },
    categoryLine: {
      paddingTop: "12.5px",
      paddingBottom: "11.5px",
    },
    expandCategoryTitlePaper: {
      borderTopRightRadius: "5px",
      borderTopLeftRadius: "5px",
      backgroundColor: theme.palette.secondary.main,
    },
    expandCategoryTitle: {
      display: "flex",
      justifyContent: "center",
    },
    subCategoryHeader: {
      display: "flex",
      alignItems: "center",
    },
    hr: {
      display: "block",
      height: "1px",
      border: 0,
      borderTop: "1px solid #ccc",
      margin: "1em 0",
      padding: 0,
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
  memberDetails: MemberDetails;
}

/**
 * Displays the member details
 */
const DisplayMemberDetails: React.FunctionComponent<DisplayMemberDetailsProps> = (props:DisplayMemberDetailsProps) => {
  const classes = useStyles();

  const {memberDetails} = props;

  const renderImage: VoidFunction = () => {
    return (<div className={classes.imageSection}>
              <img className={classes.memberImage} src={JBTLogoBlack}/>
              <div>
                <Typography>{`${memberDetails.vorname} ${memberDetails.nachname}`}</Typography>
                <Typography className={classes.imageSectionStatus}>{`${memberDetails.mitgliedstatus}`}</Typography>
              </div>
            </div>);
  };

  /**
   * Renders the category for general information
   */
  const renderGeneralInformation: VoidFunction = () => {
    return (<Grid item xs={12} sm={4}>
              <Paper className={classes.category}>
                <Typography>Allgemeine Angaben</Typography>
                <Typography className={classes.categoryLine}>Geburtsdatum: {memberDetails.geburtsdatum}</Typography>
                <Typography className={classes.categoryLine}>Handy: {memberDetails.handy}</Typography>
                <Typography className={classes.categoryLine}>JBT-E-Mail: {memberDetails.jbt_email}</Typography>
                <Typography className={classes.categoryLine}>Straße/Hausnummer: {memberDetails.strasse1}</Typography>
                <Typography className={classes.categoryLine}>PLZ/Ort: {memberDetails.plz1}</Typography>
              </Paper>
            </Grid>);
  };

  /**
   * Renders the category for club information
   */
  const renderClubInformation: VoidFunction = () => {
    return (<Grid item xs={12} sm={4}>
              <Paper className={classes.category}>
                <Typography>Verein</Typography>
                <Typography className={classes.categoryLine}>Ressort: {memberDetails.ressort}</Typography>
                <Typography className={classes.categoryLine}>Mentor: {memberDetails.mentor}</Typography>
                <Typography className={classes.categoryLine}>Mentees: </Typography>

                <div>
                  <div>
                    <div className={classes.subCategoryHeader}>
                      <Typography>Werdegang</Typography>
                      <IconButton aria-label="more filter options">
                        { true ? <ExpandLess fontSize="inherit" /> : <ExpandMore fontSize="inherit" />}
                      </IconButton>
                    </div>
                    <hr/>
                    {/* TODO: Implement "career"-item */}
                  </div>

                </div>

                <Typography className={classes.categoryLine}>Arbeitgeber: {memberDetails.arbeitgeber}</Typography>
              </Paper>
            </Grid>);
  };

  /**
   * Renders the category for club information
   */
  const renderStudyInformation: VoidFunction = () => {
    return (<Grid item xs={12} sm={4}>
              <Paper className={classes.category}>
                <Paper className={classes.categoryTitlePaper}>
                  <Typography className={classes.categoryTitle}>Studium</Typography>
                </Paper>
                <Typography className={classes.categoryLine}>Hochschule: {memberDetails.hochschule}</Typography>
                <Typography className={classes.categoryLine}>Studiengang: {memberDetails.studiengang}</Typography>
                <Typography className={classes.categoryLine}>Studienbeginn: {memberDetails.studienbeginn}</Typography>
                <Typography className={classes.categoryLine}>Studienende: {memberDetails.studienende}</Typography>
                <Typography className={classes.categoryLine}>Vertiefungen: {memberDetails.vertiefungen}</Typography>
              </Paper>
            </Grid>);
  };

  /**
   * Renders the category for payment informations
   */
  const renderPaymentInformation: VoidFunction = () => {
    return (<Grid item xs={12} sm={12}>
              <Paper className={classes.category}>
                <Paper className={classes.categoryTitlePaper}>
                  <Typography className={classes.categoryTitle}>Zahlungsinformationen</Typography>
                </Paper>
                <Typography className={classes.categoryLine}>Kontoinhaber: {memberDetails.kontoinhaber}</Typography>
                <Typography className={classes.categoryLine}>IBAN: {memberDetails.iban}</Typography>
                <Typography className={classes.categoryLine}>BIC: {memberDetails.bic}</Typography>
              </Paper>
            </Grid>);
  };

  /**
   * Renders the category for qualification information
   */
  const renderQualificationInformation: VoidFunction = () => {
    return (<Grid item xs={12} sm={12}>
              <Paper className={classes.category}>
                <Paper className={classes.categoryTitlePaper}>
                  <Typography className={classes.categoryTitle}>Qualifikationen</Typography>
                </Paper>
                <Typography className={classes.categoryLine}>Sprachen: </Typography>
                <Typography className={classes.categoryLine}>Ausbildung: {memberDetails.ausbildung}</Typography>
              </Paper>
            </Grid>);
  };

  /**
   * Renders the category for work address information
   */
  const renderWorkAddressInformation: VoidFunction = () => {
    return (<Grid item xs={12} sm={4}>
              <Paper className={classes.category}>
                <Paper className={classes.categoryTitlePaper}>
                  <Typography className={classes.categoryTitle}>Studien- oder Büroanschrift</Typography>
                </Paper>
                <Typography className={classes.categoryLine}>Telefon: {memberDetails.tel1}</Typography>
                <Typography className={classes.categoryLine}>E-Mail geschäftlich: {memberDetails.email1}</Typography>
              </Paper>
            </Grid>);
  };

  /**
   * Renders the category for home address information
   */
  const renderHomeAdressInformation: VoidFunction = () => {
    return (<Grid item xs={12} sm={4}>
              <Paper className={classes.category}>
                <Paper className={classes.categoryTitlePaper}>
                  <Typography className={classes.categoryTitle}>Heimatanschrift</Typography>
                </Paper>
                <Typography className={classes.categoryLine}>Straße: {memberDetails.strasse2}</Typography>
                <Typography className={classes.categoryLine}>PLZ: {memberDetails.plz2}</Typography>
                <Typography className={classes.categoryLine}>Ort: {memberDetails.ort2}</Typography>
                <Typography className={classes.categoryLine}>Telefon: {memberDetails.tel2}</Typography>
                <Typography className={classes.categoryLine}>E-Mail privat: {memberDetails.email2}</Typography>
              </Paper>
            </Grid>);
  };

  return (
    <div className={classes.displayMemberDetailsRoot}>
      <Grid container spacing={3}>
        {renderImage()}
        {renderGeneralInformation()}
        {renderClubInformation()}
        <Grid item xs={12} sm={12}>
          <ExpansionPanel >
            <ExpansionPanelSummary
              aria-controls="project-list-of-member"
              id="project-list"
              className={classes.expandCategoryTitlePaper}
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
              className={classes.expandCategoryTitlePaper}
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