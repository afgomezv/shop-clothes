import { CartState } from "./";
import { ICartProduct, ShippingAddress } from "@/interfaces";

type CartActionType =
  | {
      type: "[cart] - LoadCart from cookies | storage";
      payload: ICartProduct[];
    }
  | {
      type: "[cart] - Update products in cart";
      payload: ICartProduct[];
    }
  | {
      type: "[cart] - Change cart quantity";
      payload: ICartProduct;
    }
  | {
      type: "[cart] - Remove product in cart";
      payload: ICartProduct;
    }
  | {
      type: "[cart] - LoadAddress From Cookies";
      payload: ShippingAddress;
    }
  | {
      type: "[cart] - Update Address";
      payload: ShippingAddress;
    }
  | {
      type: "[cart] - Update order summary";
      payload: {
        numberOfItems: number;
        subTotal: number;
        tax: number;
        total: number;
      };
    }
  | {
      type: "[Cart] - Order Complete";
    };

export const cartReducer = (state: CartState, action: CartActionType) => {
  switch (action.type) {
    case "[cart] - LoadCart from cookies | storage":
      return {
        ...state,
        isLoaded: true,
        cart: [...action.payload],
      };
    case "[cart] - Update products in cart":
      return {
        ...state,
        //*cart: [...state.cart, action.payload],
        //?cart: [...action.payload],
        cart: [...action.payload],
      };
    case "[cart] - Change cart quantity":
      return {
        ...state,
        cart: state.cart.map((product) => {
          if (product._id !== action.payload._id) return product;
          if (product.size !== action.payload.size) return product;

          return action.payload;
        }),
      };
    case "[cart] - Remove product in cart":
      return {
        ...state,
        cart: state.cart.filter(
          (product) =>
            !(
              product._id === action.payload._id &&
              product.size === action.payload.size
            )
        ),
        // cart: state.cart.filter((product) => {
        //   if (
        //     product._id === action.payload._id &&
        //     product.size === action.payload.size
        //   ) {
        //     return false;
        //   }
        //   return true;
        // }),
      };
    case "[cart] - Update order summary":
      return {
        ...state,
        ...action.payload,
      };
    case "[cart] - Update Address":
    case "[cart] - LoadAddress From Cookies":
      return {
        ...state,
        shippingAddress: action.payload,
      };
    case "[Cart] - Order Complete":
      return {
        ...state,
        cart: [],
        numberOfItems: 0,
        subTotal: 0,
        tax: 0,
        total: 0,
      };
    default:
      return state;
  }
};
