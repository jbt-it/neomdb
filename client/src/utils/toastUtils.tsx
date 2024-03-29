import toast from "react-hot-toast";

/**
 * Creates the options for a toast
 * @param {number} duration Duration of the toast to be displayed
 * @param {string} color Color of the border and the icon
 */
const createToastOptions = (duration: number, color: string) => ({
  duration,
  style: {
    border: `1px solid ${color}`,
    padding: "16px",
  },
  iconTheme: {
    primary: color,
    secondary: "#fff",
  },
});

/**
 * Displays an error message
 * @param {string} message The message that should be explained
 * @param {number} duration Duration of the toast to be displayed
 * @example showErrorMessage("Etwas ist schieflaufen", duration = 5000)
 */
export const showErrorMessage = (message: string, duration = 5000) => {
  toast.error(message, createToastOptions(duration, "red"));
};

/**
 * Displays an success message
 * @param {string} message The message that should be explained
 * @param {number} duration Duration of the toast to be displayed
 * @example showSuccessMessage("Alles hat geklappt", duration = 5000)
 */
export const showSuccessMessage = (message: string, duration = 5000) => {
  toast.success(message, createToastOptions(duration, "green"));
};
