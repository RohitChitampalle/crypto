import React, { useEffect, useState, useRef } from 'react';
import { Table, Button, Spinner } from 'react-bootstrap';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';
import { FaSort, FaArrowUp, FaArrowDown } from "react-icons/fa";

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

const CoinTable = () => {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true); // State to manage data loading
    const [sorting, setSorting] = useState(false); // State to manage sorting loading
    const [sortOrder, setSortOrder] = useState('asc');
    const chartRefs = useRef({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8001/get/api/coins`); // Use environment variable
                const data = await response.json();
                setCoins(data.data.coins);
                setTimeout(() => {
                    setLoading(false);
                }, 1000); // 10 seconds delay for spinner
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!loading && !sorting) {
            coins.forEach((coin, index) => {
                const canvasId = `sparkline-${index}`;
                const canvas = document.getElementById(canvasId);

                if (canvas) {
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
                                borderColor: coin.color || '#000',
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
                }
            });

            // Clean up chart instances on component unmount
            return () => {
                Object.values(chartRefs.current).forEach(chart => chart.destroy());
            };
        }
    }, [coins, loading, sorting]);

    // Sort coins by price
    const sortCoinsByPrice = () => {
        setSorting(true);

        setTimeout(() => {
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
        }, 1000);
    };

    console.log("Coins =>",coins)
    return (
        <div className="container mt-4">
            <h2 className="text-center">Crypto Watcher</h2>
            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" role="status" className="large-spinner">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : (
                <div className="table-responsive">
                    <Table striped bordered hover className="coin-table align-middle">
                        <thead>
                            <tr className="text-center">
                                <th className="name-column">Coins Name</th>
                                <th>Rank</th>
                                <th onClick={sortCoinsByPrice} style={{ cursor: 'pointer' }}>
                                    Price {sortOrder === 'asc' ? <FaSort /> : <FaSort />}
                                </th>
                                <th>Market Cap</th>
                                <th>BTC Price</th>
                                <th>Change</th>
                                <th>Listed At</th>
                                <th>Last 7 Days</th>
                                <th>More Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sorting ? (
                                <tr>
                                    <td colSpan="9" className="text-center">
                                        <Spinner animation="border" role="status" className="large-spinner">
                                            <span className="visually-hidden">Sorting...</span>
                                        </Spinner>
                                    </td>
                                </tr>
                            ) : (
                                coins.map((coin, index) => (
                                    <tr key={coin.uuid}>
                                        <td>
                                            <img src={coin.iconUrl} alt={coin.name} width="25" height="25" className="me-2" />
                                            {coin.name} ({coin.symbol})
                                        </td>
                                        <td>{coin.rank}</td>
                                        <td>${parseFloat(coin.price).toFixed(2)}</td>
                                        <td>${parseFloat(coin.marketCap).toLocaleString()}</td>
                                        <td>{parseFloat(coin.btcPrice).toFixed(8)}</td>
                                        <td className={parseFloat(coin.change) >= 0 ? 'text-success' : 'text-danger'}>
                                            {parseFloat(coin.change).toFixed(2)}%
                                            {parseFloat(coin.change) >= 0 ? <FaArrowUp className="ms-1" /> : <FaArrowDown className="ms-1" />}
                                        </td>
                                        <td>{new Date(coin.listedAt * 1000).toLocaleDateString()}</td>
                                        <td>
                                            <canvas id={`sparkline-${index}`} width="120" height="40" className="sparkline-canvas"></canvas>
                                        </td>
                                        <td>
                                            <Button variant="primary" href={coin.coinrankingUrl} target="_blank" className="d-flex justify-content-center align-items-center">
                                                More
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
