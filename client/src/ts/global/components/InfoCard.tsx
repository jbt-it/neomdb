/*
 * The InfoCard component displays a card with header, edit button and information
 */
import { createStyles, makeStyles } from "@material-ui/styles";
import React from "react";
import {
  Card,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  IconButton,
  Typography,
} from "@material-ui/core";
import { Edit } from "@material-ui/icons";

/**
 * Function which proivdes the styles of the InfoCard component
 */
const useStyles = makeStyles(() =>
  createStyles({
    panelHeader: {
      display: "flex",
      width: "100%",
      justifyContent: "space-between",
      alignItems: "center",
    },
    cardHeader: {
      display: "flex",
      width: "100%",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "10px",
    },
    card: {
      paddingLeft: "20px",
      paddingRight: "20px",
      paddingTop: "20px",
      paddingBottom: "15px",
    },
  })
);

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
  const classes = useStyles();
  const { title, isEditable, handleEdit, isExpandable, defaultExpanded, children } = props;

  /**
   * Renders the edit button
   * @returns The edit button or null if `isEditable` is false
   */
  const renderEditButton = () => {
    if (isEditable && handleEdit !== undefined) {
      return (
        <IconButton onClick={(event) => handleEdit(event)}>
          <Edit fontSize="inherit" />
        </IconButton>
      );
    }
    return null;
  };

  return isExpandable ? (
    <ExpansionPanel defaultExpanded={defaultExpanded}>
      <ExpansionPanelSummary aria-controls="" id="">
        <div className={classes.panelHeader}>
          <div>
            <Typography variant="h5">
              <strong>{title}</strong>
            </Typography>
          </div>
          <div>{renderEditButton()}</div>
        </div>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>{children}</ExpansionPanelDetails>
    </ExpansionPanel>
  ) : (
    <Card elevation={3} className={classes.card}>
      <div className={classes.cardHeader}>
        <Typography variant="h5">
          <strong>{title}</strong>
        </Typography>
        <div>{renderEditButton()}</div>
      </div>
      {children}
    </Card>
  );
};

export default InfoCard;
