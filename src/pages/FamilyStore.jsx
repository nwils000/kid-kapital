import React, { useContext, useEffect, useState } from 'react';
import { MainContext } from '../context/context';
import ParentDashboardNavbar from '../layout/ParentDashboardNavbar';
import ChildDashboardNavbar from '../layout/ChildDashboardNavbar';
import StoreItemModal from '../components/StoreItemModal';
import ApproveItemModal from '../components/ApproveItemModal';
import PurchaseItemModal from '../components/PurchaseItemModal';
import {
  createStoreItem,
  updateStoreItem,
  deleteFamilyStoreItems,
  handleApproveStoreItemRequest,
} from '../api-calls/api';
import '../styles/family-store.css';

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

  const openItemModal = (item) => {
    setCurrentItem(item);
    setShowItemModal(true);
  };

  const openApproveItemModal = (item) => {
    setCurrentItem(item);
    setShowApproveItemModal(true);
  };

  const openPurchaseModal = (item) => {
    setCurrentItem(item);
    setShowPurchaseModal(true);
  };

  return (
    <>
      {main.state.profile.parent ? (
        <ParentDashboardNavbar />
      ) : (
        <ChildDashboardNavbar />
      )}
      <h1 style={{ fontSize: '2rem', margin: '20px', textAlign: 'center' }}>
        Family Store
      </h1>
      <div className="family-store">
        {!main.state.profile.parent && (
          <p>Total Money: ${main.state.profile.total_money}</p>
        )}
        <div className="store-layout">
          {main.state.profile.parent && (
            <div className="sidebar left">
              <h2>Items to Approve</h2>
              <ul className="responsibilities-list">
                {items.filter((item) => !item.approved).length > 0 ? (
                  items
                    .filter((item) => !item.approved)
                    .map((item) => (
                      <li
                        key={item.id}
                        className="hover"
                        onClick={() => openApproveItemModal(item)}
                      >
                        {item.name} - ${item.price}
                      </li>
                    ))
                ) : (
                  <li>No items to approve</li>
                )}
              </ul>
            </div>
          )}
          <div className="store-items">
            <button onClick={() => openItemModal(null)}>
              {main.state.profile.parent ? 'Add New Item' : 'Request New Item'}
            </button>
            <h2>Available Items</h2>
            <div className="items-grid">
              {items
                .filter((item) => item.approved)
                .map((item) => (
                  <div
                    key={item.id}
                    className="item-card hover"
                    onClick={() => {
                      main.state.profile.parent
                        ? openItemModal(item)
                        : openPurchaseModal(item);
                    }}
                  >
                    {item.name} - ${item.price}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      {showItemModal && (
        <StoreItemModal
          showItemModal={showItemModal}
          setShowItemModal={setShowItemModal}
          currentItem={currentItem}
          handleCreateStoreItem={createStoreItem}
          handleUpdateStoreItem={updateStoreItem}
          handleDeleteStoreItem={deleteFamilyStoreItems}
        />
      )}
      {showApproveItemModal && (
        <ApproveItemModal
          showApproveItemModal={showApproveItemModal}
          setShowApproveItemModal={setShowApproveItemModal}
          handleApproveStoreItem={handleApproveStoreItemRequest}
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
