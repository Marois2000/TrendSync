const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const path = "localhost:5000";

//MIDDLEWARE
app.use(cors());
app.use(express.json());


/**
 * Get a User
 */
app.post('/trendsync/login', async(req, res) => {
    try {
        const {email, password} = req.body;
        const query = await pool.query("SELECT * FROM users WHERE email=$1 AND password=$2;", [email, password]);

        res.json(query.rows);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
});

app.post('/trendsync/customers', async(req, res) => {
    try {
        const query = await pool.query("SELECT * FROM customer;");

        res.json(query.rows);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
});

/**
 * Insert Customer
 */
app.post('/trendsync/addcustomer', async(req, res) => {
    try {
        const { first, last, phone, email } = req.body;
        const query = await pool.query("INSERT INTO customer (first_name, last_name, phone, email) VALUES($1, $2, $3, $4) RETURNING *;", 
        [first, last, phone, email]);

        res.json(query.rows);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
});

/**
 * Insert a Truck
 */
app.post('/trendsync/addtruck', async(req, res) => {
    try {
        const { name, model, length } = req.body;
        const query = await pool.query('INSERT INTO truck (name, model, length)VALUES($1, $2, $3) RETURNING *;', [name, model, length]);
   
        res.json(query.rows);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
});

/**
 * Insert a User
 */
app.post('/trendsync/adduser', async(req, res) => {
    try {
        const { first, last, email, password, rank } = req.body;
        const query = await pool.query('INSERT INTO users (first_name, last_name, email, password, rank) VALUES($1, $2, $3, $4, $5) RETURNING *;',
        [first, last, email, password, rank]);

        res.json(query.rows);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
});

/**
 * Insert a Job
 */
app.post('/trendsync/addjob', async(req, res) => { 
    try {
        const { customerId, pickup, dropoff, crew, trucks, date, notes, estimate, rate } = req.body;
        const query = await pool.query('INSERT INTO job (customer_id, pickup, dropoff, job_date, notes, estimate, rate, num_crew, num_trucks) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;',
        [customerId, pickup, dropoff, date, notes, estimate, rate, crew, trucks]);

        res.json(query.rows);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
});


/**
 * Initialize a Schedule
 */
app.post('/trendsync/initschedule', async(req, res) => {
    try {
        const {date} = req.body;
        const schedule = {
            "timeslots": []
        }

        const query = await pool.query('INSERT INTO schedule (schedule_date, schedule) VALUES($1, $2) RETURNING *;',
        [date, schedule]);

        res.json(query.rows);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
});

/**
 * Get a Schedule
 */
app.post('/trendsync/getschedule', async(req, res) => {
    try {
        const {date} = req.body;

        const query = await pool.query('SELECT * FROM schedule WHERE schedule_date=$1;',
        [date]);

        res.json(query.rows);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
});

/**
 * Updates a schedule
 */
app.put('/trendsync/updateschedule', async(req, res) => {
    try {
        const { date, schedule } = req.body;
        const query = await pool.query('UPDATE schedule SET schedule=$1 WHERE schedule_date=$2 RETURNING *;',
        [schedule, date]);

        res.json(query.rows[0]);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
});

/**
 * Get all users not on the schedule for a given date
 */
app.post('/trendsync/getcrew', async(req, res) => {
    try {
        const { date } = req.body;
        const scheduleQuery = await pool.query('SELECT schedule FROM schedule WHERE schedule_date=$1;', [date]);
        let crewOnJob = [];
        if(scheduleQuery.rows.length > 0) {
            const { timeslots } = scheduleQuery.rows[0].schedule;
            timeslots.forEach(timeslot => {
                const crew = timeslot.crew;
                crew.forEach(crewMember => {
                    if(!crewOnJob.includes(crewMember.user_id)) {
                        crewOnJob = [...crewOnJob, crewMember.user_id];
                    }
                });
            });
        }
        
        const crewQuery = await pool.query('SELECT * FROM users WHERE NOT user_id = ANY ($1) AND active=true;', 
        [crewOnJob]);

        const allCrew = await pool.query('SELECT * FROM users;');

        const crew = {
            notScheduled: crewQuery.rows,
            everyone: allCrew.rows
        }
        
        res.json(crew);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
});

/**
 * Get all trucks not on the schedule for a given date
 */
app.post('/trendsync/gettrucks', async(req, res) => {
    try {
        const { date } = req.body;
        const scheduleQuery = await pool.query('SELECT schedule FROM schedule WHERE schedule_date=$1;', [date]);
        let trucksOnJob = [];
        if(scheduleQuery.rows.length > 0) {
            const { timeslots } = scheduleQuery.rows[0].schedule;
            timeslots.forEach(timeslot => {
                const trucks = timeslot.trucks;
                trucks.forEach(truck => {
                    if(!trucksOnJob.includes(truck.truck_id)) {
                        trucksOnJob = [...trucksOnJob, truck.truck_id];
                    }
                });
            });
        }
        const trucksQuery = await pool.query('SELECT * FROM truck WHERE NOT truck_id = ANY ($1) AND active=true;', 
        [trucksOnJob]);

        const allTrucks = await pool.query('SELECT * FROM truck;');

        const trucks = {
            notScheduled: trucksQuery.rows,
            allTrucks: allTrucks.rows
        }
        
        res.json(trucks);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
});

/**
 * Get all jobs not on the schedule for a given date
 */
app.post('/trendsync/getjobs', async(req, res) => {
    try {
        const { date } = req.body;
        const scheduleQuery = await pool.query('SELECT schedule FROM schedule WHERE schedule_date=$1;', [date]);
        let jobsOnSchedule = [];
        if(scheduleQuery.rows.length > 0) {
            const { timeslots } = scheduleQuery.rows[0].schedule;
            timeslots.forEach(timeslot => {
                const jobs = timeslot.jobid;
                jobs.forEach(job => {
                    if(!jobsOnSchedule.includes(job.job_id)) {
                        jobsOnSchedule = [...jobsOnSchedule, job.job_id];
                    }
                });
            });
        }
        const jobsQuery = await pool.query('SELECT * FROM job WHERE NOT job_id = ANY ($1) AND job_date=$2;', 
        [jobsOnSchedule, date]);

        const allJobs = await pool.query('SELECT * FROM job WHERE job_date=$1;', 
        [date]);

        const jobs = {
            jobsScheduled: jobsQuery.rows,
            allJobs: allJobs.rows
        }
        
        res.json(jobs);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
});

/**
 * Gets a customer with an id
 */
app.post('/trendsync/getcustomer', async(req, res) => {
    try {
        const { id } = req.body;
        const query = await pool.query('SELECT * FROM customer WHERE customer_id=$1;',
        [id]);

        res.json(query.rows[0]);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
});


/**
 * Gets all jobs
 */
app.post('/trendsync/getalljobs', async(req, res) => {
    try {
        const query = await pool.query('SELECT * FROM job;')

        res.json(query.rows);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
});

/**
 * Gets a users job
 */
app.post('/trendsync/getusersjob', async(req, res) => {
    try {
        const { userId, date } = req.body;

        const scheduleQuery = await pool.query('SELECT schedule FROM schedule WHERE schedule_date=$1;', [date]);
        
        let usersTimeslot = {};
        if(scheduleQuery.rows.length > 0) {
            const { timeslots } = scheduleQuery.rows[0].schedule;
            timeslots.forEach(timeslot => {
                const crew = timeslot.crew;
                crew.forEach(crewMember => {
                    if(crewMember.user_id == userId) {
                        usersTimeslot = timeslot;
                    }
                });
            });
        }

        res.json(usersTimeslot);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
});

/**
 * Get all the materials a job is not using
 */
app.post('/trendsync/getmaterials', async(req, res) => {
    try {
        const { jobId } = req.body;

        const query = await pool.query('SELECT m.* FROM material m LEFT JOIN job_material jm ON m.material_id = jm.material_id AND jm.job_id=$1 WHERE jm.job_id IS NULL;', 
        [jobId]);

        res.json(query.rows);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
});

/**
 * Get all materials a job is using
 */
app.post('/trendsync/getmaterialsinuse', async(req, res) => {
    try {
        const { jobId } = req.body;

        const query = await pool.query('SELECT jm.*, m.name, m.price FROM job_material jm JOIN material m ON jm.material_id = m.material_id WHERE jm.job_id = $1;', 
        [jobId]);


        res.json(query.rows);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
});

/**
 * Update all of a jobs materials
 */
app.post('/trendsync/updatematerials', async(req, res) => {
    try {
        const { jobId, materials } = req.body;

        await pool.query('DELETE FROM job_material WHERE job_id=$1;', [jobId]);

        materials.forEach(material => {
            pool.query('INSERT INTO job_material (job_id, material_id, quantity) VALUES ($1, $2, $3);',
            [material.job_id, material.material_id, material.quantity])
        });


    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
});

/**
 * Get all the services a job is not using
 */
app.post('/trendsync/getservices', async(req, res) => {
    try {
        const { jobId } = req.body;

        const query = await pool.query('SELECT s.* FROM service s LEFT JOIN job_service js ON s.service_id = js.service_id AND js.job_id = $1 WHERE js.job_id IS NULL;', 
        [jobId]);

        res.json(query.rows);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
});

/**
 * Get all services a job is using
 */
app.post('/trendsync/getservicesinuse', async(req, res) => {
    try {
        const { jobId } = req.body;

        const query = await pool.query('SELECT js.*, s.name, s.price FROM job_service js JOIN service s ON js.service_id = s.service_id WHERE js.job_id = $1;', 
        [jobId]);


        res.json(query.rows);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
});

/**
 * Update all of a jobs services
 */
app.post('/trendsync/updateservices', async(req, res) => {
    try {
        const { jobId, services } = req.body;


        await pool.query('DELETE FROM job_service WHERE job_id = $1;', [jobId]);

        services.forEach(service => {
            pool.query('INSERT INTO job_service (job_id, service_id, quantity) VALUES ($1, $2, $3);',
            [service.job_id, service.service_id, service.quantity])
        });


    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
});

/**
 * Update a user
 */
app.put('/trendsync/updateuser', async(req, res) => {
    try {
        const { first, last, email, password, rank, active, id } = req.body;

        const query = await pool.query('UPDATE users SET first_name=$1, last_name=$2, email=$3, password=$4, rank=$5, active=$6 WHERE user_id=$7 RETURNING *;', 
        [first, last, email, password, rank, active, id]);

        res.json(query.rows[0]);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
});

/**
 * Update a truck
 */
app.put('/trendsync/updatetruck', async(req, res) => {
    try {
        const { name, model, length, active, id } = req.body;

        const query = await pool.query('UPDATE truck SET name=$1, model=$2, length=$3, active=$4 WHERE truck_id=$5 RETURNING *;', 
        [name, model, length, active, id]);

        console.log(query.rows[0]);
        res.json(query.rows[0]);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
});


app.listen(5000, () => {
    console.log("Server has started on port: 5000")
});