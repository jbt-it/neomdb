import { useContext } from "react";
import { AuthContext } from "../../context/auth-context/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getApplicantsEvaluations, getCurrentGeneration, getFeedbackStatistics } from "../../api/application";

/**
 * Hook that handles the application api calls, uses react-query
 * @returns
 */
const useApplicants = () => {
  const { auth, dispatchAuth } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // ############
  // GET QUERIES
  // ############

  // getCurrentGeneration query
  const { data: currentGenerationData } = useQuery({
    queryKey: ["currentGeneration"],
    queryFn: getCurrentGeneration,
  });

  const currentGeneration = currentGenerationData ? currentGenerationData.data : null;

  // getApplicantsEvaluations query
  const { data: applicantsData } = useQuery({
    queryKey: ["applicants"],
    queryFn: () => getApplicantsEvaluations(auth?.userID as number),
  });

  const applicantsEvaluations = applicantsData ? applicantsData : [];

  // getFeedbackStatistics query
  const { data: feedbackStatisticsData } = useQuery({
    queryKey: ["feedback"],
    queryFn: getFeedbackStatistics,
  });

  const feedbackStatistics = feedbackStatisticsData ? feedbackStatisticsData.data : null;

  return { currentGeneration, applicantsEvaluations, feedbackStatistics };
};

export default useApplicants;
