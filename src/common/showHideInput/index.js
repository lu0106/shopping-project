import { useState } from "react";

import "./index.css";

const ShowHideInput = (props) => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [showHide, setShowHide] = useState("show");

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
    setShowHide(function (prev) {
      if (prev === "show") return setShowHide("hide");
      else return setShowHide("show");
    });
  };

  const [passwordAcceptDecline, setPasswordAcceptDecline] = useState();
  function passwordChange(e) {
    props.setPassword(e.target.value);
  }

  function check() {
    if (props.password.length < 6)
      return setPasswordAcceptDecline(
        "Password must be longer than 6 characters"
      );
    else return setPasswordAcceptDecline(null);
  }

  return (
    <>
      <div className="password">
        <input
          type={passwordShown ? "text" : "password"}
          value={props.password}
          onChange={passwordChange}
          onBlur={check}
        />
        <i className="showHide" onClick={togglePasswordVisiblity}>
          {showHide}
        </i>
        <p className="AcceptDecline">{passwordAcceptDecline}</p>
      </div>
    </>
  );
};

export default ShowHideInput;
