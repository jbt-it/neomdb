import React from "react";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";

/**
 * Interface for the billing dialog
 */
interface BillingDialogProps {
  billingDialogOpen: boolean;
  handleCloseBillingDialog: () => void;
  handleStartBilling: () => void;
}

/**
 * Billing dialog
 * @param billingDialogOpen - boolean to open the dialog
 * @param handleCloseBillingDialog - function to close the dialog
 * @param handleStartBilling - function to start the billing
 * @returns Billing dialog
 */
const BillingDialog = ({ billingDialogOpen, handleCloseBillingDialog, handleStartBilling }: BillingDialogProps) => {
  return (
    <Dialog open={billingDialogOpen}>
      <DialogContent>Sicher, dass mit der Abrechnung begonnen werden soll?</DialogContent>
      <DialogActions sx={{ borderTop: 1, borderColor: "primary.main" }}>
        <Button onClick={handleCloseBillingDialog} size="small" color="error">
          Abbrechen
        </Button>
        <Button onClick={handleStartBilling} size="small">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BillingDialog;
