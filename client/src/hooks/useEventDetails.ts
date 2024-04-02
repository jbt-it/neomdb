import { useQuery, useMutation, useQueryClient } from "react-query";
import { AxiosError } from "axios";
import { authReducerActionType } from "../types/globalTypes";
import { showErrorMessage, showSuccessMessage } from "../utils/toastUtils";
import { useContext } from "react";
import { AuthContext } from "../context/auth-context/AuthContext";
import {
  getEventDetails,
  getEventParticipants,
  getWWParticipants,
  updateEventDetails as updateEventDetailsApi,
} from "../api/events";
import { CommonEventType, EventParticipant, WorkingWeekendParticipant } from "../types/eventTypes";
import dayjs from "dayjs";

/**
 * Hook that handles the members api calls, uses react-query
 * @returns The members, a boolean indicating if the data is loading and a boolean indicating if an error occured
 */
const useEventDetails = (eventID: number) => {
  const { dispatchAuth } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // If a memberID is provided, the following code will be executed
  // Not good ... rather use a separate hook for the updateMemberStatus mutation

  // ######################################################################################
  // GET QUERIES
  // ######################################################################################

  // ----------------------------------------------------------------------------------
  // getEventDetails query
  const {
    data: eventDetailsData,
    isLoading: isEventDetailsLoading,
    isFetched: isEventDetailsFetched,
    isError: isEventDetailsError,
  } = useQuery({
    queryKey: ["EventDetails", eventID],
    queryFn: () => getEventDetails(eventID),
    onError: (err: AxiosError) => {
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
  });

  const [startHours, startMinutes] = (eventDetailsData &&
    eventDetailsData.data.startTime &&
    eventDetailsData.data.startTime.toString().split(":").map(Number)) || [0, 0];
  const [endHours, endMinutes] = (eventDetailsData &&
    eventDetailsData.data.endTime &&
    eventDetailsData.data.endTime.toString().split(":").map(Number)) || [0, 0];

  const eventDetails =
    eventDetailsData &&
    ({
      ...eventDetailsData.data,
      startDate: dayjs(eventDetailsData.data.startDate),
      endDate: dayjs(eventDetailsData.data.endDate),
      startTime: eventDetailsData.data.startTime
        ? dayjs(eventDetailsData.data.startDate).startOf("day").hour(startHours).minute(startMinutes)
        : null,
      endTime: eventDetailsData.data.endTime
        ? dayjs(eventDetailsData.data.endDate).startOf("day").hour(endHours).minute(endMinutes)
        : null,
      registrationStart: eventDetailsData.data.registrationStart
        ? dayjs(eventDetailsData.data.registrationStart)
        : null,
      registrationEnd: eventDetailsData.data.registrationEnd ? dayjs(eventDetailsData.data.registrationEnd) : null,
    } as CommonEventType);

  // ----------------------------------------------------------------------------------
  // getEventParticipants query
  const {
    data: eventParticipantsData,
    isLoading: isEventParticipantsLoading,
    isError: isEventParticipantsError,
  } = useQuery({
    queryKey: ["EventParticipants", eventID],
    queryFn: () => getEventParticipants(eventID),
    onError: (err: AxiosError) => {
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
  });

  const eventParticipants = eventParticipantsData?.data as EventParticipant[] | undefined;

  // ----------------------------------------------------------------------------------
  // getWWParticipants query
  const {
    data: wwParticipantsData,
    isLoading: iswwParticipantsLoading,
    isError: iswwParticipantsError,
  } = useQuery({
    queryKey: ["WWParticipants", eventID],
    queryFn: () => getWWParticipants(eventID),
    onError: (err: AxiosError) => {
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
    },
  });

  const wwParticipants = wwParticipantsData?.data as WorkingWeekendParticipant[] | undefined;

  // ----------------------------------------------------------------------------------

  // ######################################################################################
  // UPDATE QUERIES
  // ######################################################################################

  // updateEventDetails mutation
  const { mutateAsync: mutateEventDetails } = useMutation({
    mutationFn: updateEventDetailsApi,
    onError: (err: AxiosError) => {
      if (err.response?.status === 401) {
        dispatchAuth({ type: authReducerActionType.deauthenticate });
      }
      showErrorMessage("Fehler beim Aktualisieren des Events");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["EventDetails", eventID] });
      queryClient.invalidateQueries({ queryKey: ["EventParticipants", eventID] });
      showSuccessMessage("Event erfolgreich aktualisiert");
    },
  });

  const updateEventDetails = async (eventDetails: CommonEventType) => {
    return await mutateEventDetails(eventDetails);
  };

  // ----------------------------------------------------------------------------------
  return {
    eventDetails,
    isEventDetailsLoading,
    isEventDetailsFetched,
    isEventDetailsError,
    eventParticipants,
    wwParticipants,
    updateEventDetails,
  };
};

export default useEventDetails;
