import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

/**
 * This hook is used to make the app responsive
 * @param query - The query to be used
 * @param start - The start breakpoint
 * @param end - The end breakpoint
 * @returns - The result of the query
 * @description - This hook is used to make the app responsive
 */

export function useResponsive(query: string, start: any, end?: any) {
  const theme = useTheme();

  const mediaUp = useMediaQuery(theme.breakpoints.up(start));

  const mediaDown = useMediaQuery(theme.breakpoints.down(start));

  const mediaBetween = useMediaQuery(theme.breakpoints.between(start, end));

  const mediaOnly = useMediaQuery(theme.breakpoints.only(start));

  if (query === "up") {
    return mediaUp;
  }

  if (query === "down") {
    return mediaDown;
  }

  if (query === "between") {
    return mediaBetween;
  }

  return mediaOnly;
}

// ----------------------------------------------------------------------
/**
 * @returns - The width of the screen
 * @description - This hook is used to make the app responsive
 */

export function useWidth(): string {
  const theme = useTheme();

  const keys = [...theme.breakpoints.keys].reverse();

  return (
    keys.reduce<string | null>((output, key) => {
      const matches = useMediaQuery(theme.breakpoints.up(key));

      return !output && matches ? key : output;
    }, null) || "xs"
  );
}
