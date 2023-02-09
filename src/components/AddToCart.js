import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

import "../Style/AddToCart.css";

const AddToCart = (props) => {
  const [active, setActive] = useState(false);
  const [quantity, setQuantity] = useState(0);

  const getCartQuantity = async () => {
    try {
      const cartDoc = doc(db, "cart", props.user);
      const snap = await getDoc(cartDoc);
      const tempData = snap.data();
      let cartNum;
      Object.keys(tempData).forEach((key) => {
        if (key === props.product_id) {
          cartNum = tempData[key];
        }
        return;
      });
      // console.log("AddToCart", cartNum);
      if (cartNum !== undefined && cartNum !== 0) {
        setQuantity(cartNum);
        setActive(true);
      } else {
        setQuantity(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCartQuantity();
  }, [
    props.createCartQuantity,
    props.increaseCartQuantity,
    props.decreaseCartQuantity,
    props.deleteCartItem,
  ]);

  return (
    <button
      className="addCartBtnBox"
      onClick={() => {
        if (!active) setActive(true);
      }}
    >
      {active && (
        <span
          className="addCartMinusBtn"
          width={20}
          onClick={() => {
            if (quantity > 0) {
              setQuantity(quantity - 1);
              props.decreaseCartQuantity(props.product_id);
              return;
            } else {
              props.deleteCartItem(props.product_id);
            }
            setActive(false);
          }}
        >
          -
        </span>
      )}
      {active && <span className="addCartNumBtn">{quantity}</span>}
      {active && (
        <span
          className="addCartPlusBtn"
          width={20}
          onClick={() => {
            if (quantity === 0) {
              setQuantity(1);
              props.createCartQuantity(props.product_id);
            } else {
              setQuantity(quantity + 1);
              props.increaseCartQuantity(props.product_id);
              props.update(props.product_id, quantity);
            }
          }}
        >
          +
        </span>
      )}
      {!active && <span className="addCartBtn">Add to Card</span>}
    </button>
  );
};

export default AddToCart;
