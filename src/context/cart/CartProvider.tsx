import { FC, useEffect, useReducer } from "react";
import Cookie from "js-cookie";

import { ICartProduct } from "@/interfaces";
import { CartContext, cartReducer } from "./";
import { type } from "os";
import { OrderSummary } from "../../components/cart/OrderSummary";

export interface CartState {
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
}

const CART_INITIAL_STATE: CartState = {
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
};

interface Props {
  children: React.ReactNode;
}

export const CartProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  //*Efecto
  useEffect(() => {
    try {
      const cookieProducts = Cookie.get("cart")
        ? JSON.parse(Cookie.get("cart")!)
        : [];
      dispatch({
        type: "[cart] - LoadCart from cookies | storage",
        payload: cookieProducts,
      });
    } catch (error) {
      dispatch({
        type: "[cart] - LoadCart from cookies | storage",
        payload: [],
      });
    }
  }, []);

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({ type: "[cart] - Change cart quantity", payload: product });
  };

  const removeCartProduct = (product: ICartProduct) => {
    dispatch({ type: "[cart] - Remove product in cart", payload: product });
  };

  useEffect(() => {
    Cookie.set("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    const numberOfItems = state.cart.reduce(
      (prev, current) => current.quantity + prev,
      0
    );

    const subTotal = state.cart.reduce(
      (prev, current) => current.price * current.quantity + prev,
      0
    );

    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

    const orderSummary = {
      numberOfItems,
      subTotal,
      tax: subTotal * taxRate,
      total: subTotal * (taxRate + 1),
    };
    dispatch({ type: "[cart] - Update order summary", payload: orderSummary });
  }, [state.cart]);

  const addProductToCart = (product: ICartProduct) => {
    //! Nivel 1
    //*dispatch({ type: "[cart] - Update products in cart", payload: product });
    //! Nivel 2
    //? const productInCart = state.cart.filter((item) => item._id !== product._id && item.size !== product.size);
    //? dispatch({type: '[cart] - Update products in cart', payload: [...productInCart, product]});
    //! Nivel Final
    const productInCart = state.cart.some((item) => item._id === product._id);
    if (!productInCart)
      return dispatch({
        type: "[cart] - Update products in cart",
        payload: [...state.cart, product],
      });

    const productInCartButDifferentSize = state.cart.some(
      (item) => item._id === product._id && item.size === product.size
    );
    if (!productInCartButDifferentSize)
      return dispatch({
        type: "[cart] - Update products in cart",
        payload: [...state.cart, product],
      });
    //*Acumular
    const updatedProducts = state.cart.map((item) => {
      if (item._id !== product._id) return item;
      if (item.size !== product.size) return item;

      //*Actualizar la cantidad
      item.quantity += product.quantity;
      return item;
    });
    dispatch({
      type: "[cart] - Update products in cart",
      payload: updatedProducts,
    });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,

        //*Methods
        addProductToCart,
        removeCartProduct,
        updateCartQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
