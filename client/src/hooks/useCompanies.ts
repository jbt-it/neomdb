import { CompanyDto, CompanyShortDto, ContactPersonDto, IndustryDto } from "../types/projectTypes";

const useCompanies = () => {
  const allCompaniesShort = [
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
  ] as CompanyShortDto[];

  const allCompanies = [
    {
      companyId: 3,
      name: "Dinosaurier Datenrettung GmbH",
      industry: {
        industryId: 9,
        description: "Automobilindustrie, Zulieferer",
      },
      shortDescription: "Datenwiederherstellung für Automobilzulieferer",
      street: "Industrieweg 5",
      postalCode: "10115",
      city: "Berlin",
      addressAdditional: "Gebäude A2",
      url: "http://www.dinosaurier-datenrettung.de",
      importantInformation: "ISO 27001 zertifiziert",
      contactDesired: true,
      classified: false,
    },
    {
      companyId: 4,
      name: "Yeti Yogurt GmbH",
      industry: {
        industryId: 12,
        description: "Bergbau, Metallgewerbe",
      },
      shortDescription: "Nachhaltige Milchprodukte",
      street: "Alpenstraße 30",
      postalCode: "80333",
      city: "München",
      addressAdditional: "",
      url: "http://www.yetiyogurt.de",
      importantInformation: "100% Bio-Produkte",
      contactDesired: true,
      classified: true,
    },
    {
      companyId: 5,
      name: "Lama Investment Solutions GmbH",
      industry: {
        industryId: 10,
        description: "Banken, Finanzen, Versicherungen",
      },
      shortDescription: "Investmentberatung und Finanzmanagement",
      street: "Finanzplatz 1",
      postalCode: "60313",
      city: "Frankfurt am Main",
      addressAdditional: "Turm 18",
      url: "http://www.lamainvestments.de",
      importantInformation: "Spezialisiert auf nachhaltige Investments",
      contactDesired: true,
      classified: false,
    },
    {
      companyId: 6,
      name: "Roboter Rasenmäher GmbH",
      industry: {
        industryId: 15,
        description: "Elektronik, Elektrotechnik, Technik",
      },
      shortDescription: "Hersteller von autonomen Rasenmähern",
      street: "Technikweg 42",
      postalCode: "70469",
      city: "Stuttgart",
      addressAdditional: "",
      url: "http://www.roboterrasenmaeher.de",
      importantInformation: "Führende Technologie in Roboter-Gartenpflege",
      contactDesired: false,
      classified: true,
    },
    {
      companyId: 7,
      name: "Einhorn Energie GmbH",
      industry: {
        industryId: 15,
        description: "Elektronik, Elektrotechnik, Technik",
      },
      shortDescription: "Innovative Energielösungen für Unternehmen",
      street: "Energiestraße 88",
      postalCode: "20539",
      city: "Hamburg",
      addressAdditional: "Haus B",
      url: "http://www.einhornenergie.de",
      importantInformation: "Spezialist für solare Energielösungen",
      contactDesired: true,
      classified: false,
    },
    {
      companyId: 8,
      name: "Koala Kaffeekultur GmbH",
      industry: {
        industryId: 9,
        description: "Automobilindustrie, Zulieferer",
      },
      shortDescription: "Premium Kaffee und Espresso",
      street: "Kaffeeplatz 27",
      postalCode: "50667",
      city: "Köln",
      addressAdditional: "",
      url: "http://www.koalakaffeekultur.de",
      importantInformation: "Bietet auch Barista-Schulungen an",
      contactDesired: false,
      classified: true,
    },
    {
      companyId: 9,
      name: "Flamingo Finanzberatung GmbH",
      industry: {
        industryId: 10,
        description: "Banken, Finanzen, Versicherungen",
      },
      shortDescription: "Finanzplanung und -beratung",
      street: "Bankenviertel 15",
      postalCode: "40213",
      city: "Düsseldorf",
      addressAdditional: "",
      url: "http://www.flamingofinanz.de",
      importantInformation: "Spezialisiert auf private Finanzberatung",
      contactDesired: true,
      classified: false,
    },
    {
      companyId: 10,
      name: "Pinguin Patisserie GmbH",
      industry: {
        industryId: 15,
        description: "Elektronik, Elektrotechnik, Technik",
      },
      shortDescription: "Hochwertige Backwaren und Torten",
      street: "Backstraße 9",
      postalCode: "10179",
      city: "Berlin",
      addressAdditional: "",
      url: "http://www.pinguinpatisserie.de",
      importantInformation: "Beliefert auch Events und Feiern",
      contactDesired: false,
      classified: true,
    },
    {
      companyId: 11,
      name: "Schildkröte Sicherheitssysteme GmbH",
      industry: {
        industryId: 15,
        description: "Elektronik, Elektrotechnik, Technik",
      },
      shortDescription: "Sicherheitstechnik und Überwachungssysteme",
      street: "Sicherheitsallee 3",
      postalCode: "76133",
      city: "Karlsruhe",
      addressAdditional: "Sicherheitszentrum 2",
      url: "http://www.schildkroetesicherheit.de",
      importantInformation: "24/7 Überwachungsdienste",
      contactDesired: true,
      classified: false,
    },
    {
      companyId: 12,
      name: "Känguru Komfortklima GmbH",
      industry: {
        industryId: 44,
        description: "Eventmanagement",
      },
      shortDescription: "Klimasysteme für Großveranstaltungen",
      street: "Eventstraße 22",
      postalCode: "50678",
      city: "Köln",
      addressAdditional: "Nebengebäude 5",
      url: "http://www.kängurukomfortklima.de",
      importantInformation: "Spezialisiert auf Outdoor-Events",
      contactDesired: false,
      classified: true,
    },
  ] as CompanyDto[];

  const allContactPartners = [
    {
      contactPersonId: 1,
      companyId: 3,
      name: "Max Mustermann",
    },
    {
      contactPersonId: 2,
      companyId: 3,
      name: "Erika Musterfrau",
    },
    {
      contactPersonId: 3,
      companyId: 4,
      name: "Hans Dampf",
    },
    {
      contactPersonId: 4,
      companyId: 6,
      name: "Anna Schmidt",
    },
    {
      contactPersonId: 5,
      companyId: 6,
      name: "Peter Lustig",
    },
    {
      contactPersonId: 6,
      companyId: 7,
      name: "Klara Müller",
    },
    {
      contactPersonId: 7,
      companyId: 7,
      name: "Karl Kaffee",
    },
    {
      contactPersonId: 8,
      companyId: 7,
      name: "Lena Finanz",
    },
    {
      contactPersonId: 9,
      companyId: 7,
      name: "Paula Pinguin",
    },
    {
      contactPersonId: 10,
      companyId: 11,
      name: "Sascha Schildkröte",
    },
    {
      contactPersonId: 11,
      companyId: 11,
      name: "Kai Känguru",
    },
  ] as ContactPersonDto[];

  return { allCompanies, allCompaniesShort, allContactPartners };
};

export default useCompanies;
