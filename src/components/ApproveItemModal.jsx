import React, { useState, useEffect } from 'react';

export default function ApproveItemModal({
  showApproveItemModal,
  setShowApproveItemModal,
  handleApproveStoreItem,
  handleDeleteStoreItem,
  currentItem,
}) {
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

  const handleApprove = async () => {
    handleApproveStoreItem({ itemId: currentItem.id });
    setShowApproveItemModal(false);
  };

  const handleDelete = () => {
    handleDeleteStoreItem({ itemId: currentItem.id });
    setShowApproveItemModal(false);
  };

  if (!showApproveItemModal) return null;

  return (
    <div
      className="modal-overlay"
      onClick={() => setShowApproveItemModal(false)}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
