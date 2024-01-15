import { lazy } from "react";

const Dashboard = lazy(() => import("../../views/pages/Dashboard"));

const ComingSoonPage = lazy(() => import("../../views/pages/ComingSoon"));

const StatsCard = lazy(() => import("../../views/pages/stats/StatsCard"));

const CmCard = lazy(() => import("../../views/pages/cm/CmCard"));

const Calendar = lazy(() => import("../../views/pages/calendar/index"));

const Profile = lazy(() => import("../../views/pages/profile/index"));

const DocumentList = lazy(() => import("../../views/pages/document/DocumentList"));

const MessageSearch = lazy(() => import("../../views/pages/messages/MessagesSearch"));

const AgreementCard = lazy(() => import("../../views/pages/patients/view-tabs/AgreementCard"))

const CommonRoutes = [
  {
    path: "/home",
    element: <Dashboard />,
  },
  {
    path: "/coming-soon",
    element: <ComingSoonPage />,
  },
  {
    path: "/calendar",
    element: <Calendar />,
  },
  {
    path: "/stats",
    element: <StatsCard />,
  },
  {
    path: "/cm",
    element: <CmCard />,
  },
  {
    path: "/document-list",
    element: <DocumentList />
  },
 
  {
    path: "/agreement",
    element: <AgreementCard />
  },

  {
    path: "/profile",
    element: <Profile />
  },

  {
    path: "/messages",
    element: <MessageSearch />
  }

];

export default CommonRoutes;
