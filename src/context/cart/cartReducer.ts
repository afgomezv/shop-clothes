import { CartState } from "./";
import { ICartProduct } from "@/interfaces";

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
      type: "[cart] - Update order summary";
      payload: {
        numberOfItems: number;
        subTotal: number;
        tax: number;
        total: number;
      };
    };

export const cartReducer = (state: CartState, action: CartActionType) => {
  switch (action.type) {
    case "[cart] - LoadCart from cookies | storage":
      return {
        ...state,
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
    default:
      return state;
  }
};
