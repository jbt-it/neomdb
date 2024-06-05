import React from "react";
import { CustomerData } from "../../../types/projectTypes";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

interface CustomerStepProps {
  customerData: CustomerData;
  setCustomerData: React.Dispatch<React.SetStateAction<CustomerData>>;
}

const CustomerStep = ({ customerData, setCustomerData }: CustomerStepProps) => {
  const allContactChannels = [
    "Außenauftritt (online, offline)",
    "Netzwerkveranstaltungen (BVMW, IT-Brunch, ...)",
    "Empfehlungen (alte Kunden, ...)",
    "Sonstiges",
  ];
  const { customerName, shortDescription, newCustomer, acquisitor, acquisitionMethod, contactChannels } = customerData;

  const onChangeCustomerName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerData({ ...customerData, customerName: event.target.value });
  };

  const onChangeContactChannels = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
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
        <FormControl sx={{ flex: 3 }}>
          <RadioGroup row>
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
          value={customerName}
          onChange={onChangeCustomerName}
        />
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Akquiseverantwortlicher:
        </Typography>
        <TextField
          sx={{ flex: 3 }}
          variant="outlined"
          size="small"
          value={customerName}
          onChange={onChangeCustomerName}
        />
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Akquisemethode:
        </Typography>
        <TextField
          sx={{ flex: 3 }}
          variant="outlined"
          size="small"
          value={customerName}
          onChange={onChangeCustomerName}
        />
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Akquisekanal:
        </Typography>
        <FormControl sx={{ flex: 3 }}>
          <FormGroup row>
            {allContactChannels.map((channel) => (
              <FormControlLabel
                key={channel}
                control={
                  <Checkbox
                    checked={contactChannels?.includes(channel)}
                    onChange={onChangeContactChannels}
                    name={channel}
                  />
                }
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
