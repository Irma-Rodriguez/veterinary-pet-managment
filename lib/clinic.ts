// Static information about the clinic shown on the public pages.
// PawHaven is a fictional clinic: the address, phone (555) and email
// (.example domain) are fake on purpose.
// TODO: load `team` from the database once the `veterinarians` table exists.

export const clinic = {
  name: "PawHaven Veterinary Clinic",
  shortName: "PawHaven",
  tagline: "Caring for your pets like family.",
  address: {
    street: "1250 Maple Avenue",
    city: "Springfield",
    region: "ID 83440",
  },
  phone: "(208) 555-0142",
  emergencyPhone: "(208) 555-0199",
  email: "hello@pawhaven.example",
  hours: [
    { days: "Monday – Friday", time: "8:00 AM – 6:00 PM" },
    { days: "Saturday", time: "9:00 AM – 1:00 PM" },
    { days: "Sunday", time: "Closed" },
  ],
} as const;

export type ServiceIcon =
  "stethoscope" | "syringe" | "scalpel" | "tooth" | "skin" | "feather";

export const services: {
  title: string;
  text: string;
  icon: ServiceIcon;
}[] = [
  {
    title: "Wellness checkups",
    text: "Routine exams to keep your pet healthy at every stage of life.",
    icon: "stethoscope",
  },
  {
    title: "Vaccinations",
    text: "Core and lifestyle vaccines with reminders of what's due next.",
    icon: "syringe",
  },
  {
    title: "Surgery",
    text: "Spay, neuter, and soft-tissue surgery in a modern operating room.",
    icon: "scalpel",
  },
  {
    title: "Dental care",
    text: "Cleanings and dental checks to prevent pain and infections.",
    icon: "tooth",
  },
  {
    title: "Dermatology",
    text: "Help with allergies, itching, and skin or coat problems.",
    icon: "skin",
  },
  {
    title: "Birds & exotic pets",
    text: "Care for birds, rabbits, and other small companions.",
    icon: "feather",
  },
];

export const team = [
  {
    name: "Dr. Laura Ramírez",
    specialty: "General Medicine",
    bio: "Leads our wellness program and loves helping new pet owners.",
  },
  {
    name: "Dr. Daniel Okafor",
    specialty: "Surgery",
    bio: "Fifteen years of experience in soft-tissue and orthopedic surgery.",
  },
  {
    name: "Dr. Mei Chen",
    specialty: "Dermatology",
    bio: "Finds the cause behind allergies and stubborn skin problems.",
  },
  {
    name: "Dr. Sofía Martins",
    specialty: "Birds & Exotic Pets",
    bio: "Our specialist for birds, rabbits, and other small animals.",
  },
];
