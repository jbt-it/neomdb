// Type for the external project experience
export type ExternalProjectExperience = {
  description: string; // Beschreibung der Erfahrung
  duration: string; // Dauer der Erfahrung
  role: string; // Rolle im Projekt
};

// Type for the application details
export type ApplicationDetails = {
  projectId: number;
  projectName: string;
  memberId: number;
  type: string;
};
