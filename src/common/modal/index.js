import "./index.css";

const Modal = (props) => {
  return (
    <div
      className="Login"
      style={{ display: props.isVisible ? "block" : "none" }}
    >
      <h1 className="loginTitle">{props.title}</h1>
      <div className="button_x">
        <button onClick={props.changeIsVisible}>X</button>
      </div>
      {props.children}
    </div>
  );
};

export default Modal;
