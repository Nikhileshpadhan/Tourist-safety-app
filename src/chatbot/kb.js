// src/chatbot/kb.js
// Each item has: id, title, tags (array), text (answer), category
export default [
  // Medical emergencies
  {
    id: "med_1",
    title: "Severe bleeding - what to do",
    tags: ["bleeding", "cut", "blood", "wound", "first aid"],
    category: "medical",
    text:
      "If there is severe bleeding: 1) Apply firm pressure directly over the wound with a clean cloth. " +
      "2) Raise the injured area above heart level if possible. 3) Keep applying pressure — do not remove soaked cloth; add more layers. " +
      "4) If bleeding does not stop within 10 minutes, call emergency services immediately. " +
      "5) Try to keep the person calm and warm.",
  },

  {
    id: "med_2",
    title: "What to do for a fainting person",
    tags: ["faint", "unconscious", "syncope", "medical"],
    category: "medical",
    text:
      "If someone faints: 1) Check responsiveness and breathing. 2) If breathing normally, lay them flat and raise their legs for a few minutes to improve blood flow. " +
      "3) Loosen tight clothing. 4) If they do not regain consciousness within 1 minute or breathing is abnormal, call emergency services.",
  },

  {
    id: "med_3",
    title: "Choking (adult) immediate steps",
    tags: ["choking", "choke", "airway"],
    category: "medical",
    text:
      "If an adult is choking and cannot breathe or speak: 1) Encourage them to cough if they can. 2) If not, perform 5 back blows between shoulder blades with the heel of your hand. " +
      "3) Follow with 5 abdominal thrusts (Heimlich maneuver) if you know how. 4) Alternate until object is expelled or they become unconscious. 5) If unconscious, start CPR and call emergency services.",
  },

  // Safety & tourist guidance
  {
    id: "safe_1",
    title: "Stay safe at night",
    tags: ["night", "safety", "danger", "alone"],
    category: "safety",
    text:
      "Avoid poorly lit or isolated areas at night. Use well-known transport options, keep someone informed of your route, and stay in groups if possible. Keep phone charged and emergency contacts handy.",
  },

  {
    id: "safe_2",
    title: "If you get lost",
    tags: ["lost", "directions", "map"],
    category: "safety",
    text:
      "If you are lost: 1) Stop and stay calm. 2) Use your phone map or look for a nearby public place (shop, hotel) to ask for directions. " +
      "3) Share your live location with an emergency contact. 4) If you feel unsafe, move to a busier area or local police station.",
  },

  {
    id: "travel_1",
    title: "What to pack for a day tour",
    tags: ["packing", "tour", "bags", "water"],
    category: "travel",
    text:
      "Pack water, sunscreen, a basic first-aid kit, power bank, ID, and emergency contact. Keep valuables minimal and use a front bag while touring crowded places.",
  },

  // Device / app usage help
  {
    id: "app_1",
    title: "How to trigger SOS",
    tags: ["sos", "panic", "button", "hardware", "shake"],
    category: "app",
    text:
      "You can trigger SOS by tapping the big red SOS button on Home, or (if enabled in settings) by shaking the phone strongly. SOS sends SMS to your emergency contacts and optionally calls the first contact.",
  },

  {
    id: "app_2",
    title: "How to add an emergency contact",
    tags: ["contact", "add", "profile", "emergency"],
    category: "app",
    text:
      "Open Profile > Emergency Contacts, fill the Contact Name and Contact Number fields, and press '+ Add Contact'. The contact is saved on your device and will receive SOS messages.",
  },

  // Common tourist emergency
  {
    id: "med_4",
    title: "What to do for heat stroke",
    tags: ["heat", "heatstroke", "heat stroke", "dehydration"],
    category: "medical",
    text:
      "If someone has signs of heat stroke (hot dry skin, confusion, fainting): 1) Move them to a cool place, remove excess clothing, and cool them with water. 2) Offer sips of water only if fully conscious. 3) Seek immediate medical help—call emergency services.",
  },

  {
    id: "police_1",
    title: "How to contact local police (India)",
    tags: ["police", "report", "e-fir", "emergency number"],
    category: "safety",
    text:
      "In India, call 112 for emergency services. If you need to file an e-FIR, visit the local police website or ask the station for guidance. Keep your ID and incident details ready.",
  },
];
