import { useContext } from "react";
import { AuthContext } from "../../context/auth-context/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getApplicantsEvaluations, getFeedbackStatistics } from "../../api/application";

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

  // getApplicantsEvaluations query
  const { data: applicantsData } = useQuery({
    queryKey: ["applicants"],
    queryFn: () => getApplicantsEvaluations(auth?.userID as number),
  });

  const applicantsEvaluations = applicantsData ? applicantsData : [];

  // getFeedbackStatistics query
  const { data: feedbackStatistics } = useQuery({
    queryKey: ["feedback"],
    queryFn: getFeedbackStatistics,
  });

  return { applicantsEvaluations, feedbackStatistics };
};

export default useApplicants;
