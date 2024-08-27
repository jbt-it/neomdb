import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { MemberDetailsDto, MemberImage } from "../../types/membersTypes";
import { authReducerActionType } from "../../types/globalTypes";
import {
  getMemberDetails,
  getMemberImage,
  updateMemberDetails as updateMemberDetailsApi,
  saveMemberImage as saveMemberImageApi,
  getMemberDirectorPositions,
  addDirectorPosition as addDirectorPositionApi,
  deleteDirectorPosition as deleteDirectorPositionApi,
  changeDirectorPosition as changeDirectorPositionApi,
} from "../../api/members";
import { showErrorMessage, showSuccessMessage } from "../../utils/toastUtils";
import { useContext } from "react";
import { AuthContext } from "../../context/auth-context/AuthContext";

/**
 * Hook that handles the members api calls, uses react-query
 * @returns The member details, a function to update the details of a member, the member image and a function to save the image of a member
 */
const useMemberDetails = (memberID: number) => {
  const { dispatchAuth } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // ############
  // GET QUERIES
  // ############

  // getMemberDetails query
  const {
    data: memberDetailsData,
    isLoading: isMemberDetailsLoading,
    isError: isMemberDetailsError,
  } = useQuery({
    queryKey: ["memberDetails", memberID],
    queryFn: () => getMemberDetails(memberID),
  });

  const memberDetails = memberDetailsData && (memberDetailsData.data as MemberDetailsDto);

  // ----------------------------------------------------------------------------------
  // getMemberImage query
  const {
    data: memberImageData,
    isLoading: isMemberImageLoading,
    isError: isMemberImageError,
  } = useQuery({
    queryKey: ["memberImage", memberID],
    queryFn: () => getMemberImage(memberID),
  });

  const memberImage = memberImageData ? (memberImageData.data as MemberImage) : null;

  // ----------------------------------------------------------------------------------
  // getMemberDirectorPositions query
  const {
    data: memberDirectorPositionsData,
    isLoading: isMemberDirectorPositionsLoading,
    isError: isMemberDirectorPositionsError,
  } = useQuery({
    queryKey: ["memberDirectorPositions", memberID],
    queryFn: () => getMemberDirectorPositions(memberID),
  });

  const memberDirectorPositions = memberDirectorPositionsData ? memberDirectorPositionsData.data : [];

  // ----------------------------------------------------------------------------------

  // ############
  // UPDATE QUERIES
  // ############

  // updateMemberDetails mutation
  const { mutateAsync: mutateDetails } = useMutation({
    mutationFn: updateMemberDetailsApi,
    onError: (err: AxiosError) => {
      if (err.response?.status === 401) {
        showErrorMessage("Aktualisierung ist fehlgeschlagen!");
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
    onSuccess: () => {
      showSuccessMessage("Profil wurden erfolgreich aktualisiert!");
      queryClient.invalidateQueries({ queryKey: ["memberDetails"] }); // Invalidate the memberDetails data to refetch the data
    },
  });

  /**
   * Function to update the details of a member
   * @param memberDetails - The details of the member
   * @returns
   */
  const updateMemberDetails = async (memberDetails: MemberDetailsDto) => {
    return await mutateDetails(memberDetails);
  };

  // ----------------------------------------------------------------------------------
  // saveMemberImage mutation
  const { mutateAsync: mutateImage } = useMutation({
    mutationFn: saveMemberImageApi,
    onError: (err: AxiosError) => {
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      } else if (err.response?.status === 403) {
        showErrorMessage("Hochladen ist fehlgeschlagen!");
      } else if (err.response?.status === 500) {
        showErrorMessage("Hochladen ist fehlgeschlagen!");
      }
    },
    onSuccess: (data) => {
      showSuccessMessage("Bild wurde erfolgreich hochgeladen!");
      queryClient.invalidateQueries({ queryKey: ["memberImage", memberID] }); // Invalidate the memberImage data to refetch the data
      // Update the memberImage data with the new image
      queryClient.setQueryData(["memberImage", memberID], (oldData: any) => {
        return {
          ...oldData,
          data: data,
        };
      });
    },
  });

  /**
   * Function to save the image of a member
   * @param image - The image of the member
   * @returns
   */
  const saveMemberImage = async (image: File) => {
    return await mutateImage({ image, memberID });
  };

  // ----------------------------------------------------------------------------------
  // addDirectorPosition mutation
  const { mutateAsync: mutateAddDirectorPosition } = useMutation({
    mutationFn: addDirectorPositionApi,
    onError: (err: AxiosError) => {
      showErrorMessage("Fehler beim Hinzufügen der Position!");
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberDirectorPositions", memberID] }); // Invalidate the memberDirectorPositions data to refetch the data
      showSuccessMessage("Position wurde erfolgreich hinzugefügt!");
    },
  });

  /**
   * Function to add a new director position to the member
   * @param directorID - The ID of the director
   * @param from - The start date of the position
   * @param until - The end date of the position
   * @returns The new director position
   */
  const addDirectorPosition = async (directorID: number, from: Date, until: Date) => {
    return await mutateAddDirectorPosition({ directorID, memberID, from, until });
  };

  // ----------------------------------------------------------------------------------
  // changeDirectorPosition mutation
  const { mutateAsync: mutateChangeDirectorPosition } = useMutation({
    mutationFn: changeDirectorPositionApi,
    onError: (err: AxiosError) => {
      showErrorMessage("Fehler beim Ändern der Position!");
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberDirectorPositions", memberID] }); // Invalidate the memberDirectorPositions data to refetch the data
      showSuccessMessage("Position wurde erfolgreich geändert!");
    },
  });

  /**
   * Function to change the director position of a member
   * @param directorID - The ID of the director
   * @param from - The start date of the position
   * @param until - The end date of the position
   * @returns void
   */
  const changeDirectorPosition = async (directorID: number, from: Date, until: Date) => {
    return await mutateChangeDirectorPosition({ directorID, memberID, from, until });
  };

  // ----------------------------------------------------------------------------------

  // ############
  // DELETE QUERIES
  // ############

  const { mutateAsync: mutateDeleteDirectorPosition } = useMutation({
    mutationFn: deleteDirectorPositionApi,
    onError: (err: AxiosError) => {
      showErrorMessage("Fehler beim Löschen der Position!");
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberDirectorPositions", memberID] }); // Invalidate the memberDirectorPositions data to refetch the data
      showSuccessMessage("Position wurde erfolgreich gelöscht!");
    },
  });

  const deleteDirectorPosition = async (directorID: number) => {
    return await mutateDeleteDirectorPosition({ memberID, directorID });
  };

  // ----------------------------------------------------------------------------------
  return {
    memberDetails,
    isMemberDetailsLoading,
    isMemberDetailsError,
    updateMemberDetails,
    memberImage,
    isMemberImageLoading,
    isMemberImageError,
    saveMemberImage,
    memberDirectorPositions,
    isMemberDirectorPositionsLoading,
    isMemberDirectorPositionsError,
    addDirectorPosition,
    changeDirectorPosition,
    deleteDirectorPosition,
  };
};

export default useMemberDetails;
