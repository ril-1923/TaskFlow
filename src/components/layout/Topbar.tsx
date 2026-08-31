import React from "react";
import { Dropdown } from "react-bootstrap";
import { FiMenu, FiSun, FiMoon, FiLogOut, FiUser, FiSettings } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import SearchBar from "../common/SearchBar";
import NotificationDropdown from "../common/NotificationDropdown";
import UserAvatar from "../common/UserAvatar";

const Topbar: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const { theme, toggleTheme, currentUser, logout } = useApp();
  const navigate = useNavigate();

  return (
    <header className="tf-topbar">
      <button className="btn btn-outline-secondary d-lg-none border-0" onClick={onMenuClick} aria-label="Open menu">
        <FiMenu size={20} />
      </button>
      <SearchBar />
      <div className="ms-auto d-flex align-items-center gap-2">
        <button className="btn btn-outline-secondary border-0" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
        </button>
        <NotificationDropdown />
        <Dropdown align="end">
          <Dropdown.Toggle as="button" className="btn border-0 p-0" id="user-menu" aria-label="User menu">
            <UserAvatar user={currentUser} size={38} />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Header>{currentUser.name}</Dropdown.Header>
            <Dropdown.Item onClick={() => navigate("/profile")}><FiUser className="me-2" />Profile</Dropdown.Item>
            <Dropdown.Item onClick={() => navigate("/settings")}><FiSettings className="me-2" />Settings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <FiLogOut className="me-2" />Log out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </header>
  );
};

export default Topbar;
