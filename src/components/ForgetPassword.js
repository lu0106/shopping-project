import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import EmailInput from "../common/emailInput";

const ForgetPassword = (props) => {
  const [email, setEmail] = useState("");
  const { resetPassword } = useAuth();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      setEmail("");
      props.setWindowType("sendEmail");
    } catch (error) {
      window.alert("Failed to send email");
      console.log(error);
    }
  };

  return (
    <>
      <div className="user_info">
        <p>Email</p>
        <EmailInput email={email} setEmail={setEmail} />
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
          Back to{" "}
          <a
            onClick={() => {
              props.setWindowType("login");
            }}
          >
            Login
          </a>
        </div>
      </div>
      <div className="SendEmailBtn">
        <a onClick={handleReset}>Update password</a>
      </div>
    </>
  );
};

export default ForgetPassword;
