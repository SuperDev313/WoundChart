import {
  Users,
  PieChart,
  AlignJustify,
  Calendar,
  Home,
  Tool,
  File,
  CornerDownRight,
  DollarSign,
  FileText,
  MapPin,
  Mail,
} from "react-feather";
import { IoMedkit, IoHammer, IoPersonCircle } from "react-icons/io5";
import { FaUserDoctor } from "react-icons/fa6";

export default [
  {
    id: "home",
    title: "Home",
    icon: <Home size={20} />,
    navLink: "/home",
  },
  {
    id: "cm",
    title: "CMs",
    icon: <IoHammer size={20} />,
    navLink: "/cm",
  },
  {
    id: "patients",
    title: "Patients",
    icon: <Users size={20} />,
    children: [
      {
        id: "new-patient",
        title: "New Patient",
        icon: <CornerDownRight size={20} />,
        navLink: "/new-patient",
      },
      {
        id: "all-patients",
        title: "All Patients",
        icon: <CornerDownRight size={20} />,
        navLink: "/patients",
      },
      {
        id: "signatures",
        title: "Signatures",
        icon: <CornerDownRight size={20} />,
        navLink: "/signatures",
      },
    ],
  },
  {
    id: "calendar",
    title: "Calendar",
    icon: <Calendar size={20} />,
    navLink: "/calendar",
  },
  {
    id: "documents",
    title: "Documents",
    navLink: "/document-list",
    icon: <File size={20} />,
  },
  {
    id: "stats",
    title: "Stats",
    icon: <PieChart size={20} />,
    navLink: "/stats",
  },
  {
    id: "billing",
    title: "Billing",
    icon: <DollarSign size={20} />,
    children: [
      {
        id: "patient-billing",
        title: "Patient Billing",
        icon: <CornerDownRight size={20} />, // Replace with the appropriate icon
        navLink: "/patient-billing",
      },
      {
        id: "billing-reports",
        title: "Billing Report",
        icon: <CornerDownRight size={20} />, // Replace with the appropriate icon
        navLink: "/billing-reports",
      },
      {
        id: "authorization",
        title: "Authorization",
        icon: <CornerDownRight size={20} />, // Replace with the appropriate icon
        navLink: "/authorization",
      },
    ],
  },
  {
    id: "products",
    title: "Products",
    icon: <IoMedkit size={20} />,
    navLink: "/products",
  },
  {
    id: "cpts",
    title: "CPTs",
    icon: <Tool size={20} />,
    navLink: "/cpts",
  },
  {
    id: "messages",
    title: "Messages",
    icon: <FaUserDoctor size={20} />,
    navLink: "/messages"
  },
  {
    id: "users",
    title: "Users",
    icon: <FaUserDoctor size={20} />,
    navLink: "/users"
  },
  {
    id: "admin",
    title: "Admin",
    icon: <IoPersonCircle size={20} />,
    children: [
      {
        id: "locations",
        title: "Locations",
        icon: <CornerDownRight size={20} />,
        navLink: "/locations",
      },
      {
        id: "clinics",
        title: "Clinics",
        icon: <CornerDownRight size={20} />,
        navLink: "/clinics",
      },
      {
        id: "lookups",
        title: "Loookups",
        icon: <CornerDownRight size={20} />,
        navLink: "/lookups",
      },
    ],
  },
  {
    id: "notes",
    title: "Notes",
    icon: <FileText size={20} />,
    navLink: "/notes",
  },
];
