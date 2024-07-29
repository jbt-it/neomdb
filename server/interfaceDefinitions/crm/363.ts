// Type for company details
export type CompanyDetails = {
  name: string; // Name
  industry: string; // Branche
  website: string; // Webseite
  numberOfProjects: number; // #Proj.
  potential: string; // Potenzial
};

// Example data structure for company details
const exampleCompanyDetails: CompanyDetails = {
  name: 'Example Company',
  industry: 'Technology',
  website: 'https://www.example.com',
  numberOfProjects: 10,
  potential: 'High'
};