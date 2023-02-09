import EmailInput from "../common/emailInput";
import ShowHideInput from "../common/showHideInput";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      console.log("login");
      props.setUserName(email.match(/(\S*)@/)[1] + "/Log Out");
      props.setIsVisible(false);
      navigate("/shoppingpage");
      setEmail("");
      setPassword("");
    } catch (error) {
      window.alert("Failed to log in");
      console.log(error);
    }
  };

  return (
    <>
      <div className="user_info">
        <p>Email</p>
        <EmailInput email={email} setEmail={setEmail} />
        <p>Password</p>
        <ShowHideInput password={password} setPassword={setPassword} />
      </div>

      <div className="signUpBox">
        Don't have an account?
        <a
          onClick={() => {
            props.setWindowType("signup");
          }}
        >
          Sign Up
        </a>
        <div className="forgetPassword">
          <a
            onClick={() => {
              props.setWindowType("forget");
            }}
          >
            Forget Password
          </a>
        </div>
      </div>
      <div className="SignIn">
        <a onClick={handleLogin}>Sign In</a>
      </div>
      <div className="GuestLogin">
        <a onClick={() => navigate("/shoppingpage")}>Login as Guest</a>
      </div>
    </>
  );
};

export default Login;
