import { useState } from "react";

import "./index.css";

const EmailInput = (props) => {
  const [emailAcceptDecline, setEmailAcceptDecline] = useState();

  function emailChange(e) {
    props.setEmail(e.target.value);
  }

  function check() {
    if (!props.email.includes("@"))
      return setEmailAcceptDecline("Email must has '@'");
    else return setEmailAcceptDecline(null);
  }
  return (
    <>
      <input
        type="text"
        value={props.email}
        onChange={emailChange}
        onBlur={check}
      />
      <p className="AcceptDecline">{emailAcceptDecline}</p>
    </>
  );
};

export default EmailInput;
