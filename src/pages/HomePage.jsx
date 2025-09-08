import React, { useState, useEffect } from "react";
import { signOutUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Link } from 'react-router-dom';
import CartDrawer from "../features/cart/CartDrawer";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebaseConfig";

const ADMINS = ["ankitranjan.cs24@bmsce.ac.in"]; // Add your admin emails here

const HomePage = () => {
  const { currentUser } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  const [selectedCat, setSelectedCat] = useState("all");
  const [search, setSearch] = useState("");

  const { addToCart, cartItems, updateQuantity } = useCart();

  // Check if current user is admin (case-insensitive)
  const isAdmin =
    currentUser &&
    ADMINS.some(
      (adminEmail) =>
        adminEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim()
    );

  useEffect(() => {
    const fetchCategories = async () => {
      const catQuery = query(collection(db, "categories"), orderBy("display_order", "asc"));
      const catSnapshot = await getDocs(catQuery);
      const catList = catSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCategories(catList);
    };

    const fetchMenuItems = async () => {
      const menuSnapshot = await getDocs(collection(db, "menu"));
      const menuList = menuSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMenuItems(menuList);
    };

    fetchCategories();
    fetchMenuItems();
  }, []);

  const filteredMenuItems = menuItems.filter(
    (item) =>
      (selectedCat === "all" || item.categoryId === selectedCat) &&
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="homepage-bg">
      <nav className="navbar-flex">
        <span className="brand">GrabNGo</span>
        <div>
          <Link to="/home" className="nav-link">
            Menu
          </Link>
          <Link to="/orders" className="nav-link">
            My Orders
          </Link>

          {isAdmin && (
            <>
              <Link to="/admin/orders" className="nav-link">
                Manage Orders
              </Link>
              <Link to="/admin/items" className="nav-link">
                Manage Items
              </Link>
            </>
          )}

          <button className="logout-btn" onClick={signOutUser}>
            Logout
          </button>
        </div>
      </nav>

      <div className="container">
        <div className="hello-row">
          <span className="wave-emoji">👋</span>
          <h1 className="hello-title">
            Hello, <span style={{ color: "#f59e42" }}>{currentUser.displayName}</span>!
          </h1>
        </div>

        <div className="subtitle">What are you craving today?</div>

        <div className="category-row" role="list">
          <button
            className={`cat-btn ${selectedCat === "all" ? "cat-btn-active" : ""}`}
            onClick={() => setSelectedCat("all")}
            role="listitem"
            aria-pressed={selectedCat === "all"}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`cat-btn ${selectedCat === cat.id ? "cat-btn-active" : ""}`}
              onClick={() => setSelectedCat(cat.id)}
              role="listitem"
              aria-pressed={selectedCat === cat.id}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="top-flex-row">
          <input
            aria-label="Search for food"
            className="searchbar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for food..."
          />
          <button
            className="cartbtn"
            onClick={() => setIsCartOpen(true)}
            aria-label="Open Cart"
          >
            <span role="img" aria-label="cart">
              🛒
            </span>{" "}
            Cart ({cartItems.length})
          </button>
        </div>

        <div className="menu-list">
          {filteredMenuItems.length === 0 && (
            <div style={{ color: "#ccc", margin: 40 }}>No items found.</div>
          )}

          {filteredMenuItems.map((item) => {
            const cartItem = cartItems.find((ci) => ci.id === item.id);
            return (
              <div key={item.id} className="menu-card">
                <img src={item.imageUrl} alt={item.name} className="menu-img" />
                <h3 className="menu-title">{item.name}</h3>
                <p className="menu-desc">{item.description}</p>
                <div className="menu-footer">
                  <span className="menu-price">₹{item.price.toFixed(2)}</span>
                  {cartItem ? (
                    <div
                      className="qty-stepper"
                      role="group"
                      aria-label={`Quantity selector for ${item.name}`}
                    >
                      <button
                        className="step-btn"
                        onClick={() => updateQuantity(item.id, -1)}
                        disabled={cartItem.quantity === 1}
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        -
                      </button>
                      <span className="qty-number" aria-live="polite">
                        {cartItem.quantity}
                      </span>
                      <button
                        className="step-btn"
                        onClick={() => updateQuantity(item.id, 1)}
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      className="addtocart-btn"
                      onClick={() => addToCart(item)}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default HomePage;
