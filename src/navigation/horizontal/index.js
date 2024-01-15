import { Mail, Users, Box, Thermometer, MapPin, Home } from "react-feather";
import { IoMedkit } from "react-icons/io5";

export default [
  {
    id: "home",
    title: "Home",
    icon: <Home size={20} />,
    navLink: "/",
  },
  {
    id: "patientsPage",
    title: "Patients",
    icon: <Users size={20} />,
    navLink: "/patients",
  },
  {
    id: "productsPage",
    title: "Products",
    icon: <IoMedkit size={20} />,
    navLink: "/products",
  },
  {
    id: "diagnosesPage",
    title: "Diagnoses",
    icon: <Thermometer size={20} />,
    navLink: "/diagnoses",
  },
  {
    id: "locationsPage",
    title: "Locations",
    icon: <MapPin size={20} />,
    navLink: "/locations",
  },

  {
    id: "lookupsPage",
    title: "Lookups",
    icon: <Mail size={20} />,
    navLink: "/lookups",
  },
];
