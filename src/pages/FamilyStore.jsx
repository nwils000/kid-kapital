import React, { useContext, useEffect, useState } from 'react';
import { MainContext } from '../context/context';
import StoreItemModal from '../components/StoreItemModal';
import ApproveItemModal from '../components/ApproveItemModal';
import PurchaseItemModal from '../components/PurchaseItemModal';
import {
  createStoreItem,
  updateStoreItem,
  deleteFamilyStoreItems,
  handleApproveStoreItemRequest,
  purchaseStoreItem,
} from '../api-calls/api';
import '../styles/family-store.css';
import ParentNavbar from '../layout/ParentNavbar';
import ChildNavbar from '../layout/ChildNavbar';

function FamilyStore() {
  const { main } = useContext(MainContext);
  const [items, setItems] = useState(main.state.familyStoreItems);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showApproveItemModal, setShowApproveItemModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [overlayText, setOverlayText] = useState('');
  const [hoveredItemId, setHoveredItemId] = useState(null);

  useEffect(() => {
    setItems(main.state.familyStoreItems);
  }, [main.state.familyStoreItems]);

  const handleMouseEnter = (item) => {
    setOverlayText(main.state.profile.parent ? 'View Details' : 'Purchase');
    setHoveredItemId(item.id);
  };

  const handleMouseLeave = () => {
    setOverlayText('');
    setHoveredItemId(null);
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
    setCurrentItem(item);
    setShowPurchaseModal(true);
  };

  const handlePurchase = async (item) => {
    try {
      if (main.state.profile.total_money >= item.price) {
        await purchaseStoreItem({ main, itemId: item.id });
        setShowPurchaseModal(false);
      } else {
        alert(
          `You do not have enough money. Your balance is $${main.state.profile.total_money}, but this item costs $${item.price}.`
        );
      }
    } catch (e) {
      console.error(e);
      const navigate = useNavigate();

      alert('An error occurred while trying to make the purchase.');
    }
  };

  return (
    <>
      {main.state.profile.parent ? <ParentNavbar /> : <ChildNavbar />}
      <h1 style={{ fontSize: '2rem', margin: '20px', textAlign: 'center' }}>
        Family Store
      </h1>
      <div className="family-store">
        <div className="store-layout">
          {main.state.profile.parent && (
            <div className="sidebar left">
              <h2 style={{ textAlign: 'center', marginBottom: 0 }}>
                Items to Approve
              </h2>
              <ul style={{ marginBottom: 0 }} className="responsibilities-list">
                {items.filter((item) => !item.approved).length > 0 ? (
                  items
                    .filter((item) => !item.approved)
                    .slice(0, 3)
                    .map((item) => (
                      <div
                        style={{ marginTop: 20 }}
                        key={item.id}
                        className="item-card"
                        onClick={() => openApproveItemModal(item)}
                        onMouseEnter={() => {
                          setOverlayText('View Details');
                          setHoveredItemId(item.id);
                        }}
                        onMouseLeave={() => {
                          setOverlayText('');
                          setHoveredItemId(null);
                        }}
                      >
                        <div>{item.name}</div>
                        <div>${item.price}</div>
                        <div className="item-card-overlay">
                          {hoveredItemId === item.id ? overlayText : ''}
                        </div>
                      </div>
                    ))
                ) : (
                  <li style={{ textAlign: 'center', padding: '24px' }}>
                    No items to approve
                  </li>
                )}
              </ul>
              {items.filter((item) => !item.approved).length > 5 && (
                <div
                  style={{ margin: 'auto', marginTop: 20 }}
                  className="dots-bubble"
                ></div>
              )}
            </div>
          )}
          <div className="store-items" style={{ position: 'relative' }}>
            {!main.state.profile.parent && (
              <p
                className="total-money"
                style={{ position: 'relative', top: 45 }}
              >
                Total Money: ${main.state.profile.total_money}
              </p>
            )}
            <button
              className="request-new-item"
              onClick={() => openItemModal(null)}
            >
              {main.state.profile.parent ? 'Add New Item' : 'Request New Item'}
            </button>
            <h2 style={{ textAlign: 'center', margin: '40px 20px 20px 20px' }}>
              Available Items
            </h2>
            <div className="items-grid">
              {items
                .filter((item) => item.approved)
                .map((item) => (
                  <div
                    key={item.id}
                    className="item-card"
                    onClick={() => {
                      main.state.profile.parent
                        ? openItemModal(item)
                        : handlePurchase(item);
                    }}
                    onMouseEnter={() => handleMouseEnter(item)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div>{item.name}</div>
                    <div>${item.price}</div>
                    <div className="item-card-overlay">
                      {hoveredItemId === item.id ? overlayText : ''}
                    </div>
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
          currentItem={currentItem}
          handleApproveStoreItem={handleApproveStoreItemRequest}
        />
      )}
    </>
  );
}

export default FamilyStore;
