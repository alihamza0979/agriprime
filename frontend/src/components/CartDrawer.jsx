import React from 'react';
import { useCart } from '../contexts/CartContext';

export default function CartDrawer({ open, onClose, onCheckout }) {
  const { cart, removeFromCart, updateQty, cartTotal } = useCart();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-bold">Your Cart ({cart.length})</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <span className="material-symbols-outlined text-5xl mb-4 block">shopping_cart</span>
              <p>Your cart is empty</p>
            </div>
          ) : cart.map(item => (
            <div key={item._id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
              <img src={item.imageUrl || '/assets/product-placeholder.svg'} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
              <div className="flex-1">
                <h4 className="font-bold text-sm">{item.name}</h4>
                <p className="text-primary font-bold">₨{item.price.toLocaleString()}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => updateQty(item._id, item.qty - 1)} className="w-7 h-7 rounded bg-white border font-bold">-</button>
                  <span className="w-8 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item._id, item.qty + 1)} className="w-7 h-7 rounded bg-white border font-bold">+</button>
                  <button onClick={() => removeFromCart(item._id)} className="ml-auto text-red-500">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="p-6 border-t">
            <div className="flex justify-between mb-4">
              <span className="font-bold">Total</span>
              <span className="text-xl font-bold text-primary">₨{cartTotal.toLocaleString()}</span>
            </div>
            <button onClick={onCheckout} className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:opacity-90">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
