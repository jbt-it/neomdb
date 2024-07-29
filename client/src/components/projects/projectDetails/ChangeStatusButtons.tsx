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
 * Component for the application phase buttons
 * @param param0
 * @returns
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
