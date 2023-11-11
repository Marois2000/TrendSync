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
        const { name, model } = req.body;
        const query = await pool.query('INSERT INTO truck (name, model)VALUES($1, $2) RETURNING *;', [name, model]);
   
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
        
        const crewQuery = await pool.query('SELECT * FROM users WHERE NOT user_id = ANY ($1);', 
        [crewOnJob]);
        
        res.json(crewQuery.rows);
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
        const trucksQuery = await pool.query('SELECT * FROM truck WHERE NOT truck_id = ANY ($1);', 
        [trucksOnJob]);
        
        res.json(trucksQuery.rows);
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

        
        res.json(jobsQuery.rows);
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






app.listen(5000, () => {
    console.log("Server has started on port: 5000")
});