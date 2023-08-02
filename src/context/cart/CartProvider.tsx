import { FC, useEffect, useReducer, useRef } from "react";
import Cookie from "js-cookie";

import { ICartProduct } from "@/interfaces";
import { CartContext, cartReducer } from "./";
import Cookies from "js-cookie";

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;

  shippingAddress?: ShippingAddress;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
}

const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: undefined,
};

interface Props {
  children: React.ReactNode;
}

export const CartProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  const firstTimeLoad = useRef(true);

  const loadCookies = async () => {
    try {
      const cookieProducts = Cookie.get("cart")
        ? JSON.parse(Cookie.get("cart")!)
        : [];
      await dispatch({
        type: "[cart] - LoadCart from cookies | storage",
        payload: cookieProducts,
      });
    } catch (error) {
      await dispatch({
        type: "[cart] - LoadCart from cookies | storage",
        payload: [],
      });
    } finally {
      firstTimeLoad.current = false;
    }
  };

  useEffect(() => {
    if (Cookies.get("firstName")) {
      const shippingAddress = {
        firstName: Cookies.get("firstName") || "",
        lastName: Cookies.get("lastName") || "",
        address: Cookies.get("address") || "",
        address2: Cookies.get("address2") || "",
        zip: Cookies.get("zip") || "",
        city: Cookies.get("city") || "",
        country: Cookies.get("country") || "",
        phone: Cookies.get("phone") || "",
      };
      dispatch({
        type: "[cart] - LoadAddress From Cookies",
        payload: shippingAddress,
      });
    }
  }, []);

  useEffect(() => {
    loadCookies();
  }, []);

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({ type: "[cart] - Change cart quantity", payload: product });
  };

  const removeCartProduct = (product: ICartProduct) => {
    dispatch({ type: "[cart] - Remove product in cart", payload: product });
  };

  const updateAddress = (address: ShippingAddress) => {
    //console.log(data);
    Cookies.set("firstName", address.firstName);
    Cookies.set("lastName", address.lastName);
    Cookies.set("address", address.address);
    Cookies.set("address2", address.address2 || "");
    Cookies.set("zip", address.zip);
    Cookies.set("city", address.city);
    Cookies.set("country", address.country);
    Cookies.set("phone", address.phone);

    dispatch({ type: "[cart] - Update Address", payload: address });
  };

  //* Los productos se guardan en las cokkies
  useEffect(() => {
    if (firstTimeLoad.current) {
      return;
    }

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
        updateAddress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
