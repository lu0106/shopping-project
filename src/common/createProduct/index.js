import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProductContext } from "../../components/Home";
import { db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";

import "./index.css";

const CreateProduct = (props) => {
  const [isVisible, setIsVisible] = useState(true);
  const showImage = (e) => {
    e.stopPropagation();
    if (isVisible === true) setIsVisible(false);
  };

  const navigate = useNavigate();
  const handleClick = () => {
    if (props.createOrEdit) props.createProductClick();
    else editProduct();

    setTimeout(() => {
      navigate("/shoppingpage");
      window.scrollTo(0, 0);
    }, 500);
  };

  const { id } = useParams();
  const { products } = useContext(ProductContext);
  useEffect(() => {
    console.log(props.createOrEdit);

    products.map((product) => {
      if (product.id === id) {
        props.setName(product.name);
        props.setDescription(product.description);
        props.setCategory(product.category);
        props.setPrice(product.price);
        props.setQuantity(product.quantity);
        props.setImageURL(product.url);
      }
      return null;
    });
  }, []);

  const editProduct = async () => {
    try {
      const productDoc = doc(db, "products", id);
      const newProduct = {
        name: props.name,
        description: props.description,
        category: props.category,
        price: props.price,
        quantity: props.quantity,
        url: props.imageURL,
      };
      await updateDoc(productDoc, newProduct);
    } catch (error) {
      window.alert("The product has been deleted.");
    }
    props.setName("");
    props.setDescription("");
    props.setCategory("");
    props.setPrice(0);
    props.setQuantity(0);
    props.setImageURL("");
    props.navigate("/shoppingpage");
  };

  console.log(props.createOrEdit);

  return (
    <div className="CreateProduct">
      <h1>{props.title}</h1>
      <div className="productPage">
        <div className="productInfo">
          <p>Product Name</p>
          <input
            type="text"
            placeholder="Product Name..."
            value={props.name}
            onChange={(e) => {
              props.setName(e.target.value);
            }}
          ></input>

          <p>Product Description</p>
          <textarea
            className="productDescription"
            placeholder="Product Description"
            value={props.description}
            onChange={(e) => {
              props.setDescription(e.target.value);
            }}
          ></textarea>

          <div className="category">
            <p>Category</p>
            <select
              className="categoryBar"
              value={props.category}
              onChange={(e) => {
                props.setCategory(e.target.value);
              }}
            >
              <option value="category1">Category1</option>
              <option value="category2">Category2</option>
              <option value="category3">Category3</option>
            </select>
          </div>

          <div className="price">
            <p>Price</p>
            <input
              type="number"
              value={props.price}
              onChange={(e) => {
                props.setPrice(e.target.value);
              }}
            ></input>
          </div>

          <div className="inStockQuantity">
            <p>In Stock Quantity</p>
            <input
              type="number"
              value={props.quantity}
              onChange={(e) => {
                props.setQuantity(e.target.value);
              }}
            ></input>
          </div>

          <div className="addImageLink">
            <p>Add Image Link</p>
            <div className="linkInput">
              <input
                type="url"
                value={props.imageURL}
                onChange={(e) => {
                  props.setImageURL(e.target.value);
                }}
                placeholder="http://"
              ></input>
              <button className="showImageBtn" onClick={showImage}>
                Show
              </button>
            </div>
          </div>

          <div className="imagePreview">
            <div
              className="noImage"
              style={{ display: isVisible ? "block" : "none" }}
            ></div>
            <img
              src={props.imageURL}
              alt={"Product"}
              style={{ display: isVisible ? "none" : "block" }}
            ></img>
          </div>

          <button
            className="addProductCreateProduct"
            onClick={() => {
              handleClick();
            }}
          >
            {props.buttonTag}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
