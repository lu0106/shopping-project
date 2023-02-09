import { useEffect, useContext, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ProductContext, UserCartTotalNumContext } from "./Home";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Cart from "./Cart";

import "../Style/Header.css";

const Header = (props) => {
  const { logout } = useAuth();
  const { products } = useContext(ProductContext);
  const {
    userCartTotalNum,
    setUserCartTotalNum,
    userCartTotalPrice,
    setUserCartTotalPrice,
  } = useContext(UserCartTotalNumContext);
  // const [userCartTotalNum, setUserCartTotalNum] = useState(0);
  const user = props.userName.split("/")[0];
  const navigate = useNavigate();
  const [showHideCart, setShowHideCart] = useState(false);
  const [keyWords, setKeyWords] = useState("");

  const handleLogout = async () => {
    try {
      await logout();
      props.setIsVisible(true);
      props.setUserName("Sign In");
      navigate("/");
    } catch (error) {
      console.error();
    }
  };

  const getCart = async () => {
    try {
      let tempUserCartTotalNum = 0;
      let tempUserCartTotalPrice = 0;
      const cartDoc = doc(db, "cart", user);
      const snap = await getDoc(cartDoc);
      const tempData = snap.data();
      Object.keys(tempData).forEach((key1) => {
        // console.log(key1, "  :  ", tempData[key1]);
        if (tempData[key1] > 0) tempUserCartTotalNum += tempData[key1];
        Object.keys(products).forEach((key2) => {
          // console.log(key1, products[key2].id);
          if (key1 === products[key2].id && tempData[key1] > 0) {
            tempUserCartTotalPrice += tempData[key1] * products[key2].price;
          }
        });
      });
      setUserCartTotalNum(tempUserCartTotalNum);
      setUserCartTotalPrice(tempUserCartTotalPrice);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  if (products) getCart();

  return (
    <div className="Header">
      {showHideCart ? (
        <Cart
          onClose={() => setShowHideCart(false)}
          showHideCart={showHideCart}
          user={user}
          createCartQuantity={props.createCartQuantity}
          increaseCartQuantity={props.increaseCartQuantity}
          decreaseCartQuantity={props.decreaseCartQuantity}
          deleteCartItem={props.deleteCartItem}
        />
      ) : (
        <></>
      )}
      <div className="title">
        <h1 className="title_Management">Management</h1>
        <h1 className="title_M">M</h1>
        <span>Chuwa</span>
      </div>
      <div className="search">
        <input
          className="headerSearch"
          type="text"
          placeholder="Search"
          value={keyWords}
          onChange={(e) => setKeyWords(e.target.value)}
        />
        <a
          onClick={() => {
            props.setSearchKeyWords(keyWords);
          }}
        ></a>
      </div>

      <div className="user_box">
        <div className="user_img">
          <p></p>
        </div>
        <div className="user_name">
          <a className="user" onClick={handleLogout}>
            {props.userName}
          </a>
        </div>
      </div>
      <div className="cart_box">
        <div className="cart_img">
          <p></p>
          {props.userName === "Sign In" ? <></> : <a>{userCartTotalNum}</a>}
        </div>
        <div className="cart_name">
          {props.userName === "Sign In" ? (
            <a className="cart_price">$0.00</a>
          ) : (
            <a className="cart_price" onClick={() => setShowHideCart(true)}>
              ${userCartTotalPrice}.00
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
