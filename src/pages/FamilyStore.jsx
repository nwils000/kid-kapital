import React, { useContext, useEffect, useState } from 'react';
import { MainContext } from '../context/context';
import ParentDashboardNavbar from '../layout/ParentDashboardNavbar';
import {
  createStoreItem,
  updateStoreItem,
  deleteFamilyStoreItems,
  handleApproveStoreItemRequest,
  // approveStoreItemRequest,
  // requestStoreItem,
} from '../api-calls/api';
import StoreItemModal from '../components/StoreItemModal';
import '../styles/family-store.css';
import ApproveItemModal from '../components/ApproveItemModal';
import PurchaseItemModal from '../components/PurchaseItemModal';

function FamilyStore() {
  const { main } = useContext(MainContext);
  const [items, setItems] = useState(main.state.familyStoreItems);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showApproveItemModal, setShowApproveItemModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
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

  const handleRequestStoreItem = async (itemId) => {
    // requestStoreItem({ main, itemId });
  };

  const handleApproveStoreItem = async ({ itemId }) => {
    console.log('item iddddd', itemId);
    handleApproveStoreItemRequest({ main, itemId });
  };

  const openItemModal = (item) => {
    setCurrentItem(item);
    setShowItemModal(true);
  };

  const openApproveItemModal = (item) => {
    setCurrentItem(item);
    setShowApproveItemModal(true);
  };

  const openPurchaseModal = (item) => {
    console.log('hi');
    setCurrentItem(item);
    setShowPurchaseModal(true);
  };

  return (
    <>
      <ParentDashboardNavbar />
      <div className="family-store">
        <h1>Family Store</h1>
        {<p></p>}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8rem' }}>
          {main.state.profile.parent && (
            <div className="sidebar left">
              <ul className="responsibilities-list">
                {items.filter((item) => !item.approved).length > 0 ? (
                  <div>
                    <h2>Items to approve</h2>
                    {items
                      .filter((item) => !item.approved)
                      .map((item) => {
                        return (
                          <li
                            key={item.id}
                            className="hover"
                            onClick={() => openApproveItemModal(item)}
                          >
                            {item.name} - ${item.price}
                          </li>
                        );
                      })}
                  </div>
                ) : (
                  <li>No items to approve</li>
                )}
              </ul>
            </div>
          )}
          <div>
            <button onClick={() => openItemModal(null)}>
              {main.state.profile.parent ? (
                <p>Add New Item</p>
              ) : (
                <p>Request New Item</p>
              )}
            </button>
            <div className="store-items">
              <h2>Available Items</h2>
              <div className="items-grid">
                {items
                  .filter((item) => item.approved)
                  .map((item) => (
                    <div key={item.id} className="item-card">
                      <div
                        onClick={() => {
                          main.state.profile.parent
                            ? openItemModal(item)
                            : openPurchaseModal(item);
                        }}
                      >
                        {item.name} - ${item.price}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="right"></div>
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
      {showApproveItemModal && (
        <ApproveItemModal
          showApproveItemModal={showApproveItemModal}
          setShowApproveItemModal={setShowApproveItemModal}
          handleApproveStoreItem={handleApproveStoreItem}
          handleDeleteStoreItem={handleDeleteStoreItem}
          currentItem={currentItem}
        />
      )}
      {showPurchaseModal && (
        <PurchaseItemModal
          showPurchaseModal={showPurchaseModal}
          setShowPurchaseModal={setShowPurchaseModal}
          currentItem={currentItem}
        />
      )}
    </>
  );
}

export default FamilyStore;
