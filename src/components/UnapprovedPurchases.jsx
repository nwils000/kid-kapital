import React, { useEffect, useState, useContext } from 'react';
import { MainContext } from '../context/context';
import {
  getUnnaprovedPurchases,
  updatePurchaseApproval,
} from '../api-calls/api';

function UnapprovedPurchases() {
  const { main } = useContext(MainContext);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const fetchUnapprovedPurchases = async () => {
      try {
        const purchasesData = await getUnnaprovedPurchases({ main });
        setPurchases(purchasesData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUnapprovedPurchases();
  }, [main]);

  const handleApprovalToggle = async (purchaseId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const updatedPurchase = await updatePurchaseApproval({
        main,
        purchaseId,
        newStatus,
      });

      const updatedPurchases = purchases.map((purchase) => {
        if (purchase.id === purchaseId) {
          return { ...purchase, approved: updatedPurchase.approved };
        }
        return purchase;
      });
      setPurchases(updatedPurchases);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <h2
        style={{
          color: '#333',
          fontSize: '24px',
          textAlign: 'center',
        }}
      >
        Unfulfilled Purchases
      </h2>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          marginTop: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        {purchases.slice(0, 3).map((purchase) => (
          <li
            style={{
              backgroundColor: '#f9f9f9',
              margin: '10px 0',
              padding: '20px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'column',
              width: '90%',
            }}
            key={purchase.id}
          >
            <span
              style={{
                fontSize: '16px',
                color: '#666',
                textAlign: 'center',
              }}
            >
              {purchase.child_name} purchased {purchase.item_name} for $
              {purchase.price} on{' '}
              {purchase.date
                ? parseInt(purchase.date.slice(5, 7)) +
                  '/' +
                  parseInt(purchase.date.slice(8, 10))
                : ''}
            </span>
            <button
              style={{
                backgroundColor: '#4CC283',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                display: 'block',
                borderRadius: 8,
                cursor: 'pointer',
                marginTop: '10px',
                textAlign: 'center',
                width: '80%',
              }}
              onClick={() =>
                handleApprovalToggle(purchase.id, purchase.approved)
              }
            >
              Mark as {purchase.approved ? 'Unfulfilled' : 'Fulfilled'}
            </button>
          </li>
        ))}
        {purchases.length > 3 && <div className="dots-bubble"></div>}
      </ul>
    </div>
  );
}

export default UnapprovedPurchases;
