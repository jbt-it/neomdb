import React, { useState } from "react";
import { MemberBTAllocationDto, MembersBillingDto } from "../../../types/projectTypes";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";

/**
 * Interface for Allocations
 */
interface Allocation {
  btAllocation: number;
  expensesAllocation: number;
}

/**
 * Interface for the BT allocation dialog
 */
interface BTAllocationDialogProps {
  btAllocationDialogOpen: boolean;
  handleCloseBTAllocationDialog: () => void;
  saveBTAllocation: (allocations: MemberBTAllocationDto[]) => void;
  projectMembers: MembersBillingDto[];
  soldBT: number;
  soldExpenses: number;
}

/**
 * BT Allocation Dialog
 * @param btAllocationDialogOpen - boolean if the dialog is open
 * @param handleCloseBTAllocationDialog - function to close the dialog
 * @param saveBTAllocation - function to save the BT allocation
 * @param projectMembers - array of project members
 * @param soldBT - number of sold BT
 * @param soldExpenses - number of sold expenses
 * @returns BT Allocation Dialog
 */
const BTAllocationDialog = ({
  btAllocationDialogOpen,
  handleCloseBTAllocationDialog,
  saveBTAllocation: saveBTAllocation,
  projectMembers,
  soldBT,
  soldExpenses,
}: BTAllocationDialogProps) => {
  // Initialize state for each member
  const [allocations, setAllocations] = useState<Record<number, Allocation>>(
    projectMembers.reduce((acc, member) => {
      acc[member.memberId] = {
        btAllocation: member.btAllocation || 0,
        expensesAllocation: member.expensesAllocation || 0,
      };
      return acc;
    }, {} as Record<number, Allocation>)
  );

  // Handle changes to the TextField values
  const handleAllocationChange = (memberId: number, field: keyof Allocation, value: number) => {
    setAllocations((prevAllocations) => ({
      ...prevAllocations,
      [memberId]: {
        ...prevAllocations[memberId],
        [field]: value,
      },
    }));
  };

  // Handle saving the BT allocation
  const handleSaveBTAllocation = () => {
    const allocationsArray = Object.entries(allocations).map(([memberId, allocation]) => ({
      memberId: parseInt(memberId),
      btAllocation: allocation.btAllocation,
      expensesAllocation: allocation.expensesAllocation,
    }));
    saveBTAllocation(allocationsArray);
  };

  // Handle canceling the BT allocation
  const handleCancel = () => {
    handleCloseBTAllocationDialog();
    setAllocations(
      projectMembers.reduce((acc, member) => {
        acc[member.memberId] = {
          btAllocation: member.btAllocation || 0,
          expensesAllocation: member.expensesAllocation || 0,
        };
        return acc;
      }, {} as Record<number, Allocation>)
    );
  };

  // Check if all fields are filled and are numbers
  const checkIfAllFieldsAreFilledAndANumber = () => {
    return Object.values(allocations).some(
      (allocation) => isNaN(allocation.btAllocation) || isNaN(allocation.expensesAllocation)
    );
  };

  return (
    <Dialog open={btAllocationDialogOpen}>
      <DialogTitle>
        <Typography fontSize={20} fontWeight={"bold"}>
          BT-Aufteilung
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <Stack direction={"row"} justifyContent={"space-between"} spacing={5}>
            <Typography>
              <strong>Aufzuteilende BT:</strong> {soldBT}
            </Typography>
            <Typography>
              <strong>Aufzuteilende Spesen:</strong>{" "}
              {Intl.NumberFormat("en-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(soldExpenses)}{" "}
              €
            </Typography>
          </Stack>
          {projectMembers.map((member) => (
            <Stack key={member.memberId} direction={"column"} spacing={1}>
              <Typography>
                {member.firstname} {member.lastname}
              </Typography>
              <Stack direction={"row"} justifyContent={"space-between"} spacing={2}>
                <TextField
                  label={"BT"}
                  type="number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={allocations[member.memberId].btAllocation}
                  onChange={(e) => handleAllocationChange(member.memberId, "btAllocation", parseFloat(e.target.value))}
                  inputProps={{ min: 0 }}
                />
                <TextField
                  label={"Spesen"}
                  type="number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={allocations[member.memberId].expensesAllocation}
                  onChange={(e) =>
                    handleAllocationChange(member.memberId, "expensesAllocation", parseFloat(e.target.value))
                  }
                  inputProps={{ min: 0 }}
                />
              </Stack>
            </Stack>
          ))}
          {checkIfAllFieldsAreFilledAndANumber() ? (
            <Typography color="error">Bitte füllen Sie alle Felder aus.</Typography>
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ borderTop: 1, borderColor: "primary.main" }}>
        <Button onClick={handleCancel}>Abbrechen</Button>
        <Button onClick={handleSaveBTAllocation} disabled={checkIfAllFieldsAreFilledAndANumber()}>
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BTAllocationDialog;
