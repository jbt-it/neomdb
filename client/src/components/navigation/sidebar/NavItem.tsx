import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import { ExpandLess, ExpandMore, SvgIconComponent } from "@mui/icons-material";
import { Box, Collapse, List, ListItemButton } from "@mui/material";
import { alpha } from "@mui/material/styles";

import usePathname from "../../../hooks/usePathname";
import { checkForPermission } from "../../../utils/authUtils";
import { AuthContext } from "../../../context/auth-context/AuthContext";

interface NavItemProps {
  item: {
    title: string;
    path?: string;
    icon: SvgIconComponent;
    children?: {
      title: string;
      path: string;
      permissions?: number[];
    }[];
  };
  openItem?: boolean;
  setOpenItem?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface NavItemChildProps {
  path: string;
  title: string;
  permissions?: number[];
}

/**
 * The NavItem-Component displays a single item in the sidebar
 * For Each Item we render a ListItemButton with an icon and a title
 * If the item has children, we render a collapse component with a list of children
 * @param item the item to be displayed
 */
const NavItem = ({ item, openItem, setOpenItem }: NavItemProps) => {
  const pathname = usePathname();
  const pathParentName = pathname.split("/").slice(0, 2).join("/");
  const { auth } = useContext(AuthContext);
  const [activeChild, setActiveChild] = useState(false);

  useEffect(() => {
    if (item.children !== undefined) {
      setActiveChild(
        item.children.some((child: NavItemChildProps) => child.path === pathname.split("/").slice(0, 2).join("/"))
      );
    }
  }, [item.children, pathname]);

  const active = item.path === pathname || activeChild || item.path === pathParentName;

  /**
   * Checks if the user has the permission to view the NavBar item.
   *
   * @param navPermissions - The permissions required for the item in the NavBar.
   * @returns true if the user has the given permissions, false otherwise.
   */
  const checkAccess = (navPermissions?: number[]) => {
    if (navPermissions === undefined) {
      return true;
    } else {
      return checkForPermission(auth.permissions, navPermissions);
    }
  };

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
              checkAccess(child.permissions) ? (
                <ListItemButton
                  component={NavLink}
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
                    ...(child.path === pathname.split("/").slice(0, 2).join("/") && {
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
              ) : null
            )}
          </List>
        </Collapse>
      </>
    );
  } else if (item.path !== undefined) {
    return (
      <ListItemButton
        component={NavLink}
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

export default NavItem;
