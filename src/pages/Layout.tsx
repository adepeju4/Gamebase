import Star from "../assets/bigStar.svg";
import { ReactNode } from "react";
import PropTypes from "prop-types";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const bigStars = [
    <img src={Star} key={1} alt="Star" />,
    <img src={Star} key={2} alt="Star" />,
    <img src={Star} key={3} alt="Star" />,
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
