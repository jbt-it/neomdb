// Type for document confirmation
export type DocumentConfirmation = {
  finalPresentationAndReferenceSlideAvailable: boolean;
  finalPresentationHeld: boolean;
  evaluationResultsAvailable: boolean;
  documentationGuideAvailable: boolean;
  offerInAlfresco: boolean;
  deviationFromStandard: boolean;
  consultingContractAvailable: boolean;
  teamContractAvailable: boolean;
  QMReleased: boolean;
  fullyEnteredInCRM: boolean;
  paymentDelay: boolean;
  moneyReceived: boolean;
  // ... and so on for each document and transaction listed
};

// Type for project billing information
export type ProjectBillingInfo = {
  netSalesPrice: number;
  soldConsultingDays: number;
  consultingDayRate: number;
  netSalesPriceCalculation: string;
  expenses: number;
  valueAddedTax: number;
  invoiceAmount: number;
  commissionToAssociation: number;
};

// Type for team division details
export type DivisionDetails = {
  totalBT: number;
  expenses: number;
  sum: number;
};

// Type for team division recipients
export type TeamDivisionRecipient = {
  member: MembersField;
  bt: number;
  expenses: number;
  sum: number;
};

// GET team division
export type TeamDivision = {
  divisionDetails: DivisionDetails;
  recipients: TeamDivisionRecipient[];
};

// POST recipients
export type PostRecipients = TeamDivisionRecipient[];

// Type for project members
export type ProjectMembers = {
  freelancerContract: string;
  moneyTransfered: number;
};