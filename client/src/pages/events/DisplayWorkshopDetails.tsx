import React, { useState } from "react";

import { InformationField } from "../../types/informationTypes";

import { Workshop } from "../../types/eventTypes";

import { schulung as res } from "../../mock/events/schulung";

const DisplayWorkshopDetails = () => {
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [workshopInstances, setWorkshopInstances] = useState<WorkshopInstance[]>([]);

  const getWorkshop = (id: number) => {
    const foundWorkshop = res.find((workshop) => workshop.schulungId === id) as Workshop;
    if (foundWorkshop) {
      setWorkshop(foundWorkshop);
    } else {
      console.error(`No workshop found with id ${id}`);
    }
  };

  const displayFields: Array<InformationField> = [
    {
      label: "Worlshopname",
      value: event && event.registrationDeadline ? event.registrationDeadline.locale("de").format("DD.MM.YYYY") : null,
      type: "text",
    },
    {
      label: "Beschreibung",
      value: event && event.date ? event.date.format("DD.MM.YYYY").toString() : null,
      type: "text",
    },
    {
      label: "Art",
      value: event && event.endDate ? event.endDate.format("DD.MM.YYYY").toString() : null,
      type: "text",
    },
  ];
  return <div>DisplayWorkshopDetails</div>;
};

export default DisplayWorkshopDetails;
