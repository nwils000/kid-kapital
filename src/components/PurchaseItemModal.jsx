import React, { useState, useEffect, useContext } from 'react';
import { purchaseStoreItem } from '../api-calls/api';
import { MainContext } from '../context/context';

export default function PurchaseItemModal({
  showPurchaseModal,
  setShowPurchaseModal,
  currentItem,
}) {
  const { main } = useContext(MainContext);
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (currentItem) {
      setName(currentItem.name);
      setPrice(currentItem.price);
    } else {
      setName('');
      setPrice(0);
    }
  }, [currentItem]);

  const handlePurchase = async () => {
    try {
      if (main.state.profile.total_money >= price) {
        await purchaseStoreItem({ main, itemId: currentItem.id });
        setShowPurchaseModal(false);
        setErrorMessage(''); // Clear any previous error messages
      } else {
        setErrorMessage(
          `You do not have enough money. Your balance is $${main.state.profile.total_money}, but this item costs $${price}.`
        );
      }
    } catch (e) {
      console.error(e);
      setErrorMessage('An error occurred while trying to make the purchase.');
    }
  };

  if (!showPurchaseModal) return null;

  return (
    <div className="modal-overlay" onMouseDown={() => setShowPurchaseModal(false)}>
      <div className="modal-content" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h5>Purchase {name}</h5>
          <button onClick={() => setShowPurchaseModal(false)}>Close</button>
        </div>
        <div className="modal-body">
          <p>{price}</p>
          <button onClick={handlePurchase}>Purchase</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
}
