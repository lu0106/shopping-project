import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import AddToCart from "./AddToCart";
import { ProductContext } from "./Home";

import "../Style/ShoppingPage.css";

const ShoppingPage = (props) => {
  const { products, setProducts } = useContext(ProductContext);
  const [productsOrder, setProductsOrder] = useState([]);
  const productsCollectionRef = collection(db, "products");
  const [productOrder, setProductOrder] = useState("");
  const NumberOnPage = 6;
  const [changePageNumber, setChangePageNumber] = useState(1);
  const navigate = useNavigate();

  const productOrderList = (e) => {
    setProductOrder(e.target.value);
    if (e.target.value === "random") setProductsOrder(products);
    if (e.target.value === "priceLowToHigh") {
      productsOrder.sort((a, b) => {
        return a.price - b.price;
      });
    }
    if (e.target.value === "priceHighToLow") {
      productsOrder.sort((a, b) => {
        return b.price - a.price;
      });
    }
  };

  const deleteProduct = async (id) => {
    try {
      const productDoc = doc(db, "products", id);
      await deleteDoc(productDoc);
      window.location.reload();
    } catch (error) {
      window.alert("Failed to delete product");
      console.log(error);
    }
  };

  useEffect(() => {
    const getProducts = async () => {
      try {
        const productData = await getDocs(productsCollectionRef);
        setProducts(
          productData.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
        setProductsOrder(
          productData.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      } catch (error) {
        console.log(error);
      }
    };
    getProducts();
  }, []);

  return (
    <div className="shoppingPage">
      <div className="shoppingPageTitle">
        <h1>Products</h1>
        <div className="selectBar">
          <select value={productOrder} onChange={productOrderList}>
            <option value="random">Random</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
          </select>
        </div>
        {props.user === "Sign In" ? (
          <></>
        ) : (
          <button
            className="addProductShoppingPage"
            onClick={() => {
              navigate("/createproduct");
            }}
          >
            Add Product
          </button>
        )}
      </div>

      <div className="productsDisplay">
        <ul>
          {productsOrder.map((product, index) => {
            if (
              index >= NumberOnPage * (changePageNumber - 1) &&
              index < NumberOnPage * changePageNumber &&
              product.name.toLowerCase().includes(props.searchKeyWords)
            ) {
              return (
                <li key={index}>
                  <div className="showProductImage">
                    <img src={product.url}></img>
                  </div>
                  <div className="showProductName">
                    <Link to={"/detail/" + product.id}>
                      <span>{product.name}</span>
                    </Link>
                    {props.user === "Sign In" ? (
                      <></>
                    ) : (
                      <button
                        className="productDeleteBtn"
                        onClick={() => {
                          deleteProduct(product.id);
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p>${product.price}</p>
                  {props.user === "Sign In" ? (
                    <></>
                  ) : (
                    <AddToCart
                      product_id={product.id}
                      user={props.user}
                      createCartQuantity={props.createCartQuantity}
                      increaseCartQuantity={props.increaseCartQuantity}
                      decreaseCartQuantity={props.decreaseCartQuantity}
                      deleteCartItem={props.deleteCartItem}
                    />
                  )}
                  {props.user === "Sign In" ? (
                    <></>
                  ) : (
                    <Link to={"/edit/" + product.id}>
                      <span className="productEditBtn">Edit</span>
                    </Link>
                  )}
                </li>
              );
            }
          })}
        </ul>
      </div>

      <div className="changePage">
        <ul>
          {productsOrder.map((product, index) => {
            index /= NumberOnPage;
            if (index % 1 === 0)
              return (
                <li key={index + 1}>
                  <button
                    value={index + 1}
                    onClick={() => {
                      setChangePageNumber(index + 1);
                      window.scrollTo(0, 0);
                    }}
                  >
                    {index + 1}
                  </button>
                </li>
              );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ShoppingPage;
