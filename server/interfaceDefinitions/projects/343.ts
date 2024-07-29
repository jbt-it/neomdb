// Type for projects with status "Abrechnung" or "Durchführung"
export type ProjectStatus = {
  projectID: number;
  projectName: string;
  status: string;
  APda: boolean;
  APmm: boolean;
  EE: boolean;
  DL: boolean;
  An: boolean;
  BV: boolean;
  TV: boolean;
  QM: boolean;
  VfM: boolean;
  GÜ: boolean;
};

// Example data structure for projects
const projects: ProjectStatus[] = [
  {
    projectID: 1,
    projectName: 'Project Alpha',
    status: 'Durchführung',
    APda: true,
    APmm: false,
    EE: true,
    DL: true,
    An: false,
    BV: true,
    TV: false,
    QM: true,
    VfM: false,
    GÜ: true
  },
  {
    projectID: 2,
    projectName: 'Project Beta',
    status: 'Abrechnung',
    APda: false,
    APmm: true,
    EE: false,
    DL: false,
    An: true,
    BV: false,
    TV: true,
    QM: false,
    VfM: true,
    GÜ: false
  }
];