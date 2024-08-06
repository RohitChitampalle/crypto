// CoinContext.js

import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const CoinContext = createContext();

// Define the provider component
export const CoinProvider = ({ children }) => {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({});

    useEffect(() => {
        const fetchData = async (retries = 3, delay = 1000) => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8001/get/api/coins');
                if (!response.ok) {
                    if (response.status === 429 && retries > 0) {
                        console.warn('Rate limit exceeded. Retrying...');
                        await new Promise(resolve => setTimeout(resolve, delay));
                        return fetchData(retries - 1, delay * 2);
                    }
                    throw new Error(`Error fetching data: ${response.statusText}`);
                }
                const data = await response.json();
                setCoins(data.data.coins);
                setStats(data.data.stats);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <CoinContext.Provider value={{ coins, loading, stats }}>
            {children}
        </CoinContext.Provider>
    );
};
