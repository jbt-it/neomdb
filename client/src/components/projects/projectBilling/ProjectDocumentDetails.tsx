import { Cancel, CheckCircle } from "@mui/icons-material";
import { Button, Grid, Paper, Typography } from "@mui/material";
import React from "react";
import { ProjectBillingDetailsDto } from "../../../types/projectTypes";

/**
 * Interface for Project Document Details
 */
interface ProjectDocumentDetailsProps {
  projectBillingDetailsDto: ProjectBillingDetailsDto;
  hasPermissionDocumentFiling: boolean;
  hasPermissionProjectBilling: boolean;
  hasPermissionCRM: boolean;
  checkProjectBillingCheckmark: (checkmark: string) => void;
  checkFreelancerContract: (memberId: number) => void;
  checkMoneyTransferred: (memberId: number) => void;
}

/**
 * Project Document Details Component to display the document details of a project
 * @param projectBillingDetailsDto - project billing details
 * @param hasPermissionDocumentFiling - boolean if the user has permission to file documents
 * @param hasPermissionProjectBilling - boolean if the user has permission to project billing
 * @param hasPermissionCRM - boolean if the user has permission to CRM
 * @returns Project Document Details Component
 */
const ProjectDocumentDetails = ({
  projectBillingDetailsDto,
  hasPermissionDocumentFiling,
  hasPermissionProjectBilling,
  hasPermissionCRM,
  checkProjectBillingCheckmark,
  checkFreelancerContract,
  checkMoneyTransferred,
}: ProjectDocumentDetailsProps) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Grid container rowGap={1}>
        <Grid item container alignItems={"center"}>
          <Grid item xs={6}>
            <Typography textAlign={"end"}>
              Abschlusspräsentation, Referenzslide und Websitereferenz vorhanden
            </Typography>
          </Grid>
          <Grid item xs={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {projectBillingDetailsDto.APatEV ? <CheckCircle color="success" /> : <Cancel color="error" />}
          </Grid>
          <Grid item xs={4}>
            {projectBillingDetailsDto.APatEV ? null : (
              <Button
                sx={{ flex: 1 }}
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => {
                  checkProjectBillingCheckmark("APatEV");
                }}
              >
                <CheckCircle color="success" sx={{ marginRight: 2 }} fontSize="small" />
                <Typography fontSize={10}>Markieren</Typography>
              </Button>
            )}
          </Grid>
        </Grid>
        <Grid item container alignItems={"center"}>
          <Grid item xs={6}>
            <Typography textAlign={"end"}>Abschlusspräsentation gehalten</Typography>
          </Grid>
          <Grid item xs={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {projectBillingDetailsDto.APHold ? <CheckCircle color="success" /> : <Cancel color="error" />}
          </Grid>
          <Grid item xs={4}>
            {projectBillingDetailsDto.APHold ? null : (
              <Button
                sx={{ flex: 1 }}
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => {
                  checkProjectBillingCheckmark("APHold");
                }}
              >
                <CheckCircle color="success" sx={{ marginRight: 2 }} fontSize="small" />
                <Typography fontSize={10}>Markieren</Typography>
              </Button>
            )}
          </Grid>
        </Grid>
        <Grid item container alignItems={"center"}>
          <Grid item xs={6}>
            <Typography textAlign={"end"}>Evaluationsergebnisse vorhanden</Typography>
          </Grid>
          <Grid item xs={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {projectBillingDetailsDto.evaluationAtEV ? <CheckCircle color="success" /> : <Cancel color="error" />}
          </Grid>
          <Grid item xs={4}>
            {projectBillingDetailsDto.evaluationAtEV ? null : (
              <Button
                sx={{ flex: 1 }}
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => {
                  checkProjectBillingCheckmark("evaluationAtEV");
                }}
              >
                <CheckCircle color="success" sx={{ marginRight: 2 }} fontSize="small" />
                <Typography fontSize={10}>Markieren</Typography>
              </Button>
            )}
          </Grid>
        </Grid>
        <Grid item container alignItems={"center"}>
          <Grid item xs={6}>
            <Typography textAlign={"end"}>Dokumentationsleitfaden vorhanden</Typography>
          </Grid>
          <Grid item xs={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {projectBillingDetailsDto.DLatEV ? <CheckCircle color="success" /> : <Cancel color="error" />}
          </Grid>
          <Grid item xs={4}>
            {projectBillingDetailsDto.DLatEV ? null : (
              <Button
                sx={{ flex: 1 }}
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => {
                  checkProjectBillingCheckmark("DLatEV");
                }}
              >
                <CheckCircle color="success" sx={{ marginRight: 2 }} fontSize="small" />
                <Typography fontSize={10}>Markieren</Typography>
              </Button>
            )}
          </Grid>
        </Grid>
        <Grid item container alignItems={"center"}>
          <Grid item xs={6}>
            <Typography textAlign={"end"}>Angebot in Alfresco vorhanden</Typography>
          </Grid>
          <Grid item xs={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {projectBillingDetailsDto.offerInAlfresco ? <CheckCircle color="success" /> : <Cancel color="error" />}
          </Grid>
          <Grid item xs={4}>
            {projectBillingDetailsDto.offerInAlfresco ? null : (
              <Button
                sx={{ flex: 1 }}
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => {
                  checkProjectBillingCheckmark("offerInAlfresco");
                }}
              >
                <CheckCircle color="success" sx={{ marginRight: 2 }} fontSize="small" />
                <Typography fontSize={10}>Markieren</Typography>
              </Button>
            )}
          </Grid>
        </Grid>
        <Grid item container alignItems={"center"}>
          <Grid item xs={6}>
            <Typography textAlign={"end"}>Abweichung vom Standard</Typography>
          </Grid>
          <Grid item xs={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {projectBillingDetailsDto.deviationFromStandard ? (
              <CheckCircle color="success" />
            ) : (
              <Cancel color="error" />
            )}
          </Grid>
          <Grid item xs={4}>
            {projectBillingDetailsDto.deviationFromStandard ? null : (
              <Button
                sx={{ flex: 1 }}
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => {
                  checkProjectBillingCheckmark("deviationFromStandard");
                }}
              >
                <CheckCircle color="success" sx={{ marginRight: 2 }} fontSize="small" />
                <Typography fontSize={10}>Markieren</Typography>
              </Button>
            )}
          </Grid>
        </Grid>
        <Grid item container alignItems={"center"}>
          <Grid item xs={6}>
            <Typography textAlign={"end"}>Beratungsvertrag vorhanden</Typography>
          </Grid>
          <Grid item xs={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {projectBillingDetailsDto.consultingContractProvided ? (
              <CheckCircle color="success" />
            ) : (
              <Cancel color="error" />
            )}
          </Grid>
          <Grid item xs={4}>
            {projectBillingDetailsDto.consultingContractProvided ? null : hasPermissionDocumentFiling ? (
              <Button
                sx={{ flex: 1 }}
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => {
                  checkProjectBillingCheckmark("consultingContractProvided");
                }}
              >
                <CheckCircle color="success" sx={{ marginRight: 2 }} fontSize="small" />
                <Typography fontSize={10}>Markieren</Typography>
              </Button>
            ) : null}
          </Grid>
        </Grid>
        <Grid item container alignItems={"center"}>
          <Grid item xs={6}>
            <Typography textAlign={"end"}>Teamvertrag vorhanden</Typography>
          </Grid>
          <Grid item xs={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {projectBillingDetailsDto.teamContractProvided ? <CheckCircle color="success" /> : <Cancel color="error" />}
          </Grid>
          <Grid item xs={4}>
            {projectBillingDetailsDto.teamContractProvided ? null : hasPermissionDocumentFiling ? (
              <Button
                sx={{ flex: 1 }}
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => {
                  checkProjectBillingCheckmark("teamContractProvided");
                }}
              >
                <CheckCircle color="success" sx={{ marginRight: 2 }} fontSize="small" />
                <Typography fontSize={10}>Markieren</Typography>
              </Button>
            ) : null}
          </Grid>
        </Grid>
        <Grid item container alignItems={"center"}>
          <Grid item xs={6}>
            <Typography textAlign={"end"}>QM-Freigabe</Typography>
          </Grid>
          <Grid item xs={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {projectBillingDetailsDto.qmApproval ? <CheckCircle color="success" /> : <Cancel color="error" />}
          </Grid>
          <Grid item xs={4}>
            {projectBillingDetailsDto.qmApproval ? null : (
              <Button
                sx={{ flex: 1 }}
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => {
                  checkProjectBillingCheckmark("qmApproval");
                }}
              >
                <CheckCircle color="success" sx={{ marginRight: 2 }} fontSize="small" />
                <Typography fontSize={10}>Markieren</Typography>
              </Button>
            )}
          </Grid>
        </Grid>
        <Grid item container alignItems={"center"}>
          <Grid item xs={6}>
            <Typography textAlign={"end"}>Vollständig in CRM eingetragen</Typography>
          </Grid>
          <Grid item xs={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {projectBillingDetailsDto.CRMEntryExists ? <CheckCircle color="success" /> : <Cancel color="error" />}
          </Grid>
          <Grid item xs={4}>
            {projectBillingDetailsDto.CRMEntryExists ? null : hasPermissionCRM ? (
              <Button
                sx={{ flex: 1 }}
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => {
                  checkProjectBillingCheckmark("CRMEntryExists");
                }}
              >
                <CheckCircle color="success" sx={{ marginRight: 2 }} fontSize="small" />
                <Typography fontSize={10}>Markieren</Typography>
              </Button>
            ) : null}
          </Grid>
        </Grid>
        <Grid item container alignItems={"center"}>
          <Grid item xs={6}>
            <Typography textAlign={"end"}>Zahlungsverzug</Typography>
          </Grid>
          <Grid item xs={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {projectBillingDetailsDto.paymentDelay ? <CheckCircle color="success" /> : <Cancel color="error" />}
          </Grid>
          <Grid item xs={4}>
            {projectBillingDetailsDto.paymentDelay ? null : hasPermissionProjectBilling ? (
              <Button
                sx={{ flex: 1 }}
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => {
                  checkProjectBillingCheckmark("paymentDelay");
                }}
              >
                <CheckCircle color="success" sx={{ marginRight: 2 }} fontSize="small" />
                <Typography fontSize={10}>Markieren</Typography>
              </Button>
            ) : null}
          </Grid>
        </Grid>
        <Grid item container alignItems={"center"}>
          <Grid item xs={6}>
            <Typography textAlign={"end"}>Geld eingegangen</Typography>
          </Grid>
          <Grid item xs={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {projectBillingDetailsDto.moneyReceived ? <CheckCircle color="success" /> : <Cancel color="error" />}
          </Grid>
          <Grid item xs={4}>
            {projectBillingDetailsDto.moneyReceived ? null : hasPermissionProjectBilling ? (
              <Button
                sx={{ flex: 1 }}
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => {
                  checkProjectBillingCheckmark("moneyReceived");
                }}
              >
                <CheckCircle color="success" sx={{ marginRight: 2 }} fontSize="small" />
                <Typography fontSize={10}>Markieren</Typography>
              </Button>
            ) : null}
          </Grid>
        </Grid>
        {projectBillingDetailsDto.membersBilling.map((memberBilling) => (
          <Grid item container rowGap={1} alignItems={"center"} key={memberBilling.memberId}>
            <Grid item xs={6}>
              <Typography textAlign={"end"}>
                Vertrag freie Mitarbeit erhalten von {memberBilling.firstname} {memberBilling.lastname}
              </Typography>
            </Grid>
            <Grid item xs={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              {memberBilling.freelancerContract ? <CheckCircle color="success" /> : <Cancel color="error" />}
            </Grid>
            <Grid item xs={4}>
              {memberBilling.freelancerContract ? (
                <Typography fontSize={14}>({memberBilling.freelancerContract?.toLocaleDateString()})</Typography>
              ) : hasPermissionDocumentFiling ? (
                <Button
                  sx={{ flex: 1 }}
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => {
                    checkFreelancerContract(memberBilling.memberId);
                  }}
                >
                  <CheckCircle color="success" sx={{ marginRight: 2 }} fontSize="small" />
                  <Typography fontSize={10}>Markieren</Typography>
                </Button>
              ) : null}
            </Grid>
            <Grid item xs={6}>
              <Typography textAlign={"end"}>
                Geld überwiesen an {memberBilling.firstname} {memberBilling.lastname}
              </Typography>
            </Grid>
            <Grid item xs={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              {memberBilling.moneyTransferred ? <CheckCircle color="success" /> : <Cancel color="error" />}
            </Grid>
            <Grid item xs={4}>
              {memberBilling.moneyTransferred ? (
                <Typography fontSize={14}>({memberBilling.moneyTransferred.toLocaleDateString()})</Typography>
              ) : hasPermissionProjectBilling ? (
                <Button
                  sx={{ flex: 1 }}
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => {
                    checkMoneyTransferred(memberBilling.memberId);
                  }}
                >
                  <CheckCircle color="success" sx={{ marginRight: 2 }} fontSize="small" />
                  <Typography fontSize={10}>Markieren</Typography>
                </Button>
              ) : null}
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default ProjectDocumentDetails;
