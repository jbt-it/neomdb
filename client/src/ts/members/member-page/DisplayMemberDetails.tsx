/**
 * The DislpayMemberDetails-Component displays details of a member
 */

import React, { useState } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import JBTLogoBlack from "../../../images/jbt-logo-black.png";
import { ExpandLess, ExpandMore, Edit, AddCircleOutline, Clear } from "@material-ui/icons";
import {
  transformSQLStringToGermanDate,
  transformGermanDateToSQLString,
  transformStringToSQLString,
} from "../../utils/dateUtils";
import { NavLink } from "react-router-dom";
import { Autocomplete, createFilterOptions } from "@material-ui/lab";

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
      flexDirection: "column",
      justifyContent: "flex-start",
    },
    memberImage: {
      backgroundColor: "grey",
      borderRadius: "50%",
      border: "3px solid var(--white,#fff)",
      boxShadow:
        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
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
      borderBottomLeftRadius: "0px",
    },
    categoryTitle: {
      textAlign: "center",
    },
    categoryLine: {
      paddingTop: "12.5px",
      paddingBottom: "11.5px",
      textAlign: "right",
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
    categoryItemList: {
      display: "flex",
      flexDirection: "column",
      alignItems: "right",
    },
    addListItemBtn: {
      display: "flex",
      alignContent: "center",
    },
    hr: {
      display: "block",
      height: "1px",
      border: 0,
      borderTop: "1px solid #ccc",
      padding: 0,
    },
    categorySubItem: {
      inBottom: "-6px",
    },
    workshopItem: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "80%",
    },
    fullWidth: {
      width: "100%",
    },
    dialogListItem: {
      display: "flex",
    },
    dialogItemAddBtn: {
      display: "flex",
      alignContent: "center",
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
  })
);

/**
 * Interface for the language
 */
interface LanguageOfMember {
  wert: string;
  niveau: string;
}

/**
 * Interface for the edv skill
 */
interface EDVSkillOfMember {
  wert: string;
  niveau: string;
}


/**
 * Interface for a language
 */
interface Language {
  /*
   * Additional attribute which is needed for the Automplece Component
   * It is only used for filtering
   */
  inputValue?: string;
  wert: string;
}

/**
 * Interface for an edv skill
 */
interface EDVSkill {
  /*
   * Additional attribute which is needed for the Automplece Component
   * It is only used for filtering
   */
  inputValue?: string;
  wert: string;
}

/**
 * Interface for the department
 */
interface Department {
  ressortID: number;
  bezeichnung: string;
  kuerzel: string;
}

/**
 * Interface for mentor
 */
interface Mentor {
  mitgliedID: number | null;
  vorname: string;
  nachname: string;
}

/**
 * Interface for mentee
 */
interface Mentee {
  mitgliedID: number | null;
  vorname: string;
  nachname: string;
}

/**
 * Interface for the member
 */
interface Member {
  mitgliedID: number;
  nachname: string;
  vorname: string;
  jbt_email: string;
  ressort: string;
  mitgliedstatus: string;
}

/**
 * Interface for the member object
 */
interface MemberDetails {
  mitgliedID: number;
  nachname: string;
  vorname: string;
  geschlecht: string;
  geburtsdatum: string | null;
  handy: string;
  jbt_email: string;
  mitgliedstatus: string;
  generation: string | null;
  internesprojekt: string | null;
  mentor: Mentor | null;
  trainee_seit: string | null;
  mitglied_seit: string | null;
  alumnus_seit: string | null;
  senior_seit: string | null;
  aktiv_seit: string | null;
  passiv_seit: string | null;
  ausgetreten_seit: string | null;
  ressort: string | null;
  arbeitgeber: string | null;
  strasse1: string;
  plz1: number;
  ort1: string;
  tel1: number;
  email1: string;
  strasse2: string | null;
  plz2: number | null;
  ort2: string | null;
  tel2: number | null;
  email2: string | null;
  hochschule: string;
  studiengang: string;
  studienbeginn: string | null;
  studienende: string | null;
  vertiefungen: string | null;
  ausbildung: string | null;
  kontoinhaber: string;
  iban: string;
  bic: string;
  engagement: string | null;
  canPL: string | null;
  canQM: string | null;
  lastchange: string;
  fuehrerschein: boolean;
  ersthelferausbildung: boolean;
  sprachen: LanguageOfMember[];
  mentees: Mentee[];
  edvkenntnisse: EDVSkillOfMember[];
}

/**
 * Interface for the props of the DisplayMemberDetails
 */
interface DisplayMemberDetailsProps {
  members: Member[];
  departments: Department[];
  listOfLanguages: Language[];
  listOfEDVSkills: EDVSkill[];
  memberDetails: MemberDetails;
  isOwner: boolean;
  updateMemberDetails: (data: MemberDetails) => void;
  getMemberDetails: () => void;
}

/**
 * Displays the member details
 */
const DisplayMemberDetails: React.FunctionComponent<DisplayMemberDetailsProps> = (
  props: DisplayMemberDetailsProps
) => {
  const classes = useStyles();
  const langFilter = createFilterOptions<Language>();
  const edvFilter = createFilterOptions<EDVSkill>();

  const permissionList:number[] = [];
  const { members } = props;
  const { departments } = props;
  const { listOfLanguages } = props;
  const { listOfEDVSkills } = props;
  const { memberDetails } = props;

  const [careerOpen, setCareerOpen] = useState(false);

  const [lastname, setLastname] = useState(memberDetails.nachname);
  const [name, setName] = useState<string>(memberDetails.vorname);
  const [birthday, setBirthday] = useState<string>(
    transformSQLStringToGermanDate(memberDetails.geburtsdatum)
  );
  const [smartphone, setSmartphone] = useState<string>(
    memberDetails.handy ? memberDetails.handy : ""
  );
  const [jbtMail, setJbtMail] = useState<string>(memberDetails.jbt_email);
  const [memberState, setMemberState] = useState<string>(
    memberDetails.mitgliedstatus
  );
  const [department, setDepartment] = useState<string | null>(memberDetails.ressort);
  const [mentorState, setMentorState] = useState<Mentor | null>(
    memberDetails.mentor ? memberDetails.mentor : null
  );
  const [employer, setEmployer] = useState<string>(
    memberDetails.arbeitgeber ? memberDetails.arbeitgeber : ""
  );
  const [street1, setStreet1] = useState<string>(
    memberDetails.strasse1 ? memberDetails.strasse1 : ""
  );
  const [plz1State, setPlz1State] = useState<string>(
    memberDetails.plz1 ? memberDetails.plz1.toString() : ""
  );
  const [placeOfResidence1, setPlaceOfResidence1] = useState<string>(
    memberDetails.ort1 ? memberDetails.ort1 : ""
  );
  const [telephone1, setTelephone1] = useState<string>(
    memberDetails.tel1 ? memberDetails.tel1.toString() : ""
  );
  const [email1State, setEmail1State] = useState<string>(memberDetails.email1);
  const [street2, setStreet2] = useState<string>(
    memberDetails.strasse2 ? memberDetails.strasse2 : ""
  );
  const [plz2State, setPlz2State] = useState<string>(
    memberDetails.plz2 ? memberDetails.plz2.toString() : ""
  );
  const [placeOfResidence2, setPlaceOfResidence2] = useState<string>(
    memberDetails.ort2 ? memberDetails.ort2 : ""
  );
  const [telephone2, setTelephone2] = useState<string>(
    memberDetails.tel2 ? memberDetails.tel2.toString() : ""
  );
  const [email2State, setEmail2State] = useState<string>(
    memberDetails.email2 ? memberDetails.email2 : ""
  );
  const [university, setUniversity] = useState<string>(
    memberDetails.hochschule
  );
  const [courseOfStudy, setCourseOfStudy] = useState<string>(
    memberDetails.studiengang
  );
  const [startOfStudy, setStartOfStudy] = useState<string>(
    transformSQLStringToGermanDate(memberDetails.studienbeginn)
  );
  const [endOfStudy, setEndOfStudy] = useState<string>(
    transformSQLStringToGermanDate(memberDetails.studienende)
  );
  const [speciality, setSpeciality] = useState<string>(
    memberDetails.vertiefungen ? memberDetails.vertiefungen : ""
  );
  const [apprenticeship, setApprenticeship] = useState<string>(
    memberDetails.ausbildung ? memberDetails.ausbildung : ""
  );
  const [accountHolder, setAccountHolder] = useState<string>(
    memberDetails.kontoinhaber ? memberDetails.kontoinhaber : ""
  );
  const [ibanState, setIbanState] = useState<string>(memberDetails.iban);
  const [bicState, setBicState] = useState<string>(memberDetails.bic);
  const [engagementState, setEngagementState] = useState<string>(
    memberDetails.engagement ? memberDetails.engagement : ""
  );
  const [driversLicense, setDriversLicense] = useState<boolean>(
    memberDetails.fuehrerschein
  );
  const [firstAid, setFirstAid] = useState<boolean>(
    memberDetails.ersthelferausbildung
  );

  const [traineeSince, setTraineeSince] = useState<string>(
    transformSQLStringToGermanDate(memberDetails.trainee_seit)
  );
  const [memberSince, setMemberSince] = useState<string>(
    transformSQLStringToGermanDate(memberDetails.mitglied_seit)
  );
  const [seniorSince, setSeniorSince] = useState<string>(
    transformSQLStringToGermanDate(memberDetails.senior_seit)
  );
  const [alumniSince, setAlumniSince] = useState<string>(
    transformSQLStringToGermanDate(memberDetails.alumnus_seit)
  );
  const [passiveSince, setPassiveSince] = useState<string>(
    transformSQLStringToGermanDate(memberDetails.passiv_seit)
  );

  const [generalInfoDialogOpen, setGeneralInfoDialogOpen] = useState<boolean>(
    false
  );
  const [clubInfoDialogOpen, setClubInfoDialogOpen] = useState<boolean>(false);
  const [studyInfoDialogOpen, setStudyInfoDialogOpen] = useState<boolean>(
    false
  );
  const [paymentInfoDialogOpen, setPaymentInfoDialogOpen] = useState<boolean>(false);
  const [qualificationInfoDialogOpen, setQualificationInfoDialogOpen] = useState<boolean>(false);

  const [menteeList] = useState<Mentee[]>(memberDetails.mentees);
  const [languages, setLanguages] = useState<LanguageOfMember[]>(memberDetails.sprachen);
  const [edvSkills, setEdvSkills] = useState<EDVSkillOfMember[]>(memberDetails.edvkenntnisse);

  /**
   * Submits the changed data
   * @param event FormEvent
   */
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Data which will be submitted
    const data = {
      mitgliedID: memberDetails.mitgliedID,
      nachname: lastname,
      vorname: name,
      geschlecht: memberDetails.geschlecht,
      geburtsdatum: transformGermanDateToSQLString(birthday),
      handy: smartphone,
      jbt_email: jbtMail,
      mitgliedstatus: memberState,
      generation: memberDetails.generation,
      internesprojekt: memberDetails.internesprojekt,
      mentor: mentorState,
      trainee_seit: transformGermanDateToSQLString(traineeSince),
      mitglied_seit: transformGermanDateToSQLString(memberSince),
      alumnus_seit: transformGermanDateToSQLString(alumniSince),
      senior_seit: transformGermanDateToSQLString(seniorSince),
      aktiv_seit: transformStringToSQLString(memberDetails.aktiv_seit),
      passiv_seit: transformGermanDateToSQLString(passiveSince),
      ausgetreten_seit: memberDetails.ausgetreten_seit,
      ressort: department,
      arbeitgeber: employer,
      strasse1: street1,
      plz1: parseInt(plz1State, 10),
      ort1: placeOfResidence1,
      tel1: parseInt(telephone1, 10),
      email1: email1State,
      strasse2: street2,
      plz2: parseInt(plz2State, 10),
      ort2: placeOfResidence2,
      tel2: parseInt(telephone2, 10),
      email2: email2State,
      hochschule: university,
      studiengang: courseOfStudy,
      studienbeginn: transformGermanDateToSQLString(startOfStudy),
      studienende: transformGermanDateToSQLString(endOfStudy),
      vertiefungen: speciality,
      ausbildung: apprenticeship,
      kontoinhaber: accountHolder,
      iban: ibanState,
      bic: bicState,
      engagement: engagementState,
      canPL: transformStringToSQLString(memberDetails.canPL),
      canQM: transformStringToSQLString(memberDetails.canQM),
      lastchange: "",
      fuehrerschein: driversLicense,
      ersthelferausbildung: firstAid,
      sprachen: languages,
      mentees: menteeList,
      edvkenntnisse: edvSkills,
    };
    props.updateMemberDetails(data);
    handleGeneralInfoDialogClose();
    handleClubInfoDialogClose();
    handleStudyInfoDialogClose();
    handleQualificationInfoDialogClose();
    handlePaymentInfoDialogClose();
  };

  /**
   * Toogles the career area
   */
  const toggleCareerState: VoidFunction = () => {
    setCareerOpen(!careerOpen);
  };

  /**
   * Handles the click on the edit button of the general information section
   * @param event MouseEvent
   */
  const handleGeneralInfoDialogOpen =
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      setGeneralInfoDialogOpen(true);
    };

  /**
   * Handles the closing of the general infromation dialog
   * @param event FormEvent
   */
  const handleGeneralInfoDialogClose: VoidFunction = () => {
    setGeneralInfoDialogOpen(false);
  };

  /**
   * Handles the click on the edit button of the club information section
   * @param event MouseEvent
   */
  const handleClubInfoDialogOpen = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    setClubInfoDialogOpen(true);
  };

  /**
   * Handles the closing of the club infromation dialog
   * @param event FormEvent
   */
  const handleClubInfoDialogClose: VoidFunction = () => {
    setClubInfoDialogOpen(false);
  };

  /**
   * Handles the click on the edit button of the study information section
   * @param event MouseEvent
   */
  const handleStudyInfoDialogOpen = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    setStudyInfoDialogOpen(true);
  };

  /**
   * Handles the closing of the study infromation dialog
   * @param event FormEvent
   */
  const handleStudyInfoDialogClose: VoidFunction = () => {
    setStudyInfoDialogOpen(false);
  };

  /**
   * Handles the click on the edit button of the payment information section
   * @param event MouseEvent
   */
  const handlePaymentInfoDialogOpen = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    setPaymentInfoDialogOpen(true);
  };

  /**
   * Handles the closing of the payment infromation dialog
   * @param event FormEvent
   */
  const handlePaymentInfoDialogClose: VoidFunction = () => {
    setPaymentInfoDialogOpen(false);
  };

  /**
   * Handles the click on the edit button of the qualification information section
   * @param event MouseEvent
   */
  const handleQualificationInfoDialogOpen =
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation();
      setQualificationInfoDialogOpen(true);
    };

  /**
   * Handles the closing of the payment infromation dialog
   * @param event FormEvent
   */
  const handleQualificationInfoDialogClose: VoidFunction = () => {
    setQualificationInfoDialogOpen(false);
  };

  /**
   * Returns the string representation of the niveau number of a language
   * @param niveau A number which represents the niveau of a language
   * @returns A string representation of the niveau
   */
  const getLanguageNiveauLabel = (niveau: number) => {
    switch (niveau) {
      case 1: {
        return "Grundkenntnisse";
      }
      case 2: {
        return "Gute Kenntnisse";
      }
      case 3: {
        return "Fließend";
      }
      case 4: {
        return "Verhandlungssicher";
      }
      case 5: {
        return "Muttersprache";
      }
    }
  };

  /**
   * Returns the string representation of the niveau number of an edv skill
   * @param niveau A number which represents the niveau of an edv skill
   * @returns A string representation of the niveau
   */
  const getEDVNiveauLabel = (niveau: number) => {
    switch (niveau) {
      case 1: {
        return "Grundkenntnisse";
      }
      case 2: {
        return "Vertiefte Kenntnisse";
      }
      case 3: {
        return "Expertenwissen";
      }
    }
  };

  /**
   * Adds a langauge to the list of languages
   * @param list The new list of languages
   * @param index The index of the language item
   * @param updatedLanguage The new language
   */
  const addLanguageToList = (list: LanguageOfMember[], index: number, updatedLanguage: LanguageOfMember) => {
    list[index] = updatedLanguage;
    setLanguages(list);
  };

  /**
   * Adds an edv skill to the list of edv skills
   * @param list The new list of edv skills
   * @param index The index of the edv skill item
   * @param updatedEdvSkill The new edv skill
   */
  const addEDVSkillToList = (list: EDVSkillOfMember[], index: number, updatedEdvSkill: EDVSkillOfMember) => {
    list[index] = updatedEdvSkill;
    setEdvSkills(list);
  };



  /**
   * Renders the image of the member, his name and his status
   */
  const renderImage: VoidFunction = () => {
    return (
      <div className={classes.imageSection}>
        <img className={classes.memberImage} alt="Profile image" src={JBTLogoBlack} />
        <div className={classes.imageSectionText}>
          <Typography variant="h6">
            {`${memberDetails.vorname} ${memberDetails.nachname}`}
          </Typography>
          <Typography>
            <i>{`${memberDetails.mitgliedstatus}`}</i>
          </Typography>
        </div>
      </div>
    );
  };

  /**
   * Renders the category for general information
   */
  const renderGeneralInformation: VoidFunction = () => {
    return (
      <Grid item xs={12} sm={12}>
        <ExpansionPanel defaultExpanded={true}>
          <ExpansionPanelSummary
            aria-controls="general-information-of-a-member"
            id="general-information"
          >
            <div className={classes.categoryHeader}>
              <div>
                <Typography variant="h6">
                  <strong>Allgemeine Angaben</strong>
                </Typography>
              </div>
              <div>
                {/*When the user is owner or has the permission to
                   manage all members they can edit this section*/
                  props.isOwner || permissionList.includes(1) ? (
                    <IconButton onClick={(event) => handleGeneralInfoDialogOpen(event)}>
                      <Edit fontSize="inherit" />
                    </IconButton>
                  ) : null
                }
              </div>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div className={classes.category}>
              <div className={classes.categoryItem}>
                <Typography className={classes.categoryLine}>
                  Geburtsdatum:&nbsp;&nbsp;
                 </Typography>
                <Typography className={classes.categoryLine}>
                  {transformSQLStringToGermanDate(memberDetails.geburtsdatum)}
                </Typography>
              </div>
              <div className={classes.categoryItem}>
                <Typography className={classes.categoryLine}>
                  Handy:&nbsp;&nbsp;
                 </Typography>
                <Typography className={classes.categoryLine}>
                  {memberDetails.handy}
                </Typography>
              </div>
              <div className={classes.categoryItem}>
                <Typography className={classes.categoryLine}>
                  JBT-E-Mail:&nbsp;&nbsp;
                 </Typography>
                <Typography className={classes.categoryLine}>
                  {memberDetails.jbt_email}
                </Typography>
              </div>
              <div className={classes.categoryItem}>
                <Typography className={classes.categoryLine}>
                  Straße/Hausnummer:&nbsp;&nbsp;
                 </Typography>
                <Typography className={classes.categoryLine}>
                  {memberDetails.strasse1}
                </Typography>
              </div>
              <div className={classes.categoryItem}>
                <Typography className={classes.categoryLine}>
                  PLZ/Ort:&nbsp;&nbsp;
                 </Typography>
                <Typography className={classes.categoryLine}>
                  {memberDetails.plz1}
                </Typography>
              </div>
              <div className={classes.categoryItem}>
                <Typography className={classes.categoryLine}>
                  Messenger:&nbsp;&nbsp;
                 </Typography>
                <Typography className={classes.categoryLine}>
                  {"PLATZHALTER"}
                </Typography>
              </div>
              <div className={classes.categoryItem}>
                <Typography className={classes.categoryLine}>
                  Arbeitgeber:&nbsp;&nbsp;
                 </Typography>
                <Typography className={classes.categoryLine}>
                  {memberDetails.arbeitgeber}
                </Typography>
              </div>
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Grid>
    );
  };

  /**
   * Renders the different items for the career section
   */
  const renderCareerItems: VoidFunction = () => {
    return (
      <div>
        {memberDetails.passiv_seit ? (
          <div>
            <Typography className={classes.categoryItem}>
              <strong>{"Passives Mitglied"}</strong>
            </Typography>
            <Typography>
              {`Seit ${transformSQLStringToGermanDate(memberDetails.passiv_seit)}`}
            </Typography>
          </div>
        ) : null}
        {memberDetails.alumnus_seit ? (
          <div>
            <Typography className={classes.categoryItem}>
              <strong>{"Alumna*Alumnus"}</strong>
            </Typography>
            <Typography>
              {`Seit ${transformSQLStringToGermanDate(memberDetails.alumnus_seit)}`}
            </Typography>
          </div>
        ) : null}
        {memberDetails.senior_seit ? (
          <div>
            <Typography className={classes.categoryItem}>
              <strong>{"Senior"}</strong>
            </Typography>
            <Typography>
              {`Seit ${transformSQLStringToGermanDate(memberDetails.senior_seit)}`}
            </Typography>
          </div>
        ) : null}
        {memberDetails.mitglied_seit ? (
          <div>
            <Typography className={classes.categoryItem}>
              <strong>{"Aktives Mitglied"}</strong>
            </Typography>
            <Typography>
              {`Seit ${transformSQLStringToGermanDate(memberDetails.mitglied_seit)}`}
            </Typography>
          </div>
        ) : null}
        {memberDetails.trainee_seit ? (
          <div>
            <Typography className={classes.categoryItem}>
              <strong>{"Trainee"}</strong>
            </Typography>
            <Typography>
              {`Seit ${transformSQLStringToGermanDate(memberDetails.trainee_seit)}`}
            </Typography>
          </div>
        ) : null}
        <hr />
      </div>
    );
  };

  /**
   * Renders the category for club information
   */
  const renderClubInformation: VoidFunction = () => {
    return (
      <Grid item xs={12} sm={12}>
        <ExpansionPanel defaultExpanded={true}>
          <ExpansionPanelSummary
            aria-controls="club-information-of-a-member"
            id="club-information"
          >
            <div className={classes.categoryHeader}>
              <div>
                <Typography variant="h6">
                  <strong>Verein</strong>
                </Typography>
              </div>
              <div onClick={(event) => handleClubInfoDialogOpen(event)}>
                {
                  /*When the user has the permission to
                  manage all members they can edit this section*/
                  permissionList.includes(1) ? (
                    <IconButton>
                      <Edit fontSize="inherit" />
                    </IconButton>
                  ) : null
                }
              </div>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div className={classes.category}>
              <div className={classes.category}>
                <div className={classes.categoryItem}>
                  <Typography className={classes.categoryLine}>
                    Ressort:&nbsp;&nbsp;
                   </Typography>
                  <Typography className={classes.categoryLine}>
                    {memberDetails.ressort}
                  </Typography>
                </div>
                <div className={classes.categoryItem}>
                  <Typography className={classes.categoryLine}>
                    Mentor:&nbsp;&nbsp;
                   </Typography>
                  {memberDetails.mentor
                    && memberDetails.mentor.vorname && memberDetails.mentor.nachname ?
                    <NavLink to={`/gesamtuebersicht/${memberDetails.mentor.mitgliedID}`}
                      className={classes.categoryLine}>
                      {`${memberDetails.mentor.vorname} ${memberDetails.mentor.nachname}`}
                    </NavLink> : ""}
                </div>
                <div className={classes.categoryItem}>
                  <Typography className={classes.categoryLine}>
                    Mentees:
                   </Typography>
                  <div className={classes.categoryItemList}>
                    {menteeList.map(mentee => {
                      return <Typography className={classes.categoryLine}>
                        {`${mentee.vorname} ${mentee.nachname}`}
                      </Typography>;
                    })}
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <div className={classes.subCategoryHeader}>
                    <Typography>Werdegang</Typography>
                    <IconButton
                      aria-label="expand career"
                      onClick={toggleCareerState}
                    >
                      {careerOpen ? (
                        <ExpandLess fontSize="inherit" />
                      ) : (
                        <ExpandMore fontSize="inherit" />
                      )}
                    </IconButton>
                  </div>
                  <hr />
                  {careerOpen ? renderCareerItems() : null}
                </div>
              </div>
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Grid>
    );
  };

  /**
   * Renders the category for club information
   */
  const renderStudyInformation: VoidFunction = () => {
    return (
      <Grid item xs={12} sm={12}>
        <ExpansionPanel defaultExpanded={true}>
          <ExpansionPanelSummary
            aria-controls="study-information-of-a-member"
            id="study-information"
          >
            <div className={classes.categoryHeader}>
              <div>
                <Typography variant="h6">
                  <strong>Studium</strong>
                </Typography>
              </div>
              <div onClick={(event) => handleStudyInfoDialogOpen(event)}>
                {
                  /*When the user is owner or has the permission to
                  manage all members they can edit this section*/
                  props.isOwner ? (
                    <IconButton>
                      <Edit fontSize="inherit" />
                    </IconButton>
                  ) : null
                }
              </div>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div className={classes.category}>
              <div className={classes.categoryItem}>
                <Typography className={classes.categoryLine}>
                  Hochschule:&nbsp;&nbsp;
                 </Typography>
                <Typography className={classes.categoryLine}>
                  {memberDetails.hochschule}
                </Typography>
              </div>
              <div className={classes.categoryItem}>
                <Typography className={classes.categoryLine}>
                  Studiengang:&nbsp;&nbsp;
                 </Typography>
                <Typography className={classes.categoryLine}>
                  {memberDetails.studiengang}
                </Typography>
              </div>
              <div className={classes.categoryItem}>
                <Typography className={classes.categoryLine}>
                  Studienbeginn:&nbsp;&nbsp;
                 </Typography>
                <Typography className={classes.categoryLine}>
                  {transformSQLStringToGermanDate(memberDetails.studienbeginn)}
                </Typography>
              </div>
              <div className={classes.categoryItem}>
                <Typography className={classes.categoryLine}>
                  Studienende:&nbsp;&nbsp;
                 </Typography>
                <Typography className={classes.categoryLine}>
                  {transformSQLStringToGermanDate(memberDetails.studienende)}
                </Typography>
              </div>
              {/* speciality  is not correct */}
              <div className={classes.categoryItem}>
                <Typography className={classes.categoryLine}>
                  Vertiefungen:&nbsp;&nbsp;
                 </Typography>
                <Typography className={classes.categoryLine}>
                  {memberDetails.vertiefungen}
                </Typography>
              </div>
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Grid>
    );
  };

  /**
   * Renders the category for payment informations
   */
  const renderPaymentInformation: VoidFunction = () => {
    if (props.isOwner || permissionList.includes(6)) {
      return (
        <Grid item xs={12} sm={12}>
          <ExpansionPanel>
            <ExpansionPanelSummary
              aria-controls="payment-information-of-a-member"
              id="payment-information"
            >
              <div className={classes.categoryHeader}>
                <div>
                  <Typography variant="h6">
                    <strong>Zahlungsinformationen</strong>
                  </Typography>
                </div>
                <div onClick={(event) => handlePaymentInfoDialogOpen(event)}>
                  {
                    /*When the user is owner or has the permission to manage all
                    members they can edit this section*/
                    props.isOwner ? (
                      <IconButton>
                        <Edit fontSize="inherit" />
                      </IconButton>
                    ) : null
                  }
                </div>
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div className={classes.category}>
                <div className={classes.categoryItem}>
                  <Typography className={classes.categoryLine}>
                    Kontoinhaber:&nbsp;&nbsp;
                   </Typography>
                  <Typography className={classes.categoryLine}>
                    {memberDetails.kontoinhaber}
                  </Typography>
                </div>
                <div className={classes.categoryItem}>
                  <Typography className={classes.categoryLine}>
                    IBAN:&nbsp;&nbsp;
                   </Typography>
                  <Typography className={classes.categoryLine}>
                    {memberDetails.iban}
                  </Typography>
                </div>
                <div className={classes.categoryItem}>
                  <Typography className={classes.categoryLine}>
                    BIC:&nbsp;&nbsp;
                   </Typography>
                  <Typography className={classes.categoryLine}>
                    {memberDetails.bic}
                  </Typography>
                </div>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
      );
    } else {
      return null;
    }
  };

  /**
   * Renders the category for qualification information
   */
  const renderQualificationInformation: VoidFunction = () => {
    return (
      <Grid item xs={12} sm={12}>
        <ExpansionPanel defaultExpanded={true}>
          <ExpansionPanelSummary
            aria-controls="qualifications-information-of-a-member"
            id="qualifications-information"
          >
            <div className={classes.categoryHeader}>
              <div>
                <Typography variant="h6">
                  <strong>Qualifikationen</strong>
                </Typography>
              </div>
              <div
                onClick={(event) => handleQualificationInfoDialogOpen(event)}
              >
                {
                  /*When the user is owner or has the permission to manage all
                  members they can edit this section*/
                  props.isOwner ? (
                    <IconButton>
                      <Edit fontSize="inherit" />
                    </IconButton>
                  ) : null
                }
              </div>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div className={classes.category}>
              <div className={classes.categoryItem}>
                <Typography className={classes.categoryLine}>
                  Ausbildung:&nbsp;&nbsp;
                 </Typography>
                <Typography className={classes.categoryLine}>
                  {memberDetails.ausbildung}
                </Typography>
              </div>
              <div className={classes.categoryItem}>
                <Typography className={classes.categoryLine}>
                  Sprachen:
                 </Typography>
                <div className={classes.categoryItemList}>
                  {memberDetails.sprachen.map(language => {
                    return <Typography className={classes.categoryLine}>
                      {`${language.wert}: ${getLanguageNiveauLabel(
                        parseInt(language.niveau, 10)
                      )}`}
                    </Typography>;
                  })}
                </div>
              </div>
              <div className={classes.categoryItem}>
                <Typography className={classes.categoryLine}>
                  EDV-Kenntnisse:
                 </Typography>
                <div className={classes.categoryItemList}>
                  {memberDetails.edvkenntnisse.map(edv => {
                    return <Typography className={classes.categoryLine}>
                      {`${edv.wert}: ${getEDVNiveauLabel(parseInt(edv.niveau, 10))}`}
                    </Typography>;
                  })}
                </div>
              </div>
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Grid>
    );
  };

  /**
   * Renders the the list of projects
   */
  const renderProjectList: VoidFunction = () => {
    return (
      <Grid item xs={12} sm={12}>
        <ExpansionPanel>
          <ExpansionPanelSummary
            aria-controls="project-list-of-member"
            id="project-list"
          >
            <div>
              <Typography variant="h6">
                <strong>Projekte (# Anzahl)</strong>
              </Typography>
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
                <Typography className={classes.categoryItem}>
                  {`Geleistete BT: ${""}`}
                </Typography>
              </div>
              <hr />
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Grid>
    );
  };

  /**
   * Renders the the list of workshops
   */
  const renderWorkshopList: VoidFunction = () => {
    return (
      <Grid item xs={12} sm={12}>
        <ExpansionPanel>
          <ExpansionPanelSummary
            aria-controls="workshop-list-of-member"
            id="workshop-list"
          >
            <div>
              <Typography variant="h6">
                <strong>Workshops (# Anzahl)</strong>
              </Typography>
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
      </Grid>
    );
  };

  /**
   * Renders the dialog for changing the general informations
   */
  const renderGeneralInformationDialog: VoidFunction = () => {
    return (
      <Dialog
        open={generalInfoDialogOpen}
        onClose={handleGeneralInfoDialogClose}
        fullWidth
        maxWidth="lg"
        keepMounted
        aria-labelledby="general-dialog-title"
      >
        <DialogTitle id="general-dialog-title">
          Allgemeine Informationen
         </DialogTitle>
        <DialogContent>
          <form autoComplete="off" onSubmit={submit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  className={classes.fullWidth}
                  required
                  color="primary"
                  disabled
                  id="birthday-field"
                  label="Geburtstag"
                  variant="outlined"
                  value={birthday}
                  onChange={(event) => {
                    setBirthday(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  className={classes.fullWidth}
                  required
                  color="primary"
                  disabled={!props.isOwner}
                  id="smartphone-field"
                  label="Handy"
                  variant="outlined"
                  value={smartphone}
                  onChange={(event) => {
                    setSmartphone(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  className={classes.fullWidth}
                  color="primary"
                  required
                  disabled={!permissionList.includes(1)}
                  id="jbt-email-field"
                  label="JBT-E-Mail"
                  variant="outlined"
                  value={jbtMail}
                  onChange={(event) => {
                    setJbtMail(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  className={classes.fullWidth}
                  required
                  color="primary"
                  disabled={!props.isOwner}
                  id="street-field"
                  label="Straße/Hausnummer"
                  variant="outlined"
                  value={street1}
                  onChange={(event) => {
                    setStreet1(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6}>
                <TextField
                  className={classes.fullWidth}
                  required
                  color="primary"
                  disabled={!props.isOwner}
                  id="plz-field"
                  label="PLZ"
                  variant="outlined"
                  value={plz1State}
                  onChange={(event) => {
                    setPlz1State(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6}>
                <TextField
                  className={classes.fullWidth}
                  required
                  color="primary"
                  disabled={!props.isOwner}
                  id="place-of-residence-field"
                  label="Ort"
                  variant="outlined"
                  value={placeOfResidence1}
                  onChange={(event) => {
                    setPlaceOfResidence1(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  className={classes.fullWidth}
                  color="primary"
                  disabled={!props.isOwner}
                  id="employer-field"
                  label="Arbeitgeber"
                  variant="outlined"
                  value={employer}
                  onChange={(event) => {
                    setEmployer(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <hr />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className={classes.submitContainer}
              >
                <Button
                  className={classes.cancelButton}
                  variant="contained"
                  onClick={handleGeneralInfoDialogClose}
                >
                  Abbrechen
                 </Button>
                <Button
                  className={classes.submitButton}
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Änderungen speichern
                 </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  /**
   * Renders the dialog for changing the club informations
   */
  const renderClubInformationDialog: VoidFunction = () => {
    return (
      <Dialog
        open={clubInfoDialogOpen}
        onClose={handleClubInfoDialogClose}
        fullWidth
        maxWidth="lg"
        keepMounted
        aria-labelledby="club-dialog-title"
      >
        <DialogTitle id="club-dialog-title">Verein</DialogTitle>
        <DialogContent>
          <form autoComplete="off" onSubmit={submit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Autocomplete
                  id="ressort-select"
                  options={departments}
                  onChange={(event, newDepartment) => {
                    if (newDepartment) {
                      setDepartment(newDepartment.bezeichnung);
                    }
                  }}
                  defaultValue={departments.filter(dep => dep.bezeichnung === department)[0]}
                  getOptionLabel={(dep) => `${dep.bezeichnung}`}
                  className={classes.fullWidth}
                  renderInput={
                    (params) => <TextField {...params} label="Ressort" variant="outlined" />
                  }
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Autocomplete
                  id="mentor-select"
                  options={members}
                  disabled={!permissionList.includes(1)}
                  onChange={(event, newMentor) => {
                    if (newMentor) {
                      setMentorState(
                        {
                          mitgliedID: newMentor.mitgliedID,
                          vorname: newMentor.vorname,
                          nachname: newMentor.nachname
                        }
                      );
                    }
                  }}
                  defaultValue={members.filter(memb => memb.mitgliedID === mentorState?.mitgliedID)[0]}
                  getOptionLabel={(member) => `${member.vorname} ${member.nachname}`}
                  className={classes.fullWidth}
                  renderInput={
                    (params) => <TextField {...params} label="Mentor" variant="outlined" />
                  }
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  className={classes.fullWidth}
                  color="primary"
                  disabled={!permissionList.includes(1)}
                  id="passive-member-field"
                  label="Passives Mitglied seit"
                  variant="outlined"
                  value={passiveSince}
                  onChange={(event) => {
                    setPassiveSince(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  className={classes.fullWidth}
                  color="primary"
                  disabled={!permissionList.includes(1)}
                  id="alumni-field"
                  label="Alumna*Alumnus seit"
                  variant="outlined"
                  value={alumniSince}
                  onChange={(event) => {
                    setAlumniSince(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  className={classes.fullWidth}
                  color="primary"
                  disabled={!permissionList.includes(1)}
                  id="senior-field"
                  label="Senior seit"
                  variant="outlined"
                  value={seniorSince}
                  onChange={(event) => {
                    setSeniorSince(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  className={classes.fullWidth}
                  color="primary"
                  disabled={!permissionList.includes(1)}
                  id="member-field"
                  label="Aktives Mitglied seit"
                  variant="outlined"
                  value={memberSince}
                  onChange={(event) => {
                    setMemberSince(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  className={classes.fullWidth}
                  color="primary"
                  disabled={!permissionList.includes(1)}
                  id="trainee-field"
                  label="Trainee seit"
                  variant="outlined"
                  value={traineeSince}
                  onChange={(event) => {
                    setTraineeSince(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <hr />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className={classes.submitContainer}
              >
                <Button
                  className={classes.cancelButton}
                  variant="contained"
                  onClick={handleClubInfoDialogClose}
                >
                  Abbrechen
                 </Button>
                <Button
                  className={classes.submitButton}
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Änderungen speichern
                 </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  /**
   * Renders the dialog for changing the study informations
   */
  const renderStudyInformationDialog: VoidFunction = () => {
    return (
      <Dialog
        open={studyInfoDialogOpen}
        onClose={handleStudyInfoDialogClose}
        fullWidth
        maxWidth="lg"
        keepMounted
        aria-labelledby="study-dialog-title"
      >
        <DialogTitle id="study-dialog-title">Studium</DialogTitle>
        <DialogContent>
          <form autoComplete="off" onSubmit={submit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  className={classes.fullWidth}
                  color="primary"
                  disabled={!props.isOwner}
                  id="uni-field"
                  label="Hochschule"
                  variant="outlined"
                  value={university}
                  onChange={(event) => {
                    setUniversity(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  className={classes.fullWidth}
                  color="primary"
                  disabled={!props.isOwner}
                  id="course-of-study-field"
                  label="Studiengang"
                  variant="outlined"
                  value={courseOfStudy}
                  onChange={(event) => {
                    setCourseOfStudy(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  className={classes.fullWidth}
                  color="primary"
                  disabled={!props.isOwner}
                  id="start-of-study-field"
                  label="Studienbeginn"
                  variant="outlined"
                  value={startOfStudy}
                  onChange={(event) => {
                    setStartOfStudy(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  className={classes.fullWidth}
                  color="primary"
                  disabled={!props.isOwner}
                  id="end-of-study-field"
                  label="Studienende"
                  variant="outlined"
                  value={endOfStudy}
                  onChange={(event) => {
                    setEndOfStudy(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  className={classes.fullWidth}
                  color="primary"
                  disabled={!props.isOwner}
                  id="speciality-field"
                  label="Vertiefungen"
                  variant="outlined"
                  value={speciality}
                  onChange={(event) => {
                    setSpeciality(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <hr />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className={classes.submitContainer}
              >
                <Button
                  className={classes.cancelButton}
                  variant="contained"
                  onClick={handleStudyInfoDialogClose}
                >
                  Abbrechen
                 </Button>
                <Button
                  className={classes.submitButton}
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Änderungen speichern
                 </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  /**
   * Renders the dialog for changing the qualification informations
   */
  const renderQualificationInformationDialog: VoidFunction = () => {
    return (
      <Dialog
        open={qualificationInfoDialogOpen}
        onClose={handleQualificationInfoDialogClose}
        fullWidth
        maxWidth="lg"
        keepMounted
        aria-labelledby="qualification-dialog-title"
      >
        <DialogTitle id="qualification-dialog-title">
          Qualifikationen
         </DialogTitle>
        <DialogContent>
          <form autoComplete="off" onSubmit={submit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  className={classes.fullWidth}
                  color="primary"
                  disabled={!props.isOwner}
                  id="account-holder-field"
                  label="Ausbildung"
                  variant="outlined"
                  value={apprenticeship}
                  onChange={(event) => {
                    setApprenticeship(event.target.value);
                  }}
                />
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Typography>Sprachen:</Typography>
                    </Grid>
                    {languages.map((language, index) => {
                      return <Grid item container spacing={1} xs={11} sm={8} md={6} lg={4}
                        className={classes.dialogListItem}>
                        <Grid item xs={5}>
                          <Autocomplete
                            value={language.wert}
                            onChange={(event, newValue) => {
                              const list = [...languages];
                              if (typeof newValue === "string") {
                                // Make a new object of the updated language
                                const updatedLanguage: LanguageOfMember =
                                  { ...languages[index], wert: newValue };
                                addLanguageToList(list, index, updatedLanguage);
                              } else if (newValue && newValue.inputValue) {
                                // Make a new object of the updated language
                                const updatedLanguage: LanguageOfMember =
                                  { ...languages[index], wert: newValue.inputValue };
                                addLanguageToList(list, index, updatedLanguage);
                              } else if (newValue) {
                                // Make a new object of the updated language
                                const updatedLanguage: LanguageOfMember =
                                  { ...languages[index], wert: newValue.wert };
                                addLanguageToList(list, index, updatedLanguage);
                              }
                            }}
                            filterOptions={(options, params) => {
                              const filtered = langFilter(options, params);
                              // Suggest the creation of a new value
                              if (params.inputValue !== "") {
                                filtered.push({
                                  inputValue: params.inputValue,
                                  wert: `"${params.inputValue}" hinzufügen`,
                                });
                              }
                              return filtered;
                            }}
                            selectOnFocus
                            clearOnBlur
                            options={listOfLanguages}
                            getOptionLabel={(option) => {
                              if (typeof option === "string") {
                                return option;
                              }
                              return option.wert;
                            }}
                            freeSolo
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Sprache"
                                variant="outlined"
                              />
                            )}
                          /></Grid><Grid item xs={5}>
                          <FormControl className={classes.fullWidth}>
                            <InputLabel id="language-niveau-select-label">
                              Niveau
                                     </InputLabel>
                            <Select
                              labelId="language-niveau-select-label"
                              value={language.niveau}
                              onChange={(event) => {
                                const list = [...languages];
                                // Make a new object of updated language
                                const updatedLanguage: LanguageOfMember =
                                  { ...languages[index], niveau: "" + event.target.value };
                                 addLanguageToList(list, index, updatedLanguage);
                              }}
                            >
                              <MenuItem value={5}>{getLanguageNiveauLabel(5)}</MenuItem>
                              <MenuItem value={4}>{getLanguageNiveauLabel(4)}</MenuItem>
                              <MenuItem value={3}>{getLanguageNiveauLabel(3)}</MenuItem>
                              <MenuItem value={2}>{getLanguageNiveauLabel(2)}</MenuItem>
                              <MenuItem value={1}>{getLanguageNiveauLabel(1)}</MenuItem>
                            </Select>
                          </FormControl></Grid>
                        <Grid item xs={2}>
                          <IconButton aria-label="delete" color="primary"
                            onClick={
                              () => {
                                setLanguages(languages.filter(
                                  (value) => !(value.wert === language.wert)
                                ));
                              }
                            }
                          >
                            <Clear />
                          </IconButton>
                        </Grid>
                      </Grid>;
                    })}
                    <Grid item xs={12} sm={2} md={2} lg={2} className={classes.addListItemBtn}>
                      <IconButton aria-label="add" color="primary"
                        disabled={
                          languages.some(lang => lang.wert === "" || lang.niveau === "")
                        }
                        onClick={
                          () => { setLanguages([...languages, { wert: "", niveau: "" }]); }
                        }
                      >
                        <AddCircleOutline />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Typography>EDV-Kenntnisse:</Typography>
                    </Grid>
                    {edvSkills.map((edvSkill, index) => {
                      return <Grid item container spacing={1} xs={11} sm={8} md={6} lg={4}
                        className={classes.dialogListItem}>
                        <Grid item xs={5}>
                          <Autocomplete
                            value={edvSkill.wert}
                            onChange={(event, newValue) => {
                              const list = [...edvSkills];
                              if (typeof newValue === "string") {
                                // Make a new object of the updated edv skill
                                const updatedEdvSkill: EDVSkillOfMember =
                                  { ...edvSkills[index], wert: newValue };
                                  addEDVSkillToList(list, index, updatedEdvSkill);

                              } else if (newValue && newValue.inputValue) {
                                // Make a new object of the updated edv skill
                                const updatedEdvSkill: EDVSkillOfMember =
                                  { ...edvSkills[index], wert: newValue.inputValue };
                                  addEDVSkillToList(list, index, updatedEdvSkill);

                              } else if (newValue) {
                                // Make a new object of the updated edv skill
                                const updatedEdvSkill: EDVSkillOfMember =
                                  { ...edvSkills[index], wert: newValue.wert };
                                addEDVSkillToList(list, index, updatedEdvSkill);
                              }
                            }}
                            filterOptions={(options, params) => {
                              const filtered = edvFilter(options, params);
                              // Suggest the creation of a new value
                              if (params.inputValue !== "") {
                                filtered.push({
                                  inputValue: params.inputValue,
                                  wert: `"${params.inputValue}" hinzufügen`,
                                });
                              }
                              return filtered;
                            }}
                            selectOnFocus
                            clearOnBlur
                            options={listOfEDVSkills}
                            getOptionLabel={(option) => {
                              if (typeof option === "string") {
                                return option;
                              }
                              return option.wert;
                            }}
                            freeSolo
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="EDV-Kenntnis"
                                variant="outlined"
                              />
                            )}
                          /></Grid><Grid item xs={5}>
                          <FormControl className={classes.fullWidth}>
                            <InputLabel id="edv-skill-niveau-select-label">
                              Niveau
                                     </InputLabel>
                            <Select
                              labelId="edv-skill-niveau-select-label"
                              value={edvSkill.niveau}
                              onChange={(event) => {
                                const list = [...edvSkills];
                                // Make a new object of updated language
                                const updatedEdvSkill: EDVSkillOfMember =
                                  { ...edvSkills[index], niveau: "" + event.target.value };
                                  addEDVSkillToList(list, index, updatedEdvSkill);

                              }}
                            >
                              <MenuItem value={3}>{getEDVNiveauLabel(3)}</MenuItem>
                              <MenuItem value={2}>{getEDVNiveauLabel(2)}</MenuItem>
                              <MenuItem value={1}>{getEDVNiveauLabel(1)}</MenuItem>
                            </Select>
                          </FormControl></Grid>
                        <Grid item xs={2}>
                          <IconButton aria-label="delete" color="primary"
                            onClick={
                              () => {
                                setEdvSkills(edvSkills.filter(
                                  (value) => !(value.wert === edvSkill.wert)
                                ));
                              }
                            }
                          >
                            <Clear />
                          </IconButton>
                        </Grid>
                      </Grid>;
                    })}
                    <Grid item xs={12} sm={2} md={2} lg={2} className={classes.addListItemBtn}>
                      <IconButton aria-label="add" color="primary"
                        disabled={edvSkills.some(edv => edv.wert === "" || edv.niveau === "")}
                        onClick={() => { setEdvSkills([...edvSkills, { wert: "", niveau: "" }]); }}
                      >
                        <AddCircleOutline />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <hr />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className={classes.submitContainer}
              >
                <Button
                  className={classes.cancelButton}
                  variant="contained"
                  onClick={handleQualificationInfoDialogClose}
                >
                  Abbrechen
                 </Button>
                <Button
                  className={classes.submitButton}
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Änderungen speichern
                 </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  /**
   * Renders the dialog for changing the payment informations
   */
  const renderPaymentInformationDialog: VoidFunction = () => {
    return (
      <Dialog
        open={paymentInfoDialogOpen}
        onClose={handlePaymentInfoDialogClose}
        fullWidth
        maxWidth="lg"
        keepMounted
        aria-labelledby="payment-dialog-title"
      >
        <DialogTitle id="payment-dialog-title">
          Zahlungsinformationen
         </DialogTitle>
        <DialogContent>
          <form autoComplete="off" onSubmit={submit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  className={classes.fullWidth}
                  color="primary"
                  disabled={!props.isOwner}
                  id="account-holder-field"
                  label="Kontoinhaber"
                  variant="outlined"
                  value={accountHolder}
                  onChange={(event) => {
                    setAccountHolder(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  className={classes.fullWidth}
                  color="primary"
                  disabled={!props.isOwner}
                  id="iban-field"
                  label="IBAN"
                  variant="outlined"
                  value={ibanState}
                  onChange={(event) => {
                    setIbanState(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  className={classes.fullWidth}
                  color="primary"
                  disabled={!props.isOwner}
                  id="bic-field"
                  label="BIC"
                  variant="outlined"
                  value={bicState}
                  onChange={(event) => {
                    setBicState(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <hr />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className={classes.submitContainer}
              >
                <Button
                  className={classes.cancelButton}
                  variant="contained"
                  onClick={handlePaymentInfoDialogClose}
                >
                  Abbrechen
                 </Button>
                <Button
                  className={classes.submitButton}
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Änderungen speichern
                 </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className={classes.displayMemberDetailsRoot}>
      <Grid container spacing={3}>
        {renderImage()}
        {renderGeneralInformation()}
        {renderGeneralInformationDialog()}
        {renderClubInformation()}
        {renderClubInformationDialog()}
        {renderProjectList()}
        {renderWorkshopList()}
        {renderQualificationInformation()}
        {renderQualificationInformationDialog()}
        {renderStudyInformation()}
        {renderStudyInformationDialog()}
        {renderPaymentInformation()}
        {renderPaymentInformationDialog()}
        <Grid item>
          <strong>
            Letzte Änderung:{" "}
            {transformSQLStringToGermanDate(memberDetails.lastchange)}
          </strong>
        </Grid>
      </Grid>
    </div>
  );
};

export default DisplayMemberDetails;