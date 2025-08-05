// import node module libraries
import { useState, useEffect, useRef } from "react";

// import sub components
import NavbarVertical from "./navbars/NavbarVertical";
import NavbarTop from "./navbars/NavbarTop";
import { Row, Col } from "react-bootstrap";
import { useAuth } from "context/AuthContext";

const DefaultDashboardLayout = (props) => {
  const [showMenu, setShowMenu] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [width, setWidth] = useState(0);

  const sidebarRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      if (sidebarRef.current) {
        setWidth(sidebarRef.current.offsetWidth);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  //const { user, login, logout } = useAuth();
  const ToggleMenu = () => {
    return setShowMenu(!showMenu);
  };
  return (
    <div id="db-wrapper" className={`${showMenu ? "" : "toggled"}`}>
      <div className="navbar-vertical navbar" ref={sidebarRef}>
        <NavbarVertical
          showMenu={showMenu}
          onClick={(value) => setShowMenu(value)}
        />
      </div>
      <div id="page-content">
        <div
          className={`header transition-all duration-300 ${
            scrolled
              ? "bg-white shadow-md fixed-top shadow-sm"
              : "bg-transparent"
          }`}
          style={{ left: width }}
        >
          <NavbarTop
            data={{
              showMenu: showMenu,
              SidebarToggleMenu: ToggleMenu,
            }}
          />
        </div>
        {props.children}
        <div className="px-6 border-top py-3">
          <Row>
            <Col sm={6} className="text-center text-sm-start mb-2 mb-sm-0">
              <p className="m-0">
                Made by <a href="#" target="_blank"></a>
              </p>
            </Col>
            <Col sm={6} className="text-center text-sm-end">
              <p className="m-0"></p>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};
export default DefaultDashboardLayout;
