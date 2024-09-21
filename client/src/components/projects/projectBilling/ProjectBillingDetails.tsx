import { Paper, Stack, Typography } from "@mui/material";
import React from "react";

interface ProjectBillingDetailsProps {
  soldBT: number;
  euroPerBT: number;
  soldExpenses: number;
}

const ProjectBillingDetails = ({ soldBT, euroPerBT, soldExpenses }: ProjectBillingDetailsProps) => {
  const netSoldTotal = soldBT * euroPerBT;
  const salesTax = (netSoldTotal + soldExpenses) * 0.19;
  const invoiceAmount = salesTax + netSoldTotal + soldExpenses;

  return (
    <Paper sx={{ p: 2 }}>
      <Stack direction={"column"} maxWidth={400}>
        <Stack direction={"row"}>
          <Typography variant="body1" flex={2}>
            Verkaufte BT:
          </Typography>
          <Typography variant="body1" flex={1} textAlign={"end"}>
            {soldBT}
          </Typography>
        </Stack>
        <Stack direction={"row"}>
          <Typography variant="body1" flex={2}>
            BT-Satz:
          </Typography>
          <Typography variant="body1" flex={1} textAlign={"end"}>
            {Intl.NumberFormat("en-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(euroPerBT)} €
          </Typography>
        </Stack>
        <Stack direction={"row"}>
          <Typography variant="body1" flex={2}>
            Netto-Verkaufspreis:
          </Typography>
          <Typography variant="body1" flex={1} textAlign={"end"}>
            {Intl.NumberFormat("en-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(netSoldTotal)} €
          </Typography>
        </Stack>
        <Stack direction={"row"}>
          <Typography variant="body1" flex={2}>
            Spesen:
          </Typography>
          <Typography variant="body1" flex={1} textAlign={"end"}>
            {Intl.NumberFormat("en-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(soldExpenses)} €
          </Typography>
        </Stack>
        <Stack direction={"row"}>
          <Typography variant="body1" flex={2}>
            Mehrwertsteuer:
          </Typography>
          <Typography variant="body1" flex={1} textAlign={"end"}>
            {Intl.NumberFormat("en-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(salesTax)} €
          </Typography>
        </Stack>
        <Stack direction={"row"}>
          <Typography variant="body1" flex={2}>
            Rechnungsbetrag:
          </Typography>
          <Typography variant="body1" flex={1} textAlign={"end"}>
            {Intl.NumberFormat("en-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(invoiceAmount)} €
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default ProjectBillingDetails;
