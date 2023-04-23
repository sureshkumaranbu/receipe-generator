import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';

function Home() {
  return (
    <Container className="py-5">
      <Row>
        <Col>
          <h1 className="text-center mb-4">Recipe Generator</h1>
          <p className="text-center mb-5">Generate personalized recipes based on your dietary preferences, ingredients on hand, and cuisine preferences.</p>
          <div className="text-center">
            <Link to="/recipe">
              <Button variant="primary">Get Started</Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
