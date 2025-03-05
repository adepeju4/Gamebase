import React, { useState } from "react";
import fetcher from "../../lib/fetcher.js";
import { useDispatchComp } from "../../lib/hooks";
import Modal from "../../elements/Modal/Modal";
import Cookies from "universal-cookie";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "antd";

function SignUp() {
  const cookies = new Cookies();
  const [user, setUser] = useState({});
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const [inputError, setinputError] = useState({});

  const navigate = useNavigate();

  const modalProps = {
    title: ":( Opps!",
    body: `Something went wrong :( ... please try again later`,
    dispatch: error,
    setDispatch: setError,
  };

  const checkInputHandler = (input, label) => {
    if (!input) setinputError({ ...inputError, [label]: true });
    else setinputError({ ...inputError, [label]: false });
  };

  const inputErrorMessage = (input) => {
    return <p className="inputError"> {input} not provided</p>;
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setPending(true);
      const result = await fetcher("Api/Auth/signup", user);

      if (!result.err) {
        cookies.set("firstName", result.firstName);
        cookies.set("userName", result.userName);
        cookies.set("lastName", result.lastName);
        cookies.set("userId", result.userId);
        cookies.set("token", result.token);
        cookies.set("hashedPassword", result.password);

        navigate("/");
        return;
      }

      setError(result.err);
    } catch (error) {
      setError("Something went wrong");
    }
    setPending(false);
  };
  return (
    <form
      className="signup w-[50%] lg:w-[30%] flex flex-col gap-4 text-medium"
      onSubmit={handleSubmit}
    >
      <label> Sign Up</label>

      {inputError.firstName && inputErrorMessage("firstName")}
      <Input
        className="w-[60%]"
        type="text"
        placeholder="First Name"
        required
        onChange={(e) => {
          setUser({ ...user, firstName: e.target.value });
        }}
        onBlur={(e) => {
          checkInputHandler(e.target.value, "firstName");
        }}
      />
      {inputError.lastName && inputErrorMessage("lastName")}
      <Input
        className="w-[60%]"
        type="text"
        placeholder="Last Name"
        required
        onChange={(e) => {
          setUser({ ...user, lastName: e.target.value });
        }}
        onBlur={(e) => {
          checkInputHandler(e.target.value, "lastName");
        }}
      />
      {inputError.userName && inputErrorMessage("userName")}
      <Input
        className="w-[60%]"
        type="text"
        placeholder="Username"
        required
        onChange={(e) => {
          setUser({ ...user, userName: e.target.value });
        }}
        onBlur={(e) => {
          checkInputHandler(e.target.value, "userName");
        }}
      />
      {inputError.password && inputErrorMessage("password")}
      <Input
        className="w-[60%]"
        type="password"
        placeholder="Password"
        required
        onChange={(e) => {
          setUser({ ...user, password: e.target.value });
        }}
        onBlur={(e) => {
          checkInputHandler(e.target.value, "password");
        }}
      />
      <Link to="/login">Already signed up? Log in</Link>
      <button type="submit" disabled={pending}>
        {pending ? "Signing Up" : "Sign Up"}
      </button>

      {error && useDispatchComp(Modal, modalProps)}
    </form>
  );
}

export default SignUp;
