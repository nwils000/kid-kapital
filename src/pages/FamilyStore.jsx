import React, { useContext, useEffect, useState } from 'react';
import { MainContext } from '../context/context';
import ParentDashboardNavbar from '../layout/ParentDashboardNavbar';
import {
  createStoreItem,
  updateStoreItem,
  deleteFamilyStoreItems,
} from '../api-calls/api';
import StoreItemModal from '../components/StoreItemModal';
import '../styles/family-store.css';

function FamilyStore() {
  const { main } = useContext(MainContext);
  const [items, setItems] = useState(main.state.familyStoreItems);
  const [showItemModal, setShowItemModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    setItems(main.state.familyStoreItems);
  }, [main.state.familyStoreItems]);

  const handleDeleteStoreItem = async ({ itemId }) => {
    deleteFamilyStoreItems({ main, itemId });
  };

  const handleCreateStoreItem = async ({ name, price }) => {
    createStoreItem({ name, price, main });
  };

  const handleUpdateStoreItem = async ({ id, name, price }) => {
    updateStoreItem({ id, name, price, main });
  };

  const openItemModal = (item) => {
    setCurrentItem(item);
    setShowItemModal(true);
  };

  return (
    <>
      <ParentDashboardNavbar />
      <div className="family-store">
        <h1>Family Store</h1>
        <button onClick={() => openItemModal(null)}>Add New Item</button>
        <div className="store-items">
          <h2>Available Items</h2>
          <div className="items-grid">
            {items.map((item) => {
              console.log('Rendering item with id:', item.id); // Add console log to debug
              return (
                <div
                  key={item.id}
                  className="item-card"
                  onClick={() => openItemModal(item)}
                >
                  {item.name} - ${item.price}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {showItemModal && (
        <StoreItemModal
          showItemModal={showItemModal}
          setShowItemModal={setShowItemModal}
          currentItem={currentItem}
          handleCreateStoreItem={handleCreateStoreItem}
          handleUpdateStoreItem={handleUpdateStoreItem}
          handleDeleteStoreItem={handleDeleteStoreItem}
        />
      )}
    </>
  );
}

export default FamilyStore;
