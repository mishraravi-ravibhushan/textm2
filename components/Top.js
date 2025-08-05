import React, { useEffect } from "react";
export default function Top({ title }) {
  return (
    <nav className="header-navbar navbar-expand-md navbar navbar-with-menu fixed-top navbar-dark bg-primary navbar-shadow navbar-brand-center">
      <div className="navbar-wrapper">
        <div className="navbar-header">
          <ul className="nav navbar-nav flex-row">
            <li className="nav-item mobile-menu d-md-none mr-auto">
              <a
                onClick={(e) => e.preventDefault()}
                className="nav-link nav-menu-main menu-toggle hidden-xs"
                data-toggle="collapse"
                href="#"
              >
                <i className="ft-menu font-large-1"></i>
              </a>
            </li>
            <li className="nav-item d-md-none">
              <a
                className="nav-link open-navbar-container"
                data-toggle="collapse"
                data-target="#navbar-mobile"
              >
                <i className="fa fa-ellipsis-v"></i>
              </a>
            </li>
          </ul>
        </div>
        <div className="navbar-container content">
          <div className="collapse navbar-collapse" id="navbar-mobile">
            <ul className="nav navbar-nav mr-auto float-left">
              <li className="nav-item d-none d-md-block">
                <a
                  className="nav-link nav-menu-main menu-toggle hidden-xs"
                  href="#"
                >
                  <i className="ft-menu"> </i>
                </a>
              </li>
              <li className="nav-item d-none d-md-block">
                <a className="nav-link nav-link-expand" href="#">
                  <i className="ficon ft-maximize"></i>
                </a>
              </li>
            </ul>
            <ul className="nav navbar-nav float-right">
              <li className="dropdown dropdown-user nav-item">
                <a
                  className="dropdown-toggle nav-link dropdown-user-link"
                  href="#"
                  data-toggle="dropdown"
                >
                  <span className="avatar avatar-online">
                    <img
                      src="/images/portrait/small/avatar-s-1.png"
                      alt="avatar"
                    />
                    <i></i>
                  </span>
                  <span className="user-name">John Doe</span>
                </a>
                <div className="dropdown-menu dropdown-menu-right">
                  {/* <a className="dropdown-item" href="user-profile.html">
                    <i className="ft-user"></i> Edit Profile
                  </a>
                  <a className="dropdown-item" href="email-application.html">
                    <i className="ft-mail"></i> My Inbox
                  </a>
                  <a className="dropdown-item" href="user-cards.html">
                    <i className="ft-check-square"></i> Task
                  </a>
                  <a className="dropdown-item" href="chat-application.html">
                    <i className="ft-message-square"></i> Chats
                  </a> */}
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item" href="login-with-bg-image.html">
                    <i className="ft-power"></i> Logout
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
