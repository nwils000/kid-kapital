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
    purchaseStoreItem({ main, itemId: currentItem.id });
    setShowPurchaseModal(false);
  };

  if (!showPurchaseModal) return null;

  return (
    <div className="modal-overlay" onClick={() => setShowPurchaseModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h5>Purchase {name}</h5>
          <button onClick={() => setShowPurchaseModal(false)}>Close</button>
        </div>
        <div className="modal-body">
          <p>{price}</p>
          <button onClick={handlePurchase}>Purchase</button>
        </div>
      </div>
    </div>
  );
}