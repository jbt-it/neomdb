import React from "react";
import { Autocomplete, IconButton, Stack, TextField, useTheme } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Clear from "@mui/icons-material/Clear";
import { MembersFieldDto } from "../../types/membersTypes";
/**
 * The props of the MemberSelection component
 */
interface MemberSelectionProps {
  selectedMembers: MembersFieldDto[];
  selectableMembers: MembersFieldDto[];
  memberstatus?: string[];
  onChangeCallback: (event: React.SyntheticEvent, value: MembersFieldDto | null) => void;
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
  const options: MembersFieldDto[] = selectableMembers.filter((member) => {
    // Exclude members that are already selected
    const isAlreadySelected = selectedMembers.some((selectedMember) => selectedMember.memberId === member.memberId);
    if (isAlreadySelected) {
      return false;
    }

    // If memberstatus is defined, only include members with a matching status
    if (memberstatus) {
      const hasMatchingStatus = memberstatus.includes(member.memberStatus?.name || "");
      return hasMatchingStatus;
    }

    // If memberstatus is not defined, include all members
    return true;
  });
  const theme = useTheme();

  const styles = {
    fieldItem: {
      flexGrow: 1,
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  };

  return (
    <div>
      {selectedMembers.map((member, index) => (
        <Stack key={index} direction="row" spacing={1} marginTop={2} alignItems="center">
          <Autocomplete
            disablePortal
            autoSelect
            sx={styles.fieldItem}
            id={`members-${index}`}
            options={selectableMembers}
            filterOptions={(options, state) => {
              const isMemberStatusIncluded = (member: MembersFieldDto) =>
                memberstatus ? memberstatus.includes(member.memberStatus?.name || "") : true;

              const isMemberNotSelected = (member: MembersFieldDto) =>
                !selectedMembers.some((selectedMember) => selectedMember.memberId === member.memberId);

              const isMemberNameIncluded = (member: MembersFieldDto) =>
                (member.firstname.toLowerCase() + " " + member.lastname.toLowerCase()).includes(
                  state.inputValue.toLowerCase()
                );

              const result = options.filter(
                (member) =>
                  isMemberStatusIncluded(member) && isMemberNotSelected(member) && isMemberNameIncluded(member)
              );

              return result;
            }}
            getOptionLabel={(option: MembersFieldDto) =>
              option.firstname && option.lastname ? `${option.firstname} ${option.lastname}` : ""
            }
            value={member}
            onChange={onChangeCallback}
            clearOnBlur={false}
            isOptionEqualToValue={(option: MembersFieldDto, value: MembersFieldDto) =>
              option.memberId === value.memberId
            }
            renderInput={(params) => <TextField {...params} label="Name" variant="outlined" data-id={index} />}
            noOptionsText={"Keine Auswahl verfügbar"}
          />
          <IconButton onClick={() => removeMember(member.memberId)} aria-label="delete" color="primary">
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
