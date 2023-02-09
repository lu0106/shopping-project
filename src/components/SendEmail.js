import { useEffect, useState } from "react";

const SendEmail = () => {
  const [second, setSecond] = useState(5);
  const backToHome = () => {
    setTimeout("location.href='http://localhost:3000/'", 5000);
  };

  useEffect(() => {
    if (second > 0) {
      setTimeout(() => {
        setSecond(second - 1);
      }, 1000);
    }
    backToHome();
  });

  return (
    <>
      <p1 className="sendEmailImg"></p1>
      <p className="sendEmailMessage">
        We have sent the update password line to your email, please check that!
      </p>
      <h1 className="sendEmailSecond">{second}</h1>
    </>
  );
};

export default SendEmail;
