-- Create database
CREATE DATABASE IF NOT EXISTS charityevents_db;
USE charityevents_db;

-- Create organisations table
CREATE TABLE organisations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    address TEXT,
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create events table
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    full_description TEXT,
    event_date DATE NOT NULL,
    event_time TIME,
    location VARCHAR(255) NOT NULL,
    address TEXT,
    category_id INT,
    organisation_id INT,
    ticket_price DECIMAL(10, 2) DEFAULT 0.00,
    goal_amount DECIMAL(12, 2),
    current_amount DECIMAL(12, 2) DEFAULT 0.00,
    max_attendees INT,
    current_attendees INT DEFAULT 0,
    status ENUM('active', 'suspended', 'completed', 'cancelled') DEFAULT 'active',
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (organisation_id) REFERENCES organisations(id)
);

-- Insert sample organisations
INSERT INTO organisations (name, description, contact_email, contact_phone, address, website) VALUES
('Hope Foundation', 'A charity dedicated to supporting education for underprivileged children', 'contact@hopefoundation.org', '1234567890', '123 Hope Street, City Center', 'www.hopefoundation.org'),
('Green Earth Society', 'An organisation focusing on environmental protection and sustainable development', 'info@greenearth.org', '0987654321', '456 Green Avenue, Eco District', 'www.greenearth.org'),
('Community Care', 'An organisation providing support and care for the elderly in the community', 'care@community.org', '1122334455', '789 Care Lane, Community Area', 'www.communitycare.org');

-- Insert categories
INSERT INTO categories (name, description) VALUES
('Gala Dinner', 'Formal fundraising dinner event'),
('Fun Run', 'Charity running event'),
('Silent Auction', 'Silent auction fundraising event'),
('Concert', 'Charity concert'),
('Workshop', 'Educational workshop'),
('Community Service', 'Community service event'),
('Sports Event', 'Charity sports event'),
('Art Exhibition', 'Fundraising art exhibition');

-- Insert sample events
INSERT INTO events (name, description, full_description, event_date, event_time, location, address, category_id, organisation_id, ticket_price, goal_amount, current_amount, max_attendees, current_attendees, status, image_url) VALUES
('Night of Hope Gala Dinner', 'Annual fundraising dinner for children’s education', 'This is our most important annual fundraising event, aiming to provide education opportunities for children in underprivileged areas. The dinner will feature gourmet food, a live auction, and touching stories from children who benefited. All proceeds will go towards building rural schools and providing educational resources.', '2024-12-15', '18:00:00', 'City Center Grand Hotel', '123 Main Street, City Center', 1, 1, 150.00, 50000.00, 25000.00, 200, 85, 'active', 'https://example.com/gala-dinner.jpg'),

('Green Earth Charity Run', '5K charity run for environmental protection', 'Join our eco-themed run and contribute to protecting the planet! This 5K run will be held in a beautiful city park. Participants will receive eco-friendly souvenirs. All funds raised will go to reforestation and environmental education programs.', '2024-11-20', '08:00:00', 'City Park', '456 Park Avenue, Green District', 2, 2, 25.00, 20000.00, 8500.00, 500, 156, 'active', 'https://example.com/fun-run.jpg'),

('Charity Art Auction', 'Silent auction of local artworks', 'Enjoy beautiful artworks by local artists while supporting charity. The silent auction will showcase over 50 pieces, including paintings, sculptures, and photographs. All proceeds will support community art education projects.', '2024-12-01', '14:00:00', 'Art Gallery', '789 Art Street, Cultural Quarter', 3, 3, 0.00, 15000.00, 3200.00, 100, 42, 'active', 'https://example.com/art-auction.jpg'),

('Charity Concert', 'Concert by local musicians', 'Enjoy wonderful music while supporting a good cause. This concert will feature several well-known local musicians, performing classical, pop, and folk music. Ticket proceeds will support music education programs.', '2024-11-25', '19:30:00', 'City Concert Hall', '321 Music Boulevard, Arts District', 4, 1, 80.00, 30000.00, 12000.00, 300, 120, 'active', 'https://example.com/concert.jpg'),

('Community Care Workshop', 'Training workshop on elderly care', 'Learn how to better care for the elderly in your community. This workshop will be led by professional caregivers and cover topics such as basic care, mental health support, and emergency handling. Participants will receive a certificate.', '2024-11-30', '10:00:00', 'Community Center', '654 Community Road, Residential Area', 5, 3, 30.00, 5000.00, 2100.00, 50, 28, 'active', 'https://example.com/workshop.jpg'),

('Environmental Cleanup Day', 'Community environmental cleanup volunteer activity', 'Join our cleanup event to help create a better living environment. Activities include park cleaning, waste sorting education, and environmental awareness promotion. Volunteers will receive eco-friendly souvenirs and a service certificate.', '2024-11-18', '09:00:00', 'Community Park', '987 Park Lane, Green Area', 6, 2, 0.00, 3000.00, 1500.00, 100, 67, 'active', 'https://example.com/cleanup.jpg'),

('Charity Basketball Match', 'Charity basketball game with local teams', 'Watch an exciting basketball game while supporting youth sports development. Local teams will compete, and there will be interactive games and raffles. Proceeds will go towards providing sports equipment and training for underprivileged youth.', '2024-12-08', '15:00:00', 'Sports Center', '147 Sports Avenue, Athletic District', 7, 1, 40.00, 25000.00, 9800.00, 400, 178, 'active', 'https://example.com/basketball.jpg'),

('Hope Art Exhibition', 'Charity exhibition of children’s artworks', 'Admire paintings created by children from Hope Primary School, showcasing their dreams and love of life. The exhibition also includes workshops where visitors can create art together with the children. Sales proceeds will improve school facilities.', '2024-12-10', '11:00:00', 'Cultural Center', '258 Culture Street, Education Zone', 8, 1, 15.00, 10000.00, 4200.00, 150, 89, 'active', 'https://example.com/art-exhibition.jpg'),

('Past Charity Marathon', 'Completed marathon fundraising event', 'A successful marathon event that raised significant funds for the local hospital.', '2024-10-15', '07:00:00', 'Central Plaza', '100 Central Plaza', 2, 2, 50.00, 40000.00, 45000.00, 1000, 856, 'completed', 'https://example.com/marathon.jpg'),

('Future Tech Expo', 'Upcoming technology innovation exhibition', 'An exhibition showcasing the latest innovations in technology to raise funds for tech education projects.', '2025-01-15', '10:00:00', 'Science & Technology Museum', '500 Tech Avenue', 8, 2, 35.00, 18000.00, 2000.00, 200, 15, 'active', 'https://example.com/tech-expo.jpg');
