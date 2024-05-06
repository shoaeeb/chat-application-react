import React from "react";
import NavBar from "../components/NavBar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen">
      <NavBar />
      {children}
    </div>
  );
};

export default Layout;
