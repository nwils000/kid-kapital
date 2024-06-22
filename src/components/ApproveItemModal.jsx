import React, { useState, useEffect, useContext } from 'react';
import { MainContext } from '../context/context';
import { deleteFamilyStoreItems } from '../api-calls/api';

export default function ApproveItemModal({
  showApproveItemModal,
  setShowApproveItemModal,
  handleApproveStoreItem,
  currentItem,
}) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const { main } = useContext(MainContext);

  useEffect(() => {
    if (currentItem) {
      setName(currentItem.name);
      setPrice(currentItem.price);
    } else {
      setName('');
      setPrice(0);
    }
  }, [currentItem]);

  const handleApprove = async () => {
    handleApproveStoreItem({ main, itemId: currentItem.id });
    setShowApproveItemModal(false);
  };

  const handleDelete = () => {
    deleteFamilyStoreItems({ main, itemId: currentItem.id });
    setShowApproveItemModal(false);
  };

  if (!showApproveItemModal) return null;

  return (
    <div
      className="modal-overlay"
      onMouseDown={() => setShowApproveItemModal(false)}
    >
      <div className="modal-content" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h5>Approve Item</h5>
          <button onClick={() => setShowApproveItemModal(false)}>Close</button>
        </div>
        <div className="modal-body">
          <p>{name}</p>
          <p>{price}</p>
          <button onClick={handleApprove}>Approve</button>

          <button onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
}
