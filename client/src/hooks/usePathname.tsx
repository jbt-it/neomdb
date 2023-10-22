import { useMemo } from "react";
import { useLocation } from "react-router-dom";

/**
 * This hook returns the current pathname.
 * @returns the current pathname
 */
const usePathname = () => {
  const { pathname } = useLocation();

  return useMemo(() => pathname, [pathname]);
};

export default usePathname;
