import React from "react";
import BackButton from "../../elements/BackButton";

import PropTypes from "prop-types";
import Cookies from "universal-cookie";
import { useStoreActions } from "easy-peasy";
import { useLocation, useNavigate } from "react-router-dom";

function Navbar({ client }) {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const setGame = useStoreActions((state) => state.setActiveGame);
  const setUser = useStoreActions((state) => state.setUser);

  const location = useLocation();

  const handleLogOut = () => {
    cookies.remove("userId");
    cookies.remove("userName");
    cookies.remove("firstName");
    cookies.remove("lastName");
    cookies.remove("hashedPassword");
    cookies.remove("token");
    client.disconnectUser();
    setUser(null);
    navigate("/login");
  };

  const handleBack = () => {
    setGame("");
    navigate("/");
  };

  return (
    <nav>
      <button onClick={handleLogOut} id="logout" className="text-large">
        Log Out
      </button>

      {location.pathname === "/join" && (
        <BackButton handleBackButton={handleBack} />
      )}
    </nav>
  );
}

Navbar.propTypes = {
  client: PropTypes.object.isRequired,
};

export default Navbar;
