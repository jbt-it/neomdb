import React, { SyntheticEvent } from "react";
import { CompanyDto, ContactPersonDto, CustomerData, IndustryDto, NewCompanyDto } from "../../types/projectTypes";
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
import useCompanies from "../../hooks/useCompanies";
import useProjects from "../../hooks/projects/useProjects";
import useResponsive from "../../hooks/useResponsive";
import { Close } from "@mui/icons-material";

interface CustomerStepProps {
  customerData: CustomerData;
  setCustomerData: React.Dispatch<React.SetStateAction<CustomerData>>;
  isCompleted?: boolean;
  errors: { [key: string]: boolean };
  isEditMode?: boolean;
}

/**
 * Component to display the customer step of the project tendering form or for the project details page
 * @param customerData - The customer data
 * @param setCustomerData - Function to change the customer data
 * @returns - A form to enter the customer data
 */
const CustomerStep = ({ customerData, setCustomerData, isCompleted, errors, isEditMode }: CustomerStepProps) => {
  const allAcquisitionMethods = ["Kunde", "Alumni", "Kurator", "Partner", "PA", "JBTler"];
  const allAcquisitors = ["Pool", "GF Winter (GFW)", "GF Sommer (GFS)"];
  const [isNewCustomerDialogOpen, setIsNewCustomerDialogOpen] = React.useState(false);
  const isMobile = useResponsive("down", "sm");

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
    newContactPerson,
    newContactPersonName,
  } = customerData;
  const { allCompanies, allContactPartners } = useCompanies();
  const { allIndustries } = useProjects();

  // Handle new customer dialog open
  const handleNewCustomerDialogOpen = () => {
    setIsNewCustomerDialogOpen(true);
  };

  // Handle save new customer
  // TODO: Implement the save new customer function when backend is ready
  const handleSaveNewCustomer = (newCustomer: NewCompanyDto) => {
    console.log(newCustomer);
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

  // Handle industry change
  const onChangeIndustry = (event: SyntheticEvent<Element, Event>, value: IndustryDto | null) => {
    setCustomerData({ ...customerData, industry: value || undefined });
  };

  // Handle change contact person
  const onChangeContactPerson = (event: SyntheticEvent<Element, Event>, value: ContactPersonDto | null) => {
    setCustomerData({
      ...customerData,
      contactPerson: value || undefined,
    });
  };

  // Handle new contact person
  const onChangeNewContactPersonName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerData({ ...customerData, newContactPersonName: event.target.value });
  };

  // Handle new contact person
  const onChangeNewContactPerson = () => {
    setCustomerData({ ...customerData, newContactPerson: true });
  };

  // Handle new contact person cancel
  const onChangeNewContactPersonCancel = () => {
    setCustomerData({ ...customerData, newContactPerson: false });
  };

  return (
    <>
      <NewCustomerDialog
        open={isNewCustomerDialogOpen}
        onClose={() => setIsNewCustomerDialogOpen(false)}
        onSave={handleSaveNewCustomer}
      />
      <Stack direction={"column"} spacing={isMobile ? 2 : 1}>
        <Stack
          direction={isMobile ? "column" : "row"}
          justifyContent={"space-between"}
          alignItems={isMobile ? "start" : "center"}
        >
          <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
            Altkunde/Neukunde:
          </Typography>
          {!isEditMode ? (
            <Typography sx={{ flex: 3 }}>{newCustomer ? "Neukunde" : "Altkunde"}</Typography>
          ) : (
            <React.Fragment>
              <Box sx={{ flex: 2 }}>
                <FormControl disabled={isCompleted}>
                  <Typography
                    variant={"caption"}
                    color={"error"}
                    sx={{ display: errors.newCustomer ? "block" : "none" }}
                  >
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
            </React.Fragment>
          )}
        </Stack>
        <Stack
          direction={isMobile ? "column" : "row"}
          justifyContent={"space-between"}
          alignItems={isMobile ? "start" : "center"}
        >
          <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
            Auftraggeber:
          </Typography>
          {!isEditMode ? (
            <Typography sx={{ flex: 3 }}>{name}</Typography>
          ) : (
            <Autocomplete
              sx={{ flex: 3, width: "100%" }}
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
          )}
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
          <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
            Geheim:
          </Typography>
          {!isEditMode ? (
            <Typography sx={{ flex: 3 }}>{classified ? "Ja" : "Nein"}</Typography>
          ) : (
            <Box sx={{ flex: isMobile ? 1 : 3, width: "100%" }}>
              <Checkbox
                sx={{ paddingLeft: 0 }}
                checked={classified}
                onChange={onChangeClassified}
                disabled={isCompleted}
              />
            </Box>
          )}
        </Stack>
        <Stack
          direction={isMobile ? "column" : "row"}
          justifyContent={"space-between"}
          alignItems={isMobile ? "start" : "center"}
        >
          <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
            Branche:
          </Typography>
          {!isEditMode ? (
            <Typography sx={{ flex: 3 }}>{industry?.description}</Typography>
          ) : (
            <Autocomplete
              sx={{ flex: 3, width: "100%" }}
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
              value={allIndustries.find((ind) => ind.industryId === industry?.industryId) || null}
              onChange={onChangeIndustry}
              size="small"
            />
          )}
        </Stack>
        <Stack
          direction={isMobile ? "column" : "row"}
          justifyContent={"space-between"}
          alignItems={isMobile ? "start" : "center"}
        >
          <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
            Kurzbeschreibung:
          </Typography>
          {!isEditMode ? (
            <Typography sx={{ flex: 3 }}>{shortDescription}</Typography>
          ) : (
            <TextField
              sx={{ flex: 3, width: "100%" }}
              variant="outlined"
              size="small"
              value={shortDescription}
              onChange={onChangeShortDescription}
              disabled={isCompleted}
              multiline
              rows={4}
              helperText={errors.shortDescription ? "Bitte gib eine Kurzbeschreibung an." : ""}
              error={errors.shortDescription}
            />
          )}
        </Stack>
        <Stack
          direction={isMobile ? "column" : "row"}
          justifyContent={"space-between"}
          alignItems={isMobile ? "start" : "center"}
        >
          <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
            Straße:
          </Typography>
          {!isEditMode ? (
            <Typography sx={{ flex: 3 }}>{street}</Typography>
          ) : (
            <TextField
              sx={{ flex: 3, width: "100%" }}
              variant="outlined"
              size="small"
              value={street}
              onChange={onChangeStreet}
              disabled={isCompleted}
            />
          )}
        </Stack>
        <Stack
          direction={isMobile ? "column" : "row"}
          justifyContent={"space-between"}
          alignItems={isMobile ? "start" : "center"}
        >
          <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
            PLZ:
          </Typography>
          {!isEditMode ? (
            <Typography sx={{ flex: 3 }}>{postalCode}</Typography>
          ) : (
            <TextField
              sx={{ flex: 3, width: "100%" }}
              variant="outlined"
              size="small"
              value={postalCode}
              onChange={onChangePostalCode}
              disabled={isCompleted}
            />
          )}
        </Stack>
        <Stack
          direction={isMobile ? "column" : "row"}
          justifyContent={"space-between"}
          alignItems={isMobile ? "start" : "center"}
        >
          <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
            Ort:
          </Typography>
          {!isEditMode ? (
            <Typography sx={{ flex: 3 }}>{city}</Typography>
          ) : (
            <TextField
              sx={{ flex: 3, width: "100%" }}
              variant="outlined"
              size="small"
              value={city}
              onChange={onChangeCity}
              disabled={isCompleted}
            />
          )}
        </Stack>
        <Stack
          direction={isMobile ? "column" : "row"}
          justifyContent={"space-between"}
          alignItems={isMobile ? "start" : "center"}
        >
          <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
            Website:
          </Typography>
          {!isEditMode ? (
            <Typography sx={{ flex: 3 }}>{url}</Typography>
          ) : (
            <TextField
              sx={{ flex: 3, width: "100%" }}
              variant="outlined"
              size="small"
              value={url}
              onChange={onChangeUrl}
              disabled={isCompleted}
            />
          )}
        </Stack>
        <Stack
          direction={isMobile ? "column" : "row"}
          justifyContent={"space-between"}
          alignItems={isMobile ? "start" : "center"}
        >
          <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
            Kontakt erwünscht:
          </Typography>
          {!isEditMode ? (
            <Typography sx={{ flex: 3 }}>{contactDesired ? "Ja" : "Nein"}</Typography>
          ) : (
            <Box sx={{ flex: 3, width: "100%" }}>
              <Checkbox
                sx={{ paddingLeft: 0 }}
                checked={contactDesired}
                onChange={handleContactDesired}
                disabled={isCompleted}
              />
            </Box>
          )}
        </Stack>
        <Stack
          direction={isMobile ? "column" : "row"}
          justifyContent={"space-between"}
          alignItems={isMobile ? "start" : "center"}
        >
          <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
            Ansprechpartner:
          </Typography>
          {!isEditMode ? (
            <Typography sx={{ flex: 3 }}>{contactPerson?.name}</Typography>
          ) : newContactPerson ? (
            <Stack direction={"row"} sx={{ flex: 3, width: "100%" }} spacing={3}>
              <TextField
                value={newContactPersonName}
                onChange={onChangeNewContactPersonName}
                variant="outlined"
                size="small"
                disabled={isCompleted}
                sx={{ flex: 7 }}
                error={errors.contactPerson}
                helperText={errors.contactPerson ? "Bitte gib einen Ansprechpartner an." : ""}
              />
              <Button variant="outlined" onClick={onChangeNewContactPersonCancel} sx={{ flex: 1, maxHeight: 40 }}>
                {isMobile ? <Close /> : "Abbrechen"}
              </Button>
            </Stack>
          ) : (
            <Stack direction={"row"} sx={{ flex: 3, width: "100%" }} spacing={3}>
              <Autocomplete
                value={allContactPartners.find((cp) => cp.contactPersonId === contactPerson?.contactPersonId) || null}
                options={allContactPartners.filter((contact) => contact.companyId === customerData.companyId)}
                getOptionLabel={(option) => option.name}
                size="small"
                onChange={onChangeContactPerson}
                disabled={isCompleted}
                sx={{ flex: 7 }}
                renderInput={(params) => (
                  <TextField
                    variant="outlined"
                    error={errors.contactPerson}
                    helperText={errors.contactPerson ? "Bitte gib einen Ansprechpartner an." : ""}
                    {...params}
                  />
                )}
              />
              <Button variant="outlined" sx={{ flex: 1, maxHeight: 40 }} onClick={onChangeNewContactPerson}>
                Neu
              </Button>
            </Stack>
          )}
        </Stack>
        <Stack
          direction={isMobile ? "column" : "row"}
          justifyContent={"space-between"}
          alignItems={isMobile ? "start" : "center"}
        >
          <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
            Akquiseverantwortlicher:
          </Typography>
          {!isEditMode ? (
            <Typography sx={{ flex: 3 }}>{acquisitor}</Typography>
          ) : (
            <FormControl sx={{ flex: 3, width: "100%" }} disabled={isCompleted} error={errors.acquisitor}>
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
          )}
        </Stack>
        <Stack
          direction={isMobile ? "column" : "row"}
          justifyContent={"space-between"}
          alignItems={isMobile ? "start" : "center"}
        >
          <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
            Akquisemethode:
          </Typography>
          {!isEditMode ? (
            <Typography sx={{ flex: 3 }}>{acquisitionMethod}</Typography>
          ) : (
            <FormControl sx={{ flex: 3, width: "100%" }} disabled={isCompleted} error={errors.acquisitionMethod}>
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
          )}
        </Stack>
      </Stack>
    </>
  );
};

export default CustomerStep;
