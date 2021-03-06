import React, { useEffect, useState, useMemo } from "react";
import data from "./menu.json";

import MainMenu from "./components/MainMenu";
import SubMenu from "./components/SubMenu";
import Cart from "./components/Cart";

import Logo from "./assets/logo.jpg";

import styled from "styled-components";

function App() {
  const [menuler, setMenuler] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filters, setFilter] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const MainWrapper = styled.section`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .navbar {
      display: grid;
      place-items: center;
    }

    .navbar img {
      margin: 5px;
      width: 200px;
      box-shadow: 2px 2px 2px 1px rgba(250, 250, 250, 0.2);
    }

    .product-list {
      display: grid;
      grid-template-columns: 1fr 400px;
      grid-gap: 0.5rem;
      width: 100%;
    }

    .item-1 {
      background-color: #19181f;
      grid: 1/2;
      display: flex;
      margin: 5px;

      padding: 2rem;
      border-bottom-right-radius: 20px;
      border-top-right-radius: 20px;
    }

    .item-2 {
      position: relative;
      background: #0f1115;
      grid: 2/3;
      margin: 5px;
    }

    .footer {
      display: grid;
      place-items: center;
      font-size: 1.5rem;
    }
  `;

  useEffect(() => {
    const [mainMenu, ...categories] = data.menus;
    setMenuler(mainMenu.items);
    setSubCategories(categories);
  }, []);

  const removeFromCart = (product) => {
    const cartItem = cartItems.slice();
    setCartItems(cartItem.filter((item) => item.name !== product.name));
  };

  const addToCart = (product) => {
    const cartItem = cartItems.slice();
    let alreadyInCart = false;
    cartItem.forEach((item) => {
      if (item.price === product.price && item.name === product.name) {
        item.count++;
        alreadyInCart = true;
      }
    });
    if (!alreadyInCart) {
      cartItem.push({ ...product, count: 1 });
    }
    setCartItems(cartItem);
  };

  const selectSubCategory = (items) => {
    const { subMenus = [] } = items;
    setFilter(subMenus);
    addToCart(items);
  };

  const filteredItems = useMemo(() => {
    if (filters.length > 0) {
      return subCategories.filter((category) => {
        return filters.indexOf(category.key) > -1;
      });
    }
    return [];
  }, [filters, subCategories]);

  return (
    <MainWrapper>
      <nav className="navbar">
        <img src={Logo} alt="logo" />
      </nav>
      <div className="product-list">
        <div className="product-list-item item-1">
          <div>
            {menuler.map((item) => {
              return (
                <MainMenu
                  key={item.key}
                  onSelect={selectSubCategory}
                  {...item}
                />
              );
            })}
          </div>
          <div>
            <SubMenu menu={filteredItems} onSelect={selectSubCategory} />
          </div>
        </div>
        <div className="product-list-item item-2">
          <Cart cartItems={cartItems} removeFromCart={removeFromCart} />
        </div>
      </div>
      <footer className="footer">
        <p>Meal Box Yemek Hizmetleri</p>
      </footer>
    </MainWrapper>
  );
}

export default App;
