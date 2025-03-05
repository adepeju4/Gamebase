import Star from "../assets/bigStar.svg";

import React from "react";

import PropTypes from "prop-types";

function Layout({ children }) {
  const bigStars = [
    <img src={Star} key={1} />,
    <img src={Star} key={2} />,
    <img src={Star} key={3} />,
  ];

  return (
    <div className="authContainer">
      <div className="gameName flex items-center justify-center flex-col">
        <div>Games FM</div>

        <div className="flex p-8">{bigStars}</div>
      </div>
      {children}
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
