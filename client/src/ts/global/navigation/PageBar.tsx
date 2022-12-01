/*
 * The PageBar -Component displays the name of the page, the user is currently at,
 * a help button (optional) and page-specific options (optional)
 */
import React from "react";
import {
  Typography,
  makeStyles,
  Theme,
  createStyles,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Paper,
} from "@material-ui/core";
import { HelpOutline, MoreVert } from "@material-ui/icons";

/**
 * Function which proivdes the styles of the PageBar
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pageBar: {
      position: "fixed",
      bottom: theme.spacing(0),
      width: "100%",
      backgroundColor: theme.palette.secondary.main,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "8px",
      zIndex: 10,
      [theme.breakpoints.up("md")]: {
        marginLeft: "280px",
        paddingRight: "280px",
      },
    },
    pageBarOptions: {
      display: "flex",
    },
    helpModal: {
      position: "absolute",
      margin: "auto",
      top: "20%",
      bottom: "20%",
      width: "50%",
      [theme.breakpoints.down("md")]: {
        width: "90%",
      },
      display: "flex",
      justifyContent: "center",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
);

/**
 * Interface for the option-item of page-specific options
 */
interface Option {
  optionName: string;
  optionFunciton: () => void;
}

/**
 * Interface for the props of the PageBar
 */
interface PageBarProps {
  pageTitle: string;
  helpText?: string;
  pageOptions?: Option[];
}

/**
 * Functional Component which displays a PageBar at the bottom of the page
 * @param props The props of the PageBar (implements the interface PageBarProps)
 */
const PageBar: React.FunctionComponent<PageBarProps> = (props: PageBarProps) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [helpOpen, setHelpOpen] = React.useState(false);

  /**
   * Handles the click on the help button
   */
  const handleHelpOpen = () => {
    setHelpOpen(true);
  };

  /**
   * Handles the click to exit the help modal
   */
  const handleHelpClose = () => {
    setHelpOpen(false);
  };

  /**
   * Renders the help paper
   */
  const renderHelp = () => {
    return (
      <div>
        <IconButton onClick={handleHelpOpen} size="small">
          <HelpOutline />
        </IconButton>
        <Modal open={helpOpen} onClose={handleHelpClose}>
          <div style={{ display: "flex", alignContent: "center", justifyContent: "center" }}>
            <Paper className={classes.helpModal}>
              <Typography>{props.helpText}</Typography>
            </Paper>
          </div>
        </Modal>
      </div>
    );
  };

  /**
   * Handles the click on the options button
   * @param event The click event on the options button
   */
  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Handles the closing of the menu
   */
  const handleOptionsClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (option: Option) => {
    option.optionFunciton();
    handleOptionsClose();
  };

  /**
   * Renders the options
   */
  const renderOptions = () => {
    return (
      <div>
        <IconButton onClick={handleButtonClick} size="small">
          <MoreVert />
        </IconButton>
        <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleOptionsClose}>
          {props.pageOptions?.map((option, key) => {
            return (
              <MenuItem
                key={key}
                onClick={() => {
                  handleMenuClick(option);
                }}
              >
                {option.optionName}
              </MenuItem>
            );
          })}
        </Menu>
      </div>
    );
  };

  return (
    <div className={classes.pageBar}>
      <Typography>{props.pageTitle}</Typography>
      <div className={classes.pageBarOptions}>
        {props.helpText ? renderHelp() : null}
        {props.pageOptions ? renderOptions() : null}
      </div>
    </div>
  );
};

export default PageBar;
