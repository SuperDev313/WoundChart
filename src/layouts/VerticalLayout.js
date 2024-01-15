// ** React Imports
import { Outlet } from "react-router-dom";

// ** Core Layout Import
import Layout from "@layouts/VerticalLayout";

// ** Menu Items Array
import navigation from "@src/navigation/vertical";

const VerticalLayout = (props) => {
  return (
    <Layout menuData={navigation} {...props}>
      <Outlet />
    </Layout>
  );
};

export default VerticalLayout;
