const writeWrapped = (doc, text, x, y, width, lineHeight = 7) => {
  const lines = doc.splitTextToSize(String(text || ""), width);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
};

const pageBreak = (doc, y) => {
  if (y < 270) return y;
  doc.addPage();
  return 18;
};

export const exportItineraryPdf = async (trip) => {
  const { jsPDF } = await import("jspdf");
  const itinerary = trip.itinerary || trip.itinerarySnapshot || {};
  const request = trip.request || {};
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = 18;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  y = writeWrapped(doc, itinerary.title || "Travel itinerary", 18, y, 174, 9) + 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  y = writeWrapped(doc, itinerary.summary || `${request.destination || "Trip"} itinerary`, 18, y, 174) + 4;

  doc.setFont("helvetica", "bold");
  doc.text("Budget", 18, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  const budget = itinerary.budgetOverview || {};
  y = writeWrapped(
    doc,
    `${budget.currency || ""} total: ${budget.totalEstimate || "TBD"} | per person: ${budget.perPersonEstimate || "TBD"}\n${budget.notes || ""}`,
    18,
    y,
    174
  );

  (itinerary.days || []).forEach((day) => {
    y = pageBreak(doc, y + 5);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    y = writeWrapped(doc, `Day ${day.day}: ${day.title}`, 18, y, 174, 8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    y = writeWrapped(doc, `Morning: ${day.morning}`, 18, y + 1, 174, 6);
    y = writeWrapped(doc, `Afternoon: ${day.afternoon}`, 18, y + 1, 174, 6);
    y = writeWrapped(doc, `Evening: ${day.evening}`, 18, y + 1, 174, 6);
    y = writeWrapped(doc, `Food: ${day.food}`, 18, y + 1, 174, 6);
  });

  const sections = [
    ["Packing tips", itinerary.packingTips],
    ["Weather advice", itinerary.weatherAdvice],
    ["Safety tips", itinerary.safetyTips],
    ["Booking tips", itinerary.bookingTips]
  ];

  sections.forEach(([title, items]) => {
    if (!items?.length) return;
    y = pageBreak(doc, y + 6);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(title, 18, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    items.forEach((item) => {
      y = pageBreak(doc, y);
      y = writeWrapped(doc, `- ${item}`, 20, y, 170, 6);
    });
  });

  doc.save(`${(itinerary.destination || request.destination || "itinerary").replace(/\s+/g, "-").toLowerCase()}-itinerary.pdf`);
};
