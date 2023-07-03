import React, { createContext, useEffect, useState } from 'react';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { db } from '../../src/firebase';

const ResultsContext = createContext();

export const fetchCollectionData = async () => {
  const collectionRef = collection(db, 'maindata');
  const q = query(collectionRef, limit(100));
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
  return data;
};

export const ResultsProvider = ({ children }) => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCollectionData();
      setResults(data);
    };

    fetchData();
  }, []);

  const contextValue = {
    results,
    fetchCollectionData // Pass the function as part of the context value
  };

  return (
    <ResultsContext.Provider value={contextValue}>
      {children}
    </ResultsContext.Provider>
  );
};

export default ResultsContext;
