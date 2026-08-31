import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar, { SidebarOffcanvas } from "./Sidebar";
import Topbar from "./Topbar";

const AppLayout: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="tf-app-shell">
      <Sidebar />
      <SidebarOffcanvas show={showSidebar} onHide={() => setShowSidebar(false)} />
      <div className="tf-main">
        <Topbar onMenuClick={() => setShowSidebar(true)} />
        <main className="tf-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
