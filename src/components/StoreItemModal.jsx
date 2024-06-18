import React, { useState, useEffect, useContext } from 'react';
import { MainContext } from '../context/context';

function StoreItemModal({
  showItemModal,
  setShowItemModal,
  currentItem,
  handleCreateStoreItem,
  handleUpdateStoreItem,
  handleDeleteStoreItem,
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

  const handleSubmit = async () => {
    if (currentItem) {
      await handleUpdateStoreItem({
        main,
        id: currentItem.id,
        name,
        price,
      });
    } else {
      await handleCreateStoreItem({
        main,
        name,
        price,
      });
    }
    setShowItemModal(false);
  };

  const handleDelete = () => {
    handleDeleteStoreItem({ itemId: currentItem.id });
    setShowItemModal(false);
  };

  if (!showItemModal) return null;

  return (
    <div className="modal-overlay" onClick={() => setShowItemModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h5>{currentItem ? 'Edit Item' : 'Add New Item'}</h5>
          <button onClick={() => setShowItemModal(false)}>Close</button>
        </div>
        <div className="modal-body">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Item Name"
          />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
          />
          <button onClick={handleSubmit}>Save</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default StoreItemModal;
