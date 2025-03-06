import Star from "../assets/bigStar.svg";
import { ReactNode } from "react";
import PropTypes from "prop-types";
import { Card, CardContent } from "../components/ui/card";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const bigStars = [
    <img src={Star} key={1} alt="Star" className="w-8 h-8" />,
    <img src={Star} key={2} alt="Star" className="w-8 h-8" />,
    <img src={Star} key={3} alt="Star" className="w-8 h-8" />,
  ];

  return (
    <div className="w-screen h-screen flex items-center justify-center flex-col text-white relative">
      <Card className="bg-transparent border-none shadow-none">
        <CardContent className="flex items-center justify-center flex-col p-6">
          <div className="text-4xl font-bold text-white">Games FM</div>
          <div className="flex p-8">{bigStars}</div>
        </CardContent>
      </Card>
      {children}
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
