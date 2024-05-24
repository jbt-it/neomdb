import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DepartmentDetailsDto, DepartmentMemberDto, DirectorDto } from "../../types/membersTypes";
import { useContext } from "react";
import { AuthContext } from "../../context/auth-context/AuthContext";
import { AxiosError } from "axios";
import {
  getAllDirectors,
  getCurrentDirectors,
  getDepartmentMembers,
  getDepartments,
  updateDepartment,
} from "../../api/departments";
import { authReducerActionType } from "../../types/globalTypes";
import { showErrorMessage, showSuccessMessage } from "../../utils/toastUtils";

/**
 * Hook that handles the department api calls, uses react-query
 * @returns The departments, the department members, the current directors, all directors and a function to update the details of a department
 */
const useDepartments = () => {
  const { dispatchAuth } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // ############
  // GET QUERIES
  // ############

  // getDepartments query
  const { data: departmentsData } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });

  const departments = (departmentsData?.data as DepartmentDetailsDto[]) || [];

  // ----------------------------------------------------------------------------------

  // getDepartmentMembers query
  const { data: departmentMembersData } = useQuery({
    queryKey: ["departmentMembers"],
    queryFn: getDepartmentMembers,
  });

  const departmentMembers = (departmentMembersData?.data as DepartmentMemberDto[]) || [];

  // ----------------------------------------------------------------------------------

  // getCurrentDirectors query
  const { data: currentDirectorsData } = useQuery({
    queryKey: ["currentDirectors"],
    queryFn: getCurrentDirectors,
  });

  const currentDirectors = (currentDirectorsData?.data as DirectorDto[]) || [];

  // ----------------------------------------------------------------------------------

  // getAllDirectors query
  const { data: allDirectorsData } = useQuery({
    queryKey: ["allDirectors"],
    queryFn: getAllDirectors,
  });

  const allDirectors = (allDirectorsData?.data as DirectorDto[]) || [];

  // ############
  //  UPDATES
  // ############

  // updateDepartmentDetails mutation
  const { mutateAsync: mutateDepartmentDetails } = useMutation({
    mutationFn: updateDepartment,
    onError: (err: AxiosError) => {
      showErrorMessage("Ressort aktualisieren ist fehlgeschlagen");
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      showSuccessMessage("Ressort erfolgreich aktualisiert");
    },
  });

  /**
   * Function to update the details of a department
   * @param departmentDetails - The details of the department
   */
  const updateDepartmentDetails = async (departmentDetails: DepartmentDetailsDto) => {
    return await mutateDepartmentDetails(departmentDetails);
  };

  // ----------------------------------------------------------------------------------
  // Objects and functions returned by the hook
  return {
    departments,
    departmentMembers,
    currentDirectors,
    allDirectors,
    updateDepartmentDetails,
  };
};

export default useDepartments;
