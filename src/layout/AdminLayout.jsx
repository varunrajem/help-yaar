import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return <Outlet />; // No Navbar here
};

export default AdminLayout;