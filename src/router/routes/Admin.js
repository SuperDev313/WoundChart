import { lazy } from "react";

const ProductSearch = lazy(() =>
  import("../../views/pages/products/ProductSearch")
);
const MedicinesSearch = lazy(() =>
  import("../../views/pages/medicines/MedicinesSearch")
);
const DiagnosisSearch = lazy(() =>
  import("../../views/pages/diagnosis/DiagnosisSearch")
);
const LocationsSearch = lazy(() =>
  import("../../views/pages/locations/LocationsSearch")
);
const LookupsSearch = lazy(() =>
  import("../../views/pages/lookups/LookupsSearch")
);
const ClinicsSearch = lazy(() =>
  import("../../views/pages/clinics/ClinicsSearch")
);

const UsersSearch = lazy(() =>
  import("../../views/pages/users/UsersSearch")
);

const AdminRoutes = [
  {
    path: "/products",
    element: <ProductSearch />,
  },
   
  {
    path: "/diagnoses",
    element: <DiagnosisSearch />,
  },
   
  {
    path: "/locations",
    element: <LocationsSearch />,
  },
   
  {
    path: "/medicines",
    element: <MedicinesSearch />,
  },
   
  {
    path: "/lookups",
    element: <LookupsSearch />,
  },
   
  {
    path: "/clinics",
    element: <ClinicsSearch />,
  },
  {
    path: "/users",
    element: <UsersSearch />,
  },
];

export default AdminRoutes;
