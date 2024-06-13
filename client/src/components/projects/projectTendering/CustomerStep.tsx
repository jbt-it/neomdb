import React, { SyntheticEvent } from "react";
import { CompanyDto, ContactPersonDto, CustomerData, IndustryDto, NewCompanyDto } from "../../../types/projectTypes";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import NewCustomerDialog from "./NewCustomerDialog";
import useCompanies from "../../../hooks/useCompanies";
import useProjects from "../../../hooks/useProjects";

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
  const allAcquisitionMethods = ["Kunde", "Alumni", "Kurator", "Partner", "PA", "JBTler"];
  const allAcquisitors = ["Pool", "GF Winter (GFW)", "GF Sommer (GFS)"];
  const [isNewCustomerDialogOpen, setIsNewCustomerDialogOpen] = React.useState(false);

  const {
    name,
    shortDescription,
    newCustomer,
    acquisitor,
    acquisitionMethod,
    classified,
    contactDesired,
    street,
    postalCode,
    city,
    url,
    contactPerson,
    industry,
  } = customerData;
  const { allCompanies, allContactPartners } = useCompanies();
  const { allIndustries } = useProjects();

  // Handle new customer dialog open
  const handleNewCustomerDialogOpen = () => {
    setIsNewCustomerDialogOpen(true);
  };

  // Handle save new customer
  const handleSaveNewCustomer = (newCustomer: NewCompanyDto) => {
    setCustomerData({
      ...customerData,
      name: newCustomer.name,
      newCustomer: true,
      acquisitor: "",
      acquisitionMethod: "",
    });
    setIsNewCustomerDialogOpen(false);
  };

  // Handle classified change
  const onChangeClassified = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerData({ ...customerData, classified: event.target.checked });
  };

  // Handle contact desired change
  const handleContactDesired = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerData({ ...customerData, contactDesired: event.target.checked });
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

  // Handle street change
  const onChangeStreet = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerData({ ...customerData, street: event.target.value });
  };

  // Handle postal code change
  const onChangePostalCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerData({ ...customerData, postalCode: event.target.value });
  };

  // Handle city change
  const onChangeCity = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerData({ ...customerData, city: event.target.value });
  };

  // Handle url change
  const onChangeUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerData({ ...customerData, url: event.target.value });
  };

  // Handle industry change
  const onChangeIndustry = (event: SyntheticEvent<Element, Event>, value: IndustryDto | null) => {
    setCustomerData({ ...customerData, industry: value || undefined });
  };

  // Handle customer data change
  const onChangeCustomerData = (event: SyntheticEvent<Element, Event>, value: CompanyDto | null) => {
    setCustomerData({
      ...customerData,
      name: value?.name || "",
      companyId: value?.companyId || -1,
      shortDescription: value?.shortDescription || "",
      street: value?.street || "",
      postalCode: value?.postalCode || "",
      city: value?.city || "",
      addressAdditional: value?.addressAdditional || "",
      url: value?.url || "",
      importantInformation: value?.importantInformation || "",
      contactDesired: value?.contactDesired || false,
      classified: value?.classified || false,
      industry: value?.industry || undefined,
      contactPerson: undefined,
    });
  };

  // Handle change contact person
  const onChangeContactPerson = (event: SyntheticEvent<Element, Event>, value: ContactPersonDto | null) => {
    setCustomerData({
      ...customerData,
      contactPerson: value || undefined,
    });
  };

  return (
    <>
      <NewCustomerDialog
        open={isNewCustomerDialogOpen}
        onClose={() => setIsNewCustomerDialogOpen(false)}
        onSave={handleSaveNewCustomer}
      />
      <Stack direction={"column"} spacing={1}>
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
          <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
            Altkunde/Neukunde:
          </Typography>
          <Box sx={{ flex: 2 }}>
            <FormControl disabled={isCompleted}>
              <Typography variant={"caption"} color={"error"} sx={{ display: errors.newCustomer ? "block" : "none" }}>
                Bitte wählen Sie eine Option aus.
              </Typography>
              <RadioGroup row value={newCustomer} onChange={onChangeNewCustomer}>
                <FormControlLabel value={false} control={<Radio />} label="Altkunde" />
                <FormControlLabel value={true} control={<Radio />} label="Neukunde" />
              </RadioGroup>
            </FormControl>
          </Box>
          <Button variant="outlined" onClick={handleNewCustomerDialogOpen}>
            Neuen Kunden erstellen
          </Button>
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
          <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
            Auftraggeber:
          </Typography>
          <Autocomplete
            sx={{ flex: 3 }}
            size="small"
            renderInput={(params) => (
              <TextField
                variant="outlined"
                error={errors.customer}
                helperText={errors.customer ? "Bitte gib einen Auftraggeber an." : ""}
                {...params}
              />
            )}
            value={allCompanies.find((company) => company.name === name) || null}
            onChange={onChangeCustomerData}
            disabled={isCompleted}
            options={allCompanies}
            getOptionLabel={(option) => option.name}
          />
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
          <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
            Geheim:
          </Typography>
          <Box sx={{ flex: 3 }}>
            <Checkbox sx={{ paddingLeft: 0 }} value={classified} onChange={onChangeClassified} disabled={isCompleted} />
          </Box>
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
          <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
            Branche:
          </Typography>
          <Autocomplete
            sx={{ flex: 3 }}
            disabled={isCompleted}
            renderInput={(params) => (
              <TextField
                variant="outlined"
                error={errors.industry}
                helperText={errors.industry ? "Bitte wähle eine Branche aus." : ""}
                {...params}
              />
            )}
            options={allIndustries}
            getOptionLabel={(option) => option.description}
            value={industry}
            onChange={onChangeIndustry}
            size="small"
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
            helperText={errors.shortDescription ? "Bitte gib eine Kurzbeschreibung an." : ""}
            error={errors.shortDescription}
          />
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
          <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
            Straße:
          </Typography>
          <TextField
            sx={{ flex: 3 }}
            variant="outlined"
            size="small"
            value={street}
            onChange={onChangeStreet}
            disabled={isCompleted}
          />
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
          <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
            PLZ:
          </Typography>
          <TextField
            sx={{ flex: 3 }}
            variant="outlined"
            size="small"
            value={postalCode}
            onChange={onChangePostalCode}
            disabled={isCompleted}
          />
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
          <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
            Ort:
          </Typography>
          <TextField
            sx={{ flex: 3 }}
            variant="outlined"
            size="small"
            value={city}
            onChange={onChangeCity}
            disabled={isCompleted}
          />
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
          <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
            Website:
          </Typography>
          <TextField
            sx={{ flex: 3 }}
            variant="outlined"
            size="small"
            value={url}
            onChange={onChangeUrl}
            disabled={isCompleted}
          />
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
          <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
            Kontakt erwünscht:
          </Typography>
          <Box sx={{ flex: 3 }}>
            <Checkbox
              sx={{ paddingLeft: 0 }}
              value={contactDesired}
              onChange={handleContactDesired}
              disabled={isCompleted}
            />
          </Box>
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
          <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
            Ansprechpartner:
          </Typography>
          <Autocomplete
            sx={{ flex: 3 }}
            value={contactPerson}
            options={allContactPartners.filter((contact) => contact.companyId === customerData.companyId)}
            getOptionLabel={(option) => option.name}
            size="small"
            onChange={onChangeContactPerson}
            disabled={isCompleted}
            renderInput={(params) => (
              <TextField
                variant="outlined"
                error={errors.contactPerson}
                helperText={errors.industryError ? "Bitte gib einen Ansprechpartner an." : ""}
                {...params}
              />
            )}
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
      </Stack>
    </>
  );
};

export default CustomerStep;
