export const formatDeliveriesToTimestamp = (shopDeliveries: string[]) => {
  const monthNames: Record<string, number> = {
    stycznia: 0,
    lutego: 1,
    marca: 2,
    kwietnia: 3,
    maja: 4,
    czerwca: 5,
    lipca: 6,
    sierpnia: 7,
    września: 8,
    października: 9,
    listopada: 10,
    grudnia: 11,
  };

  const deliveriesTimestamp = shopDeliveries.map((delivery) => {
    const [day, month, year, timeStart, , timeEnd] = delivery.split(" ");
    const [startHour, startMinute] = timeStart!.split(":");
    const [endHour, endMinute] = timeEnd!.split(":");

    const monthPad = monthNames[month!]?.toString().padStart(2, "0");
    const dayPad = day?.toString().padStart(2, "0");

    const startString = `${year}-${monthPad}-${dayPad}T${startHour}:${startMinute}:00.000Z`;
    const endString = `${year}-${monthPad}-${dayPad}T${endHour}:${endMinute}:00.000Z`;

    const start = Date.parse(startString);
    const end = Date.parse(endString);

    return { start, end };
  });

  return deliveriesTimestamp;
};
