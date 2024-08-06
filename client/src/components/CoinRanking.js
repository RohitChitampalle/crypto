

import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Button, Spinner, Badge } from 'react-bootstrap';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';
import { FaSort, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { CoinContext } from './Context/CoinContext'; // Import the context
import CoinStatsModal from './CoinStatsModal';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

const CoinTable = () => {
    const { coins, loading, setCoins } = useContext(CoinContext); // Use the context to get coins and loading
    const [sortOrder, setSortOrder] = useState('asc');
    const [sorting, setSorting] = useState(false);
    const chartRefs = useRef({});

    useEffect(() => {
        coins.forEach((coin, index) => {
            const canvasId = `sparkline-${index}`;
            const canvas = document.getElementById(canvasId);

            if (!canvas) return;

            const ctx = canvas.getContext('2d');

            // Destroy previous chart instance if it exists
            if (chartRefs.current[canvasId]) {
                chartRefs.current[canvasId].destroy();
            }

            // Create a new chart instance and store it in the ref
            chartRefs.current[canvasId] = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: coin.sparkline.map((_, i) => i + 1),
                    datasets: [{
                        data: coin.sparkline,
                        borderColor: coin.color,
                        borderWidth: 2,
                        fill: false,
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        x: {
                            display: false
                        },
                        y: {
                            display: false
                        }
                    }
                }
            });
        });

        // Clean up chart instances on component unmount
        return () => {
            Object.values(chartRefs.current).forEach(chart => chart.destroy());
        };
    }, [coins]);

    // Sort coins by price
    const sortCoinsByPrice = () => {
        setSorting(true);
        const sortedCoins = [...coins].sort((a, b) => {
            if (sortOrder === 'asc') {
                return parseFloat(a.price) - parseFloat(b.price);
            } else {
                return parseFloat(b.price) - parseFloat(a.price);
            }
        });

        setCoins(sortedCoins);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        setSorting(false);
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center">Crypto Watcher</h2>
            <CoinStatsModal />
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                    <Spinner animation="border" variant="primary" style={{ width: '5rem', height: '5rem' }} />
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <Table striped bordered hover className="mt-3" style={{ width: '100%' }}>
                        <thead>
                            <tr className="text-center">
                                <th style={{ width: '15%' }}>Name</th>
                                <th>Rank</th>
                                <th onClick={sortCoinsByPrice} style={{ cursor: 'pointer' }}>
                                    Price {sortOrder === 'asc' ? <FaSort /> : <FaSort />}
                                </th>
                                <th>Market Cap</th>
                                <th>BTC Price</th>
                                <th>Volume 24hr</th>
                                <th>Change</th>
                                <th>Listed At</th>
                                <th>Last 7 Days</th>
                                <th>More Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sorting ? (
                                <tr>
                                    <td colSpan="11" className="text-center">
                                        <Spinner animation="border" variant="primary" />
                                    </td>
                                </tr>
                            ) : (
                                coins.map((coin, index) => (
                                    <tr key={coin.uuid} className="align-middle">
                                        <td className="small-text">
                                            <img src={coin.iconUrl} alt={coin.name} width="25" height="25" className="me-2" />
                                            {coin.name} <span className="me-2 text-secondary">{coin.symbol}</span>
                                            <Badge bg="secondary" className="me-2">Buy</Badge>
                                        </td>
                                        <td>{coin.rank}</td>
                                        <td className="small-text">${parseFloat(coin.price).toFixed(2)}</td>
                                        <td className="small-text">${parseInt(coin.marketCap).toLocaleString()}</td>
                                        <td className="small-text">{coin.btcPrice}</td>
                                        <td className="small-text">${parseFloat(coin['24hVolume']).toLocaleString()}</td>
                                        <td className="small-text" style={{ color: parseFloat(coin.change) >= 0 ? 'green' : 'red' }}>
                                            {parseFloat(coin.change).toFixed(2)}%
                                            {parseFloat(coin.change) >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                                        </td>
                                        <td className="small-text">{new Date(coin.listedAt * 1000).toLocaleDateString()}</td>
                                        <td className="small-text">
                                            <canvas id={`sparkline-${index}`} width="100" height="30"></canvas>
                                        </td>
                                        <td>
                                            <Button variant="primary" href={coin.coinrankingUrl} target="_blank" className="d-flex justify-content-center align-content-center">
                                                More...
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default CoinTable;
