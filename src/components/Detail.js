import { useState, useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductContext } from "./Home";
import AddToCart from "./AddToCart";

import "../Style/Detail.css";

const Detail = (props) => {
  const { id } = useParams();
  const { products } = useContext(ProductContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [imageURL, setImageURL] = useState("");

  useEffect(() => {
    products.map((product) => {
      if (product.id === id) {
        setName(product.name);
        setDescription(product.description);
        setCategory(product.category);
        setPrice(product.price);
        setImageURL(product.url);
      }
      return null;
    });
  }, []);

  return (
    <div className="ProductDetailPage">
      <h1>Product Detail</h1>

      <div key={id}>
        <div className="detailImage">
          <img src={imageURL} alt={"product"}></img>
        </div>
        <p className="detailCategory">{category}</p>
        <h2 className="detailName">{name}</h2>
        <div className="priceInStock">
          <h2>${price}</h2>
          {/* <div className="detailOutOfStock">
            <span>Out of Stock</span>
          </div> */}
        </div>
        <p className="detailDescription">{description}</p>
        <div className="detailAddEdit">
          {props.user === "Sign In" ? (
            <></>
          ) : (
            <AddToCart
              product_id={id}
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
            <Link
              to={"/edit/" + id}
              className="detailEdit"
              onClick={props.setCreateOrEdit}
            >
              <span>Edit</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Detail;
