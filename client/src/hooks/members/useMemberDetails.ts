import { useQuery, useMutation, useQueryClient } from "react-query";
import { AxiosError } from "axios";
import { MemberDetails, MemberImage } from "../../types/membersTypes";
import { authReducerActionType } from "../../types/globalTypes";
import {
  getMemberDetails,
  getMemberImage,
  updateMemberDetails as updateDetails,
  saveMemberImage as saveImage,
} from "../../api/members";
import { showErrorMessage, showSuccessMessage } from "../../utils/toastUtils";
import { useContext } from "react";
import { AuthContext } from "../../context/auth-context/AuthContext";

/**
 * Hook that handles the members api calls, uses react-query
 * @returns The members, a boolean indicating if the data is loading and a boolean indicating if an error occured
 */
const useMemberDetails = (memberID: number) => {
  const { dispatchAuth } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // If a memberID is provided, the following code will be executed
  // Not good ... rather use a separate hook for the updateMemberStatus mutation

  // ############
  // GET QUERIES
  // ############

  // getMemberDetails query
  const {
    data: memberDetailsData,
    isLoading: isMemberDetailsLoading,
    isError: isMemberDetailsError,
  } = useQuery({
    queryKey: ["MemberDetails", memberID],
    queryFn: () => getMemberDetails(memberID),
    onError: (err: AxiosError) => {
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
  });

  const memberDetails = memberDetailsData && (memberDetailsData.data as MemberDetails);

  // ----------------------------------------------------------------------------------
  // getMemberImage query
  const {
    data: memberImageData,
    isLoading: isMemberImageLoading,
    isError: isMemberImageError,
  } = useQuery({
    queryKey: ["MemberImage", memberID],
    queryFn: () => getMemberImage(memberID),
    onError: (err: AxiosError) => {
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
  });

  const memberImage = memberImageData ? (memberImageData.data as MemberImage) : null;

  // ----------------------------------------------------------------------------------

  // ############
  // UPDATE QUERIES
  // ############

  // updateMemberDetails mutation
  const { mutate: mutateDetails, isLoading: isUpdatingMemberDetails } = useMutation({
    mutationFn: updateDetails,
    onError: (err: AxiosError) => {
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["MemberDetails"] });
    },
  });

  const updateMemberDetails = (memberDetails: MemberDetails) => {
    mutateDetails(memberDetails);
  };

  // ----------------------------------------------------------------------------------
  //saveMemberImage mutation
  const { mutate: mutateImage, isLoading: isSavingMemberImage } = useMutation({
    mutationFn: saveImage,
    onError: (err: AxiosError) => {
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      } else if (err.response?.status === 403) {
        showErrorMessage("Hochladen ist fehlgeschlagen!");
      } else if (err.response?.status === 500) {
        showErrorMessage("Hochladen ist fehlgeschlagen!");
      }
    },
    onSuccess: () => {
      showSuccessMessage("Bild wurde erfolgreich hochgeladen!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["MemberImage"] });
    },
  });

  const saveMemberImage = (image: File) => {
    mutateImage({ image, memberID });
  };

  // ----------------------------------------------------------------------------------

  return {
    memberDetails,
    isMemberDetailsLoading,
    isMemberDetailsError,
    updateMemberDetails,
    isUpdatingMemberDetails,
    memberImage,
    isMemberImageLoading,
    isMemberImageError,
    saveMemberImage,
    isSavingMemberImage,
  };
};

export default useMemberDetails;
