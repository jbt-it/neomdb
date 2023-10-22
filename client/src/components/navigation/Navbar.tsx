import * as React from "react";
import { AppBar, styled, alpha, Toolbar, Box, IconButton, Typography, InputBase, Avatar, Theme } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { Menu, Search } from "@mui/icons-material";
import useResponsive from "../../hooks/useResponsive";
import AccountPopover from "./AccountPopover";
import JBTLogoWhite from "../../assets/jbt-logo-white.png";

/**
 * Styled-Component for the SearchField
 */
const SearchField = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  marginRight: "10px",
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

/**
 * Styled-Component for the SearchIcon
 */
const SearchIcon = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
}));

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
    },
    searchInputRoot: {
      color: "white",
    },
    searchInputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: "12ch",
        "&:focus": {
          width: "20ch",
        },
      },
    },
  })
);

/**
 * Type of the Props that the Navbar receives
 */
interface NavbarProps {
  onOpenDrawer: () => void;
}

/**
 * The Navbar-Component displays the Navbar at the top of the page
 * @param onOpenDrawer Function to open the Drawer
 */
const Navbar = ({ onOpenDrawer }: NavbarProps): JSX.Element => {
  const classes = useStyles();
  const lgUp = useResponsive("up", "lg");

  const renderContent = (
    <>
      {!lgUp ? (
        <IconButton edge="start" aria-label="open drawer" onClick={onOpenDrawer} sx={{ mr: 1 }}>
          <Menu sx={{ color: "white", display: "block" }} />
        </IconButton>
      ) : null}
      {lgUp ? (
        <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
          <Avatar alt="JBT neoMDB" src={JBTLogoWhite} />
          <Typography variant="h6" noWrap sx={{ ml: 2 }}>
            neoMDB
          </Typography>
        </Box>
      ) : null}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginRight: 2 }}>
        <SearchField>
          <SearchIcon>
            <Search />
          </SearchIcon>
          <InputBase
            placeholder="Suche..."
            classes={{
              root: classes.searchInputRoot,
              input: classes.searchInputInput,
            }}
            inputProps={{ "aria-label": "search" }}
          />
        </SearchField>
        <AccountPopover />
      </Box>
    </>
  );

  return (
    <AppBar>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
