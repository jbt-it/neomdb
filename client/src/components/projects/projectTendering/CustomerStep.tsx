import React from "react";
import { CustomerData } from "../../../types/projectTypes";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

interface CustomerStepProps {
  customerData: CustomerData;
  setCustomerData: React.Dispatch<React.SetStateAction<CustomerData>>;
  isCompleted: boolean;
  errors: { [key: string]: boolean };
}

/**
 * Component to display the customer step of the project tendering form
 * @param customerData - The customer data
 * @param setCustomerData - Function to change the customer data
 * @returns - A form to enter the customer data
 */
const CustomerStep = ({ customerData, setCustomerData, isCompleted, errors }: CustomerStepProps) => {
  const allContactChannels = [
    "Außenauftritt (online, offline)",
    "Netzwerkveranstaltungen (BVMW, IT-Brunch, ...)",
    "Empfehlungen (alte Kunden, ...)",
    "Sonstiges",
  ];
  const allAcquisitionMethods = ["Kunde", "Alumni", "Kurator", "Partner", "PA", "JBTler"];
  const allAcquisitors = ["Pool", "GF Winter (GFW)", "GF Sommer (GFS)"];

  const { customerName, shortDescription, newCustomer, acquisitor, acquisitionMethod, contactChannels } = customerData;

  // Handle customer name change
  const onChangeCustomerName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerData({ ...customerData, customerName: event.target.value });
  };

  // Handle short description change
  const onChangeShortDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerData({ ...customerData, shortDescription: event.target.value });
  };

  // Handle new customer change
  const onChangeNewCustomer = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerData({ ...customerData, newCustomer: event.target.value === "true" });
  };

  // Handle acquisitor change
  const onChangeAcquisitor = (event: SelectChangeEvent<string>) => {
    setCustomerData({ ...customerData, acquisitor: event.target.value as string });
  };

  // Handle acquisition method change
  const onChangeAquisitionMethod = (event: SelectChangeEvent<string>) => {
    setCustomerData({ ...customerData, acquisitionMethod: event.target.value as string });
  };

  // Handle contact channels change
  const onChangeContactChannels = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    if (!contactChannels) {
      setCustomerData({ ...customerData, contactChannels: [name] });
    }
    if (contactChannels) {
      if (contactChannels.includes(name)) {
        setCustomerData({ ...customerData, contactChannels: contactChannels.filter((channel) => channel !== name) });
      } else {
        setCustomerData({ ...customerData, contactChannels: [...contactChannels, name] });
      }
    }
  };

  return (
    <Stack direction={"column"} spacing={1}>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Altkunde/Neukunde:
        </Typography>
        <FormControl sx={{ flex: 3 }} disabled={isCompleted}>
          <Typography variant={"caption"} color={"error"} sx={{ display: errors.newCustomer ? "block" : "none" }}>
            Bitte wählen Sie eine Option aus.
          </Typography>
          <RadioGroup row value={newCustomer} onChange={onChangeNewCustomer}>
            <FormControlLabel value={false} control={<Radio />} label="Altkunde" />
            <FormControlLabel value={true} control={<Radio />} label="Neukunde" />
          </RadioGroup>
        </FormControl>
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Auftraggeber:
        </Typography>
        <TextField
          sx={{ flex: 3 }}
          variant="outlined"
          size="small"
          value={customerName}
          onChange={onChangeCustomerName}
          disabled={isCompleted}
          helperText={errors.customerName ? "Bitte geben Sie einen Auftraggeber an." : ""}
          error={errors.customerName}
        />
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Kurzbeschreibung:
        </Typography>
        <TextField
          sx={{ flex: 3 }}
          variant="outlined"
          size="small"
          value={shortDescription}
          onChange={onChangeShortDescription}
          disabled={isCompleted}
          helperText={errors.shortDescription ? "Bitte geben Sie eine Kurzbeschreibung an." : ""}
          error={errors.shortDescription}
        />
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Akquiseverantwortlicher:
        </Typography>
        <FormControl sx={{ flex: 3 }} disabled={isCompleted} error={errors.acquisitor}>
          <Select value={acquisitor} onChange={onChangeAcquisitor} size="small">
            {allAcquisitors.map((acquisitor) => (
              <MenuItem key={acquisitor} value={acquisitor}>
                {acquisitor}
              </MenuItem>
            ))}
          </Select>
          <Typography
            variant={"caption"}
            color={"error"}
            sx={{ display: errors.acquisitor ? "block" : "none", marginLeft: 2 }}
          >
            Bitte wählen Sie eine Option aus.
          </Typography>
        </FormControl>
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Akquisemethode:
        </Typography>
        <FormControl sx={{ flex: 3 }} disabled={isCompleted} error={errors.acquisitionMethod}>
          <Select value={acquisitionMethod} onChange={onChangeAquisitionMethod} size="small">
            {allAcquisitionMethods.map((method) => (
              <MenuItem key={method} value={method}>
                {method}
              </MenuItem>
            ))}
          </Select>
          <Typography
            variant={"caption"}
            color={"error"}
            sx={{ display: errors.acquisitionMethod ? "block" : "none", marginLeft: 2 }}
          >
            Bitte wählen Sie eine Option aus.
          </Typography>
        </FormControl>
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Akquisekanal:
        </Typography>
        <FormControl
          sx={{ flex: 3 }}
          disabled={isCompleted}
          error={errors.contactChannels && contactChannels?.length === 0}
        >
          <FormGroup row onChange={onChangeContactChannels}>
            {allContactChannels.map((channel) => (
              <FormControlLabel
                key={channel}
                control={<Checkbox checked={contactChannels?.includes(channel)} name={channel} />}
                label={channel}
              />
            ))}
          </FormGroup>
          <Typography
            variant={"caption"}
            color={"error"}
            sx={{ display: errors.contactChannels && contactChannels?.length === 0 ? "block" : "none" }}
          >
            Bitte wählen Sie mindestens einen Kanal aus.
          </Typography>
        </FormControl>
      </Stack>
    </Stack>
  );
};

export default CustomerStep;
