import { useNavigate } from "react-router-dom";

import "../Style/ErrorPage.css";

const ErrorPage = (props) => {
  const navigate = useNavigate();

  const navigateToLoginOrShopping = () => {
    console.log("Error");
    if (props.user !== "Sign In") {
      navigate("/shoppingpage");
    } else navigate("/");
  };

  return (
    <div>
      <p className="errorImg"></p>
      <h1 className="errorMessage">Oops, something went weong!</h1>
      <button className="errorBtn" onClick={() => navigateToLoginOrShopping()}>
        Go Home
      </button>
    </div>
  );
};

export default ErrorPage;
