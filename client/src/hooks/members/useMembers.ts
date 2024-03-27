import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  createPermissionAssignment,
  deletePermissionAssignment,
  getAllDirectors,
  getCurrentDirectors,
  getDepartmentMembers,
  getDepartments,
  getEdvSkills,
  getLanguages,
  getMembers,
  getPermissionAssignments,
  getPermissions,
  updateDepartment,
  updateMemberStatus as updateStatus,
  addMember as addMemberApi,
} from "../../api/members";
import {
  DepartmentDetails,
  DepartmentMember,
  Director,
  EDVSkill,
  Language,
  Member,
  PermissionAssignment,
  Permissions,
} from "../../types/membersTypes";
import { AxiosError } from "axios";
import { authReducerActionType } from "../../types/globalTypes";
import { showErrorMessage, showSuccessMessage } from "../../utils/toastUtils";
import { replaceSpecialCharacters } from "../../utils/stringUtils";
import { transfromDateToSQLDate } from "../../utils/dateUtils";
import { AuthContext } from "../../context/auth-context/AuthContext";
import { useContext } from "react";

/**
 * Hook that handles the members api calls, uses react-query
 * @returns The members, a boolean indicating if the data is loading and a boolean indicating if an error occured
 */
const useMembers = () => {
  const { dispatchAuth } = useContext(AuthContext);
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
  // getAllDirectors query
  const { data: allDirectorsData } = useQuery({
    queryKey: ["AllDirectors"],
    queryFn: getAllDirectors,
    onError: (err: AxiosError) => {
      showErrorMessage("Fehler beim Laden der Ressortleitungen");
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
  });

  const allDirectors = (allDirectorsData?.data as Director[]) || [];

  // ----------------------------------------------------------------------------------
  // getLanguages query
  const {
    data: languagesData,
    isLoading: isLanguagesLoading,
    isError: isLanguagesError,
  } = useQuery({
    queryKey: ["Languages"],
    queryFn: getLanguages,
    onError: (err: AxiosError) => {
      showErrorMessage("Fehler beim Laden der Sprachen");
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
  });

  const languages = (languagesData?.data as Language[]) || [];

  // ----------------------------------------------------------------------------------
  // getEDVSkills query
  const {
    data: edvSkillsData,
    isLoading: isEDVSkillsLoading,
    isError: isEDVSkillsError,
  } = useQuery({
    queryKey: ["EDVSkills"],
    queryFn: getEdvSkills,
    onError: (err: AxiosError) => {
      showErrorMessage("Fehler beim Laden der Sprachen");
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
  });

  const edvSkills = (edvSkillsData?.data as EDVSkill[]) || [];

  // ----------------------------------------------------------------------------------
  // getPermissions query
  const { data: permissionsData } = useQuery({
    queryKey: ["Permissions"],
    queryFn: getPermissions,
    onError: (err: AxiosError) => {
      showErrorMessage("Fehler beim Laden der Sprachen");
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
  });

  const permissions = (permissionsData?.data as Permissions[]) || [];

  // ----------------------------------------------------------------------------------
  // getPermissionAssignments query
  const { data: permissionAssignmentData } = useQuery({
    queryKey: ["PermissionAssignments"],
    queryFn: getPermissionAssignments,
    onError: (err: AxiosError) => {
      showErrorMessage("Fehler beim Laden der Sprachen");
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
  });

  const permissionAssignments = (permissionAssignmentData?.data as PermissionAssignment[]) || [];

  // ----------------------------------------------------------------------------------
  // ############
  // UPDATE QUERIES
  // ############

  // updateMemberStatus mutation
  const { mutateAsync: mutateStatus, isLoading: isUpdatingMemberStatus } = useMutation({
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
  const updateMemberStatus = async (memberID: number, status: string) => {
    return await mutateStatus({ memberID, status });
  };

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
      queryClient.invalidateQueries({ queryKey: ["Departments"] });
      showSuccessMessage("Ressort erfolgreich aktualisiert");
    },
  });

  /**
   * Function to update the details of a department
   * @param departmentDetails - The details of the department
   */
  const updateDepartmentDetails = async (departmentDetails: DepartmentDetails) => {
    return await mutateDepartmentDetails(departmentDetails);
  };

  // ----------------------------------------------------------------------------------
  // ############
  // CREATE QUERIES
  // ############

  // addMember mutation
  const { mutateAsync: mutateAddMember, isLoading: isAddingMember } = useMutation({
    mutationFn: addMemberApi,
    onError: (err: AxiosError) => {
      showErrorMessage("Mitglied hinzufügen fehlgeschlagen");
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
    onSuccess: () => {
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
  const addMember = async (firstName: string, lastName: string, email: string) => {
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

    return await mutateAddMember(payload);
  };

  // createPermissionAssignment mutation
  const { mutateAsync: mutateCreatePermissionAssignment } = useMutation({
    mutationFn: createPermissionAssignment,
    onError: (err: AxiosError) => {
      showErrorMessage("Berechtigung konnte nicht erteilt werden");
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PermissionAssignments"] });
      showSuccessMessage("Berechtigung wurde erfolgreich erteilt");
    },
  });

  /**
   * Function to create a new relation between a member and a permission
   * @param memberID - The ID of the member
   * @param permissionID - The ID of the permission
   * @returns The new permission assignment
   */
  const createPermission = async (memberID: number, permissionID: number) => {
    return await mutateCreatePermissionAssignment({ memberID, permissionID });
  };

  // ----------------------------------------------------------------------------------
  // ############
  // DELETE QUERIES
  // ############

  // deletePermissionAssignment mutation
  const { mutateAsync: mutateDeletePermissionAssignment } = useMutation({
    mutationFn: deletePermissionAssignment,
    onError: (err: AxiosError) => {
      showErrorMessage("Berechtigung konnte nicht entzogen werden");
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PermissionAssignments"] });
      showSuccessMessage("Berechtigung wurde erfolgreich entzogen");
    },
  });

  /**
   * Function to delete a relation between a member and a permission
   * @param memberID - The ID of the member
   * @param permissionID - The ID of the permission
   */
  const deletePermission = async (memberID: number, permissionID: number) => {
    return await mutateDeletePermissionAssignment({ memberID, permissionID });
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
    allDirectors,
    languages,
    isLanguagesLoading,
    isLanguagesError,
    edvSkills,
    isEDVSkillsLoading,
    isEDVSkillsError,
    permissions,
    permissionAssignments,
    updateDepartmentDetails,
    createPermission,
    deletePermission,
  };
};

export default useMembers;
