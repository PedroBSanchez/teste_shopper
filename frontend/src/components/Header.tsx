import React from "react";

import "./Header.css";

import logoShopper from "../assets/logoshopper.png";

const Header = () => {
  return (
    <div className="shopper-header pb-3">
      <div className="row">
        <div className="offset-1 col">
          <img src={logoShopper} width={175} height={75} />
        </div>
      </div>
    </div>
  );
};

export default Header;
