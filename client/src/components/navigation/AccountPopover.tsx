import React, { useContext, useState } from "react";
import { alpha } from "@mui/material/styles";
import { MenuItem, Typography, IconButton, Avatar, Popover, Box, Divider } from "@mui/material";
import api from "../../utils/api";
import { useNavigate, Link } from "react-router-dom";
import { authReducerActionType } from "../../types/globalTypes";
import { stringToColor } from "../../utils/stringUtils";
import { AuthContext } from "../../context/auth-context/AuthContext";

interface MenuOption {
  label: string;
  path: string;
}

/**
 * This component renders the account popover in the navbar
 * it contains links to the profile page, password change page and logout
 */
const AccountPopover = () => {
  const [open, setOpen] = useState<null | HTMLElement>(null);
  const { auth, dispatchAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const MENU_OPTIONS: MenuOption[] = [
    {
      label: "Profil",
      path: `/gesamtuebersicht/${auth.userID}`,
    },
    {
      label: "Passwort ändern",
      path: "/passwort-aendern",
    },
  ];

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  /**
   * Handles click on logout link
   */
  const handleLogout: VoidFunction = () => {
    api.post("/auth/logout").then(() => {
      navigate("/login");
      dispatchAuth({ type: authReducerActionType.deauthenticate });
    });
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          alt={auth.userName?.toString()}
          sx={{
            width: 36,
            height: 36,
            bgcolor: stringToColor(auth.userName ? auth.userName.toString() : ""),
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {auth.userName?.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Popover
        disableScrollLock
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          root: {
            sx: {
              p: 0,
              mt: 0.5,
              width: 200,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} noWrap>
            {auth.userName}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem key={option.label} component={Link} to={option.path}>
            {option.label}
          </MenuItem>
        ))}

        <Divider sx={{ borderStyle: "dashed", m: 0 }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleLogout}
          sx={{ typography: "body2", color: "error.main", py: 1.5 }}
        >
          Logout
        </MenuItem>
      </Popover>
    </>
  );
};

export default AccountPopover;
