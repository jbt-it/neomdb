import { CompanyDto, IndustryDto } from "../types/projectTypes";

const useCompanies = () => {
  const allCompanies = [
    {
      companyId: 3,
      name: "Dinosaurier Datenrettung GmbH",
      industry: {
        industryId: 9,
        description: "Automobilindustrie, Zulieferer",
      } as IndustryDto,
    },
    {
      companyId: 4,
      name: "Yeti Yogurt GmbH",
      industry: {
        industryId: 12,
        description: "Bergbau, Metallgewerbe",
      } as IndustryDto,
    },
    {
      companyId: 5,
      name: "Lama Investment Solutions GmbH",
      industry: {
        industryId: 10,
        description: "Banken, Finanzen, Versicherungen",
      } as IndustryDto,
    },
    {
      companyId: 6,
      name: "Roboter Rasenmäher GmbH",
      industry: {
        industryId: 15,
        description: "Elektronik, Elektrotechnik, Technik",
      } as IndustryDto,
    },
    {
      companyId: 7,
      name: "Einhorn Energie GmbH",
      industry: {
        industryId: 15,
        description: "Elektronik, Elektrotechnik, Technik",
      } as IndustryDto,
    },
    {
      companyId: 8,
      name: "Koala Kaffeekultur GmbH",
      industry: {
        industryId: 9,
        description: "Automobilindustrie, Zulieferer",
      } as IndustryDto,
    },
    {
      companyId: 9,
      name: "Flamingo Finanzberatung GmbH",
      industry: {
        industryId: 10,
        description: "Banken, Finanzen, Versicherungen",
      } as IndustryDto,
    },
    {
      companyId: 10,
      name: "Pinguin Patisserie GmbH",
      industry: {
        industryId: 15,
        description: "Elektronik, Elektrotechnik, Technik",
      } as IndustryDto,
    },
    {
      companyId: 11,
      name: "Schildkröte Sicherheitssysteme GmbH",
      industry: {
        industryId: 15,
        description: "Elektronik, Elektrotechnik, Technik",
      } as IndustryDto,
    },
    {
      companyId: 12,
      name: "Känguru Komfortklima GmbH",
      industry: {
        industryId: 44,
        description: "Eventmanagement",
      } as IndustryDto,
    },
  ] as CompanyDto[];

  return { allCompanies };
};

export default useCompanies;
