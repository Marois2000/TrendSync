CREATE TABLE material(
    material_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    price REAL
);

CREATE TABLE service(
    service_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    price REAL
);

CREATE TABLE truck(
    truck_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    model VARCHAR(255)
);

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    rank INT
);

CREATE TABLE customer(
    customer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone VARCHAR(255),
    email VARCHAR(255),
    balance REAL
);

CREATE TABLE job(
    job_id SERIAL PRIMARY KEY,
    customer_id INT,
    pickup VARCHAR(255),
    dropoff VARCHAR(255),
    job_date DATE,
    notes VARCHAR(2047),
    start_time TIME,
    end_time TIME,
    price REAL,
    pdf BYTEA,
    estimate INT,
    rate INT,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

CREATE TABLE schedule(
    schedule_date DATE,
    schedule JSON
);

CREATE TABLE job_material(
    job_id INT,
    material_id INT,
    quantity INT,
    FOREIGN KEY (job_id) REFERENCES job(job_id),
    FOREIGN KEY (material_id) REFERENCES material(material_id)
);

CREATE TABLE job_service(
    job_id INT,
    service_id INT,
    quantity INT,
    FOREIGN KEY (job_id) REFERENCES job(job_id),
    FOREIGN KEY (service_id) REFERENCES service(service_id)
);