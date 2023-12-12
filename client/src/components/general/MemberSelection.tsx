import React from "react";
import { Autocomplete, IconButton, Stack, TextField, Theme, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Clear from "@mui/icons-material/Clear";
import { makeStyles, createStyles } from "@mui/styles";
import { MembersField } from "../../types/membersTypes";

interface Props {
  selectedMembers: MembersField[];
  allMembers: MembersField[];
  mitgliedstatus?: number[];
  onChangeCallback: (event: React.SyntheticEvent, value: MembersField | null, reason: string) => void;
  addMember: () => void;
  removeMember: (mitgliedID: number) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fieldItem: {
      flexGrow: 1,
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  })
);

/**
 * The MemberSelection component is used to select members eg. for a project or an event and uses the Autocomplete component to easily select a member.
 * For each selected member a Autocomplete component is rendered. Members can be added and removed from the selection.
 * @param props - The properties of the component
 * @param props.selectedMembers - The currently selected members state
 * @param props.allMembers - All members that can be selected as statte
 * @param props.mitgliedstatus - The mitgliedstatus of the members that can be selected eg. only trainees
 * @param props.onChangeCallback - The callback function that is called when the selection changes
 * @param props.addMember - The callback function that is called when a member is added
 * @param props.removeMember - The callback function that is called when a member is removed
 * @returns A React FunctionComponent
 */

const MemberSelection = (props: Props) => {
  const classes = useStyles();
  const { selectedMembers, allMembers, mitgliedstatus, onChangeCallback, addMember, removeMember } = props;
  const options: MembersField[] = mitgliedstatus
    ? allMembers.filter(
        (member) =>
          mitgliedstatus.includes(member.mitgliedstatus) &&
          !selectedMembers.some((selectedMember) => selectedMember.mitgliedID === member.mitgliedID)
      )
    : allMembers.filter(
        (member) => !selectedMembers.some((selectedMember) => selectedMember.mitgliedID === member.mitgliedID)
      );

  return (
    <div>
      {selectedMembers.map((member, index) => (
        <Stack key={index} direction="row" spacing={1} marginTop={2} alignItems="center">
          <Autocomplete
            disablePortal
            autoSelect
            className={`${classes.fieldItem} `}
            id={`members-${index}`}
            options={allMembers}
            filterOptions={(options, state) => {
              const result = mitgliedstatus
                ? options.filter(
                    (member) =>
                      mitgliedstatus.includes(member.mitgliedstatus) &&
                      !selectedMembers.some((selectedMember) => selectedMember.mitgliedID === member.mitgliedID) &&
                      member.name.toLowerCase().includes(state.inputValue.toLowerCase())
                  )
                : options.filter(
                    (member) =>
                      !selectedMembers.some((selectedMember) => selectedMember.mitgliedID === member.mitgliedID) &&
                      member.name.toLowerCase().includes(state.inputValue.toLowerCase())
                  );
              return result;
            }}
            getOptionLabel={(option: MembersField) => option.name || ""}
            value={member}
            onChange={onChangeCallback}
            clearOnBlur={false}
            isOptionEqualToValue={(option: MembersField, value: MembersField) => option.mitgliedID === value.mitgliedID}
            renderInput={(params) => <TextField {...params} label="Name" variant="outlined" data-id={index} />}
            noOptionsText={"Keine Auswahl verfügbar"}
          />
          <IconButton onClick={() => removeMember(member.mitgliedID)} aria-label="delete" color="primary">
            <Clear />
          </IconButton>
        </Stack>
      ))}
      <IconButton onClick={() => addMember()} aria-label="add" color="primary" disabled={options.length === 0}>
        <AddCircleOutlineIcon />
      </IconButton>
    </div>
  );
};

export default MemberSelection;
