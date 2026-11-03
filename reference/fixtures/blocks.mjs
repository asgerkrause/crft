// Fictional sample content for the block gallery. Edit values here; blocks render them unchanged.
// Every name, place, number, quote, and image belongs to the invented Hollin Studio.

export const header = {
  name: "Hollin Studio",
  homeHref: "#top",
  links: [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Work", href: "#selected-work" },
    { label: "Team", href: "#team" },
    { label: "Questions", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ],
};

export const hero = {
  heading: "Rooms people want to stay in.",
  summary: "Hollin Studio designs interiors, furniture, and wayfinding for libraries, cafés, and small hotels. We begin with how people move, sit, and wait.",
  actionLabel: "See selected work",
  actionHref: "#selected-work",
  detailHeading: "Taking commissions for spring 2027",
  detail: "We have room for three projects. Send the floor plan, the opening date, and a sentence about who will use the room.",
};

export const about = {
  id: "about",
  heading: "A studio of nine, working from one long table.",
  paragraphs: [
    "We are architects, joiners, and product designers who share one workshop in a converted print works. Most of our work starts with a building that already exists and a team that has to keep it running.",
    "We measure every room before we draw it and sit in the furniture before we order it. The drawings we leave behind are ones the maintenance team can use.",
  ],
  facts: [
    { label: "Founded", value: "2014" },
    { label: "Completed rooms", value: "38" },
    { label: "Based", value: "Workshop and studio on one site" },
  ],
  image: { src: "/blocks/about.svg", alt: "Pale arched window above a round table with two chairs" },
};

export const cta = {
  id: "start",
  heading: "Planning a room that has to work harder?",
  summary: "Send the floor plan and a few sentences about how the room is used. We reply within three working days with a proposed next step.",
  actionLabel: "Send the floor plan",
  actionHref: "#contact",
};

export const services = {
  id: "services",
  heading: "Services",
  intro: "We take a room from first measurements to a finished installation. Most commissions use one service; larger buildings use all three.",
  services: [
    {
      name: "Survey and brief",
      summary: "We measure the room, talk with the people who use it, and write a brief you can check against the finished space.",
      deliverables: ["Measured drawings", "Use and movement notes", "Written brief"],
      timeline: "Two to three weeks",
    },
    {
      name: "Interior design",
      summary: "Layout, materials, lighting, and fixed joinery, drawn at full size wherever the detail matters.",
      deliverables: ["Layout and lighting plan", "Material samples", "Fixed joinery drawings"],
      timeline: "Six to ten weeks",
    },
    {
      name: "Furniture and wayfinding",
      summary: "Made-to-measure tables, seating, and signs, built in our workshop and fitted on site.",
      deliverables: ["Prototype review", "Installation on site", "Maintenance notes"],
      timeline: "Eight to fourteen weeks",
    },
  ],
};

export const team = {
  id: "team",
  heading: "The people in the room",
  intro: "Nine people, most of whom have worked on at least one commission from first measurement to final fit.",
  members: [
    {
      name: "Mira Okafor",
      role: "Founder, architect",
      bio: "Leads the brief and the first survey. Previously designed reading rooms for two regional library systems.",
      portrait: { src: "/blocks/portrait-mira.svg", alt: "Flat illustration of a person with dark hair and a black jacket" },
    },
    {
      name: "Tomas Reyes",
      role: "Joinery lead",
      bio: "Builds the prototypes and checks every fixed detail against the drawings before it leaves the workshop.",
      portrait: { src: "/blocks/portrait-tomas.svg", alt: "Flat illustration of a person with short dark hair and a rust jacket" },
    },
    {
      name: "Ada Lindqvist",
      role: "Lighting designer",
      bio: "Plans daylight and artificial light for working rooms, and tests each scheme at the hours people use the room.",
      portrait: { src: "/blocks/portrait-ada.svg", alt: "Flat illustration of a person with long dark hair and a sage jacket" },
    },
  ],
};

export const testimonials = {
  id: "testimonials",
  heading: "What clients say",
  testimonials: [
    {
      quote: "They measured the reading room three times before they drew a single line. The tables were in the right place on the first day, and the staff stopped moving furniture by the second week.",
      name: "Ines Calder",
      role: "Director, Tidewater Library Trust",
    },
    {
      quote: "The bakery went from a narrow shopfront to a room people wait in happily. The counter and the signs were finished before we opened.",
      name: "Sam Achebe",
      role: "Owner, Kiln Street Bakery",
    },
    {
      quote: "Clear drawings, honest costs, and a joiner who came back to fix a hinge after handover.",
      name: "Priya Nair",
      role: "Facilities manager, Marsh Light Pavilion",
    },
  ],
};

export const selectedWork = {
  id: "selected-work",
  heading: "Selected work",
  intro: "Four recent rooms, from a reading room that reopened in March to a pavilion for a seaside town.",
  projects: [
    {
      title: "Tidewater Reading Room",
      href: "#case-study",
      type: "Public library",
      year: "2025",
      summary: "A reading room for two hundred visitors a day, with daylight tables and shelving that keeps the old brick line.",
      image: { src: "/blocks/reading-room.svg", alt: "Long reading tables under arched windows with lamps" },
    },
    {
      title: "Kiln Street Bakery",
      href: "#portfolio-index",
      type: "Café",
      year: "2024",
      summary: "A narrow shopfront turned into a counter, a bread wall, and two benches for customers who wait.",
      image: { src: "/blocks/bakery.svg", alt: "Arched shelves above a timber counter with pendant lamps" },
    },
    {
      title: "Orchard House",
      href: "#portfolio-index",
      type: "Residence",
      year: "2024",
      summary: "An extension and kitchen for a family house beside an old orchard, with a window seat cut into the north wall.",
      image: { src: "/blocks/orchard.svg", alt: "Pale house with a red roof among round trees" },
    },
    {
      title: "Marsh Light Pavilion",
      href: "#portfolio-index",
      type: "Public pavilion",
      year: "2023",
      summary: "An open-sided shelter on a tidal path, with a roof that drains into a single timber channel.",
      image: { src: "/blocks/pavilion.svg", alt: "Open timber pavilion with a red roof plane above a flat marsh" },
    },
  ],
};

export const portfolio = {
  id: "portfolio-index",
  heading: "Portfolio",
  intro: "Completed work since 2021, newest first. Projects with a full case study link to it.",
  projects: [
    { title: "Tidewater Reading Room", href: "#case-study", type: "Public library", location: "Harbor town", year: "2025", image: { src: "/blocks/reading-room.svg", alt: "Reading room with long tables under arched windows" } },
    { title: "Kiln Street Bakery", href: "#portfolio-index", type: "Café", location: "Old market", year: "2024", image: { src: "/blocks/bakery.svg", alt: "Bakery counter with arched shelves" } },
    { title: "Orchard House", href: "#portfolio-index", type: "Residence", location: "Lower Fenwick", year: "2024", image: { src: "/blocks/orchard.svg", alt: "House with a red roof among round trees" } },
    { title: "Marsh Light Pavilion", href: "#portfolio-index", type: "Public pavilion", location: "Tidal path", year: "2023", image: { src: "/blocks/pavilion.svg", alt: "Open timber pavilion above a flat marsh" } },
    { title: "Harbor Lane Hostel", href: "#portfolio-index", type: "Small hotel", location: "Lower town", year: "2022", image: { src: "/blocks/signage.svg", alt: "Wayfinding sign with three coloured panels" } },
    { title: "Quarry Hall Seating", href: "#portfolio-index", type: "Furniture", location: "Quarry Hall foyer", year: "2021", image: { src: "/blocks/stool.svg", alt: "Timber stool with a red seat on a pale floor" } },
  ],
};

export const caseStudy = {
  id: "case-study",
  title: "Tidewater Reading Room",
  summary: "The Trust wanted a reading room people would use all day. We spent three weeks measuring light and sitting in the building before we drew the room.",
  facts: [
    { label: "Client", value: "Tidewater Library Trust" },
    { label: "Scope", value: "Interiors, furniture, wayfinding" },
    { label: "Completed", value: "March 2025" },
  ],
  image: { src: "/blocks/reading-room.svg", alt: "Long reading tables under arched windows with lamps" },
  chapters: [
    {
      heading: "The brief",
      paragraphs: [
        "The building is a former mill with tall windows on one side only. The old reading room became unusable after noon because of glare on the screens and pages.",
        "We asked staff which seats were chosen first and which stayed empty. Their answer shaped the layout more than any drawing did.",
      ],
    },
    {
      heading: "What we changed",
      paragraphs: [
        "Tables run parallel to the windows, so every seat gets daylight without facing the glass. Shelving stops below sill height so the far wall stays visible from the entrance.",
        "Lamps are fixed to the tables rather than the ceiling. Readers control their own light, and the ceiling stays quiet.",
      ],
    },
    {
      heading: "After opening",
      paragraphs: [
        "The room opened in March. The Trust reports that the afternoon seats now fill first, and staff spend less time moving furniture back into place.",
      ],
    },
  ],
  metrics: [
    { value: "212", label: "Seats across the room" },
    { value: "+40%", label: "Daylight at reading tables at noon on a clear day" },
    { value: "3 weeks", label: "Survey before the first drawing" },
  ],
  quote: {
    text: "Readers ask where the best seats are now. Nobody asks for the old ones back.",
    name: "Ines Calder",
    role: "Director, Tidewater Library Trust",
  },
  next: { title: "Kiln Street Bakery", href: "#portfolio-index" },
};

export const faq = {
  id: "faq",
  heading: "Questions we get",
  intro: "Short answers. The survey and brief explain each step in more detail.",
  items: [
    { question: "How long does a commission take?", answer: "Most rooms take four to six months from first survey to fitting. Furniture made in our workshop adds about two months." },
    { question: "Do you work outside the region?", answer: "Yes, when a project needs regular site visits. We price travel into the fee and tell you the number of trips before we sign." },
    { question: "Can you work with our own architect or contractor?", answer: "Yes. We provide drawings, specifications, and site inspections that fit the existing team's process rather than replacing it." },
    { question: "What does a survey cost?", answer: "A survey has a fixed fee set after a short call. It covers measurements, observation, and a written brief you keep even if you go elsewhere." },
  ],
};

export const clients = {
  id: "clients",
  names: ["Tidewater Trust", "Kiln Street", "Harbor Lane", "Marsh Light", "Quarry Hall"],
  note: "Selected clients, 2019 to 2026.",
};

export const gallery = {
  id: "gallery",
  heading: "Joinery and detail",
  items: [
    { src: "/blocks/stool.svg", alt: "Timber stool with a red seat on a pale floor", caption: "Oak stool made in our workshop for the Quarry Hall foyer." },
    { src: "/blocks/signage.svg", alt: "Wayfinding sign with three coloured panels above a bench", caption: "Wayfinding panels for Harbor Lane Hostel, fixed at eye height." },
    { src: "/blocks/pavilion.svg", alt: "Open timber pavilion with a red roof plane above a flat marsh", caption: "Marsh Light Pavilion, drawn at full scale for its roof channel." },
  ],
};

export const footer = {
  id: "contact",
  name: "Hollin Studio",
  address: "Fieldgate Works, Unit 3, Sawmill Lane",
  email: "hello@hollin.example",
  links: [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Work", href: "#selected-work" },
    { label: "Questions", href: "#faq" },
    { label: "Start a project", href: "#start" },
  ],
};
