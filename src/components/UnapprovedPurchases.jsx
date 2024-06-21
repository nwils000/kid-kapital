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
    <div>
      <h2>Unapproved Purchases</h2>
      <ul>
        {purchases.map((purchase) => (
          <li key={purchase.id}>
            {purchase.child_name} purchased {purchase.item_name} for $
            {purchase.price} on {new Date(purchase.date).toLocaleDateString()}
            {purchase.approved ? ' (Received)' : ' (Not Received)'}
            <button
              onClick={() =>
                handleApprovalToggle(purchase.id, purchase.approved)
              }
            >
              Mark as {purchase.approved ? 'Not Received' : 'Received'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UnapprovedPurchases;
