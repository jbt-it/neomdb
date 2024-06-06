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
}

/**
 * Component to display the customer step of the project tendering form
 * @param customerData - The customer data
 * @param setCustomerData - Function to change the customer data
 * @returns - A form to enter the customer data
 */
const CustomerStep = ({ customerData, setCustomerData, isCompleted }: CustomerStepProps) => {
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
        />
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Akquiseverantwortlicher:
        </Typography>
        <FormControl sx={{ flex: 3 }} disabled={isCompleted}>
          <Select value={acquisitor} onChange={onChangeAcquisitor} size="small">
            {allAcquisitors.map((acquisitor) => (
              <MenuItem key={acquisitor} value={acquisitor}>
                {acquisitor}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Akquisemethode:
        </Typography>
        <FormControl sx={{ flex: 3 }} disabled={isCompleted}>
          <Select value={acquisitionMethod} onChange={onChangeAquisitionMethod} size="small">
            {allAcquisitionMethods.map((method) => (
              <MenuItem key={method} value={method}>
                {method}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Akquisekanal:
        </Typography>
        <FormControl sx={{ flex: 3 }} disabled={isCompleted}>
          <FormGroup row onChange={onChangeContactChannels}>
            {allContactChannels.map((channel) => (
              <FormControlLabel
                key={channel}
                control={<Checkbox checked={contactChannels?.includes(channel)} name={channel} />}
                label={channel}
              />
            ))}
          </FormGroup>
        </FormControl>
      </Stack>
    </Stack>
  );
};

export default CustomerStep;
