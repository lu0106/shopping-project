import Header from "./Header";
import Footer from "./Footer";
import Modal from "../common/modal";
import { useState, useEffect, createContext } from "react";
import Login from "./Login";
import Signup from "./Signup";
import ForgetPassword from "./ForgetPassword";
import SendEmail from "./SendEmail";
import ShoppingPage from "./ShoppingPage";
import CreateProduct from "../common/createProduct";
import Detail from "./Detail";
import ErrorPage from "./ErrorPage";
import ErrorBoundary from "./ErrorBoundary";
import { AuthProvider } from "../contexts/AuthContext";
import { db } from "../firebase";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute.js";
import { auth } from "../firebase";
import {
  addDoc,
  collection,
  deleteField,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

export const ProductContext = createContext(null);
export const UserCartTotalNumContext = createContext(null);

const Home = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [windowType, setWindowType] = useState("login");
  const [userName, setUserName] = useState("Sign In");
  const [products, setProducts] = useState([]);
  const [userCartTotalNum, setUserCartTotalNum] = useState(0);
  const [userCartTotalPrice, setUserCartTotalPrice] = useState(0);
  const [searchKeyWords, setSearchKeyWords] = useState("");

  const user = userName.split("/")[0];

  // product
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [imageURL, setImageURL] = useState("");

  const titleType = () => {
    switch (windowType) {
      case "login":
        return "Sign in to your account";
      case "signup":
        return "Sign up your account";
      case "forget":
        return "Update your account";
      default:
        return null;
    }
  };

  const contentType = () => {
    switch (windowType) {
      case "login":
        return (
          <Login
            setWindowType={setWindowType}
            setIsVisible={setIsVisible}
            setUserName={setUserName}
          />
        );
      case "signup":
        return <Signup setWindowType={setWindowType} />;
      case "forget":
        return <ForgetPassword setWindowType={setWindowType} />;
      case "sendEmail":
        return <SendEmail />;
      default:
        return null;
    }
  };

  // proudct
  const productsCollectionRef = collection(db, "products");
  const addProduct = async () => {
    try {
      await addDoc(productsCollectionRef, {
        name: name,
        description: description,
        category: category,
        price: Number(price),
        quantity: Number(quantity),
        url: imageURL,
      });
    } catch (error) {
      window.alert("Failed to add product");
      console.log(error);
    }
    setName("");
    setDescription("");
    setCategory("");
    setPrice(0);
    setQuantity(0);
    setImageURL("");
  };

  // add cart functions
  const createCartQuantity = async (id) => {
    try {
      let tempUserCartTotalNum = 1;
      let tempUserCartTotalPrice = 0;
      const cartDoc = doc(db, "cart", user);
      const snap = await getDoc(cartDoc);
      const tempData = snap.data();
      Object.keys(tempData).forEach((key1) => {
        tempUserCartTotalNum += tempData[key1];
        Object.keys(products).forEach((key2) => {
          if (id === products[key2].id)
            tempUserCartTotalPrice += Number(products[key2].price);
          if (key1 === products[key2].id)
            tempUserCartTotalPrice += tempData[key1] * products[key2].price;
        });
      });
      const newCart = { [id]: Number(1) };
      await updateDoc(cartDoc, newCart);
      // setIsCartShowVisible(true);
      setUserCartTotalNum(tempUserCartTotalNum);
      setUserCartTotalPrice(tempUserCartTotalPrice);
    } catch (error) {
      window.alert("Failed to add product");
      console.log(error);
    }
    // setIsCartShowVisible({ id: true });
  };

  const increaseCartQuantity = async (id) => {
    try {
      let tempUserCartTotalNum = 1;
      let tempUserCartTotalPrice = 0;
      const cartDoc = doc(db, "cart", user);
      const snap = await getDoc(cartDoc);
      const tempData = snap.data();
      let cartNum;
      Object.keys(tempData).forEach((key1) => {
        tempUserCartTotalNum += tempData[key1];
        Object.keys(products).forEach((key2) => {
          if (key1 === id && id === products[key2].id)
            tempUserCartTotalPrice += Number(products[key2].price);
          if (key1 === products[key2].id)
            tempUserCartTotalPrice += tempData[key1] * products[key2].price;
        });
        if (key1 === id) cartNum = tempData[key1];
        return;
      });
      setUserCartTotalNum(tempUserCartTotalNum);
      setUserCartTotalPrice(tempUserCartTotalPrice);
      const newCart = { [id]: cartNum + 1 };
      await updateDoc(cartDoc, newCart);
    } catch (error) {
      window.alert("Failed to add product");
      console.log(error);
    }
  };

  const decreaseCartQuantity = async (id) => {
    try {
      let tempUserCartTotalNum = -1;
      let tempUserCartTotalPrice = 0;
      const cartDoc = doc(db, "cart", user);
      const snap = await getDoc(cartDoc);
      const tempData = snap.data();
      let cartNum;
      Object.keys(tempData).forEach((key1) => {
        tempUserCartTotalNum += tempData[key1];
        Object.keys(products).forEach((key2) => {
          if (key1 === products[key2].id)
            tempUserCartTotalPrice += tempData[key1] * products[key2].price;
          if (key1 === id && id === products[key2].id)
            tempUserCartTotalPrice -= Number(products[key2].price);
        });
        if (key1 === id) cartNum = tempData[key1];
        return;
      });
      setUserCartTotalNum(tempUserCartTotalNum);
      setUserCartTotalPrice(tempUserCartTotalPrice);
      const newCart = { [id]: cartNum - 1 };
      await updateDoc(cartDoc, newCart);
    } catch (error) {
      window.alert("Failed to delete product");
      console.log(error);
    }
  };

  const deleteCartItem = async (id) => {
    try {
      let tempUserCartTotalNum = -1;
      let tempUserCartTotalPrice = 0;
      const cartDoc = doc(db, "cart", user);
      await updateDoc(cartDoc, {
        [id]: deleteField(),
      });
      const snap = await getDoc(cartDoc);
      const tempData = snap.data();
      Object.keys(tempData).forEach((key1) => {
        tempUserCartTotalNum += tempData[key1];
        Object.keys(products).forEach((key2) => {
          if (key1 === products[key2].id)
            tempUserCartTotalPrice += tempData[key1] * products[key2].price;
          if (key1 === id && id === products[key2].id)
            tempUserCartTotalPrice -=
              Number(tempData[key1]) * Number(products[key2].price);
        });
      });
      setUserCartTotalNum(tempUserCartTotalNum);
      setUserCartTotalPrice(tempUserCartTotalPrice);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getUser = auth.onAuthStateChanged(() => {
      if (auth.currentUser) {
        setIsVisible(false);
        setUserName(auth.currentUser.email.match(/(\S*)@/)[1] + "/Log Out");
      }
      return;
    });
    getUser();
  }, []);

  return (
    <>
      <ProductContext.Provider value={{ products, setProducts }}>
        <UserCartTotalNumContext.Provider
          value={{
            userCartTotalNum,
            setUserCartTotalNum,
            userCartTotalPrice,
            setUserCartTotalPrice,
          }}
        >
          <Router>
            <AuthProvider>
              <ErrorBoundary>
                <Header
                  setIsVisible={setIsVisible}
                  userName={userName}
                  setUserName={setUserName}
                  createCartQuantity={createCartQuantity}
                  increaseCartQuantity={increaseCartQuantity}
                  decreaseCartQuantity={decreaseCartQuantity}
                  deleteCartItem={deleteCartItem}
                  setSearchKeyWords={setSearchKeyWords}
                />
              </ErrorBoundary>
              <ErrorBoundary>
                <Footer />
              </ErrorBoundary>
              <Routes>
                <Route
                  exact
                  path="/"
                  element={
                    <ErrorBoundary>
                      <Modal
                        title={titleType()}
                        isVisible={isVisible}
                        changeIsVisible={() => {
                          setIsVisible(false);
                        }}
                      >
                        {contentType()}
                      </Modal>
                    </ErrorBoundary>
                  }
                />
                <Route
                  exact
                  path="/shoppingpage"
                  element={
                    <ErrorBoundary>
                      <ShoppingPage
                        user={user}
                        createCartQuantity={createCartQuantity}
                        increaseCartQuantity={increaseCartQuantity}
                        decreaseCartQuantity={decreaseCartQuantity}
                        deleteCartItem={deleteCartItem}
                        searchKeyWords={searchKeyWords}
                      />
                    </ErrorBoundary>
                  }
                />
                <Route
                  exact
                  path="/createproduct"
                  element={
                    <PrivateRoute>
                      <ErrorBoundary>
                        <CreateProduct
                          title={"Create Product"}
                          name={name}
                          setName={setName}
                          description={description}
                          setDescription={setDescription}
                          category={category}
                          setCategory={setCategory}
                          price={price}
                          setPrice={setPrice}
                          quantity={quantity}
                          setQuantity={setQuantity}
                          imageURL={imageURL}
                          setImageURL={setImageURL}
                          createProductClick={addProduct}
                          buttonTag={"Add"}
                          createOrEdit={true}
                        />
                      </ErrorBoundary>
                    </PrivateRoute>
                  }
                />
                <Route
                  exact
                  path="/detail/:id"
                  element={
                    <ErrorBoundary>
                      <Detail
                        user={user}
                        createCartQuantity={createCartQuantity}
                        increaseCartQuantity={increaseCartQuantity}
                        decreaseCartQuantity={decreaseCartQuantity}
                        deleteCartItem={deleteCartItem}
                      />
                    </ErrorBoundary>
                  }
                />
                <Route
                  exact
                  path="/edit/:id"
                  element={
                    <PrivateRoute>
                      <ErrorBoundary>
                        <CreateProduct
                          title={"Edit Product"}
                          name={name}
                          setName={setName}
                          description={description}
                          setDescription={setDescription}
                          category={category}
                          setCategory={setCategory}
                          price={price}
                          setPrice={setPrice}
                          quantity={quantity}
                          setQuantity={setQuantity}
                          imageURL={imageURL}
                          setImageURL={setImageURL}
                          buttonTag={"Edit"}
                          createOrEdit={false}
                        />
                      </ErrorBoundary>
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<ErrorPage user={user} />} />
              </Routes>
            </AuthProvider>
          </Router>
        </UserCartTotalNumContext.Provider>
      </ProductContext.Provider>
    </>
  );
};

export default Home;
