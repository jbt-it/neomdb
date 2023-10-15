import React, { useState } from "react";

import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Box, Stack, SwipeableDrawer, ListItemButton, Avatar, Typography, Collapse, List } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { SvgIconComponent, ExpandLess, ExpandMore, ExitToApp } from "@mui/icons-material";

import { Permission, authReducerActionType } from "../../types/globalTypes";
import api from "../../utils/api";
import { useAuth } from "../../hooks/useAuth";
import { usePathname } from "../../hooks/usePathname";
import { useResponsive } from "../../hooks/useResponsive";

import JBTLogoBlack from "../../assets/jbt-logo-black.png";
import Scrollbar from "./Scrollbar";
import navConfig from "./navConfig";

interface NavItemProps {
  item: {
    title: string;
    path?: string;
    icon: SvgIconComponent;
    children?: {
      title: string;
      path: string;
      permissions?: Permission[];
    }[];
  };
}

interface NavItemChildProps {
  path: string;
  title: string;
  permissions?: Permission[];
}

interface NavProps {
  openDrawer: boolean;
  onCloseDrawer: () => void;
  onOpenDrawer: () => void;
}

/**
 * The NavItem-Component displays a single item in the sidebar
 * For Each Item we render a ListItemButton with an icon and a title
 * If the item has children, we render a collapse component with a list of children
 * @param item the item to be displayed
 */
function NavItem({ item }: NavItemProps) {
  const [menuItem, setMenuItemOpen] = useState(false);
  const pathname = usePathname();
  const { auth } = useAuth();

  const active = item.path === pathname;

  const handleCollpaseClick = (value: string) => () => {
    switch (value) {
      case "Mitglieder": {
        setMenuItemOpen(!menuItem);
        break;
      }
    }
  };

  if (item.children !== undefined) {
    return (
      <>
        <ListItemButton
          onClick={handleCollpaseClick("Mitglieder")}
          sx={{
            minHeight: 44,
            borderRadius: 1,
            typography: "body2",
            color: "text.secondary",
            textTransform: "capitalize",
            fontWeight: "fontWeightMedium",
            ...(active && {
              color: "primary.main",
              fontWeight: "fontWeightSemiBold",
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              "&:hover": {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
              },
            }),
          }}
        >
          <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
            <item.icon />
          </Box>
          <Box component="span">{item.title} </Box>
          {menuItem ? <ExpandLess sx={{ ml: "auto", me: 0 }} /> : <ExpandMore sx={{ ml: "auto", me: 0 }} />}
        </ListItemButton>
        <Collapse in={menuItem} timeout="auto" unmountOnExit>
          <List sx={{ marginLeft: 3, marginTop: -1 }}>
            {item.children.map((child: NavItemChildProps) =>
              child.permissions && auth.permissions.length === 0 ? null : (
                <ListItemButton
                  component={Link}
                  to={child.path}
                  sx={{
                    marginLeft: 2.1,
                    marginBottom: 0.5,
                    minHeight: 22,
                    borderRadius: 1,
                    typography: "body2",
                    color: "text.secondary",
                    textTransform: "capitalize",
                    fontWeight: "fontWeightMedium",
                    ...(child.path === pathname && {
                      color: "primary.main",
                      fontWeight: "fontWeightSemiBold",
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                      "&:hover": {
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
                      },
                    }),
                  }}
                >
                  <Box component="span">{child.title} </Box>
                </ListItemButton>
              )
            )}
          </List>
        </Collapse>
      </>
    );
  } else if (item.path !== undefined) {
    return (
      <ListItemButton
        component={Link}
        to={item.path}
        sx={{
          minHeight: 44,
          borderRadius: 1,
          typography: "body2",
          color: "text.secondary",
          textTransform: "capitalize",
          fontWeight: "fontWeightMedium",
          ...(active && {
            color: "primary.main",
            fontWeight: "fontWeightSemiBold",
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
            "&:hover": {
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
            },
          }),
        }}
      >
        <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
          <item.icon />
        </Box>
        <Box component="span">{item.title} </Box>
      </ListItemButton>
    );
  } else {
    return (
      <ListItemButton
        sx={{
          minHeight: 44,
          borderRadius: 1,
          typography: "body2",
          color: "text.secondary",
          textTransform: "capitalize",
          fontWeight: "fontWeightMedium",
        }}
      >
        <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
          <item.icon />
        </Box>
        <Box component="span">{item.title} </Box>
      </ListItemButton>
    );
  }
}

/**
 * The Sidebar-Component displays the sidebar on the left side of the screen
 * We render the account information and the navigation items
 */
export default function Sidebar({ openDrawer, onCloseDrawer, onOpenDrawer }: NavProps) {
  const { auth, dispatchAuth } = useAuth();
  const pathname = usePathname();
  const upLg = useResponsive("up", "lg");
  const navigate = useNavigate();
  const navWidth = { width: 280 };

  /**
   * Handles click on logout link
   */
  const handleLogout: VoidFunction = () => {
    api.post("/auth/logout").then(() => {
      navigate("/login");
      dispatchAuth({ type: authReducerActionType.deauthenticate });
    });
  };

  useEffect(() => {
    if (openDrawer) {
      onCloseDrawer();
    }
  }, [pathname]);

  /**
   * Renders the account information with the profile picture, name and roles
   */
  const renderAccount = (
    <Box
      sx={{
        mb: 3,
        mx: 2.5,
        py: 2,
        px: 2.5,
        display: "flex",
        borderRadius: 1.5,
        alignItems: "center",
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
      }}
    >
      <Avatar src={JBTLogoBlack} alt="photoURL" />
      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2">{auth.userName ? auth.userName : "Name"}</Typography>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {auth.roles ? auth.roles : "Rollen"}
        </Typography>
      </Box>
    </Box>
  );

  /**
   * Renders the navigation items
   * We map over the navConfig and render a NavItem for each item
   * We also render a logout button at the bottom
   */
  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      {navConfig.map((item) => (
        <NavItem key={item.title} item={item} />
      ))}
      <ListItemButton
        onClick={() => {
          handleLogout();
        }}
        sx={{
          minHeight: 44,
          borderRadius: 1,
          typography: "body2",
          color: "text.secondary",
          textTransform: "capitalize",
          fontWeight: "fontWeightMedium",
        }}
      >
        <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
          <ExitToApp />
        </Box>
        <Box component="span">Logout</Box>
      </ListItemButton>
    </Stack>
  );

  /**
   * Renders the content of the sidebar
   */
  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "& .simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {renderAccount}

      {renderMenu}

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: navWidth.width },
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: "fixed",
            width: navWidth.width,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <SwipeableDrawer
          open={openDrawer}
          onClose={onCloseDrawer}
          onOpen={onOpenDrawer}
          PaperProps={{
            sx: {
              width: navWidth.width,
            },
          }}
        >
          <Box sx={{ mt: 1 }}>{renderContent}</Box>
        </SwipeableDrawer>
      )}
    </Box>
  );
}
