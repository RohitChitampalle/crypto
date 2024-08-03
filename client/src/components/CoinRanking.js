import React, { useEffect, useState, useRef } from 'react';
import { Table, Button } from 'react-bootstrap';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';
import { FaSort } from "react-icons/fa";

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

const CoinTable = () => {
    const [coins, setCoins] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc');
    const chartRefs = useRef({});

    useEffect(() => {
        fetch('https://api.coinranking.com/v2/coins')
            .then(response => response.json())
            .then(data => {
                setCoins(data.data.coins);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        coins.forEach((coin, index) => {
            const canvasId = `sparkline-${index}`;
            const ctx = document.getElementById(canvasId).getContext('2d');

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
        const sortedCoins = [...coins].sort((a, b) => {
            if (sortOrder === 'asc') {
                return parseFloat(a.price) - parseFloat(b.price);
            } else {
                return parseFloat(b.price) - parseFloat(a.price);
            }
        });

        setCoins(sortedCoins);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center">Cryptocurrency Prices</h2>
            <Table striped bordered hover>
                <thead>
                    <tr className="text-center">
                        <th>Name</th>
                        <th>Rank</th>
                        <th onClick={sortCoinsByPrice} style={{ cursor: 'pointer' }}>
                            Price {sortOrder === 'asc' ? <FaSort /> : <FaSort />}
                        </th>
                        <th>Listed At</th>
                        <th>Last 7 Days</th>
                        <th>More Details</th>
                    </tr>
                </thead>
                <tbody >
                    {coins.map((coin, index) => (
                        <tr key={coin.uuid}>
                            <td >
                                <img src={coin.iconUrl} alt={coin.name} width="25" height="25" className="me-2" />
                                {coin.name} ({coin.symbol})
                            </td>
                            <td>{coin.rank}</td>
                            <td>${parseFloat(coin.price).toFixed(2)}</td>
                            <td>{new Date(coin.listedAt * 1000).toLocaleDateString()}</td>
                            <td>
                                <canvas id={`sparkline-${index}`} width="100" height="30"></canvas>
                            </td>
                            <td>
                                <Button variant="primary" href={coin.coinrankingUrl} target="_blank" className="d-flex justify-content-center align-content-center  ">
                                    More Details
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default CoinTable;
