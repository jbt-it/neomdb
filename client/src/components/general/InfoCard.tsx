/*
 * The InfoCard component displays a card with header, edit button and information
 */
import React from "react";
import { Card, Accordion, AccordionDetails, AccordionSummary, IconButton, Typography, Box } from "@mui/material";
import { Edit } from "@mui/icons-material";

/**
 * Prop type for the InfoCard
 */
type InfoCardProps = {
  title: string;
  isEditable: boolean;
  handleEdit?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isExpandable: boolean;
  defaultExpanded: boolean;
  children: React.ReactNode[] | React.ReactNode;
};

/**
 * Displays a card with a header and an optional edit button which invokes the given `handleEdit` function
 * This component can be used if information about a specific 'topic' (e.g. departments, specific member details etc.) should be displayed
 *
 * @example <InfoCard title="Title" isEditable={true} handleEdit={handleEdit} isExpandable={true} defaultExpanded={true}>
 * // Insert content here
 * </InfoCard>
 */
const InfoCard: React.FunctionComponent<InfoCardProps> = (props: InfoCardProps) => {
  const { title, isEditable, handleEdit, isExpandable, defaultExpanded, children } = props;

  /**
   * Renders the edit button
   * @returns The edit button or null if `isEditable` is false
   */
  const renderEditButton = () => {
    if (isEditable && handleEdit !== undefined) {
      return (
        <IconButton onClick={(event) => handleEdit(event)} size="large">
          <Edit fontSize="inherit" />
        </IconButton>
      );
    }
    return null;
  };

  return isExpandable ? (
    <Accordion defaultExpanded={defaultExpanded} sx={{ m: 0 }}>
      <AccordionSummary aria-controls="" id="">
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5">
            <strong>{title}</strong>
          </Typography>
          {renderEditButton()}
        </Box>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  ) : (
    <Card
      elevation={3}
      sx={{
        paddingLeft: "20px",
        paddingRight: "20px",
        paddingTop: "20px",
        paddingBottom: "15px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <Typography variant="h5">
          <strong>{title}</strong>
        </Typography>
        {renderEditButton()}
      </Box>
      {children}
    </Card>
  );
};

export default InfoCard;
