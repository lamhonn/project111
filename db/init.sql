-- Initialize database with mock data
USE projectdb;

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- Create a simple items table for CRUD testing
CREATE TABLE IF NOT EXISTS items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  categoryID INT,
  FOREIGN KEY (categoryID) REFERENCES categories(id)
);

-- Insert some mock categories
INSERT INTO categories (name) VALUES
('Electronics'),
('Office Supplies'),
('Hampurilaiset'); -- TODO: Add categories via GraphQL mutation

-- Insert some mock data
INSERT INTO items (name, description, price, categoryID) VALUES
('Laptop', 'High-performance laptop for development', 1299.99, 1),
('Coffee Mug', 'Ceramic coffee mug with company logo', 12.50, 2),
('Wireless Mouse', 'Ergonomic wireless mouse', 45.00, 1),
('Notebook', 'Spiral-bound notebook for meetings', 8.99, 2),
('Monitor', '27-inch 4K monitor', 399.99, 1),
('Phone Charger', 'Fast charging USB-C cable', 25.00, 1);