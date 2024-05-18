/**
 * The DislpayMemberDetails-Component displays details of a member
 */

import React, { useReducer, useState } from "react";
import {
  Grid,
  Typography,
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
  createFilterOptions,
  Autocomplete,
  useTheme,
  Box,
} from "@mui/material";
import { ExpandLess, ExpandMore, AddCircleOutline, Clear } from "@mui/icons-material";
import JBTLogoBlack from "../../../assets/jbt-logo-black.png";
import {
  transformSQLStringToGermanDate,
  transformGermanDateToSQLString,
  transformStringToSQLString,
} from "../../../utils/dateUtils";
import * as membersTypes from "../../../types/membersTypes";
import * as globalTypes from "../../../types/globalTypes";
import { doesPermissionsHaveSomeOf } from "../../../utils/authUtils";
import InfoCard from "../../../components/general/InfoCard";
import MemberImage from "../../../components/general/MemberImage";
import { Link } from "react-router-dom";

/**
 * Interface for the props of the DisplayMemberDetails
 */
interface DisplayMemberDetailsProps {
  members: membersTypes.Member[];
  listOfPermissions: globalTypes.Permission[];
  departments: membersTypes.Department[];
  listOfLanguages: membersTypes.Language[];
  listOfEDVSkills: membersTypes.EDVSkill[];
  memberDetails: membersTypes.MemberDetails;
  isOwner: boolean;
  memberImage: membersTypes.MemberImage | null;
  updateMemberDetails: (data: membersTypes.MemberDetails) => void;
  saveMemberImage: (file: File) => void;
}

/**
 * Displays the member details
 */
const DisplayMemberDetails: React.FunctionComponent<DisplayMemberDetailsProps> = (props: DisplayMemberDetailsProps) => {
  const theme = useTheme();

  /**
   * Function which proivdes the styles of the MemberPage
   */
  const styles = {
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
      [theme.breakpoints.down("xl")]: {
        width: "50%",
      },
      [theme.breakpoints.down("lg")]: {
        width: "60%",
      },
      [theme.breakpoints.down("md")]: {
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
  };

  // Filter of languages for the autocomplete component
  const langFilter = createFilterOptions<membersTypes.Language>();

  // Filter of languages for the autocomplete component
  const edvFilter = createFilterOptions<membersTypes.EDVSkill>();

  const { members, departments, listOfLanguages, listOfEDVSkills, memberDetails } = props;

  const [careerOpen, setCareerOpen] = useState(false);
  const [lastname] = useState(memberDetails.nachname);
  const [name] = useState<string>(memberDetails.vorname);
  const [birthday, setBirthday] = useState<string>(transformSQLStringToGermanDate(memberDetails.geburtsdatum));
  const [smartphone, setSmartphone] = useState<string>(memberDetails.handy ? memberDetails.handy : "");
  const [jbtMail, setJbtMail] = useState<string>(memberDetails.jbt_email);
  const [memberState] = useState<string>(memberDetails.mitgliedstatus);
  const [department, setDepartment] = useState<string | null>(memberDetails.ressort);
  const [mentorState, setMentorState] = useState<membersTypes.Mentor | null>(
    memberDetails.mentor ? memberDetails.mentor : null
  );
  const [employer, setEmployer] = useState<string>(memberDetails.arbeitgeber ? memberDetails.arbeitgeber : "");
  const [street1, setStreet1] = useState<string>(memberDetails.strasse1 ? memberDetails.strasse1 : "");
  const [plz1State, setPlz1State] = useState<string>(memberDetails.plz1 ? memberDetails.plz1.toString() : "");
  const [placeOfResidence1, setPlaceOfResidence1] = useState<string>(memberDetails.ort1 ? memberDetails.ort1 : "");
  const [telephone1] = useState<string>(memberDetails.tel1 ? memberDetails.tel1.toString() : "");
  const [email1State] = useState<string>(memberDetails.email1 || "");
  const [street2] = useState<string>(memberDetails.strasse2 ? memberDetails.strasse2 : "");
  const [plz2State] = useState<string>(memberDetails.plz2 ? memberDetails.plz2.toString() : "");
  const [placeOfResidence2] = useState<string>(memberDetails.ort2 ? memberDetails.ort2 : "");
  const [telephone2] = useState<string>(memberDetails.tel2 ? memberDetails.tel2.toString() : "");
  const [email2State] = useState<string>(memberDetails.email2 ? memberDetails.email2 : "");
  const [university, setUniversity] = useState<string>(memberDetails.hochschule);
  const [courseOfStudy, setCourseOfStudy] = useState<string>(memberDetails.studiengang);
  const [startOfStudy, setStartOfStudy] = useState<string>(transformSQLStringToGermanDate(memberDetails.studienbeginn));
  const [endOfStudy, setEndOfStudy] = useState<string>(transformSQLStringToGermanDate(memberDetails.studienende));
  const [speciality, setSpeciality] = useState<string>(memberDetails.vertiefungen ? memberDetails.vertiefungen : "");
  const [apprenticeship, setApprenticeship] = useState<string>(
    memberDetails.ausbildung ? memberDetails.ausbildung : ""
  );
  const [accountHolder, setAccountHolder] = useState<string>(
    memberDetails.kontoinhaber ? memberDetails.kontoinhaber : ""
  );
  const [ibanState, setIbanState] = useState<string>(memberDetails?.iban || "");
  const [bicState, setBicState] = useState<string>(memberDetails?.bic || "");
  const [engagementState] = useState<string>(memberDetails.engagement ? memberDetails.engagement : "");
  const [driversLicense] = useState<boolean>(memberDetails.fuehrerschein);
  const [firstAid] = useState<boolean>(memberDetails.ersthelferausbildung);
  const [traineeSince, setTraineeSince] = useState<string>(transformSQLStringToGermanDate(memberDetails.trainee_seit));
  const [memberSince, setMemberSince] = useState<string>(transformSQLStringToGermanDate(memberDetails.mitglied_seit));
  const [seniorSince, setSeniorSince] = useState<string>(transformSQLStringToGermanDate(memberDetails.senior_seit));
  const [alumniSince, setAlumniSince] = useState<string>(transformSQLStringToGermanDate(memberDetails.alumnus_seit));
  const [passiveSince, setPassiveSince] = useState<string>(transformSQLStringToGermanDate(memberDetails.passiv_seit));
  const [generalInfoDialogOpen, setGeneralInfoDialogOpen] = useState<boolean>(false);
  const [clubInfoDialogOpen, setClubInfoDialogOpen] = useState<boolean>(false);
  const [studyInfoDialogOpen, setStudyInfoDialogOpen] = useState<boolean>(false);
  const [paymentInfoDialogOpen, setPaymentInfoDialogOpen] = useState<boolean>(false);
  const [qualificationInfoDialogOpen, setQualificationInfoDialogOpen] = useState<boolean>(false);
  const [menteeList] = useState<membersTypes.Mentee[]>(memberDetails?.mentees || []);

  /**
   * Saves the changes of the image
   * @param event ChangeEvent
   */
  const saveImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      props.saveMemberImage(file);
    }
  };

  /**
   * Checks if there would be a duplicate value in languages if value would be added
   * @param list the list of the languages of the member
   * @param value the new value that should be inserted
   * @returns true it there would be a duplicate
   */
  const checkLanguagesForDuplicates = (list: membersTypes.LanguageOfMember[], value: string) => {
    return list.filter((language) => language.wert === value).length !== 0;
  };

  /**
   * Updates the list of languages of the member
   * @param list the current list of languages of the member
   * @param index the index of the language that should be updated
   * @param value the new value of the language
   * @param typeOfValue specifies which type the value is and what attribute of language should be updated
   * @returns An updated list of languages
   */
  const updateLanguages = (
    list: membersTypes.LanguageOfMember[],
    index: number,
    value: string,
    typeOfValue: string
  ) => {
    // Creates a copy of the current list of languages
    const newList = [...list];
    switch (typeOfValue) {
      case "WERT": {
        // Updates the language
        const updatedLanguage: membersTypes.LanguageOfMember = {
          ...list[index],
          wert: value,
        };
        newList[index] = updatedLanguage;
        return newList;
      }
      case "NIVEAU": {
        // Updates the language
        const updatedLanguage: membersTypes.LanguageOfMember = {
          ...list[index],
          niveau: value,
        };
        newList[index] = updatedLanguage;
        return newList;
      }
      default:
        return list;
    }
  };

  /**
   * The reducer function for the languages
   * It manages how the languages can be changed
   * @param state the current state of the languages
   * @param action the action that should be performed
   * @returns the new state of the languages
   */
  const languagesReducer = (state: membersTypes.LanguageOfMember[], action: membersTypes.languagesReducerAction) => {
    switch (action.type) {
      case membersTypes.languagesReducerActionType.addNewLanguageWithValueAsString: {
        if (checkLanguagesForDuplicates(state, action.payload.value)) {
          return state;
        }
        return updateLanguages(state, action.payload.index, action.payload.value, "WERT");
      }
      case membersTypes.languagesReducerActionType.addNewLanguageWithValueAsObject: {
        if (action.payload.lang.inputValue) {
          if (checkLanguagesForDuplicates(state, action.payload.lang.inputValue)) {
            return state;
          }
          return updateLanguages(state, action.payload.index, action.payload.lang.inputValue, "WERT");
        } else if (action.payload.lang.wert) {
          if (checkLanguagesForDuplicates(state, action.payload.lang.wert)) {
            return state;
          }
          return updateLanguages(state, action.payload.index, action.payload.lang.wert, "WERT");
        } else {
          return state;
        }
      }
      case membersTypes.languagesReducerActionType.addNewLanguageWithNiveau: {
        return updateLanguages(state, action.payload.index, action.payload.niveau, "NIVEAU");
      }
      case membersTypes.languagesReducerActionType.addEmptyLanguage: {
        return [...state, { wert: "", niveau: "" }];
      }
      case membersTypes.languagesReducerActionType.deleteLanguage: {
        return state.filter((value) => !(value.wert === action.payload.lang.wert));
      }
      default:
        return state;
    }
  };

  /**
   * Checks if there would be a duplicate value in edv skills if value would be added
   * @param list the list of the edv skills of the member
   * @param value the new value that should be inserted
   * @returns true it there would be a duplicate
   */
  const checkEdvSkillsForDuplicates = (list: membersTypes.EDVSkillOfMember[], value: string) => {
    return list.filter((edvSkill) => edvSkill.wert === value).length !== 0;
  };

  /**
   * Updates the list of edv skills of the member
   * @param list the current list of edv skills of the member
   * @param index the index of the edv skill that should be updated
   * @param value the new value of the edv skill
   * @param typeOfValue specifies which type the value is and what attribute of edv skill should be updated
   * @returns An updated list of languages
   */
  const updateEdvSkills = (
    list: membersTypes.EDVSkillOfMember[],
    index: number,
    value: string,
    typeOfValue: string
  ) => {
    // Creates a copy of the current list of languages
    const newList = [...list];
    switch (typeOfValue) {
      case "WERT": {
        // Updates the language
        const updatedEdvSkill: membersTypes.EDVSkillOfMember = {
          ...list[index],
          wert: value,
        };
        newList[index] = updatedEdvSkill;
        return newList;
      }
      case "NIVEAU": {
        // Updates the language
        const updatedEdvSkill: membersTypes.EDVSkillOfMember = {
          ...list[index],
          niveau: value,
        };
        newList[index] = updatedEdvSkill;
        return newList;
      }
      default:
        return list;
    }
  };

  /**
   * The reducer function for the edvSkills
   * It manages how the edvSkills can be changed
   * @param state the current state of the edvSkills
   * @param action the action that should be performed
   * @returns the new state of the edvSkills
   */
  const edvSkillsReducer = (state: membersTypes.EDVSkillOfMember[], action: membersTypes.edvSkillsReducerAction) => {
    switch (action.type) {
      case membersTypes.edvSkillsReducerActionType.addNewEdvSkillWithValueAsString: {
        if (checkEdvSkillsForDuplicates(state, action.payload.value)) {
          return state;
        }
        return updateEdvSkills(state, action.payload.index, action.payload.value, "WERT");
      }
      case membersTypes.edvSkillsReducerActionType.addNewEdvSkillWithValueAsObject: {
        if (action.payload.edvSkill.inputValue) {
          if (checkEdvSkillsForDuplicates(state, action.payload.edvSkill.inputValue)) {
            return state;
          }
          return updateEdvSkills(state, action.payload.index, action.payload.edvSkill.inputValue, "WERT");
        } else if (action.payload.edvSkill.wert) {
          if (checkEdvSkillsForDuplicates(state, action.payload.edvSkill.wert)) {
            return state;
          }
          return updateEdvSkills(state, action.payload.index, action.payload.edvSkill.wert, "WERT");
        } else {
          return state;
        }
      }
      case membersTypes.edvSkillsReducerActionType.addNewEdvSkillWithNiveau: {
        return updateEdvSkills(state, action.payload.index, action.payload.niveau, "NIVEAU");
      }
      case membersTypes.edvSkillsReducerActionType.addEmptyEdvSkill: {
        return [...state, { wert: "", niveau: "" }];
      }
      case membersTypes.edvSkillsReducerActionType.deleteEdvSkill: {
        return state.filter((value) => !(value.wert === action.payload.edvSkill.wert));
      }
      default:
        return state;
    }
  };

  const [languages, dispatchLanguages] = useReducer(languagesReducer, memberDetails?.sprachen || []);
  const [edvSkills, dispatchEdvSkills] = useReducer(edvSkillsReducer, memberDetails?.edvkenntnisse || []);

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
      plz1: plz1State ? parseInt(plz1State, 10) : null,
      ort1: placeOfResidence1,
      tel1: parseInt(telephone1, 10),
      email1: email1State,
      strasse2: street2,
      plz2: plz2State ? parseInt(plz2State, 10) : null,
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
      fuehrerschein: driversLicense ? true : false, // API does only support true and false and not 0 and 1
      ersthelferausbildung: firstAid ? true : false, // API does only support true and false and not 0 and 1
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
  const handleGeneralInfoDialogOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    setGeneralInfoDialogOpen(true);
  };

  /**
   * Handles the closing of the general information dialog
   * @param event FormEvent
   */
  const handleGeneralInfoDialogClose: VoidFunction = () => {
    setGeneralInfoDialogOpen(false);
  };

  /**
   * Handles the click on the edit button of the club information section
   * @param event MouseEvent
   */
  const handleClubInfoDialogOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
  const handleStudyInfoDialogOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
  const handlePaymentInfoDialogOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
  const handleQualificationInfoDialogOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
   * Renders the image of the member, his name and his status
   */
  const renderImage: VoidFunction = () => {
    return (
      <Box sx={styles.imageSection}>
        <MemberImage
          base64={props.memberImage?.base64}
          mimeType={props.memberImage?.mimeType}
          defaultImage={JBTLogoBlack}
          alt="Member Image"
          size={240}
          onImageChange={props.isOwner ? saveImage : undefined}
        />
        <Box sx={styles.imageSectionText}>
          <Typography variant="h6">{`${memberDetails.vorname} ${memberDetails.nachname}`}</Typography>
          <Typography>
            <i>{`${memberDetails.mitgliedstatus}`}</i>
          </Typography>
        </Box>
      </Box>
    );
  };

  /**
   * Renders the category for general information
   */
  const renderGeneralInformation: VoidFunction = () => {
    return (
      <Grid item xs={12} sm={12}>
        <InfoCard
          title={"Allgemeine Angaben"}
          isExpandable={true}
          defaultExpanded={true}
          /* When the user is owner or has the permission to
            manage all members they can edit this section */
          isEditable={props.isOwner || doesPermissionsHaveSomeOf(props.listOfPermissions, [1])}
          handleEdit={handleGeneralInfoDialogOpen}
        >
          <Box sx={styles.category}>
            <Box sx={styles.categoryItem}>
              <Typography sx={styles.categoryLine}>Geburtsdatum:&nbsp;&nbsp;</Typography>
              <Typography sx={styles.categoryLine}>
                {transformSQLStringToGermanDate(memberDetails.geburtsdatum)}
              </Typography>
            </Box>
            <Box sx={styles.categoryItem}>
              <Typography sx={styles.categoryLine}>Handy:&nbsp;&nbsp;</Typography>
              <Typography sx={styles.categoryLine}>{memberDetails.handy}</Typography>
            </Box>
            <Box sx={styles.categoryItem}>
              <Typography sx={styles.categoryLine}>JBT-E-Mail:&nbsp;&nbsp;</Typography>
              <Typography sx={styles.categoryLine}>{memberDetails.jbt_email}</Typography>
            </Box>
            <Box sx={styles.categoryItem}>
              <Typography sx={styles.categoryLine}>Straße/Hausnummer:&nbsp;&nbsp;</Typography>
              <Typography sx={styles.categoryLine}>{memberDetails.strasse1}</Typography>
            </Box>
            <Box sx={styles.categoryItem}>
              <Typography sx={styles.categoryLine}>PLZ/Ort:&nbsp;&nbsp;</Typography>
              <Typography sx={styles.categoryLine}>{memberDetails.plz1}</Typography>
            </Box>
            <Box sx={styles.categoryItem}>
              <Typography sx={styles.categoryLine}>Messenger:&nbsp;&nbsp;</Typography>
              <Typography sx={styles.categoryLine}>{"PLATZHALTER"}</Typography>
            </Box>
            <Box sx={styles.categoryItem}>
              <Typography sx={styles.categoryLine}>Arbeitgeber:&nbsp;&nbsp;</Typography>
              <Typography sx={styles.categoryLine}>{memberDetails.arbeitgeber}</Typography>
            </Box>
          </Box>
        </InfoCard>
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
            <Typography sx={styles.categoryItem}>
              <strong>{"Passives Mitglied"}</strong>
            </Typography>
            <Typography>{`Seit ${transformSQLStringToGermanDate(memberDetails.passiv_seit)}`}</Typography>
          </div>
        ) : null}
        {memberDetails.alumnus_seit ? (
          <div>
            <Typography sx={styles.categoryItem}>
              <strong>{"Alumna*Alumnus"}</strong>
            </Typography>
            <Typography>{`Seit ${transformSQLStringToGermanDate(memberDetails.alumnus_seit)}`}</Typography>
          </div>
        ) : null}
        {memberDetails.senior_seit ? (
          <div>
            <Typography sx={styles.categoryItem}>
              <strong>{"Senior"}</strong>
            </Typography>
            <Typography>{`Seit ${transformSQLStringToGermanDate(memberDetails.senior_seit)}`}</Typography>
          </div>
        ) : null}
        {memberDetails.mitglied_seit ? (
          <div>
            <Typography sx={styles.categoryItem}>
              <strong>{"Aktives Mitglied"}</strong>
            </Typography>
            <Typography>{`Seit ${transformSQLStringToGermanDate(memberDetails.mitglied_seit)}`}</Typography>
          </div>
        ) : null}
        {memberDetails.trainee_seit ? (
          <div>
            <Typography sx={styles.categoryItem}>
              <strong>{"Trainee"}</strong>
            </Typography>
            <Typography>{`Seit ${transformSQLStringToGermanDate(memberDetails.trainee_seit)}`}</Typography>
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
        <InfoCard
          title={"Verein"}
          isExpandable={true}
          defaultExpanded={true}
          /* When the has the permission to
            manage all members they can edit this section */
          isEditable={doesPermissionsHaveSomeOf(props.listOfPermissions, [1])}
          handleEdit={handleClubInfoDialogOpen}
        >
          <Box sx={styles.category}>
            <Box sx={styles.category}>
              <Box sx={styles.categoryItem}>
                <Typography sx={styles.categoryLine}>Ressort:&nbsp;&nbsp;</Typography>
                <Typography sx={styles.categoryLine}>{memberDetails.ressort}</Typography>
              </Box>
              <Box sx={styles.categoryItem}>
                <Typography sx={styles.categoryLine}>Mentor:&nbsp;&nbsp;</Typography>
                {memberDetails.mentor && memberDetails.mentor.vorname && memberDetails.mentor.nachname ? (
                  <Link
                    to={`/gesamtuebersicht/${memberDetails.mentor.mitgliedID}`}
                    style={{ paddingTop: "12.5px", paddingBottom: "11.5px", textAlign: "right" }}
                  >
                    {`${memberDetails.mentor.vorname} ${memberDetails.mentor.nachname}`}
                  </Link>
                ) : (
                  ""
                )}
              </Box>
              <Box sx={styles.categoryItem}>
                <Typography sx={styles.categoryLine}>Mentees:</Typography>
                <Box sx={styles.categoryItemList}>
                  {menteeList.map((mentee, index) => {
                    return (
                      <Typography
                        sx={styles.categoryLine}
                        key={index}
                      >{`${mentee.vorname} ${mentee.nachname}`}</Typography>
                    );
                  })}
                </Box>
              </Box>
            </Box>
            <div>
              <div>
                <>
                  <Box sx={styles.subCategoryHeader}>
                    <Typography>Werdegang</Typography>
                    <IconButton aria-label="expand career" onClick={toggleCareerState} size="large">
                      {careerOpen ? <ExpandLess fontSize="inherit" /> : <ExpandMore fontSize="inherit" />}
                    </IconButton>
                  </Box>
                  <hr />
                  {careerOpen ? renderCareerItems() : null}
                </>
              </div>
            </div>
          </Box>
        </InfoCard>
      </Grid>
    );
  };

  /**
   * Renders the category for club information
   */
  const renderStudyInformation: VoidFunction = () => {
    return (
      <Grid item xs={12} sm={12}>
        <InfoCard
          title={"Studium"}
          isExpandable={true}
          defaultExpanded={true}
          /* When the user is owner they can edit this section */
          isEditable={props.isOwner}
          handleEdit={handleStudyInfoDialogOpen}
        >
          <Box sx={styles.category}>
            <Box sx={styles.categoryItem}>
              <Typography sx={styles.categoryLine}>Hochschule:&nbsp;&nbsp;</Typography>
              <Typography sx={styles.categoryLine}>{memberDetails.hochschule}</Typography>
            </Box>
            <Box sx={styles.categoryItem}>
              <Typography sx={styles.categoryLine}>Studiengang:&nbsp;&nbsp;</Typography>
              <Typography sx={styles.categoryLine}>{memberDetails.studiengang}</Typography>
            </Box>
            <Box sx={styles.categoryItem}>
              <Typography sx={styles.categoryLine}>Studienbeginn:&nbsp;&nbsp;</Typography>
              <Typography sx={styles.categoryLine}>
                {transformSQLStringToGermanDate(memberDetails.studienbeginn)}
              </Typography>
            </Box>
            <Box sx={styles.categoryItem}>
              <Typography sx={styles.categoryLine}>Studienende:&nbsp;&nbsp;</Typography>
              <Typography sx={styles.categoryLine}>
                {transformSQLStringToGermanDate(memberDetails.studienende)}
              </Typography>
            </Box>
            <Box sx={styles.categoryItem}>
              <Typography sx={styles.categoryLine}>Vertiefungen:&nbsp;&nbsp;</Typography>
              <Typography sx={styles.categoryLine}>{memberDetails.vertiefungen}</Typography>
            </Box>
          </Box>
        </InfoCard>
      </Grid>
    );
  };

  /**
   * Renders the category for payment informations
   */
  const renderPaymentInformation: VoidFunction = () => {
    if (props.isOwner || doesPermissionsHaveSomeOf(props.listOfPermissions, [6])) {
      return (
        <Grid item xs={12} sm={12}>
          <InfoCard
            title={"Zahlungsinformationen"}
            isExpandable={true}
            defaultExpanded={false}
            /* When the user is owner they can edit this section */
            isEditable={props.isOwner}
            handleEdit={handlePaymentInfoDialogOpen}
          >
            <Box sx={styles.category}>
              <Box sx={styles.categoryItem}>
                <Typography sx={styles.categoryLine}>Kontoinhaber:&nbsp;&nbsp;</Typography>
                <Typography sx={styles.categoryLine}>{memberDetails.kontoinhaber}</Typography>
              </Box>
              <Box sx={styles.categoryItem}>
                <Typography sx={styles.categoryLine}>IBAN:&nbsp;&nbsp;</Typography>
                <Typography sx={styles.categoryLine}>{memberDetails.iban}</Typography>
              </Box>
              <Box sx={styles.categoryItem}>
                <Typography sx={styles.categoryLine}>BIC:&nbsp;&nbsp;</Typography>
                <Typography sx={styles.categoryLine}>{memberDetails.bic}</Typography>
              </Box>
            </Box>
          </InfoCard>
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
        <InfoCard
          title={"Qualifikationen"}
          isExpandable={true}
          defaultExpanded={true}
          /* When the user is owner they can edit this section */
          isEditable={props.isOwner}
          handleEdit={handleQualificationInfoDialogOpen}
        >
          <Box sx={styles.category}>
            <Box sx={styles.categoryItem}>
              <Typography sx={styles.categoryLine}>Ausbildung:&nbsp;&nbsp;</Typography>
              <Typography sx={styles.categoryLine}>{memberDetails.ausbildung}</Typography>
            </Box>
            <Box sx={styles.categoryItem}>
              <Typography sx={styles.categoryLine}>Sprachen:</Typography>
              <Box sx={styles.categoryItemList}>
                {(memberDetails?.sprachen || []).map((language) => {
                  return (
                    <Typography sx={styles.categoryLine}>
                      {`${language.wert}: ${getLanguageNiveauLabel(parseInt(language.niveau, 10))}`}
                    </Typography>
                  );
                })}
              </Box>
            </Box>
            <Box sx={styles.categoryItem}>
              <Typography sx={styles.categoryLine}>EDV-Kenntnisse:</Typography>
              <Box sx={styles.categoryItemList}>
                {(memberDetails?.edvkenntnisse || []).map((edv) => {
                  return (
                    <Typography sx={styles.categoryLine}>
                      {`${edv.wert}: ${getEDVNiveauLabel(parseInt(edv.niveau, 10))}`}
                    </Typography>
                  );
                })}
              </Box>
            </Box>
          </Box>
        </InfoCard>
      </Grid>
    );
  };

  /**
   * Renders the the list of projects
   */
  const renderProjectList: VoidFunction = () => {
    return (
      <Grid item xs={12} sm={12}>
        <InfoCard title={"Projekte (# Anzahl)"} isExpandable={true} defaultExpanded={true} isEditable={false}>
          <Box sx={styles.category}>
            <div>
              <Typography sx={styles.categoryItem}>
                <strong>{"Name des Projekts"}</strong>
              </Typography>
              <Typography sx={styles.categoryItem}>{`Projektzeitraum: von ${""} bis ${""}`}</Typography>
              <Typography sx={styles.categoryItem}>{`Rolle: ${""}`}</Typography>
              <Typography sx={styles.categoryItem}>{`Geleistete BT: ${""}`}</Typography>
            </div>
            <hr />
          </Box>
        </InfoCard>
      </Grid>
    );
  };

  /**
   * Renders the the list of workshops
   */
  const renderWorkshopList: VoidFunction = () => {
    return (
      <Grid item xs={12} sm={12}>
        <InfoCard title={"Workshops (# Anzahl)"} isExpandable={true} defaultExpanded={true} isEditable={false}>
          <Box sx={styles.category}>
            <Box sx={styles.workshopItem}>
              <Typography>{`${"DATUM"}`}</Typography>
              <Typography>{`${"ART DES WS"}`}</Typography>
              <Typography>{`${"NAME"}`}</Typography>
              <Typography>{`${"GEHALTEN"}`}</Typography>
            </Box>
          </Box>
        </InfoCard>
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
        <DialogTitle id="general-dialog-title">Allgemeine Informationen</DialogTitle>
        <DialogContent>
          <form autoComplete="off" onSubmit={submit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  sx={styles.fullWidth}
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
                  sx={styles.fullWidth}
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
                  sx={styles.fullWidth}
                  color="primary"
                  required
                  disabled={!doesPermissionsHaveSomeOf(props.listOfPermissions, [1])}
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
                  sx={styles.fullWidth}
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
                  sx={styles.fullWidth}
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
                  sx={styles.fullWidth}
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
                  sx={styles.fullWidth}
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
              <Grid item xs={12} sm={12} md={12} lg={12} sx={styles.submitContainer}>
                <Button sx={styles.cancelButton} variant="contained" onClick={handleGeneralInfoDialogClose}>
                  Abbrechen
                </Button>
                <Button sx={styles.submitButton} variant="contained" color="primary" type="submit">
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
                  defaultValue={departments.filter((dep) => dep.bezeichnung === department)[0]}
                  getOptionLabel={(dep) => `${dep.bezeichnung}`}
                  sx={styles.fullWidth}
                  renderInput={(params) => <TextField {...params} label="Ressort" variant="outlined" />}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Autocomplete
                  id="mentor-select"
                  options={members}
                  disabled={!doesPermissionsHaveSomeOf(props.listOfPermissions, [1])}
                  onChange={(event, newMentor) => {
                    if (newMentor) {
                      setMentorState({
                        mitgliedID: newMentor.mitgliedID,
                        vorname: newMentor.vorname,
                        nachname: newMentor.nachname,
                      });
                    }
                  }}
                  defaultValue={members.filter((memb) => memb.mitgliedID === mentorState?.mitgliedID)[0]}
                  getOptionLabel={(member) => `${member.vorname} ${member.nachname}`}
                  sx={styles.fullWidth}
                  renderInput={(params) => <TextField {...params} label="Mentor" variant="outlined" />}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  sx={styles.fullWidth}
                  color="primary"
                  disabled={!doesPermissionsHaveSomeOf(props.listOfPermissions, [1])}
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
                  sx={styles.fullWidth}
                  color="primary"
                  disabled={!doesPermissionsHaveSomeOf(props.listOfPermissions, [1])}
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
                  sx={styles.fullWidth}
                  color="primary"
                  disabled={!doesPermissionsHaveSomeOf(props.listOfPermissions, [1])}
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
                  sx={styles.fullWidth}
                  color="primary"
                  disabled={!doesPermissionsHaveSomeOf(props.listOfPermissions, [1])}
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
                  sx={styles.fullWidth}
                  color="primary"
                  disabled={!doesPermissionsHaveSomeOf(props.listOfPermissions, [1])}
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
              <Grid item xs={12} sm={12} md={12} lg={12} sx={styles.submitContainer}>
                <Button sx={styles.cancelButton} variant="contained" onClick={handleClubInfoDialogClose}>
                  Abbrechen
                </Button>
                <Button sx={styles.submitButton} variant="contained" color="primary" type="submit">
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
                  sx={styles.fullWidth}
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
                  sx={styles.fullWidth}
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
                  sx={styles.fullWidth}
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
                  sx={styles.fullWidth}
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
                  sx={styles.fullWidth}
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
              <Grid item xs={12} sm={12} md={12} lg={12} sx={styles.submitContainer}>
                <Button sx={styles.cancelButton} variant="contained" onClick={handleStudyInfoDialogClose}>
                  Abbrechen
                </Button>
                <Button sx={styles.submitButton} variant="contained" color="primary" type="submit">
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
        <DialogTitle id="qualification-dialog-title">Qualifikationen</DialogTitle>
        <DialogContent>
          <form autoComplete="off" onSubmit={submit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  sx={styles.fullWidth}
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
                      return (
                        <Grid
                          item
                          container
                          spacing={1}
                          xs={11}
                          sm={8}
                          md={6}
                          lg={4}
                          sx={styles.dialogListItem}
                          key={index}
                        >
                          <Grid item xs={5}>
                            <Autocomplete
                              value={language.wert}
                              onChange={(event, newValue) => {
                                if (typeof newValue === "string") {
                                  dispatchLanguages({
                                    type: membersTypes.languagesReducerActionType.addNewLanguageWithValueAsString,
                                    payload: { index, value: newValue },
                                  });
                                } else if ((newValue && newValue.inputValue) || newValue) {
                                  dispatchLanguages({
                                    type: membersTypes.languagesReducerActionType.addNewLanguageWithValueAsObject,
                                    payload: { index, lang: newValue },
                                  });
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
                              renderInput={(params) => <TextField {...params} label="Sprache" variant="outlined" />}
                            />
                          </Grid>
                          <Grid item xs={5}>
                            <FormControl sx={styles.fullWidth}>
                              <InputLabel id="language-niveau-select-label">Niveau</InputLabel>
                              <Select
                                labelId="language-niveau-select-label"
                                value={language.niveau}
                                onChange={(event) => {
                                  dispatchLanguages({
                                    type: membersTypes.languagesReducerActionType.addNewLanguageWithNiveau,
                                    payload: {
                                      index,
                                      niveau: "" + event.target.value,
                                    },
                                  });
                                }}
                              >
                                <MenuItem value={5}>{getLanguageNiveauLabel(5)}</MenuItem>
                                <MenuItem value={4}>{getLanguageNiveauLabel(4)}</MenuItem>
                                <MenuItem value={3}>{getLanguageNiveauLabel(3)}</MenuItem>
                                <MenuItem value={2}>{getLanguageNiveauLabel(2)}</MenuItem>
                                <MenuItem value={1}>{getLanguageNiveauLabel(1)}</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={2}>
                            <IconButton
                              aria-label="delete"
                              color="primary"
                              onClick={() =>
                                dispatchLanguages({
                                  type: membersTypes.languagesReducerActionType.deleteLanguage,
                                  payload: { lang: language },
                                })
                              }
                              size="large"
                            >
                              <Clear />
                            </IconButton>
                          </Grid>
                        </Grid>
                      );
                    })}
                    <Grid item xs={12} sm={2} md={2} lg={2} sx={styles.addListItemBtn}>
                      <IconButton
                        aria-label="add"
                        color="primary"
                        disabled={languages.some((lang) => lang.wert === "" || lang.niveau === "")}
                        onClick={() =>
                          dispatchLanguages({
                            type: membersTypes.languagesReducerActionType.addEmptyLanguage,
                          })
                        }
                        size="large"
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
                    {edvSkills.map((edv, index) => {
                      return (
                        <Grid
                          item
                          container
                          spacing={1}
                          xs={11}
                          sm={8}
                          md={6}
                          lg={4}
                          sx={styles.dialogListItem}
                          key={index}
                        >
                          <Grid item xs={5}>
                            <Autocomplete
                              value={edv.wert}
                              onChange={(event, newValue) => {
                                if (typeof newValue === "string") {
                                  dispatchEdvSkills({
                                    type: membersTypes.edvSkillsReducerActionType.addNewEdvSkillWithValueAsString,
                                    payload: { index, value: newValue },
                                  });
                                } else if ((newValue && newValue.inputValue) || newValue) {
                                  dispatchEdvSkills({
                                    type: membersTypes.edvSkillsReducerActionType.addNewEdvSkillWithValueAsObject,
                                    payload: { index, edvSkill: newValue },
                                  });
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
                                <TextField {...params} label="EDV-Kenntnis" variant="outlined" />
                              )}
                            />
                          </Grid>
                          <Grid item xs={5}>
                            <FormControl sx={styles.fullWidth}>
                              <InputLabel id="edv-skill-niveau-select-label">Niveau</InputLabel>
                              <Select
                                labelId="edv-skill-niveau-select-label"
                                value={edv.niveau}
                                onChange={(event) => {
                                  dispatchEdvSkills({
                                    type: membersTypes.edvSkillsReducerActionType.addNewEdvSkillWithNiveau,
                                    payload: {
                                      index,
                                      niveau: "" + event.target.value,
                                    },
                                  });
                                }}
                              >
                                <MenuItem value={3}>{getEDVNiveauLabel(3)}</MenuItem>
                                <MenuItem value={2}>{getEDVNiveauLabel(2)}</MenuItem>
                                <MenuItem value={1}>{getEDVNiveauLabel(1)}</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={2}>
                            <IconButton
                              aria-label="delete"
                              color="primary"
                              onClick={() =>
                                dispatchEdvSkills({
                                  type: membersTypes.edvSkillsReducerActionType.deleteEdvSkill,
                                  payload: { edvSkill: edv },
                                })
                              }
                              size="large"
                            >
                              <Clear />
                            </IconButton>
                          </Grid>
                        </Grid>
                      );
                    })}
                    <Grid item xs={12} sm={2} md={2} lg={2} sx={styles.addListItemBtn}>
                      <IconButton
                        aria-label="add"
                        color="primary"
                        disabled={edvSkills.some((edv) => edv.wert === "" || edv.niveau === "")}
                        onClick={() => {
                          dispatchEdvSkills({
                            type: membersTypes.edvSkillsReducerActionType.addEmptyEdvSkill,
                          });
                        }}
                        size="large"
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
              <Grid item xs={12} sm={12} md={12} lg={12} sx={styles.submitContainer}>
                <Button sx={styles.cancelButton} variant="contained" onClick={handleQualificationInfoDialogClose}>
                  Abbrechen
                </Button>
                <Button sx={styles.submitButton} variant="contained" color="primary" type="submit">
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
        <DialogTitle id="payment-dialog-title">Zahlungsinformationen</DialogTitle>
        <DialogContent>
          <form autoComplete="off" onSubmit={submit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  sx={styles.fullWidth}
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
                  sx={styles.fullWidth}
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
                  sx={styles.fullWidth}
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
              <Grid item xs={12} sm={12} md={12} lg={12} sx={styles.submitContainer}>
                <Button sx={styles.cancelButton} variant="contained" onClick={handlePaymentInfoDialogClose}>
                  Abbrechen
                </Button>
                <Button sx={styles.submitButton} variant="contained" color="primary" type="submit">
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
    <Box sx={styles.displayMemberDetailsRoot}>
      <Grid container spacing={3}>
        <>
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
        </>
        <Grid item>
          <strong>Letzte Änderung: {transformSQLStringToGermanDate(memberDetails.lastchange)}</strong>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DisplayMemberDetails;
