import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import React from "react";

/**
 * Interface for the billing warning dialog
 */
interface BillingWarningDialogProps {
  billingWarningDialogOpen: boolean;
  handleCloseBillingWarning: () => void;
}

/**
 * Billing warning dialog
 * @param billingWarningDialogOpen - boolean to open the dialog
 * @param handleCloseBillingWarning - function to close the dialog
 * @returns Billing warning dialog
 */
const BillingWarningDialog = ({ billingWarningDialogOpen, handleCloseBillingWarning }: BillingWarningDialogProps) => {
  return (
    <Dialog open={billingWarningDialogOpen}>
      <DialogContent>
        Zum Starten der Abrechnungsphase bitte erst auf der Hauptprojektseite die Abrechnungsdaten eingeben
      </DialogContent>
      <DialogActions sx={{ borderTop: 1, borderColor: "primary.main" }}>
        <Button onClick={handleCloseBillingWarning} size="small">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BillingWarningDialog;
