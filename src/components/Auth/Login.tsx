import React, { useState } from "react";
import fetcher from "../../lib/fetcher.js";
import { useDispatchComp } from "../../lib/hooks";
import Modal from "../../elements/Modal/Modal";
import Cookies from "universal-cookie";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "antd";

function LogIn() {
  const cookies = new Cookies();
  const [pending, setPending] = useState(false);
  const [user, setUser] = useState({});
  const [error, setError] = useState(null);
  const [inputError, setinputError] = useState({});

  const navigate = useNavigate();

  const modalProps = {
    title: ":( Opps!",
    body: error + " 👀",
    dispatch: error,
    setDispatch: setError,
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setPending(true);
      const result = await fetcher("/Api/Auth/login", user);

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
      className="login w-[50%] lg:w-[30%] flex flex-col gap-4 text-medium"
      onSubmit={handleSubmit}
    >
      <label> Log In</label>

      {inputError.userName && (
        <p className="inputError">Username not provided</p>
      )}
      <Input
        type="text"
        placeholder="Username"
        required
        className="w-[60%]  "
        onChange={(e) => {
          setUser({ ...user, userName: e.target.value });
        }}
        onBlur={(e) => {
          if (!e.target.value) setinputError({ ...inputError, userName: true });
          else setinputError({ ...inputError, userName: false });
        }}
      />
      {inputError.password && (
        <p className="inputError">Password not provided</p>
      )}
      <Input
        type="password"
        required
        placeholder="Password"
        className="w-[60%]"
        onChange={(e) => {
          setUser({ ...user, password: e.target.value });
        }}
        onBlur={(e) => {
          if (!e.target.value) setinputError({ ...inputError, password: true });
          else setinputError({ ...inputError, password: false });
        }}
      />

      <Link to="/signup">Don&apos;t have an account? Sign up</Link>

      <button type="submit" disabled={pending}>
        {pending ? "Logging In" : "Log In"}
      </button>

      {error && useDispatchComp(Modal, modalProps)}
    </form>
  );
}

export default LogIn;
