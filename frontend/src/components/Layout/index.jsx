import React from "react";

import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";


const Layout = ({ children }) => {
  return (
    <div id="layout-wrapper" style={{ background: 'var(--gou-gray)' }}>
      <Header />
      <Sidebar />
      <main className="gou-main">
        {children}
        <Footer />
      </main>
    </div>
  );
};

export default Layout;
