import EmailInput from "../common/emailInput";
import ShowHideInput from "../common/showHideInput";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const Signup = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup } = useAuth();

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password);
      await setDoc(doc(db, "cart", email.split("@")[0]), {});
      window.alert("Sign Up Successfully");
      setEmail("");
      setPassword("");
      props.setWindowType("login");
    } catch (error) {
      window.alert("Failed to sign up");
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
        Already have an account?
        <a
          onClick={() => {
            props.setWindowType("login");
          }}
        >
          Login
        </a>
      </div>
      <div className="SignupBtn">
        <a onClick={handleSignin}>Sign Up</a>
      </div>
    </>
  );
};

export default Signup;
