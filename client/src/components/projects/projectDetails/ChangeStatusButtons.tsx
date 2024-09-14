import { Cancel, CheckCircle, Payments } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import React from "react";

interface ApplicationPhaseButtonsProps {
  handleOfferAccepted: () => void;
  handleOfferRejected: () => void;
  handlePitchLost: () => void;
  handleBilling: () => void;
  handleCallOff: () => void;
  status: string;
}

/**
 * Component for the change status buttons
 * @param handleOfferAccepted - Function to handle the offer accepted button click
 * @param handleOfferRejected - Function to handle the offer rejected button click
 * @param handlePitchLost - Function to handle the pitch lost button click
 * @param handleBilling - Function to handle the billing button click
 * @param handleCallOff - Function to handle the call off button click
 * @param status - The status of the project
 * @returns The change status buttons depending on the status
 */
const ChangeStatusButtons = ({
  handleOfferAccepted,
  handleOfferRejected,
  handlePitchLost,
  handleBilling,
  handleCallOff,
  status,
}: ApplicationPhaseButtonsProps) => {
  if (status === "Angebot") {
    return (
      <Box>
        <Button
          variant="outlined"
          color="success"
          sx={{ fontWeight: 600, mr: 2 }}
          onClick={handleOfferAccepted}
          startIcon={<CheckCircle />}
          size="small"
        >
          Angebot angenommen
        </Button>
        <Button
          variant="outlined"
          color="error"
          sx={{ fontWeight: 600, mr: 2 }}
          onClick={handleOfferRejected}
          startIcon={<Cancel />}
          size="small"
        >
          Angebot abgelehnt
        </Button>
        <Button
          variant="outlined"
          color="error"
          sx={{ fontWeight: 600, mr: 2 }}
          onClick={handlePitchLost}
          startIcon={<Cancel />}
          size="small"
        >
          Pitch verloren
        </Button>
      </Box>
    );
  }

  if (status === "Durchführung") {
    return (
      <Box>
        <Button
          variant="outlined"
          color="success"
          sx={{ fontWeight: 600, mr: 2 }}
          onClick={handleBilling}
          startIcon={<Payments />}
          size="small"
        >
          Abrechnung
        </Button>
        <Button
          variant="outlined"
          color="error"
          sx={{ fontWeight: 600, mr: 2 }}
          onClick={handleCallOff}
          startIcon={<Cancel />}
          size="small"
        >
          Absagen
        </Button>
      </Box>
    );
  }

  if (status === "Abgeschlossen" || status === "Abrechnung") {
    return (
      <Button
        variant="outlined"
        color="success"
        sx={{ fontWeight: 600, mr: 2 }}
        onClick={handleBilling}
        startIcon={<Payments />}
        size="small"
      >
        Abrechnung
      </Button>
    );
  }

  return null;
};

export default ChangeStatusButtons;
