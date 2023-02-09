import { useContext, useState, useEffect } from "react";
import { ProductContext, UserCartTotalNumContext } from "./Home";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import AddToCart from "./AddToCart";

import "../Style/Cart.css";

const Carts = (props) => {
  const [discountMessage, setDiscountMessage] = useState("");
  const [discount, setDiscount] = useState(0);
  const [cartInfo, setCartInfo] = useState([]);

  const {
    userCartTotalNum,
    setUserCartTotalNum,
    userCartTotalPrice,
    setUserCartTotalPrice,
  } = useContext(UserCartTotalNumContext);
  const { products } = useContext(ProductContext);

  const checkDiscount = () => {
    if (
      discountMessage === "20 DOLLAR OFF" &&
      userCartTotalPrice * 1.1 - 20 > 0
    ) {
      setDiscount(20);
      return;
    } else if (
      discountMessage === "20 DOLLAR OFF" &&
      userCartTotalPrice * 1.1 - 20 < 0
    ) {
      setDiscount((userCartTotalPrice * 1.1).toFixed(2));
      return;
    }
    window.alert("The promotional code you entered is not valid.");
  };

  useEffect(() => {
    const updateCart = async () => {
      try {
        let tempUserCartTotalNum = 0;
        let tempUserCartTotalPrice = 0;
        const cartDoc = doc(db, "cart", props.user);
        const snap = await getDoc(cartDoc);
        const tempData = snap.data();
        Object.keys(tempData).forEach((key1) => {
          if (tempData[key1] > 0) tempUserCartTotalNum += tempData[key1];
          Object.keys(products).forEach((key2) => {
            if (key1 === products[key2].id && tempData[key1] > 0) {
              tempUserCartTotalPrice += tempData[key1] * products[key2].price;
              // console.log(products[key2].name, tempData[key1]);
              let obj = {
                id: products[key2].id,
                name: products[key2].name,
                url: products[key2].url,
                price: products[key2].price,
              };
              setCartInfo((prop) => [...prop, obj]);
            }
          });
        });
        setUserCartTotalNum(tempUserCartTotalNum);
        setUserCartTotalPrice(tempUserCartTotalPrice);
      } catch (error) {
        console.log(error);
      }
    };
    updateCart();
  }, []);

  let cartInfoFiltered = cartInfo.filter(
    (ele, ind) => ind === cartInfo.findIndex((elem) => elem.id === ele.id)
  );

  return (
    <div className={"cartPage"}>
      <div className={"cart_card"}>
        <div className={"cart_header"}>
          <div>
            <h1>Cart</h1>
            <span>({userCartTotalNum})</span>
          </div>
          <p onClick={props.onClose}>X</p>
        </div>
        <div className={"cart_products"}>
          {cartInfoFiltered.map((product) => {
            return (
              <div className={"product_item"} key={product.id}>
                <img src={product.url} alt={"Product"}></img>
                <div className={"product_item_detail"}>
                  <div className={"product_item_info"}>
                    <h3>{product.name}</h3>
                    <p>${product.price}</p>
                  </div>
                  <div className={"product_item_action"}>
                    <AddToCart
                      product_id={product.id}
                      user={props.user}
                      createCartQuantity={props.createCartQuantity}
                      increaseCartQuantity={props.increaseCartQuantity}
                      decreaseCartQuantity={props.decreaseCartQuantity}
                    />
                    <a
                      className={"product_item_remove"}
                      onClick={() => {
                        props.deleteCartItem(product.id);
                        setCartInfo(
                          cartInfo.filter(
                            (ele, ind) =>
                              ind ===
                              cartInfo.findIndex(
                                (elem) =>
                                  elem.id === ele.id && ele.id !== product.id
                              )
                          )
                        );
                      }}
                    >
                      Remove
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className={"cart_discount"}>
          <p>Apply Discount Code</p>
          <div className={"cart_discount_input"}>
            <input
              autoFocus
              disabled={userCartTotalNum === 0}
              placeholder={"20 DOLLAR OFF"}
              value={discountMessage}
              onChange={(e) => setDiscountMessage(e.target.value)}
            />
            <button onClick={() => checkDiscount()}>Apply</button>
          </div>
        </div>
        <div className={"cart_total"}>
          <div className={"fee_item"}>
            <span>Subtotal : {userCartTotalPrice}</span>
          </div>
          <div className={"fee_item"}>
            <span>Tax : {(userCartTotalPrice / 10).toFixed(2)}</span>
          </div>
          <div className={"fee_item"}>
            <span>Discount : {discount}</span>
          </div>
          <div className={"fee_item"}>
            <span>
              Estimated total :{" "}
              {userCartTotalPrice * 1.1 - discount > 0
                ? (userCartTotalPrice * 1.1 - discount).toFixed(2)
                : 0}
            </span>
          </div>
        </div>
        <button className={"cart_submit"} disabled={userCartTotalNum === 0}>
          Continue to checkout
        </button>
      </div>
    </div>
  );
};

export default Carts;
