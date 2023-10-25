-- Get a User with email and ID
SELECT * FROM users WHERE email='tmarois85@gmail.com' AND password='123';

-- Insert user into users
INSERT INTO users (first_name, last_name, email, password, rank)
VALUES('test', 'user', 'testuser@gmail.com', '123456', 2);

-- Insert truck into trucks
INSERT INTO truck (name, model)
VALUES('NH 1', 'Enterprise');

-- Get all trucks
SELECT * FROM truck;

-- Create a customer
INSERT INTO customer (first_name, last_name, phone, email, balance)
VALUES('Fake', 'Customer', '(123) 456-7890', 'fakecustomer@gmail.com', 0.00);

--Create a job
INSERT INTO job (customer_id, pickup, dropoff, job_date, notes, start_time, price, estimate, rate)
VALUES(1, '123 pickup st.', '456 dropoff rd.', '2023-10-25', 'This is a job', '20:52:00', 0, 3, 185);

--Create schedule
INSERT INTO schedule (schedule_date, schedule)
VALUES('2023-10-25', '[{"jobs": [2], "crew": [1], "trucks": [1]}]');