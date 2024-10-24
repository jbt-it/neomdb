import { ApplicationDto, ApplicationImageDto } from "../types/applicationTypes";
import api from "../utils/api";

/**
 * Save the application
 * @param application The application to save
 */
export const saveApplication = async (
  application: ApplicationDto,
  applicationImage: ApplicationImageDto
): Promise<boolean> => {
  const data = { application: application, applicationImage: applicationImage };
  // Make API call to save the application
  return await api.post(`/application`, data);
};
