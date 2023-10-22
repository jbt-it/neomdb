import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

/**
 * This hook is used to make the app responsive
 * @param size - The size to be used
 * @param start - The start breakpoint
 * @param end - The end breakpoint
 * @returns - The result of the query
 * @description - This hook is used to make the app responsive
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

// ----------------------------------------------------------------------
/**
 * @returns - The width of the screen
 * @description - This hook is used to make the app responsive
 */

const useWidth = (): string => {
  const theme = useTheme();

  const keys = [...theme.breakpoints.keys].reverse();

  return (
    keys.reduce<string | null>((output, key) => {
      const matches = useMediaQuery(theme.breakpoints.up(key));

      return !output && matches ? key : output;
    }, null) || "xs"
  );
};

export default useResponsive;
export { useWidth };
