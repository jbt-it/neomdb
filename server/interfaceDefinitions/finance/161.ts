type SEPAProcessPage = {
    permissionRequired: string, // this page is only displayed if the user has permission “finance data”
    generalDirectDebitComponent: GeneralDirectDebitComponent, // general direct debit component
    informationText: string, // the following information text is displayed
    membershipFeeContent: MembershipFeeContent // specific content for membership fee
}

type GeneralDirectDebitComponent = {
    buttons: Buttons, // two buttons are displayed
    mailWarning: MailWarning // warning regarding emails
}

type Buttons = {
    cancel: ButtonAction, // "cancel" redirects back to Client: Finance Main Page #159
    createSEPAXML: ButtonAction // "create SEPA XML" creates a xml file ("Lastschrift-Sammler") that is downloaded by the user and can be uploaded with the bank
}

type ButtonAction = {
    label: string, // Button label
    action: string // Button action description
}

type MailWarning = {
    mailSendingOption: string, // if "Mails versenden" is on "yes"/"no"
    warningMessage: string, // Warning message displayed
    userChoice: UserChoice // User choices
}

type UserChoice = {
    confirm: string, // if the user chooses "confirm"
    cancel: string // if the user chooses "cancel"
}

type MembershipFeeContent = {
    inputFields: Array<InputField>, // multiple input fields are displayed
    memberTable: MemberTable // a table with all members is displayed
}

type InputField = {
    fieldName: string, // Field name
    defaultValue: string // Default value
}

type MemberTable = {
    attributes: Array<Attribute>, // attributes displayed for each member
    filters: Filters, // Filters for the list
    actions: TableActions // Actions on the table
}

type Attribute = {
    name: string, // Attribute name
    type: string // Type of the attribute (e.g., text, checkbox)
}

type Filters = {
    statusDropdown: string, // Filter by status (dropdown)
    nameText: string // Filter by name (free text)
}

type TableActions = {
    memberProfileRedirect: string, // clicking on the name of the member redirects to the member profile page
    changeCheckboxes: string, // the user can change the checkboxes
    downloadCSV: string, // download of the filtered table as csv file is possible
    deselectAll: string // a button "deselect all" unticks all checkboxes
}

const sepaProcessPage = {
    permissionRequired: "finance data",
    generalDirectDebitComponent: {
        buttons: {
            cancel: {
                label: "cancel",
                action: "redirects back to Client: Finance Main Page #159"
            },
            createSEPAXML: {
                label: "create SEPA XML",
                action: "creates a xml file ('Lastschrift-Sammler') that is downloaded by the user and can be uploaded with the bank"
            }
        },
        mailWarning: {
            mailSendingOption: "yes",
            warningMessage: "a warning is displayed, that an informing email is sent to every selected member",
            userChoice: {
                confirm: "the mails are sent and the xml file is created and downloaded",
                cancel: "the process is instead aborted"
            }
        }
    },
    informationText: "Wichtige Information: ...",
    membershipFeeContent: {
        inputFields: [
            {
                fieldName: "Verwendungszweck",
                defaultValue: "default text with the current year"
            },
            {
                fieldName: "ID der Abbuchung",
                defaultValue: "default ID with the current year"
            },
            {
                fieldName: "Abbuchungsdatum",
                defaultValue: "default date that is calculated to be far enough in the future to comply with the law"
            },
            {
                fieldName: "Mails versenden (beim Klick auf SEPA-XML erstellen)",
                defaultValue: "yes / no (radio button)"
            }
        ],
        memberTable: {
            attributes: [
                {
                    name: "lastname",
                    type: "text"
                },
                {
                    name: "firstname",
                    type: "text"
                },
                {
                    name: "status",
                    type: "text"
                },
                {
                    name: "selected",
                    type: "checkbox"
                }
            ],
            filters: {
                statusDropdown: "status (dropdown)",
                nameText: "name (free text)"
            },
            actions: {
                memberProfileRedirect: "clicking on the name of the member redirects to the member profile page",
                changeCheckboxes: "this information is used for the 'create SEPA XML' process. It is not saved if the user leaves this page",
                downloadCSV: "download of the filtered table as csv file is possible",
                deselectAll: "a button 'deselect all' unticks all checkboxes"
            }
        }
    }
}