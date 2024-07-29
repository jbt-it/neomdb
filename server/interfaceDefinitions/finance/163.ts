type SEPAProcessPage = {
    permissionRequired: string, // this page is only displayed if the user has permission “finance data”
    generalDirectDebitComponent: GeneralDirectDebitComponent, // general direct debit component
    informationText: string, // the following information text is displayed
    wwFeeContent: WWFeeContent // specific content for ww-fee
}

type GeneralDirectDebitComponent = {
    description: string // see description of Client: Membershipfee #161 for details
}

type WWFeeContent = {
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
    type: string, // Type of the attribute (e.g., text, checkbox, radio button)
    options?: Array<string> // Options for radio buttons
}

type Filters = {
    statusDropdown: string, // Filter by status (dropdown)
    nameText: string // Filter by name (free text)
}

type TableActions = {
    memberProfileRedirect: string, // clicking on the name of the member redirects to the member profile page
    changeRadioButtons: string, // the user can change the radio buttons
    downloadCSV: string // download of the filtered table as csv file is possible
}

const sepaProcessPage = {
    permissionRequired: "finance data",
    generalDirectDebitComponent: {
        description: "see description of Client: Membershipfee #161 for details"
    },
    informationText: "Wichtige Information: ...",
    wwFeeContent: {
        inputFields: [
            {
                fieldName: "Verwendungszweck",
                defaultValue: "default text with the month and year of the last ww"
            },
            {
                fieldName: "ID der Abbuchung",
                defaultValue: "default ID with the month and year of the last ww"
            },
            {
                fieldName: "Abbuchungsdatum",
                defaultValue: "default date that is calculated to be far enough in the future to comply with the law"
            },
            {
                fieldName: "Mails versenden (beim Klick auf SEPA-XML erstellen)",
                defaultValue: "yes / no (radio button)"
            },
            {
                fieldName: "Variabler Betrag",
                defaultValue: "by default empty value and €-sign, numbers in euros (e.g. 18,70)"
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
                    name: "feeOption",
                    type: "radio",
                    options: ["nothing", "variable amount", "10€", "15€", "20€", "30€"]
                }
            ],
            filters: {
                statusDropdown: "status (dropdown)",
                nameText: "name (free text)"
            },
            actions: {
                memberProfileRedirect: "clicking on the name of the member redirects to the member profile page",
                changeRadioButtons: "this information is used for the 'create SEPA XML' process. It is not saved if the user leaves this page",
                downloadCSV: "download of the filtered table as csv file is possible"
            }
        }
    }
}