import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { MembersBillingDto } from "../../../types/projectTypes";

/**
 * Interface for BT Allocation
 */
interface BTAllocationProps {
  soldBT: number;
  euroPerBT: number;
  soldExpenses: number;
  projectMembers: MembersBillingDto[];
}

/**
 * BT Allocation Component to display the BT allocation
 * @param soldBT - number of sold BT
 * @param euroPerBT - price per BT
 * @param soldExpenses - number of sold expenses
 * @param projectMembers - array of project members
 * @returns BT Allocation Component
 */
const BTAllocation = ({ soldBT, euroPerBT, soldExpenses, projectMembers }: BTAllocationProps) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Stack direction={"column"} spacing={2} sx={{ mt: 1 }}>
        <Typography>
          <strong>Hinweis:</strong> Die Summe der geleisteten BT muss nicht notwendigerweise den verkauften BT
          entsprechen. Bitte hier genau die geleisteten BT eintragen, die MDB rechnet entsprechend um.{" "}
          <strong>Wenn eine andere Geld-Aufteilung verwendet werden soll</strong> als die, die der BT-Aufteilung
          entspricht, bitte direkt mit dem Finanzvorstand Kontakt aufnehmen.
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Empfänger</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>BT-Aufteilung</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Spesen-Aufteilung</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Summe</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ border: 0 }}>Aufzuteilen:</TableCell>
                <TableCell sx={{ border: 0 }}>
                  {soldBT} BT ={" "}
                  {Intl.NumberFormat("en-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                    euroPerBT * soldBT
                  )}{" "}
                  €
                </TableCell>
                <TableCell sx={{ border: 0 }}>
                  {Intl.NumberFormat("en-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                    soldExpenses
                  )}{" "}
                  €
                </TableCell>
                <TableCell sx={{ border: 0 }}>
                  {Intl.NumberFormat("en-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                    euroPerBT * soldBT
                  )}{" "}
                  €
                </TableCell>
              </TableRow>
              {projectMembers.map((member) => (
                <TableRow key={member.memberId}>
                  <TableCell sx={{ border: 0 }}>
                    {member.firstname} {member.lastname}{" "}
                    {member.type === "PL" ? "(PL)" : member.type === "QM" ? "(QM)" : ""}
                  </TableCell>
                  <TableCell sx={{ border: 0 }}>
                    {member.btAllocation} BT ={" "}
                    {Intl.NumberFormat("en-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                      member.btAllocation !== null ? member.btAllocation * euroPerBT : 0
                    )}{" "}
                    €
                  </TableCell>
                  <TableCell sx={{ border: 0 }}>
                    {Intl.NumberFormat("en-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                      member.expensesAllocation !== null ? member.expensesAllocation : 0
                    )}{" "}
                    €
                  </TableCell>
                  <TableCell sx={{ border: 0 }}>
                    {Intl.NumberFormat("en-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                      member.btAllocation !== null && member.expensesAllocation !== null
                        ? member.btAllocation * euroPerBT + member.expensesAllocation
                        : 0
                    )}{" "}
                    €
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Paper>
  );
};

export default BTAllocation;
