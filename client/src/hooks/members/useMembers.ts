import { useMutation, useQuery, useQueryClient } from "react-query";
import { getCurrentDirectors, getDepartmentMembers, getDepartments, getMembers } from "../../api/members";
import { DepartmentDetails, DepartmentMember, Director, Member } from "../../types/membersTypes";
import { AxiosError } from "axios";
import { authReducerActionType } from "../../types/globalTypes";
import { useAuth } from "../useAuth";
import { updateMemberStatus as updateStatus } from "../../api/members";
import { showErrorMessage, showSuccessMessage } from "../../utils/toastUtils";
import { addMember as addMemberApi } from "../../api/members";
import { replaceSpecialCharacters } from "../../utils/stringUtils";
import { transfromDateToSQLDate } from "../../utils/dateUtils";

/**
 * Hook that handles the members api calls, uses react-query
 * @returns The members, a boolean indicating if the data is loading and a boolean indicating if an error occured
 */
const useMembers = () => {
  const { dispatchAuth } = useAuth();
  const queryClient = useQueryClient();

  // ############
  // GET QUERIES
  // ############

  // getMembers query
  const {
    data: membersData,
    isLoading: isMembersLoading,
    isError: isMembersError,
  } = useQuery({
    queryKey: ["Members"],
    queryFn: getMembers,
    onError: (err: AxiosError) => {
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
  });

  const members = (membersData?.data as Member[]) || [];

  // ----------------------------------------------------------------------------------
  // getDepartments query
  const {
    data: departmentsData,
    isLoading: isDepartmentsLoading,
    isError: isDepartmentsError,
  } = useQuery({
    queryKey: ["Departments"],
    queryFn: getDepartments,
    onError: (err: AxiosError) => {
      showErrorMessage("Fehler beim Laden der Ressorts");
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
  });

  const departments = (departmentsData?.data as DepartmentDetails[]) || [];

  // ----------------------------------------------------------------------------------
  // getDepartmentMembers query
  const {
    data: departmentMembersData,
    isLoading: isDepartmentMembersLoading,
    isError: isDepartmentMembersError,
  } = useQuery({
    queryKey: ["DepartmentMembers"],
    queryFn: getDepartmentMembers,
    onError: (err: AxiosError) => {
      showErrorMessage("Fehler beim Laden der Ressortmitglieder");
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
  });

  const departmentMembers = (departmentMembersData?.data as DepartmentMember[]) || [];

  // ----------------------------------------------------------------------------------
  // getCurrentDirectors query
  const {
    data: currentDirectorsData,
    isLoading: isCurrentDirectorsLoading,
    isError: isCurrentDirectorsError,
  } = useQuery({
    queryKey: ["CurrentDirectors"],
    queryFn: getCurrentDirectors,
    onError: (err: AxiosError) => {
      showErrorMessage("Fehler beim Laden der Ressortleitungen");
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
  });

  const currentDirectors = (currentDirectorsData?.data as Director[]) || [];

  // ----------------------------------------------------------------------------------

  // ############
  // UPDATE QUERIES
  // ############

  // updateMemberStatus mutation
  const { mutate: mutateStatus, isLoading: isUpdatingMemberStatus } = useMutation({
    mutationFn: updateStatus,
    onError: (err: AxiosError) => {
      showErrorMessage("Mitgliedsstatus Änderung fehlgeschlagen");
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["MemberDetails"] });
      queryClient.invalidateQueries({ queryKey: ["Members"] });
      showSuccessMessage("Mitgliedsstatus erfolgreich geändert");
    },
  });

  /**
   * Function to update the status of a member
   * @param memberID The id of the member
   * @param status The new status
   */
  const updateMemberStatus = (memberID: number, status: string) => {
    mutateStatus({ memberID, status });
  };

  // ############
  // CREATE QUERIES
  // ############

  // addMember mutation
  const { mutate: mutateAddMember, isLoading: isAddingMember } = useMutation({
    mutationFn: addMemberApi,
    onError: (err: AxiosError) => {
      showErrorMessage("Mitglied hinzufügen fehlgeschlagen");
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["Members"] });
      showSuccessMessage("Mitglied erfolgreich hinzugefügt");
    },
  });

  /**
   * Function to add a new member
   * @param firstName - first name of the member
   * @param lastName - last name of the member
   * @param email - email of the member
   */
  const addMember = (firstName: string, lastName: string, email: string) => {
    if (firstName.trim().length <= 0) {
      showErrorMessage("Der Vorname darf nicht leer sein");
      return;
    }
    if (lastName.trim().length <= 0) {
      showErrorMessage("Der Nachname darf nicht leer sein");
      return;
    }
    if (email.trim().length <= 0) {
      showErrorMessage("Die E-Mail darf nicht leer sein");
      return;
    }

    const password = Math.random().toString(36).slice(2, 11);
    const firstNameSanitized = replaceSpecialCharacters(firstName.trim().replace(" ", "-")).toLowerCase();
    const lastNameSanitized = replaceSpecialCharacters(lastName.trim().replace(" ", "-")).toLowerCase();
    const payload = {
      name: firstNameSanitized + "." + lastNameSanitized,
      password: password,
      vorname: firstName.trim(),
      nachname: lastName.trim(),
      geburtsdatum: null,
      handy: null,
      geschlecht: null,
      generation: null,
      traineeSeit: transfromDateToSQLDate(new Date()),
      email: email,
    };

    mutateAddMember(payload);
  };

  // ----------------------------------------------------------------------------------
  // Objects and functions returned by the hook
  return {
    members,
    isMembersLoading,
    isMembersError,
    updateMemberStatus,
    isUpdatingMemberStatus,
    addMember,
    isAddingMember,
    departments,
    isDepartmentsLoading,
    isDepartmentsError,
    departmentMembers,
    isDepartmentMembersLoading,
    isDepartmentMembersError,
    currentDirectors,
    isCurrentDirectorsLoading,
    isCurrentDirectorsError,
  };
};

export default useMembers;
