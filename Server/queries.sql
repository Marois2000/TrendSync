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

SELECT schedule FROM schedule WHERE schedule_date='2023-10-27'; 

-- Update a schedule given a date
UPDATE schedule
SET schedule=$1
WHERE schedule_date=$2
RETURNING *;

-- Get all crew that ID is not in array
SELECT *
FROM users
WHERE NOT user_id = ANY ($1);

-- Get all trucks that ID is not in array
SELECT *
FROM truck
WHERE NOT truck_id = ANY ($1);

--Get all materials that a job isn't using
SELECT m.*
FROM material m
LEFT JOIN job_material jm ON m.material_id = jm.material_id AND jm.job_id = 22
WHERE jm.job_id IS NULL;

--Get all materials a job is using
SELECT jm.*, m.name, m.price
FROM job_material jm
JOIN material m ON jm.material_id = m.material_id
WHERE jm.job_id = $1;

-- Delete existing materials for the specified job
DELETE FROM job_material
WHERE job_id = $1;

-- Insert new set of materials
INSERT INTO job_material (job_id, material_id, quantity)
VALUES ($1, $2, $3);

--Get all services that a job isn't using
SELECT s.*
FROM service s
LEFT JOIN job_service js ON s.service_id = js.service_id AND js.job_id = $1
WHERE js.job_id IS NULL;

--Get all services a job is using
SELECT js.*, s.name, s.price
FROM job_service js
JOIN service s ON js.service_id = s.service_id
WHERE js.job_id = $1;

-- Delete existing services for the specified job
DELETE FROM job_service
WHERE job_id = $1;

-- Insert new set of services
INSERT INTO job_service (job_id, service_id, quantity)
VALUES ($1, $2, $3);