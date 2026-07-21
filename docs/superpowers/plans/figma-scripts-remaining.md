# Figma 剩余页面脚本

> 文件: `Travel Atlas UI` (hcep6fRgZPahSW3TRxHVYK)
> 执行环境: `use_figma` MCP tool
> 参数: `fileKey`: `hcep6fRgZPahSW3TRxHVYK`, `skillNames`: `figma-use,figma-generate-design`

执行顺序：Trip → Timeline → Wishlist。每段一个独立 `use_figma` 调用。

---

## 1. Trip 页面后半段 — 航班卡片 + 底栏

```js
const screen = figma.createAutoLayout("VERTICAL");
screen.name = "Trip - Paris";
screen.resize(1440, 900);
screen.x = 2960;
screen.y = 0;
screen.clipsContent = true;
screen.fills = [{ type: "SOLID", color: { r: 0.0235, g: 0.0235, b: 0.0510, a: 1 } }];

await figma.loadFontAsync({ family: "Inter", style: "Regular" });
await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
await figma.loadFontAsync({ family: "Playfair Display", style: "Semi Bold" });
await figma.loadFontAsync({ family: "Playfair Display", style: "Bold" });
await figma.loadFontAsync({ family: "JetBrains Mono", style: "Regular" });
await figma.loadFontAsync({ family: "JetBrains Mono", style: "Medium" });

function T(c, f, s, z, r, g, b, a) {
  const t = figma.createText(); t.characters = c;
  t.fontName = { family: f, style: s }; t.fontSize = z;
  t.fills = [{ type: "SOLID", color: { r, g, b, a } }];
  t.textAutoResize = "WIDTH_AND_HEIGHT"; return t;
}

// ===== HEADER =====
const header = figma.createAutoLayout("VERTICAL");
header.paddingLeft = 48; header.paddingRight = 48; header.paddingTop = 28; header.paddingBottom = 20; header.itemSpacing = 4;
const backBtn = figma.createAutoLayout("HORIZONTAL");
backBtn.cornerRadius = 10; backBtn.paddingLeft = 10; backBtn.paddingRight = 12; backBtn.paddingTop = 4; backBtn.paddingBottom = 4;
backBtn.itemSpacing = 6; backBtn.counterAxisAlignItems = "CENTER";
backBtn.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1, a: 0.06 } }];
backBtn.strokes = [{ type: "SOLID", color: { r: 1, g: 1, b: 1, a: 0.07 } }]; backBtn.strokeWeight = 0.5;
backBtn.appendChild(T("← Back to France", "Inter", "Regular", 13, 1, 1, 1, 0.55));
header.appendChild(backBtn);
header.appendChild(T("Paris, France", "Playfair Display", "Bold", 36, 0.831, 0.631, 0.294, 1));

const metaRow = figma.createAutoLayout("HORIZONTAL"); metaRow.itemSpacing = 12; metaRow.counterAxisAlignItems = "CENTER";
metaRow.appendChild(T("Oct 12 – Oct 19, 2024", "Inter", "Regular", 14, 1, 1, 1, 0.50));
const durBadge = figma.createAutoLayout("HORIZONTAL"); durBadge.cornerRadius = 20;
durBadge.paddingLeft = 10; durBadge.paddingRight = 10; durBadge.paddingTop = 3; durBadge.paddingBottom = 3;
durBadge.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1, a: 0.08 } }];
durBadge.appendChild(T("8 days", "Inter", "Semi Bold", 12, 0.831, 0.631, 0.294, 1));
metaRow.appendChild(durBadge);
header.appendChild(metaRow);

// Route summary strip
const routeStrip = figma.createAutoLayout("HORIZONTAL");
routeStrip.itemSpacing = 8; routeStrip.counterAxisAlignItems = "CENTER";
routeStrip.appendChild(T("Shanghai", "Inter", "Regular", 12, 1, 1, 1, 0.40));
routeStrip.appendChild(T("✈", "Inter", "Regular", 14, 0.357, 0.588, 0.910, 0.6));
routeStrip.appendChild(T("Paris", "Inter", "Semi Bold", 12, 0.831, 0.631, 0.294, 0.80));
routeStrip.appendChild(T("🚄", "Inter", "Regular", 14, 0.239, 0.788, 0.722, 0.6));
routeStrip.appendChild(T("Lyon", "Inter", "Regular", 12, 1, 1, 1, 0.40));
routeStrip.appendChild(T("🚄", "Inter", "Regular", 14, 0.239, 0.788, 0.722, 0.6));
routeStrip.appendChild(T("Paris", "Inter", "Regular", 12, 1, 1, 1, 0.40));
routeStrip.appendChild(T("✈", "Inter", "Regular", 14, 0.357, 0.588, 0.910, 0.6));
routeStrip.appendChild(T("Shanghai", "Inter", "Regular", 12, 1, 1, 1, 0.40));
header.appendChild(routeStrip);

screen.appendChild(header);
header.layoutSizingHorizontal = "FILL";

// ===== CONTENT: Map + Flight Cards =====
const contentRow = figma.createAutoLayout("HORIZONTAL");
contentRow.paddingLeft = 48; contentRow.paddingRight = 48; contentRow.paddingTop = 0; contentRow.paddingBottom = 16; contentRow.itemSpacing = 20;

// Map area
const mapPanel = figma.createAutoLayout("VERTICAL");
mapPanel.name = "Route Map";
mapPanel.cornerRadius = 16; mapPanel.resize(760, 420);
mapPanel.fills = [{ type: "SOLID", color: { r: 0.040, g: 0.045, b: 0.065, a: 1 } }];
mapPanel.strokes = [{ type: "SOLID", color: { r: 1, g: 1, b: 1, a: 0.07 } }]; mapPanel.strokeWeight = 0.5;
mapPanel.counterAxisAlignItems = "CENTER"; mapPanel.primaryAxisAlignItems = "CENTER";

// Route visualization on map
const mapContent = figma.createAutoLayout("VERTICAL"); mapContent.itemSpacing = 12; mapContent.counterAxisAlignItems = "CENTER";
mapContent.appendChild(T("Shanghai  ──✈──  Paris  ──🚄──  Lyon", "JetBrains Mono", "Regular", 12, 0.357, 0.588, 0.910, 0.50));

// Simulate route path with simple elements
const routeVis = figma.createAutoLayout("HORIZONTAL"); routeVis.itemSpacing = 2; routeVis.counterAxisAlignItems = "CENTER";
// Shanghai dot
const dot1 = figma.createEllipse(); dot1.resize(8, 8); dot1.fills = [{ type: "SOLID", color: { r: 0.831, g: 0.631, b: 0.294, a: 1 } }]; routeVis.appendChild(dot1);
// Arc line (simple line placeholder)
const line1 = figma.createRectangle(); line1.resize(200, 2); line1.fills = [{ type: "SOLID", color: { r: 0.357, g: 0.588, b: 0.910, a: 0.6 } }]; line1.cornerRadius = 1; routeVis.appendChild(line1);
// Paris dot
const dot2 = figma.createEllipse(); dot2.resize(8, 8); dot2.fills = [{ type: "SOLID", color: { r: 0.831, g: 0.631, b: 0.294, a: 1 } }]; routeVis.appendChild(dot2);
// Train line
const line2 = figma.createRectangle(); line2.resize(140, 2); line2.fills = [{ type: "SOLID", color: { r: 0.239, g: 0.788, b: 0.722, a: 0.5 } }]; line2.cornerRadius = 1; line2.dashPattern = [4, 4]; routeVis.appendChild(line2);
// Lyon dot
const dot3 = figma.createEllipse(); dot3.resize(8, 8); dot3.fills = [{ type: "SOLID", color: { r: 0.831, g: 0.631, b: 0.294, a: 1 } }]; routeVis.appendChild(dot3);
mapContent.appendChild(routeVis);
mapPanel.appendChild(mapContent);

contentRow.appendChild(mapPanel);

// Flight cards sidebar
const flightPanel = figma.createAutoLayout("VERTICAL"); flightPanel.itemSpacing = 12; flightPanel.resize(540, 420);

// Flight Card Builder
function makeFlight(no, airline, aircraft, dep, arr, depTime, arrTime, dur, depDate, arrDate, stops) {
  const card = figma.createAutoLayout("VERTICAL");
  card.name = no;
  card.cornerRadius = 14; card.paddingLeft = 16; card.paddingRight = 16; card.paddingTop = 14; card.paddingBottom = 14; card.itemSpacing = 8;
  card.fills = [{ type: "SOLID", color: { r: 0.055, g: 0.055, b: 0.094, a: 0.65 } }];
  card.strokes = [{ type: "SOLID", color: { r: 1, g: 1, b: 1, a: 0.08 } }]; card.strokeWeight = 0.5;
  card.resize(540, 175);

  // Airline + Flight No
  const topRow = figma.createAutoLayout("HORIZONTAL"); topRow.itemSpacing = 8; topRow.counterAxisAlignItems = "CENTER";
  topRow.appendChild(T(airline, "Inter", "Regular", 13, 1, 1, 1, 0.55));
  const fn = figma.createAutoLayout("HORIZONTAL"); fn.cornerRadius = 6; fn.paddingLeft = 8; fn.paddingRight = 8; fn.paddingTop = 2; fn.paddingBottom = 2;
  fn.fills = [{ type: "SOLID", color: { r: 0.357, g: 0.588, b: 0.910, a: 0.15 } }];
  fn.appendChild(T(no, "JetBrains Mono", "Medium", 15, 0.357, 0.588, 0.910, 1));
  topRow.appendChild(fn);
  card.appendChild(topRow);

  card.appendChild(T(aircraft, "Inter", "Regular", 11, 1, 1, 1, 0.30));

  // Route visual
  const routeRow = figma.createAutoLayout("HORIZONTAL"); routeRow.itemSpacing = 8; routeRow.counterAxisAlignItems = "CENTER";
  routeRow.appendChild(T(dep, "JetBrains Mono", "Medium", 14, 1, 1, 1, 0.80));
  routeRow.appendChild(T("────────✈────────", "Inter", "Regular", 9, 0.357, 0.588, 0.910, 0.35));
  routeRow.appendChild(T(arr, "JetBrains Mono", "Medium", 14, 1, 1, 1, 0.80));
  card.appendChild(routeRow);

  // Time bar
  const timeBar = figma.createAutoLayout("HORIZONTAL"); timeBar.itemSpacing = 12; timeBar.counterAxisAlignItems = "BASELINE";
  timeBar.appendChild(T(depTime, "JetBrains Mono", "Regular", 20, 1, 1, 1, 0.90));

  // Duration with glass badge
  const durRow = figma.createAutoLayout("HORIZONTAL"); durRow.cornerRadius = 8; durRow.paddingLeft = 8; durRow.paddingRight = 8; durRow.paddingTop = 2; durRow.paddingBottom = 2;
  durRow.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1, a: 0.06 } }];
  durRow.appendChild(T(dur, "JetBrains Mono", "Regular", 10, 1, 1, 1, 0.45));
  timeBar.appendChild(durRow);

  timeBar.appendChild(T(arrTime, "JetBrains Mono", "Regular", 20, 1, 1, 1, 0.90));
  card.appendChild(timeBar);

  // Dates + stops
  const botRow = figma.createAutoLayout("HORIZONTAL"); botRow.itemSpacing = 4; botRow.counterAxisAlignItems = "CENTER";
  botRow.appendChild(T(depDate, "Inter", "Regular", 10, 1, 1, 1, 0.30));
  botRow.appendChild(T("·", "Inter", "Regular", 10, 1, 1, 1, 0.20));
  botRow.appendChild(T(stops, "Inter", "Regular", 10, 1, 1, 1, 0.30));
  botRow.appendChild(T("·", "Inter", "Regular", 10, 1, 1, 1, 0.20));
  botRow.appendChild(T(arrDate, "Inter", "Regular", 10, 1, 1, 1, 0.30));
  card.appendChild(botRow);

  return card;
}

flightPanel.appendChild(makeFlight("AF 111", "Air France", "Boeing 777-300ER", "PVG", "CDG", "10:30", "14:20", "11h 50m", "Oct 12", "Oct 12", "Direct"));
flightPanel.appendChild(makeFlight("AF 112", "Air France", "Boeing 777-300ER", "CDG", "PVG", "23:15", "16:40", "11h 25m", "Oct 19", "Oct 20", "Direct"));

contentRow.appendChild(flightPanel);
screen.appendChild(contentRow);
contentRow.layoutSizingHorizontal = "FILL";

// ===== BOTTOM: Photos + Notes =====
const bottomRow = figma.createAutoLayout("HORIZONTAL");
bottomRow.paddingLeft = 48; bottomRow.paddingRight = 48; bottomRow.paddingTop = 0; bottomRow.paddingBottom = 24; bottomRow.itemSpacing = 20;
bottomRow.resize(1440, 200);

// Photos
const photoSection = figma.createAutoLayout("VERTICAL"); photoSection.itemSpacing = 10; photoSection.resize(760, 200);
const phLabel = figma.createAutoLayout("HORIZONTAL"); phLabel.itemSpacing = 8; phLabel.counterAxisAlignItems = "CENTER";
phLabel.appendChild(T("PHOTOS", "Inter", "Semi Bold", 10, 1, 1, 1, 0.30));
phLabel.appendChild(T("12 photos", "Inter", "Regular", 10, 1, 1, 1, 0.18));
photoSection.appendChild(phLabel);

const pg = figma.createAutoLayout("HORIZONTAL"); pg.itemSpacing = 8;
for (let i = 0; i < 6; i++) {
  const ph = figma.createRectangle(); ph.name = "Photo " + (i+1); ph.cornerRadius = 8; ph.resize(115, 80);
  ph.fills = [{ type: "SOLID", color: { r: 0.07 + i*0.015, g: 0.08 + i*0.01, b: 0.13 + i*0.01, a: 1 } }];
  ph.strokes = [{ type: "SOLID", color: { r: 1, g: 1, b: 1, a: 0.06 } }]; ph.strokeWeight = 0.5;
  pg.appendChild(ph);
}
photoSection.appendChild(pg);
bottomRow.appendChild(photoSection);

// Notes
const notesSection = figma.createAutoLayout("VERTICAL"); notesSection.itemSpacing = 10; notesSection.resize(540, 200);
const ntLabel = figma.createAutoLayout("HORIZONTAL"); ntLabel.itemSpacing = 8; ntLabel.counterAxisAlignItems = "CENTER";
ntLabel.appendChild(T("NOTES", "Inter", "Semi Bold", 10, 1, 1, 1, 0.30));
ntLabel.appendChild(T("3 entries", "Inter", "Regular", 10, 1, 1, 1, 0.18));
notesSection.appendChild(ntLabel);

const noteCard = figma.createAutoLayout("VERTICAL");
noteCard.cornerRadius = 12; noteCard.paddingLeft = 16; noteCard.paddingRight = 16; noteCard.paddingTop = 14; noteCard.paddingBottom = 14; noteCard.itemSpacing = 6;
noteCard.fills = [{ type: "SOLID", color: { r: 0.055, g: 0.055, b: 0.094, a: 0.55 } }];
noteCard.strokes = [{ type: "SOLID", color: { r: 1, g: 1, b: 1, a: 0.06 } }]; noteCard.strokeWeight = 0.5;
noteCard.resize(540, 140);

noteCard.appendChild(T("Day 1: Montmartre", "Playfair Display", "Semi Bold", 16, 1, 1, 1, 0.85));

const nob1 = figma.createText(); nob1.characters = "We woke up to the smell of fresh croissants drifting through the window. Spent the morning wandering the winding streets of Montmartre, stopping at small cafés and watching street artists paint the Sacré-Cœur."; nob1.fontName = { family: "Inter", style: "Regular" }; nob1.fontSize = 12; nob1.lineHeight = { value: 18, unit: "PIXELS" }; nob1.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1, a: 0.45 } }]; nob1.textAutoResize = "HEIGHT"; nob1.resize(500, 60);
noteCard.appendChild(nob1);

notesSection.appendChild(noteCard);
bottomRow.appendChild(notesSection);

screen.appendChild(bottomRow);
bottomRow.layoutSizingHorizontal = "FILL";

return { screenId: screen.id, done: true };
```

---

## 2. Timeline 页面

```js
const screen = figma.createAutoLayout("VERTICAL");
screen.name = "Timeline";
screen.resize(1440, 900);
screen.x = 4400;
screen.y = 0;
screen.clipsContent = true;
screen.fills = [{ type: "SOLID", color: { r: 0.0235, g: 0.0235, b: 0.0510, a: 1 } }];

await figma.loadFontAsync({ family: "Inter", style: "Regular" });
await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
await figma.loadFontAsync({ family: "Inter", style: "Bold" });
await figma.loadFontAsync({ family: "Playfair Display", style: "Semi Bold" });
await figma.loadFontAsync({ family: "Playfair Display", style: "Bold" });

function T(c, f, s, z, r, g, b, a) {
  const t = figma.createText(); t.characters = c;
  t.fontName = { family: f, style: s }; t.fontSize = z;
  t.fills = [{ type: "SOLID", color: { r, g, b, a } }];
  t.textAutoResize = "WIDTH_AND_HEIGHT"; return t;
}

// ===== NAV PILL =====
const navPill = figma.createAutoLayout("HORIZONTAL");
navPill.cornerRadius = 20; navPill.paddingLeft = 8; navPill.paddingRight = 8; navPill.paddingTop = 6; navPill.paddingBottom = 6;
navPill.itemSpacing = 4; navPill.primaryAxisAlignItems = "CENTER"; navPill.counterAxisAlignItems = "CENTER";
navPill.fills = [{ type: "SOLID", color: { r: 0.055, g: 0.055, b: 0.094, a: 0.72 } }];
navPill.strokes = [{ type: "SOLID", color: { r: 1, g: 1, b: 1, a: 0.07 } }]; navPill.strokeWeight = 0.5;
navPill.effects = [{ type: "BACKGROUND_BLUR", radius: 12, visible: true }];
navPill.x = 480; navPill.y = 16;

const navItems = ["Globe", "Country", "Trip", "Timeline", "Wishlist"];
for (let i = 0; i < navItems.length; i++) {
  const btn = figma.createAutoLayout("HORIZONTAL");
  btn.cornerRadius = 16; btn.paddingLeft = 14; btn.paddingRight = 14; btn.paddingTop = 6; btn.paddingBottom = 6;
  btn.counterAxisAlignItems = "CENTER";
  const isActive = navItems[i] === "Timeline";
  btn.fills = isActive ? [{ type: "SOLID", color: { r: 1, g: 1, b: 1, a: 0.10 } }] : [];
  if (isActive) { btn.strokes = [{ type: "SOLID", color: { r: 0.831, g: 0.631, b: 0.294, a: 0.5 } }]; btn.strokeWeight = 1; }
  btn.appendChild(T(navItems[i], "Inter", isActive ? "Semi Bold" : "Regular", 13, 1, 1, 1, isActive ? 0.90 : 0.50));
  navPill.appendChild(btn);
}

screen.appendChild(navPill);

// ===== YEAR FILTER =====
const yearFilter = figma.createAutoLayout("HORIZONTAL");
yearFilter.cornerRadius = 20; yearFilter.paddingLeft = 6; yearFilter.paddingRight = 6; yearFilter.paddingTop = 6; yearFilter.paddingBottom = 6;
yearFilter.itemSpacing = 2;
yearFilter.fills = [{ type: "SOLID", color: { r: 0.055, g: 0.055, b: 0.094, a: 0.65 } }];
yearFilter.strokes = [{ type: "SOLID", color: { r: 1, g: 1, b: 1, a: 0.06 } }]; yearFilter.strokeWeight = 0.5;
yearFilter.effects = [{ type: "BACKGROUND_BLUR", radius: 12, visible: true }];
yearFilter.x = 520; yearFilter.y = 72;

const years = ["All", "2025", "2024", "2023"];
for (let i = 0; i < years.length; i++) {
  const pill = figma.createAutoLayout("HORIZONTAL");
  pill.cornerRadius = 14; pill.paddingLeft = 16; pill.paddingRight = 16; pill.paddingTop = 5; pill.paddingBottom = 5;
  pill.counterAxisAlignItems = "CENTER";
  const active = years[i] === "All";
  pill.fills = active ? [{ type: "SOLID", color: { r: 0.831, g: 0.631, b: 0.294, a: 0.20 } }] : [];
  pill.strokes = active ? [{ type: "SOLID", color: { r: 0.831, g: 0.631, b: 0.294, a: 0.4 } }] : [];
  pill.strokeWeight = active ? 0.5 : 0;
  pill.appendChild(T(years[i], "Inter", active ? "Semi Bold" : "Regular", 13, active ? 0.831 : 1, active ? 0.631 : 1, active ? 0.294 : 1, active ? 1 : 0.50));
  yearFilter.appendChild(pill);
}
screen.appendChild(yearFilter);

// ===== TIMELINE CONTENT =====
const timelineArea = figma.createAutoLayout("VERTICAL");
timelineArea.paddingLeft = 140; timelineArea.paddingRight = 140; timelineArea.paddingTop = 120; timelineArea.paddingBottom = 40;
timelineArea.itemSpacing = 0;

// Year groups
const yearGroups = [
  { year: "2025", trips: [
    { month: "Mar", city: "Tokyo", country: "Japan", flag: "🇯🇵", days: 7, cities: 3, color: { r: 0.06, g: 0.07, b: 0.12 } }
  ]},
  { year: "2024", trips: [
    { month: "Oct", city: "Paris", country: "France", flag: "🇫🇷", days: 8, cities: 3, color: { r: 0.05, g: 0.06, b: 0.11 } },
    { month: "Jul", city: "Rome", country: "Italy", flag: "🇮🇹", days: 5, cities: 2, color: { r: 0.07, g: 0.08, b: 0.13 } },
    { month: "Mar", city: "Bangkok", country: "Thailand", flag: "🇹🇭", days: 7, cities: 3, color: { r: 0.06, g: 0.07, b: 0.12 } }
  ]},
  { year: "2023", trips: [
    { month: "Aug", city: "Barcelona", country: "Spain", flag: "🇪🇸", days: 6, cities: 2, color: { r: 0.05, g: 0.06, b: 0.11 } },
    { month: "May", city: "Seoul", country: "South Korea", flag: "🇰🇷", days: 4, cities: 1, color: { r: 0.07, g: 0.08, b: 0.13 } }
  ]}
];

for (const yg of yearGroups) {
  // Year label
  const yearLabel = figma.createAutoLayout("HORIZONTAL");
  yearLabel.paddingLeft = 0; yearLabel.paddingTop = 24; yearLabel.paddingBottom = 16;
  yearLabel.appendChild(T(yg.year, "Playfair Display", "Bold", 52, 1, 1, 1, 0.12));
  timelineArea.appendChild(yearLabel);

  for (const trip of yg.trips) {
    // Trip card row: month badge + card
    const row = figma.createAutoLayout("HORIZONTAL");
    row.itemSpacing = 16; row.counterAxisAlignItems = "CENTER"; row.paddingBottom = 12;

    // Month badge
    const monthBadge = figma.createAutoLayout("VERTICAL");
    monthBadge.resize(40, 40); monthBadge.cornerRadius = 20;
    monthBadge.counterAxisAlignItems = "CENTER"; monthBadge.primaryAxisAlignItems = "CENTER";
    monthBadge.fills = [{ type: "SOLID", color: { r: 0.055, g: 0.055, b: 0.094, a: 0.55 } }];
    monthBadge.strokes = [{ type: "SOLID", color: { r: 1, g: 1, b: 1, a: 0.06 } }]; monthBadge.strokeWeight = 0.5;
    monthBadge.appendChild(T(trip.month, "Inter", "Semi Bold", 12, 1, 1, 1, 0.60));
    row.appendChild(monthBadge);

    // Trip card
    const card = figma.createAutoLayout("HORIZONTAL");
    card.cornerRadius = 14; card.paddingLeft = 16; card.paddingRight = 16; card.paddingTop = 14; card.paddingBottom = 14;
    card.itemSpacing = 16; card.counterAxisAlignItems = "CENTER";
    card.fills = [{ type: "SOLID", color: { r: 0.055, g: 0.055, b: 0.094, a: 0.55 } }];
    card.strokes = [{ type: "SOLID", color: { r: 1, g: 1, b: 1, a: 0.06 } }]; card.strokeWeight = 0.5;
    card.resize(800, 72);

    // Photo thumbnails (3 mini)
    const thumbs = figma.createAutoLayout("HORIZONTAL"); thumbs.itemSpacing = 4;
    for (let p = 0; p < 3; p++) {
      const thumb = figma.createRectangle(); thumb.cornerRadius = 6; thumb.resize(44, 44);
      thumb.fills = [{ type: "SOLID", color: { r: 0.08 + p*0.02, g: 0.09 + p*0.01, b: 0.14 + p*0.02, a: 1 } }];
      thumbs.appendChild(thumb);
    }
    card.appendChild(thumbs);

    // Info
    const info = figma.createAutoLayout("VERTICAL"); info.itemSpacing = 3; info.layoutSizingHorizontal = "FILL";
    const cityRow = figma.createAutoLayout("HORIZONTAL"); cityRow.itemSpacing = 6; cityRow.counterAxisAlignItems = "CENTER";
    cityRow.appendChild(T(trip.flag, "Inter", "Regular", 16, 1, 1, 1, 1));
    cityRow.appendChild(T(trip.city, "Playfair Display", "Semi Bold", 20, 1, 1, 1, 0.90));
    cityRow.appendChild(T(trip.country, "Inter", "Regular", 13, 1, 1, 1, 0.40));
    info.appendChild(cityRow);

    const metaRow = figma.createAutoLayout("HORIZONTAL"); metaRow.itemSpacing = 8;
    metaRow.appendChild(T(trip.days + " days", "Inter", "Regular", 11, 1, 1, 1, 0.40));
    metaRow.appendChild(T("·", "Inter", "Regular", 11, 1, 1, 1, 0.25));
    metaRow.appendChild(T(trip.cities + " cities", "Inter", "Regular", 11, 1, 1, 1, 0.40));
    info.appendChild(metaRow);
    card.appendChild(info);

    // Arrow hint
    card.appendChild(T("→", "Inter", "Regular", 16, 1, 1, 1, 0.25));

    row.appendChild(card);
    info.layoutSizingHorizontal = "FILL";
    timelineArea.appendChild(row);
  }
}

screen.appendChild(timelineArea);
timelineArea.layoutSizingHorizontal = "FILL";

return { screenId: screen.id, done: true };
```

---

## 3. Wishlist 页面

```js
const screen = figma.createAutoLayout("VERTICAL");
screen.name = "Wishlist";
screen.resize(1440, 900);
screen.x = 5920;
screen.y = 0;
screen.clipsContent = true;
screen.fills = [{ type: "SOLID", color: { r: 0.0235, g: 0.0235, b: 0.0510, a: 1 } }];

await figma.loadFontAsync({ family: "Inter", style: "Regular" });
await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
await figma.loadFontAsync({ family: "Inter", style: "Bold" });
await figma.loadFontAsync({ family: "Playfair Display", style: "Semi Bold" });
await figma.loadFontAsync({ family: "Playfair Display", style: "Bold" });

function T(c, f, s, z, r, g, b, a) {
  const t = figma.createText(); t.characters = c;
  t.fontName = { family: f, style: s }; t.fontSize = z;
  t.fills = [{ type: "SOLID", color: { r, g, b, a } }];
  t.textAutoResize = "WIDTH_AND_HEIGHT"; return t;
}

// ===== NAV PILL =====
const navPill = figma.createAutoLayout("HORIZONTAL");
navPill.cornerRadius = 20; navPill.paddingLeft = 8; navPill.paddingRight = 8; navPill.paddingTop = 6; navPill.paddingBottom = 6;
navPill.itemSpacing = 4; navPill.primaryAxisAlignItems = "CENTER"; navPill.counterAxisAlignItems = "CENTER";
navPill.fills = [{ type: "SOLID", color: { r: 0.055, g: 0.055, b: 0.094, a: 0.72 } }];
navPill.strokes = [{ type: "SOLID", color: { r: 1, g: 1, b: 1, a: 0.07 } }]; navPill.strokeWeight = 0.5;
navPill.effects = [{ type: "BACKGROUND_BLUR", radius: 12, visible: true }];
navPill.x = 480; navPill.y = 16;

const navItems = ["Globe", "Country", "Trip", "Timeline", "Wishlist"];
for (let i = 0; i < navItems.length; i++) {
  const btn = figma.createAutoLayout("HORIZONTAL");
  btn.cornerRadius = 16; btn.paddingLeft = 14; btn.paddingRight = 14; btn.paddingTop = 6; btn.paddingBottom = 6;
  btn.counterAxisAlignItems = "CENTER";
  const isActive = navItems[i] === "Wishlist";
  btn.fills = isActive ? [{ type: "SOLID", color: { r: 1, g: 1, b: 1, a: 0.10 } }] : [];
  if (isActive) { btn.strokes = [{ type: "SOLID", color: { r: 0.239, g: 0.788, b: 0.722, a: 0.5 } }]; btn.strokeWeight = 1; }
  btn.appendChild(T(navItems[i], "Inter", isActive ? "Semi Bold" : "Regular", 13, 1, 1, 1, isActive ? 0.90 : 0.50));
  navPill.appendChild(btn);
}
screen.appendChild(navPill);

// ===== PAGE TITLE =====
const pageHeader = figma.createAutoLayout("VERTICAL");
pageHeader.paddingLeft = 80; pageHeader.paddingRight = 80; pageHeader.paddingTop = 80; pageHeader.paddingBottom = 24; pageHeader.itemSpacing = 4;
pageHeader.appendChild(T("Dream Destinations", "Playfair Display", "Bold", 36, 0.239, 0.788, 0.722, 1));
pageHeader.appendChild(T("Places waiting to be explored", "Inter", "Regular", 14, 1, 1, 1, 0.40));
screen.appendChild(pageHeader);

// ===== CATEGORY TOGGLE =====
const catToggle = figma.createAutoLayout("HORIZONTAL");
catToggle.cornerRadius = 16; catToggle.paddingLeft = 6; catToggle.paddingRight = 6; catToggle.paddingTop = 4; catToggle.paddingBottom = 4;
catToggle.itemSpacing = 2; catToggle.x = 80; catToggle.y = 160;
catToggle.fills = [{ type: "SOLID", color: { r: 0.055, g: 0.055, b: 0.094, a: 0.55 } }];
catToggle.strokes = [{ type: "SOLID", color: { r: 1, g: 1, b: 1, a: 0.06 } }]; catToggle.strokeWeight = 0.5;

const catItems = [
  { label: "Countries", active: true },
  { label: "Cities", active: false }
];
for (const ci of catItems) {
  const pill = figma.createAutoLayout("HORIZONTAL");
  pill.cornerRadius = 12; pill.paddingLeft = 18; pill.paddingRight = 18; pill.paddingTop = 6; pill.paddingBottom = 6;
  pill.counterAxisAlignItems = "CENTER";
  if (ci.active) {
    pill.fills = [{ type: "SOLID", color: { r: 0.239, g: 0.788, b: 0.722, a: 0.15 } }];
    pill.strokes = [{ type: "SOLID", color: { r: 0.239, g: 0.788, b: 0.722, a: 0.3 } }]; pill.strokeWeight = 0.5;
  }
  pill.appendChild(T(ci.label, "Inter", ci.active ? "Semi Bold" : "Regular", 13, ci.active ? 0.239 : 1, ci.active ? 0.788 : 1, ci.active ? 0.722 : 1, ci.active ? 1 : 0.50));
  catToggle.appendChild(pill);
}
screen.appendChild(catToggle);

// ===== DESTINATION GRID =====
const grid = figma.createAutoLayout("HORIZONTAL");
grid.paddingLeft = 80; grid.paddingRight = 80; grid.paddingTop = 80; grid.paddingBottom = 40;
grid.itemSpacing = 16; grid.layoutSizingHorizontal = "FILL"; grid.wrap = "WRAP";
grid.primaryAxisSizingMode = "FIXED"; grid.resize(1440, 600);

const destinations = [
  { name: "Iceland", flag: "🇮🇸", cities: 12, saved: 5, color: { r: 0.06, g: 0.08, b: 0.14 }, cover: "Reykjavik · Northern Lights · Hot Springs" },
  { name: "New Zealand", flag: "🇳🇿", cities: 8, saved: 3, color: { r: 0.08, g: 0.06, b: 0.12 }, cover: "Milford Sound · Hobbiton · Queenstown" },
  { name: "Peru", flag: "🇵🇪", cities: 5, saved: 2, color: { r: 0.07, g: 0.07, b: 0.13 }, cover: "Machu Picchu · Lima · Cusco" },
  { name: "Japan", flag: "🇯🇵", cities: 3, saved: 8, color: { r: 0.05, g: 0.07, b: 0.12 }, cover: "Kyoto · Osaka · Hokkaido" },
  { name: "Morocco", flag: "🇲🇦", cities: 2, saved: 4, color: { r: 0.07, g: 0.05, b: 0.11 }, cover: "Marrakech · Sahara · Chefchaouen" },
  { name: "Norway", flag: "🇳🇴", cities: 6, saved: 3, color: { r: 0.06, g: 0.06, b: 0.13 }, cover: "Lofoten · Tromsø · Bergen" },
];

for (const dest of destinations) {
  // Destination card
  const card = figma.createAutoLayout("VERTICAL");
  card.name = dest.name;
  card.cornerRadius = 16; card.resize(405, 220); card.clipsContent = true;
  card.fills = [{ type: "SOLID", color: dest.color }];
  card.strokes = [{ type: "SOLID", color: { r: 1, g: 1, b: 1, a: 0.06 } }]; card.strokeWeight = 0.5;

  // Cover area
  const cover = figma.createAutoLayout("VERTICAL");
  cover.paddingLeft = 20; cover.paddingRight = 20; cover.paddingTop = 20; cover.paddingBottom = 14; cover.itemSpacing = 8;
  cover.resize(405, 140); cover.layoutSizingHorizontal = "FILL";

  // Flag + bookmark
  const topRow = figma.createAutoLayout("HORIZONTAL"); topRow.counterAxisAlignItems = "CENTER"; topRow.layoutSizingHorizontal = "FILL";
  const flagText = figma.createText(); flagText.characters = dest.flag; flagText.fontName = { family: "Inter", style: "Regular" }; flagText.fontSize = 32; flagText.textAutoResize = "WIDTH_AND_HEIGHT"; topRow.appendChild(flagText);

  // Bookmark icon (teal star)
  const spacer = figma.createAutoLayout("HORIZONTAL"); spacer.layoutSizingHorizontal = "FILL"; topRow.appendChild(spacer);
  const star = figma.createAutoLayout("HORIZONTAL"); star.cornerRadius = 20; star.paddingLeft = 10; star.paddingRight = 10; star.paddingTop = 4; star.paddingBottom = 4;
  star.fills = [{ type: "SOLID", color: { r: 0.239, g: 0.788, b: 0.722, a: 0.20 } }];
  star.strokes = [{ type: "SOLID", color: { r: 0.239, g: 0.788, b: 0.722, a: 0.4 } }]; star.strokeWeight = 0.5;
  star.appendChild(T("★ " + dest.saved, "Inter", "Semi Bold", 12, 0.239, 0.788, 0.722, 1));
  topRow.appendChild(star);

  cover.appendChild(topRow);

  // Country name
  cover.appendChild(T(dest.name, "Playfair Display", "Bold", 28, 1, 1, 1, 0.90));

  // Description
  cover.appendChild(T(dest.cover, "Inter", "Regular", 11, 1, 1, 1, 0.40));

  card.appendChild(cover);

  // Footer gradient
  const footer = figma.createAutoLayout("HORIZONTAL");
  footer.paddingLeft = 20; footer.paddingRight = 20; footer.paddingTop = 10; footer.paddingBottom = 14;
  footer.fills = [{ type: "GRADIENT_LINEAR", gradientTransform: [[0, 1, 0], [0, 0, 1]], gradientStops: [{ position: 0, color: { r: 0, g: 0, b: 0, a: 0 } }, { position: 1, color: { r: 0, g: 0, b: 0, a: 0.4 } }] }];
  footer.resize(405, 60); footer.layoutSizingHorizontal = "FILL";
  footer.counterAxisAlignItems = "CENTER";
  footer.appendChild(T(dest.cities + " saved cities", "Inter", "Regular", 11, 1, 1, 1, 0.40));
  card.appendChild(footer);

  grid.appendChild(card);
}

screen.appendChild(grid);

// ===== ADD BUTTON =====
const addFab = figma.createAutoLayout("HORIZONTAL");
addFab.cornerRadius = 20; addFab.paddingLeft = 18; addFab.paddingRight = 18; addFab.paddingTop = 10; addFab.paddingBottom = 10;
addFab.itemSpacing = 6; addFab.counterAxisAlignItems = "CENTER";
addFab.fills = [{ type: "SOLID", color: { r: 0.239, g: 0.788, b: 0.722, a: 0.25 } }];
addFab.strokes = [{ type: "SOLID", color: { r: 0.239, g: 0.788, b: 0.722, a: 0.4 } }]; addFab.strokeWeight = 0.5;
addFab.effects = [{ type: "BACKGROUND_BLUR", radius: 12, visible: true }];
addFab.x = 1220; addFab.y = 820;
addFab.appendChild(T("+", "Inter", "Semi Bold", 18, 0.373, 0.910, 0.847, 1));
addFab.appendChild(T("Add Destination", "Inter", "Semi Bold", 13, 0.373, 0.910, 0.847, 1));
screen.appendChild(addFab);

return { screenId: screen.id, done: true };
```

---

## 执行清单

当 Figma API 额度恢复后，按顺序执行：

1. `get_metadata` 查看当前文件状态
2. 执行 **Trip 页面脚本**（第一个代码块）
3. 执行 **Timeline 页面脚本**（第二个代码块）
4. 执行 **Wishlist 页面脚本**（第三个代码块）
5. `get_screenshot` 检查所有新页面

总共 4 次 `use_figma` 调用，足以在 Starter 计划的一次额度周期内完成。
