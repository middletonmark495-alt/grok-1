import { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

const STORAGE_KEY = 'kingdom_cart';

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const exists = state.items.find(
        (i) => i.id === action.item.id && i.selectedSize === action.item.selectedSize
      );
      if (exists) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.item.id && i.selectedSize === action.item.selectedSize
              ? { ...i, qty: i.qty + action.item.qty }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.item] };
    }
    case 'REMOVE':
      return {
        ...state,
        items: state.items.filter(
          (i) => !(i.id === action.id && i.selectedSize === action.selectedSize)
        ),
      };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id && i.selectedSize === action.selectedSize
            ? { ...i, qty: action.qty }
            : i
        ),
      };
    case 'CLEAR':
      return { ...state, items: [] };
    case 'LOAD':
      return { ...state, items: action.items };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) dispatch({ type: 'LOAD', items: JSON.parse(saved) });
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  function addToCart(item) {
    dispatch({ type: 'ADD', item });
    toast.success(`${item.name} added to cart`, {
      style: { background: '#1a1a1a', color: '#fff', border: '1px solid #c9a84c' },
      iconTheme: { primary: '#c9a84c', secondary: '#000' },
    });
  }

  function removeFromCart(id, selectedSize) {
    dispatch({ type: 'REMOVE', id, selectedSize });
  }

  function updateQty(id, selectedSize, qty) {
    if (qty < 1) return removeFromCart(id, selectedSize);
    dispatch({ type: 'UPDATE_QTY', id, selectedSize, qty });
  }

  function clearCart() {
    dispatch({ type: 'CLEAR' });
  }

  const itemCount = state.items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items: state.items, itemCount, subtotal, addToCart, removeFromCart, updateQty, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
