
import React from "react";
import { Typography, makeStyles, Theme, createStyles, Popover, IconButton, Menu, MenuItem, Modal, Paper } from "@material-ui/core";
import { HelpOutline, MoreVert } from "@material-ui/icons";

const useStyles = makeStyles((theme:Theme) => createStyles({
  pageBar: {
    position: "fixed",
    bottom: theme.spacing(0),
    width: "100%",
    backgroundColor: theme.palette.secondary.main,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px",
    [theme.breakpoints.up("md")]:{
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
    top: "20%", bottom: "20%",
    width: "50%",
    [theme.breakpoints.down("md")]:{
      width: "90%",
    },
    display: "flex",
    justifyContent: "center",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  }
}));

interface Option {
  optionName: string;
  optionFunciton: ()=>void;
}

interface PageBarProps {
  pageTitle: string;
  helpText?: string;
  pageOptions?: Option[];
}

const PageBar: React.FunctionComponent<PageBarProps> = (props: PageBarProps) => {
  const classes = useStyles();

  const Help: React.FunctionComponent = () => {
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    return (
      <div>
        <IconButton onClick={handleOpen} size="small">
          <HelpOutline/>
        </IconButton>
        <Modal
        open={open}
        onClose={handleClose}
      >
        <div style={{display: "flex", alignContent: "center", justifyContent: "center"}}>
          <Paper className={classes.helpModal}>
            <Typography>{props.helpText}</Typography>
          </Paper>
        </div>
      </Modal>
      </div>
    );
  };

  const Options: React.FunctionComponent = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleMenuClick = (option:Option) => {
      option.optionFunciton();
      handleClose();
    };

    return (
      <div>
        <IconButton onClick={handleButtonClick} size="small">
          <MoreVert/>
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {props.pageOptions?.map((option, key) => {
            return (<MenuItem key={key} onClick={() => {handleMenuClick(option);}}>{option.optionName}</MenuItem>);
          })}
        </Menu>
    </div>
    );
  };

  return (
    <div className={classes.pageBar}>
      <Typography>{props.pageTitle}</Typography>
      <div className={classes.pageBarOptions}>
        {props.helpText ? <Help/>: null}
        {props.pageOptions ? <Options/> : null}
      </div>
    </div>
  );
};

export default PageBar;