-- Initialize database with mock data
USE projectdb;

-- Create a simple items table for CRUD testing
CREATE TABLE IF NOT EXISTS items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert some mock data
INSERT INTO items (name, description, price, category) VALUES
('Laptop', 'High-performance laptop for development', 1299.99, 'Electronics'),
('Coffee Mug', 'Ceramic coffee mug with company logo', 12.50, 'Office Supplies'),
('Wireless Mouse', 'Ergonomic wireless mouse', 45.00, 'Electronics'),
('Notebook', 'Spiral-bound notebook for meetings', 8.99, 'Office Supplies'),
('Monitor', '27-inch 4K monitor', 399.99, 'Electronics'),
('Desk Lamp', 'Adjustable LED desk lamp', 35.00, 'Furniture'),
('Phone Charger', 'Fast charging USB-C cable', 25.00, 'Electronics'),
('Plant Pot', 'Small ceramic pot for desk plants', 15.99, 'Decoration');