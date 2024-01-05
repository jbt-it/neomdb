import React, { useState } from "react";

import { useEffect } from "react";
import { Link } from "react-router-dom";

import {
  Box,
  Stack,
  SwipeableDrawer,
  ListItemButton,
  Collapse,
  List,
  Avatar,
  Typography,
  Divider,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { SvgIconComponent, ExpandLess, ExpandMore } from "@mui/icons-material";

import { Permission } from "../../types/globalTypes";
import { useAuth } from "../../hooks/useAuth";
import usePathname from "../../hooks/usePathname";
import useResponsive from "../../hooks/useResponsive";

import JBTLogo from "../../assets/jbt-logo.svg";
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
  openItem?: boolean;
  setOpenItem?: React.Dispatch<React.SetStateAction<boolean>>;
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
const NavItem = ({ item, openItem, setOpenItem }: NavItemProps) => {
  const pathname = usePathname();
  const { auth } = useAuth();
  const [activeChild, setActiveChild] = useState(false);

  useEffect(() => {
    if (item.children !== undefined) {
      setActiveChild(
        item.children.some(
          (child: NavItemChildProps) => child.path === pathname.replace("/#", "").split("/").slice(0, 2).join("/")
        )
      );
    }
  }, [item.children, pathname]);

  const active = item.path === pathname || activeChild;

  if (item.children !== undefined && setOpenItem !== undefined) {
    const handleCollpaseClick = () => {
      setOpenItem(!openItem);
    };
    return (
      <>
        <ListItemButton
          onClick={handleCollpaseClick}
          sx={{
            key: item.title,
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
          {openItem ? <ExpandLess sx={{ ml: "auto", me: 0 }} /> : <ExpandMore sx={{ ml: "auto", me: 0 }} />}
        </ListItemButton>
        <Collapse in={openItem} timeout="auto" unmountOnExit>
          <List sx={{ marginLeft: 3, marginTop: -1, paddingBottom: 0 }}>
            {item.children.map((child: NavItemChildProps) =>
              child.permissions && auth.permissions.length === 0 ? null : (
                <ListItemButton
                  component={Link}
                  to={child.path}
                  key={child.title}
                  sx={{
                    marginLeft: 2.1,
                    marginBottom: 0.5,
                    minHeight: 22,
                    borderRadius: 1,
                    typography: "body2",
                    color: "text.secondary",
                    textTransform: "capitalize",
                    fontWeight: "fontWeightMedium",
                    ...(child.path === pathname.replace("/#", "").split("/").slice(0, 2).join("/") && {
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
        key={item.title}
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
        key={item.title}
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
};

/**
 * The Sidebar-Component displays the sidebar on the left side of the screen
 * We render the account information and the navigation items
 */
const Sidebar = ({ openDrawer, onCloseDrawer, onOpenDrawer }: NavProps) => {
  const pathname = usePathname();
  const upLg = useResponsive("up", "lg");
  const navWidth = { width: 280 };

  useEffect(() => {
    if (openDrawer) {
      onCloseDrawer();
    }
  }, [pathname]);

  const [openMitglieder, setOpenMitglieder] = useState(false);
  const [openTools, setOpenTools] = useState(false);
  const [openEvents, setOpenEvents] = useState(false);

  const handleOpenMitglieder = () => {
    setOpenMitglieder(!openMitglieder);
    if (openTools) {
      setOpenTools(false);
    }
  };

  const handleOpenTools = () => {
    setOpenTools(!openTools);
    if (openMitglieder) {
      setOpenMitglieder(false);
    }
  };

  const handleOpenEvents = () => {
    setOpenEvents(!openEvents);
    if (openEvents) {
      setOpenEvents(false);
    }
  };

  /**
   * Renders the navigation items
   * We map over the navConfig and render a NavItem for each item
   * We also render a logout button at the bottom
   */
  const renderNavigationMenu = () => (
    <Stack component="nav" spacing={0.5} sx={{ px: 2, mt: 2 }}>
      {navConfig.map((item) => (
        <NavItem
          key={item.title}
          item={item}
          openItem={
            item.title === "Mitglieder"
              ? openMitglieder
              : item.title === "Tools"
              ? openTools
              : item.title === "Veranstaltungen"
              ? openEvents
              : undefined
          }
          setOpenItem={
            item.title === "Mitglieder"
              ? handleOpenMitglieder
              : item.title === "Tools"
              ? handleOpenTools
              : item.title === "Veranstaltungen"
              ? handleOpenEvents
              : undefined
          }
        />
      ))}
    </Stack>
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
            mt: -2,
            position: "fixed",
            height: "100%",
            width: { lg: navWidth.width },
            borderRight: { lg: "1px solid rgba(0, 0, 0, 0.12)" },
          }}
        >
          {renderNavigationMenu()}
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
          <Box
            sx={{
              py: 2,
              px: 2.5,
              mt: 1,
              display: "flex",
              justifyContent: "flex-start",
              borderRadius: 1.5,
              alignItems: "center",
            }}
          >
            <Avatar src={JBTLogo} alt="photoURL" />
            <Typography ml={2} variant="h6" color={"text.secondary"}>
              neoMDB
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ mt: 1 }}>{renderNavigationMenu()}</Box>
        </SwipeableDrawer>
      )}
    </Box>
  );
};

export default Sidebar;
