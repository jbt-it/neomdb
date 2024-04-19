/**
 * The AssignTraineePreferences-Component lets admins manually add members and change the status of existing members
 */
import React, { useState } from "react";
import {
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Typography,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  Modal,
  useTheme,
} from "@mui/material";
import { showErrorMessage } from "../../utils/toastUtils";
import AttachFileSharpIcon from "@mui/icons-material/AttachFileSharp";
import { Link } from "react-router-dom";

type TraineeType = {
  mitgliedID: number;
  vorname: string;
  nachname: string;
  wahl_mentor1: number;
  wahl_mentor1_name: string;
  wahl_mentor2: number;
  wahl_mentor2_name: string;
  wahl_mentor3: number;
  wahl_mentor3_name: string;
  wahl_ressort1: number;
  wahl_ressort1_kuerzel: string;
  wahl_ressort2: number;
  wahl_ressort2_kuerzel: string;
  wahl_ressort3: number;
  wahl_ressort3_kuerzel: string;
  wahl_internesprojekt1: number;
  wahl_internesprojekt1_kuerzel: string;
  wahl_internesprojekt2: number;
  wahl_internesprojekt2_kuerzel: string;
  wahl_internesprojekt3: number;
  wahl_internesprojekt3_kuerzel: string;
  wahl_internesprojekt1_motivation: string;
  wahl_internesprojekt2_motivation: string;
  wahl_internesprojekt3_motivation: string;
};

/**
 * Options to create a new member and to change the status of members
 */
const AssignTrainees: React.FunctionComponent = () => {
  const theme = useTheme();

  /**
   * Function which proivdes the styles of the AssignTraineePreferences
   */
  const styles = {
    // Header text of a paper marking a section of a page
    paperHeaderText: {
      marginLeft: theme.spacing(1),
      marginTop: theme.spacing(1),
    },
    paperText: {
      marginLeft: theme.spacing(1),
      marginTop: theme.spacing(1),
    },
    // Header divider of a paper marking a section of a page
    paperHeaderDivider: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    paperContainer: {
      marginBottom: "10px",
    },
    inputContainer: {
      padding: theme.spacing(1),
    },
    selectionElement: {
      [theme.breakpoints.up("md")]: {
        margin: theme.spacing(1),
        width: "155px",
      },
      [theme.breakpoints.down("md")]: {
        margin: theme.spacing(1),
        width: "120px",
      },
      [theme.breakpoints.down("sm")]: {
        margin: theme.spacing(1),
        width: "120px",
      },
    },
    motivationalText: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    inputButton: {
      margin: theme.spacing(1),
    },
    tableContainer: {
      maxHeight: (window.screen.height - 75) * 0.8,
    },
    tableHeadCell: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
    tableHeadSortBtn: {
      display: "flex",
      alignItems: "center",
    },
    linkText: {
      textDecoration: "none",
      boxShadow: "none",
      color: "black",
    },
    motivationalTextPaper: {
      overflowY: "auto",
      position: "absolute",
      margin: "auto",
      top: "10%",
      left: "10%",
      right: "10%",
      bottom: "10%",
      width: "80%",
      display: "flex",
      justifyContent: "center",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  };
  const [showMotivationalTexts, setShowMotivationalTexts] = useState<boolean>(false);
  const [openedTrainee, setOpenedTrainee] = useState<null | TraineeType>(null);

  // Test data
  const startDateString = "01.01.2024";
  const endDateString = "15.01.2024";

  const preferences = [
    {
      mitgliedID: 7,
      vorname: "Henry",
      nachname: "larry",
      wahl_mentor1: 8,
      wahl_mentor1_name: "M.Lewa",
      wahl_mentor2: 9,
      wahl_mentor2_name: "S.KESr",
      wahl_mentor3: 10,
      wahl_mentor3_name: "T.sdafas",
      wahl_ressort1: 1,
      wahl_ressort1_kuerzel: "MAR",
      wahl_ressort2: 2,
      wahl_ressort2_kuerzel: "FK",
      wahl_ressort3: 3,
      wahl_ressort3_kuerzel: "IT",
      wahl_internesprojekt1: 1,
      wahl_internesprojekt1_kuerzel: "LEWS",
      wahl_internesprojekt1_motivation: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lacus sed viverra tellus in hac habitasse platea dictumst. Eget mi proin sed libero enim sed faucibus turpis in. Tempor orci dapibus ultrices in iaculis. Parturient montes nascetur ridiculus mus mauris vitae. Mi in nulla posuere sollicitudin aliquam. Et ultrices neque ornare aenean. Mauris sit amet massa vitae tortor condimentum lacinia quis vel. Turpis massa sed elementum tempus egestas sed sed. Orci nulla pellentesque dignissim enim sit amet venenatis. Eget nullam non nisi est sit amet facilisis magna etiam. Enim eu turpis egestas pretium aenean pharetra magna ac. Aliquet risus feugiat in ante metus dictum. Tincidunt eget nullam non nisi est. Sagittis vitae et leo duis ut. Sed vulputate odio ut enim blandit volutpat. Augue lacus viverra vitae congue eu consequat ac felis donec. Interdum velit laoreet id donec ultrices tincidunt arcu non. Morbi blandit cursus risus at ultrices mi tempus.
      Nullam ac tortor vitae purus faucibus ornare suspendisse sed. Mattis aliquam faucibus purus in massa. Urna nunc id cursus metus aliquam eleifend mi in. Egestas erat imperdiet sed euismod nisi porta lorem mollis aliquam. Condimentum mattis pellentesque id nibh tortor id. Laoreet non curabitur gravida arcu ac tortor dignissim convallis aenean. Convallis posuere morbi leo urna molestie at elementum eu. Viverra tellus in hac habitasse platea. Dis parturient montes nascetur ridiculus mus mauris vitae. Elementum sagittis vitae et leo duis ut. Ac turpis egestas sed tempus urna. Urna molestie at elementum eu.
      Varius quam quisque id diam vel. Lacus suspendisse faucibus interdum posuere lorem ipsum dolor. Id volutpat lacus laoreet non curabitur gravida arcu ac. Mattis nunc sed blandit libero volutpat sed. Eros donec ac odio tempor orci. Integer vitae justo eget magna fermentum iaculis eu non diam. Id velit ut tortor pretium viverra suspendisse. Mollis aliquam ut porttitor leo a diam. Sit amet facilisis magna etiam tempor orci eu lobortis. Enim praesent elementum facilisis leo vel fringilla est. Cursus vitae congue mauris rhoncus aenean vel elit scelerisque mauris. Aliquet bibendum enim facilisis gravida neque convallis. Et ultrices neque ornare aenean euismod elementum. Sed pulvinar proin gravida hendrerit. Laoreet sit amet cursus sit. Gravida cum sociis natoque penatibus et magnis dis. Accumsan lacus vel facilisis volutpat est velit egestas.
      Vitae purus faucibus ornare suspendisse sed nisi. Faucibus nisl tincidunt eget nullam non nisi est sit amet. Justo donec enim diam vulputate. Nec nam aliquam sem et tortor consequat. Facilisi etiam dignissim diam quis enim lobortis scelerisque. Vulputate dignissim suspendisse in est ante. Mauris in aliquam sem fringilla ut morbi tincidunt augue. Pellentesque dignissim enim sit amet venenatis urna cursus eget. Molestie nunc non blandit massa enim nec dui nunc. At quis risus sed vulputate. Nulla facilisi cras fermentum odio eu feugiat pretium. Interdum varius sit amet mattis vulputate enim nulla aliquet. Egestas pretium aenean pharetra magna ac placerat. Quisque id diam vel quam elementum pulvinar etiam non. Diam ut venenatis tellus in metus vulputate. Nunc lobortis mattis aliquam faucibus purus in massa tempor nec. Faucibus interdum posuere lorem ipsum dolor sit amet consectetur. Suspendisse faucibus interdum posuere lorem ipsum dolor.
      Facilisi morbi tempus iaculis urna id volutpat lacus laoreet non. Integer malesuada nunc vel risus commodo. Sed blandit libero volutpat sed cras ornare arcu dui vivamus. Quis auctor elit sed vulputate mi sit amet mauris commodo. Vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae elementum. Leo urna molestie at elementum eu facilisis sed. Sagittis eu volutpat odio facilisis mauris sit amet. Tristique nulla aliquet enim tortor at auctor urna nunc. Nulla facilisi nullam vehicula ipsum a. Tempor orci dapibus ultrices in iaculis nunc sed. Sem viverra aliquet eget sit amet tellus cras adipiscing enim. Diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus. Aliquam sem fringilla ut morbi tincidunt augue interdum. In arcu cursus euismod quis viverra nibh cras pulvinar mattis. In mollis nunc sed id semper risus in hendrerit gravida.`,
      wahl_internesprojekt2: 2,
      wahl_internesprojekt2_kuerzel: "REKS",
      wahl_internesprojekt2_motivation: "MotivasJ AJSDFJ ASLLDJFL AKSJDFLKJADJSNF ",
      wahl_internesprojekt3: 3,
      wahl_internesprojekt3_kuerzel: "BEKS",
      wahl_internesprojekt3_motivation: "skdajflakjsdf jasdfj laksdjf ajdsa",
    },
    {
      mitgliedID: 7,
      vorname: "Behi",
      nachname: "Sammy",
      wahl_mentor1: 8,
      wahl_mentor1_name: "M.Lewa",
      wahl_mentor2: 9,
      wahl_mentor2_name: "S.KESr",
      wahl_mentor3: 10,
      wahl_mentor3_name: "T.sdafas",
      wahl_ressort1: 1,
      wahl_ressort1_kuerzel: "MAR",
      wahl_ressort2: 2,
      wahl_ressort2_kuerzel: "FK",
      wahl_ressort3: 3,
      wahl_ressort3_kuerzel: "IT",
      wahl_internesprojekt1: 1,
      wahl_internesprojekt1_kuerzel: "LEWS",
      wahl_internesprojekt1_motivation: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lacus sed viverra tellus in hac habitasse platea dictumst. Eget mi proin sed libero enim sed faucibus turpis in. Tempor orci dapibus ultrices in iaculis. Parturient montes nascetur ridiculus mus mauris vitae. Mi in nulla posuere sollicitudin aliquam. Et ultrices neque ornare aenean. Mauris sit amet massa vitae tortor condimentum lacinia quis vel. Turpis massa sed elementum tempus egestas sed sed. Orci nulla pellentesque dignissim enim sit amet venenatis. Eget nullam non nisi est sit amet facilisis magna etiam. Enim eu turpis egestas pretium aenean pharetra magna ac. Aliquet risus feugiat in ante metus dictum. Tincidunt eget nullam non nisi est. Sagittis vitae et leo duis ut. Sed vulputate odio ut enim blandit volutpat. Augue lacus viverra vitae congue eu consequat ac felis donec. Interdum velit laoreet id donec ultrices tincidunt arcu non. Morbi blandit cursus risus at ultrices mi tempus.
      Nullam ac tortor vitae purus faucibus ornare suspendisse sed. Mattis aliquam faucibus purus in massa. Urna nunc id cursus metus aliquam eleifend mi in. Egestas erat imperdiet sed euismod nisi porta lorem mollis aliquam. Condimentum mattis pellentesque id nibh tortor id. Laoreet non curabitur gravida arcu ac tortor dignissim convallis aenean. Convallis posuere morbi leo urna molestie at elementum eu. Viverra tellus in hac habitasse platea. Dis parturient montes nascetur ridiculus mus mauris vitae. Elementum sagittis vitae et leo duis ut. Ac turpis egestas sed tempus urna. Urna molestie at elementum eu.
      Varius quam quisque id diam vel. Lacus suspendisse faucibus interdum posuere lorem ipsum dolor. Id volutpat lacus laoreet non curabitur gravida arcu ac. Mattis nunc sed blandit libero volutpat sed. Eros donec ac odio tempor orci. Integer vitae justo eget magna fermentum iaculis eu non diam. Id velit ut tortor pretium viverra suspendisse. Mollis aliquam ut porttitor leo a diam. Sit amet facilisis magna etiam tempor orci eu lobortis. Enim praesent elementum facilisis leo vel fringilla est. Cursus vitae congue mauris rhoncus aenean vel elit scelerisque mauris. Aliquet bibendum enim facilisis gravida neque convallis. Et ultrices neque ornare aenean euismod elementum. Sed pulvinar proin gravida hendrerit. Laoreet sit amet cursus sit. Gravida cum sociis natoque penatibus et magnis dis. Accumsan lacus vel facilisis volutpat est velit egestas.
      Vitae purus faucibus ornare suspendisse sed nisi. Faucibus nisl tincidunt eget nullam non nisi est sit amet. Justo donec enim diam vulputate. Nec nam aliquam sem et tortor consequat. Facilisi etiam dignissim diam quis enim lobortis scelerisque. Vulputate dignissim suspendisse in est ante. Mauris in aliquam sem fringilla ut morbi tincidunt augue. Pellentesque dignissim enim sit amet venenatis urna cursus eget. Molestie nunc non blandit massa enim nec dui nunc. At quis risus sed vulputate. Nulla facilisi cras fermentum odio eu feugiat pretium. Interdum varius sit amet mattis vulputate enim nulla aliquet. Egestas pretium aenean pharetra magna ac placerat. Quisque id diam vel quam elementum pulvinar etiam non. Diam ut venenatis tellus in metus vulputate. Nunc lobortis mattis aliquam faucibus purus in massa tempor nec. Faucibus interdum posuere lorem ipsum dolor sit amet consectetur. Suspendisse faucibus interdum posuere lorem ipsum dolor.
      Facilisi morbi tempus iaculis urna id volutpat lacus laoreet non. Integer malesuada nunc vel risus commodo. Sed blandit libero volutpat sed cras ornare arcu dui vivamus. Quis auctor elit sed vulputate mi sit amet mauris commodo. Vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae elementum. Leo urna molestie at elementum eu facilisis sed. Sagittis eu volutpat odio facilisis mauris sit amet. Tristique nulla aliquet enim tortor at auctor urna nunc. Nulla facilisi nullam vehicula ipsum a. Tempor orci dapibus ultrices in iaculis nunc sed. Sem viverra aliquet eget sit amet tellus cras adipiscing enim. Diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus. Aliquam sem fringilla ut morbi tincidunt augue interdum. In arcu cursus euismod quis viverra nibh cras pulvinar mattis. In mollis nunc sed id semper risus in hendrerit gravida.`,
      wahl_internesprojekt2: 2,
      wahl_internesprojekt2_kuerzel: "REKS",
      wahl_internesprojekt2_motivation: "MotivasJ AJSDFJ ASLLDJFL AKSJDFLKJADJSNF ",
      wahl_internesprojekt3: 3,
      wahl_internesprojekt3_kuerzel: "BEKS",
      wahl_internesprojekt3_motivation: "skdajflakjsdf jasdfj laksdjf ajdsa",
    },
  ];

  const closeMotivationalTexts = () => {
    setShowMotivationalTexts(false);
  };

  const openMotivationalTexts = (trainee: TraineeType) => {
    if (trainee) {
      setOpenedTrainee(trainee);
      setShowMotivationalTexts(true);
    } else {
      showErrorMessage(
        "Die Motivationstexte konnten nicht gefunden werden, bitte laden Sie die Seite neu und probieren sie es erneut."
      );
    }
  };

  const renderMotivationalTexts = (
    <Modal open={showMotivationalTexts} onClose={closeMotivationalTexts}>
      <Paper sx={styles.motivationalTextPaper}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h5" sx={styles.paperHeaderText}>
              Motivation für {openedTrainee?.wahl_internesprojekt1_kuerzel}
            </Typography>
            <Typography sx={styles.paperText}>{openedTrainee?.wahl_internesprojekt1_motivation}</Typography>
            <Divider sx={styles.paperHeaderDivider} />
            <Typography variant="h5" sx={styles.paperHeaderText}>
              Motivation für {openedTrainee?.wahl_internesprojekt2_kuerzel}
            </Typography>
            <Typography sx={styles.paperText}>{openedTrainee?.wahl_internesprojekt2_motivation}</Typography>
            <Divider sx={styles.paperHeaderDivider} />
            <Typography variant="h5" sx={styles.paperHeaderText}>
              Motivation für {openedTrainee?.wahl_internesprojekt3_kuerzel}
            </Typography>
            <Typography sx={styles.paperText}>{openedTrainee?.wahl_internesprojekt3_motivation}</Typography>
            <Divider sx={styles.paperHeaderDivider} />
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );

  const renderPreferences = (
    <TableContainer component={Paper} sx={styles.tableContainer}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell sx={styles.tableHeadCell}>
              <Typography>Trainee</Typography>
            </TableCell>
            <TableCell sx={styles.tableHeadCell}>
              <Typography>Ressort</Typography>
            </TableCell>
            <TableCell sx={styles.tableHeadCell}>
              <Typography>Mentor</Typography>
            </TableCell>
            <TableCell sx={styles.tableHeadCell}>
              <Typography>Internes Projekt</Typography>
            </TableCell>
            <TableCell sx={styles.tableHeadCell}>
              <Typography></Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {preferences.map((trainee, index) => (
            <TableRow hover key={index}>
              <TableCell component="th" scope="row">
                <Typography color="secondary">
                  <Link
                    to={`/gesamtuebersicht/${trainee.mitgliedID}`}
                    style={styles.linkText}
                  >{`${trainee.vorname} ${trainee.nachname}`}</Link>
                </Typography>
              </TableCell>
              <TableCell>
                <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                  <FormControlLabel
                    value={trainee.wahl_ressort1}
                    control={<Radio />}
                    label={trainee.wahl_ressort1_kuerzel}
                  />
                  <FormControlLabel
                    value={trainee.wahl_ressort2}
                    control={<Radio />}
                    label={trainee.wahl_ressort2_kuerzel}
                  />
                  <FormControlLabel
                    value={trainee.wahl_ressort3}
                    control={<Radio />}
                    label={trainee.wahl_ressort3_kuerzel}
                  />
                </RadioGroup>
              </TableCell>
              <TableCell>
                <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                  <FormControlLabel
                    value={trainee.wahl_mentor1}
                    control={<Radio />}
                    label={trainee.wahl_mentor1_name}
                  />
                  <FormControlLabel
                    value={trainee.wahl_mentor2}
                    control={<Radio />}
                    label={trainee.wahl_mentor2_name}
                  />
                  <FormControlLabel
                    value={trainee.wahl_mentor3}
                    control={<Radio />}
                    label={trainee.wahl_mentor3_name}
                  />
                </RadioGroup>
              </TableCell>
              <TableCell>
                <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                  <FormControlLabel
                    value={trainee.wahl_internesprojekt1}
                    control={<Radio />}
                    label={trainee.wahl_internesprojekt1_kuerzel}
                  />
                  <FormControlLabel
                    value={trainee.wahl_internesprojekt2}
                    control={<Radio />}
                    label={trainee.wahl_internesprojekt2_kuerzel}
                  />
                  <FormControlLabel
                    value={trainee.wahl_internesprojekt3}
                    control={<Radio />}
                    label={trainee.wahl_internesprojekt3_kuerzel}
                  />
                </RadioGroup>
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => {
                    openMotivationalTexts(trainee);
                  }}
                >
                  <AttachFileSharpIcon></AttachFileSharpIcon>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <div>
      {renderMotivationalTexts}
      <Paper sx={styles.paperContainer}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h5" sx={styles.paperHeaderText}>
              Trainee-Zuteilung
            </Typography>
            <Typography sx={styles.paperText}>
              Hier können die Präferenzen für die Wahl von Ressort, Mentor und Internem Projekt der Trainees zugeteilt
              werden.<br></br>
              Startdatum Präferenzwahlen: <b>{startDateString}</b>
              <br></br>
              Enddatum Präferenzwahlen: <b>{endDateString}</b>
              <br></br>
            </Typography>
            <Divider sx={styles.paperHeaderDivider} />
            {renderPreferences}
            <Button variant="outlined" color="primary" sx={styles.inputButton}>
              Präferenzen Zuteilung speichern
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default AssignTrainees;
