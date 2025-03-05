import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import fetcher from "../../lib/fetcher";
import Modal from "../../elements/Modal/Modal";
import { Link } from "react-router-dom";
import { useDispatchComp } from "../../lib/hooks";

interface UserFormData {
  userName?: string;
  password?: string;
  [key: string]: string | undefined;
}

interface InputErrorState {
  userName?: boolean;
  password?: boolean;
  [key: string]: boolean | undefined;
}

const cookies = new Cookies();

function LogIn() {
  const [pending, setPending] = useState(false);
  const [user, setUser] = useState<UserFormData>({});
  const [error, setError] = useState<string | null>(null);
  const [inputError, setinputError] = useState<InputErrorState>({});

  const navigate = useNavigate();

  const modalProps = {
    title: ":( Opps!",
    body: error + " 👀",
    dispatch: error,
    setDispatch: setError,
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setPending(true);
      const result = await fetcher("/Api/Auth/login", {
        method: 'POST',
        body: user
      });

      const userData = result.success ? result.data : null;

      if (userData) {
        cookies.set("firstName", userData.firstName);
        cookies.set("userName", userData.userName);
        cookies.set("lastName", userData.lastName);
        cookies.set("userId", userData.userId);
        cookies.set("token", userData.token);
        cookies.set("hashedPassword", userData.hashedPassword);

        navigate("/");
        return;
      }

      
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

      <Button type="submit" disabled={pending}>
        {pending ? "Logging In" : "Log In"}
      </Button>

      {error && useDispatchComp(Modal, modalProps)}
    </form>
  );
}

export default LogIn;
