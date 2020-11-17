/**
 * The DislpayMemberDetails-Component displays details of a member
 */

import React, { useEffect, useState } from "react";
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
import { ExpandLess, ExpandMore, Edit } from "@material-ui/icons";

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
    imageSectionText: {
      marginLeft: "8px",
    },
    imageEdit: {
      height: "100%",
      marginTop: "50px",
      display: "flex",
      flexDirection:"column",
      justifyContent:"flex-start",
    },
    memberImage: {
      backgroundColor: "grey",
      borderRadius: "50%",
      border: "3px solid var(--white,#fff)",
      boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      width: "40%",
      marginLeft: "20px",
      marginTop: "20px",
    },
    category: {
      color: theme.palette.text.secondary,
      width: "100%",
    },
    categoryHeader: {
      display: "flex",
      width: "100%",
      justifyContent: "space-between",
      alignItems: "center",
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
      justifyContent: "space-between",
    },
    categoryItem: {
      display: "flex",
      justifyContent: "space-between",
      [theme.breakpoints.up("md")]: {
        width: "30%",
      },
      [theme.breakpoints.down("md")]: {
        width: "50%",
      },
      [theme.breakpoints.down("sm")]: {
        width: "60%",
      },
      [theme.breakpoints.down("xs")]: {
        width: "100%",
      },
    },
    hr: {
      display: "block",
      height: "1px",
      border: 0,
      borderTop: "1px solid #ccc",
      padding: 0,
    },
    categorySubItem: {
      marginBottom: "-6px"
    },
    workshopItem: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "80%",
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

  const [careerOpen, setCareerOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const [lastname, setLastname] = useState("");
  const [name, setName] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");
  const [smartphone, setSmartphone] = useState<string>("");
  const [jbtMail, setJbtMail] = useState<string>("");
  const [membetState, setMemberState] = useState<string>("");
  const [employer, setEmployer] = useState<string>("");
  const [street1, setStreet1] = useState<string>("");
  const [plz1, setPlz1] = useState<number|null>(null);
  const [placeOfResidence1, setPlaceOfResidence1] = useState<string>("");
  const [telephone1, setTelephone1] = useState<number|null>(null);
  const [email1, setEmail1] = useState<string>("");
  const [street2, setStreet2] = useState<string>("");
  const [plz2, setPlz2] = useState<number|null>(null);
  const [placeOfResidence2, setPlaceOfResidence2] = useState<string>("");
  const [telephone2, setTelephone2] = useState<number|null>(null);
  const [email2, setEmail2] = useState<string>("");
  const [university, setUniversity] = useState<string>("");
  const [courseOfStudy, setCourseOfStudy] = useState<string>("");
  const [startOfStudy, setStartOfStudy] = useState<string>("");
  const [endOfStudy, setEndOfStudy] = useState<string>("");
  const [speciality, setSpeciality] = useState<string>("");
  const [apprenticeship, setApprenticeship] = useState<string>("");
  const [accountHolder, setAccountHolder] = useState<string>("");
  const [iban, setIban] = useState<string>("");
  const [engagement, setEngagement] = useState<string>("");
  const [driversLicense, setDriversLicense] = useState<string>("");
  const [firstAid, setFirstAid] = useState<string>("");

  useEffect(() => {
    // TODO: check whether the user is the owner of the mamber page
    setIsOwner(true);
  }, []);

  /**
   * Toogles the career area
   */
  const toggleCareerState = () => {
    setCareerOpen(!careerOpen);
  };

  /**
   * Handles the click on the image
   */
  const handleEditImage = () => {
    // TODO: handle edit image dialog
  };

  /**
   * Handles the click on the edit button of the general information section
   * @param event MouseEvent
   */
  const handleEditGeneralInformation = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    // TODO: handle edit general information dialog
  };

  /**
   * Handles the click on the edit button of the club information section
   * @param event MouseEvent
   */
  const handleEditClubInformation = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    // TODO: handle edit club information dialog
  };

  /**
   * Handles the click on the edit button of the study information section
   * @param event MouseEvent
   */
  const handleEditStudyInformation = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    // TODO: handle edit study information dialog
  };

  /**
   * Handles the click on the edit button of the payment information section
   * @param event MouseEvent
   */
  const handleEditPaymentInformation = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    // TODO: handle edit payment information dialog
  };

  /**
   * Handles the click on the edit button of the qualification information section
   * @param event MouseEvent
   */
  const handleEditQualificationInformation = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    // TODO: handle edit qualification information dialog
  };

  /**
   * Renders the image of the member, his name and his status
   */
  const renderImage: VoidFunction = () => {
    return (<div className={classes.imageSection}>
          <img className={classes.memberImage} src={JBTLogoBlack}/>
          <div className={classes.imageSectionText}>
          <Typography variant="h6">{`${memberDetails.vorname} ${memberDetails.nachname}`}</Typography>
          <Typography><i>{`${memberDetails.mitgliedstatus}`}</i></Typography>
          </div>
        </div>);
  };

  /**
   * Renders the category for general information
   */
  const renderGeneralInformation: VoidFunction = () => {
    return (<Grid item xs={12} sm={12}>
        <ExpansionPanel defaultExpanded={true}>
          <ExpansionPanelSummary
            aria-controls="general-information-of-a-member"
            id="general-information"
            >
            <div className={classes.categoryHeader}>
            <div>
            <Typography variant="h6"><strong>Allgemeine Angaben</strong></Typography>
            </div>
            <div onClick={(event) => handleEditGeneralInformation(event)}>
              {isOwner ? <IconButton>
              <Edit fontSize="inherit"/>
            </IconButton> : null}
            </div>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div className={classes.category}>
            <Typography className={classes.categoryLine}>Geburtsdatum: {memberDetails.geburtsdatum}</Typography>
            <Typography className={classes.categoryLine}>Handy: {memberDetails.handy}</Typography>
            <Typography className={classes.categoryLine}>JBT-E-Mail: {memberDetails.jbt_email}</Typography>
            <Typography className={classes.categoryLine}>Straße/Hausnummer: {memberDetails.strasse1}</Typography>
            <Typography className={classes.categoryLine}>PLZ/Ort: {memberDetails.plz1}</Typography>
            <Typography className={classes.categoryLine}>Messenger: {"PLATZHALTER"}</Typography>
            <Typography className={classes.categoryLine}>Arbeitgeber: {memberDetails.arbeitgeber}</Typography>
            </div>
          </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>);
  };

  /**
   * Renders the different items for the career section
   */
  const renderCareerItems = () => {
    return (<div>
          <div>
          <Typography className={classes.categoryItem}>
            <strong>{"Name des Titels"}</strong>
          </Typography>
          <Typography>
            {`Von ${""} bis ${""}`}
          </Typography>
          </div>
          <hr/>
        </div>);
  };

  /**
   * Renders the category for club information
   */
  const renderClubInformation: VoidFunction = () => {
    return (<Grid item xs={12} sm={12}>
          <ExpansionPanel >
            <ExpansionPanelSummary
            aria-controls="club-information-of-a-member"
            id="club-information"
            >
                <div className={classes.categoryHeader}>
                    <div>
                    <Typography variant="h6"><strong>Verein</strong></Typography>
                    </div>
                    <div onClick={(event) => handleEditClubInformation(event)}>
                        {isOwner ? <IconButton>
                        <Edit fontSize="inherit"/>
                        </IconButton> : null}
                    </div>
                </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
            <div className={classes.category}>
                <Typography className={classes.categoryLine}>Ressort: {memberDetails.ressort}</Typography>
                <Typography className={classes.categoryLine}>Mentor: {memberDetails.mentor}</Typography>
                <Typography className={classes.categoryLine}>Mentees: {"PLATZHALTER"}</Typography>
                <div>
                    <div>
                        <div className={classes.subCategoryHeader}>
                        <Typography>Werdegang</Typography>
                        <IconButton aria-label="expand career" onClick={toggleCareerState}>
                        { careerOpen ? <ExpandLess fontSize="inherit" /> : <ExpandMore fontSize="inherit" />}
                        </IconButton>
                        </div>
                        <hr/>
                        {careerOpen ? renderCareerItems() : null}
                    </div>
                </div>
            </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          </Grid>);
  };

  /**
   * Renders the category for club information
   */
  const renderStudyInformation: VoidFunction = () => {
    return (<Grid item xs={12} sm={12}>
          <ExpansionPanel >
            <ExpansionPanelSummary
            aria-controls="study-information-of-a-member"
            id="study-information"
            >
                <div className={classes.categoryHeader}>
                    <div>
                    <Typography variant="h6"><strong>Studium</strong></Typography>
                    </div>
                    <div onClick={(event) => handleEditStudyInformation(event)}>
                        {isOwner ? <IconButton>
                        <Edit fontSize="inherit"/>
                        </IconButton> : null}
                    </div>
                </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
            <div className={classes.category}>
              <div className={classes.categoryItem}>
                <Typography className={classes.categoryLine}>Hochschule:</Typography>
                <Typography className={classes.categoryLine}>{memberDetails.hochschule}</Typography>
              </div>
              <div className={classes.categoryItem}>
                <Typography className={classes.categoryLine}>Studiengang:</Typography>
                <Typography className={classes.categoryLine}>{memberDetails.studiengang}</Typography>
              </div>
              <div className={classes.categoryItem}>
                <Typography className={classes.categoryLine}>Studienbeginn:</Typography>
                <Typography className={classes.categoryLine}>{memberDetails.studienbeginn}</Typography>
              </div>
              <div className={classes.categoryItem}>
                <Typography className={classes.categoryLine}>Studienende:</Typography>
                <Typography className={classes.categoryLine}>{memberDetails.studienende}</Typography>
              </div>
              <div className={classes.categoryItem}>
                <Typography className={classes.categoryLine}>Vertiefungen:</Typography>
                <Typography className={classes.categoryLine}>{memberDetails.vertiefungen}</Typography>
              </div>
            </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          </Grid>);
  };

  /**
   * Renders the category for payment informations
   */
  const renderPaymentInformation: VoidFunction = () => {
    return (<Grid item xs={12} sm={12}>
          <ExpansionPanel >
            <ExpansionPanelSummary
            aria-controls="payment-information-of-a-member"
            id="payment-information"
            >
                <div className={classes.categoryHeader}>
                    <div>
                        <Typography variant="h6"><strong>Zahlungsinformationen</strong></Typography>
                    </div>
                    <div onClick={(event) => handleEditPaymentInformation(event)}>
                        {isOwner ? <IconButton>
                        <Edit fontSize="inherit"/>
                        </IconButton> : null}
                    </div>
                </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
            <div className={classes.category}>
              <Typography className={classes.categoryLine}>Kontoinhaber: {memberDetails.kontoinhaber}</Typography>
              <Typography className={classes.categoryLine}>IBAN: {memberDetails.iban}</Typography>
              <Typography className={classes.categoryLine}>BIC: {memberDetails.bic}</Typography>
            </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          </Grid>);
  };

  /**
   * Renders the category for qualification information
   */
  const renderQualificationInformation: VoidFunction = () => {
    return (<Grid item xs={12} sm={12}>
          <ExpansionPanel >
            <ExpansionPanelSummary
            aria-controls="qualifications-information-of-a-member"
            id="qualifications-information"
            >
                <div className={classes.categoryHeader}>
                    <div>
                        <Typography variant="h6"><strong>Qualifikationen</strong></Typography>
                    </div>
                    <div onClick={(event) => handleEditQualificationInformation(event)}>
                        {isOwner ? <IconButton>
                        <Edit fontSize="inherit"/>
                        </IconButton> : null}
                    </div>
                </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
            <div className={classes.category}>
            <Typography className={classes.categoryLine}>Sprachen: </Typography>
            <Typography className={classes.categoryLine}>Ausbildung: {memberDetails.ausbildung}</Typography>
            </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          </Grid>);
  };

  /**
   * Renders the the list of projects
   */
  const renderProjectList:VoidFunction = () => {
    return (<Grid item xs={12} sm={12}>
          <ExpansionPanel >
          <ExpansionPanelSummary
            aria-controls="project-list-of-member"
            id="project-list"
          >
            <div>
            <Typography variant="h6"><strong>Projekte (# Anzahl)</strong></Typography>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div className={classes.category}>
            <div>
              <Typography className={classes.categoryItem}>
              <strong>{"Name des Projekts"}</strong>
              </Typography>
              <Typography className={classes.categoryItem}>
              {`Projektzeitraum: von ${""} bis ${""}`}
              </Typography>
              <Typography className={classes.categoryItem}>
              {`Rolle: ${""}`}
              </Typography>
              <Typography  className={classes.categoryItem}>
              {`Geleistete BT: ${""}`}
              </Typography>
            </div>
            <hr/>
            </div>
          </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>);
  };

  /**
   * Renders the the list of workshops
   */
  const renderWorkshopList:VoidFunction = () => {
    return (<Grid item xs={12} sm={12}>
          <ExpansionPanel >
          <ExpansionPanelSummary
            aria-controls="workshop-list-of-member"
            id="workshop-list"
          >
            <div>
            <Typography variant="h6"><strong>Workshops (# Anzahl)</strong></Typography>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div className={classes.category}>
            <div className={classes.workshopItem}>
              <Typography>{`${"DATUM"}`}</Typography>
              <Typography>{`${"ART DES WS"}`}</Typography>
              <Typography>{`${"NAME"}`}</Typography>
              <Typography>{`${"GEHALTEN"}`}</Typography>
            </div>
            </div>
          </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>);
  };

  return (
    <div className={classes.displayMemberDetailsRoot}>
      <Grid container spacing={3}>
      {renderImage()}
      {renderGeneralInformation()}
      {renderClubInformation()}
      {renderProjectList()}
      {renderWorkshopList()}
      {renderQualificationInformation()}
      {renderStudyInformation()}
      {renderPaymentInformation()}
      </Grid>
    </div>
  );
};

export default DisplayMemberDetails;