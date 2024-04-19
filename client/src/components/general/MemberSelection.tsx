import React from "react";
import { Autocomplete, IconButton, Stack, TextField, useTheme } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Clear from "@mui/icons-material/Clear";
import { MembersField } from "../../types/membersTypes";

/**
 * The props of the MemberSelection component
 */
interface MemberSelectionProps {
  selectedMembers: MembersField[];
  selectableMembers: MembersField[];
  memberstatus?: string[];
  onChangeCallback: (event: React.SyntheticEvent, value: MembersField | null) => void;
  addMember: () => void;
  removeMember: (mitgliedID: number) => void;
}

/**
 * The MemberSelection component is used to select members eg. for a project or an event and uses the Autocomplete component to easily select a member.
 * For each selected member a Autocomplete component is rendered. Members can be added and removed from the selection.
 * @param selectedMembers - The currently selected members state
 * @param selectableMembers - All members that can be selected as statte
 * @param memberstatus - The memberstatus of the members that can be selected eg. only trainees
 * @param onChangeCallback - The callback function that is called when the selection changes
 * @param addMember - The callback function that is called when a member is added
 * @param removeMember - The callback function that is called when a member is removed
 * @returns A React FunctionComponent
 */
const MemberSelection: React.FunctionComponent<MemberSelectionProps> = ({
  selectedMembers,
  selectableMembers,
  memberstatus,
  onChangeCallback,
  addMember,
  removeMember,
}: MemberSelectionProps) => {
  const theme = useTheme();

  const styles = {
    fieldItem: {
      flexGrow: 1,
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  };
  const options: MembersField[] = memberstatus
    ? selectableMembers.filter(
        (member) =>
          memberstatus.includes(member.mitgliedstatus) &&
          !selectedMembers.some((selectedMember) => selectedMember.mitgliedID === member.mitgliedID)
      )
    : selectableMembers.filter(
        (member) => !selectedMembers.some((selectedMember) => selectedMember.mitgliedID === member.mitgliedID)
      );

  return (
    <div>
      {selectedMembers.map((member, index) => (
        <Stack key={index} direction="row" spacing={1} marginTop={2} alignItems="center">
          <Autocomplete
            disablePortal
            autoSelect
            className={`${styles.fieldItem} `}
            id={`members-${index}`}
            options={selectableMembers}
            filterOptions={(options, state) => {
              const result = memberstatus
                ? options.filter(
                    (member) =>
                      memberstatus.includes(member.mitgliedstatus) &&
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
