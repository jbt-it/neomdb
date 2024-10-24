import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../context/auth-context/AuthContext";
import { AxiosError } from "axios";
import {
  getITSkills,
  getLanguages,
  getMembers,
  updateMemberStatus as updateMemberStatusApi,
  addMember as addMemberApi,
} from "../../api/members";
import { authReducerActionType } from "../../types/globalTypes";
import { showErrorMessage, showSuccessMessage } from "../../utils/toastUtils";
import { replaceSpecialCharacters } from "../../utils/stringUtils";

/**
 * Hook that handles the members api calls, uses react-query
 * @returns The members, the languages, the it skills, a function to update the status of a member and a function to add a new member
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
    queryKey: ["members"],
    queryFn: getMembers,
  });

  const members = membersData?.data || [];

  // ----------------------------------------------------------------------------------
  // getLanguages query
  const { data: languagesData } = useQuery({
    queryKey: ["languages"],
    queryFn: getLanguages,
  });

  const languages = languagesData?.data || [];

  // ----------------------------------------------------------------------------------
  // getEDVSkills query
  const { data: edvSkillsData } = useQuery({
    queryKey: ["itSkills"],
    queryFn: getITSkills,
  });

  const itSkills = edvSkillsData?.data || [];

  // ----------------------------------------------------------------------------------
  // ############
  // UPDATE QUERIES
  // ############

  // updateMemberStatus mutation
  const { mutateAsync: mutateStatus } = useMutation({
    mutationFn: updateMemberStatusApi,
    onError: (err: AxiosError) => {
      showErrorMessage("Mitgliedsstatus Änderung fehlgeschlagen");
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberDetails"] }); // Invalidate the memberDetails data to refetch the data
      queryClient.invalidateQueries({ queryKey: ["members"] }); // Invalidate the members data to refetch the data
      showSuccessMessage("Mitgliedsstatus erfolgreich geändert");
    },
  });

  /**
   * Function to update the status of a member
   * @param memberId The id of the member
   * @param status The new status
   */
  const updateMemberStatus = async (memberId: number, status: string) => {
    return await mutateStatus({ memberId, status });
  };

  // ----------------------------------------------------------------------------------
  // ############
  // CREATE QUERIES
  // ############

  // addMember mutation
  const { mutateAsync: mutateAddMember } = useMutation({
    mutationFn: addMemberApi,
    onError: (err: AxiosError) => {
      showErrorMessage("Mitglied hinzufügen fehlgeschlagen");
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] }); // Invalidate the members data to refetch the data
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

    const firstNameSanitized = replaceSpecialCharacters(firstName.trim().replace(" ", "-")).toLowerCase();
    const lastNameSanitized = replaceSpecialCharacters(lastName.trim().replace(" ", "-")).toLowerCase();
    const payload = {
      name: firstNameSanitized + "." + lastNameSanitized,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      birthday: null,
      mobile: null,
      gender: null,
      generationId: null,
      email: email,
    };

    return await mutateAddMember(payload);
  };

  // ----------------------------------------------------------------------------------
  // Objects and functions returned by the hook
  return {
    members,
    isMembersLoading,
    isMembersError,
    languages,
    itSkills,
    updateMemberStatus,
    addMember,
  };
};

export default useMembers;
