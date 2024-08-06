// CoinStatsModal.js

import React, { useContext, useState } from 'react';
import { Button, Modal, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CoinContext } from './Context/CoinContext'; // Import the context

const CoinStatsModal = () => {
    const { stats } = useContext(CoinContext); // Use the context to get stats
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Helper function to format large numbers with or without currency
    const formatNumber = (num, withCurrency = false) => {
        const formatted = new Intl.NumberFormat().format(num);
        return withCurrency ? `$${formatted}` : formatted;
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Status
            </Button>

            <Modal show={show} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Coin Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mt-3">
                        <Row xs={1} md={2} lg={3} className="g-4">
                            {Object.entries(stats).map(([key, value], idx) => (
                                <Col key={idx}>
                                    <Card className="h-100">
                                        <Card.Body>
                                            <Card.Title>
                                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                            </Card.Title>
                                            <Card.Text>
                                                {key === 'totalExchanges'
                                                    ? formatNumber(value) // No dollar sign for "Total Exchanges"
                                                    : formatNumber(value, true)}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CoinStatsModal;
