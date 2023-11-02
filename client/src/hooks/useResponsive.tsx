import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

/**
 * This hook is used to make the app responsive
 * @param size - The size to be used
 * @param start - The start breakpoint
 * @param end - The end breakpoint
 * @returns - The result of the query
 */
const useResponsive = (
  size: string,
  start: "xs" | "sm" | "md" | "lg" | "xl",
  end?: "xs" | "sm" | "md" | "lg" | "xl"
) => {
  const theme = useTheme();

  const mediaUp = useMediaQuery(theme.breakpoints.up(start));

  const mediaDown = useMediaQuery(theme.breakpoints.down(start));

  const mediaBetween = end ? useMediaQuery(theme.breakpoints.between(start, end)) : null;

  const mediaOnly = useMediaQuery(theme.breakpoints.only(start));

  if (size === "up") {
    return mediaUp;
  }

  if (size === "down") {
    return mediaDown;
  }

  if (size === "between") {
    return mediaBetween;
  }

  return mediaOnly;
};

export default useResponsive;
