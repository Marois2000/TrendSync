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
        console.log(email);
        console.log(query.rows);

        res.json(query.rows);
    } catch (error) {
        console.log(error.message);
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
    }
});

/**
 * Insert a Job
 */
app.post('/trendsync/addjob', async(req, res) => { 
    try {
        const { customerId, pickup, dropoff, date, notes, estimate, rate } = req.body;
        const query = await pool.query('INSERT INTO job (customer_id, pickup, dropoff, job_date, notes, estimate, rate) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *;',
        [customerId, pickup, dropoff, date, notes, estimate, rate]);

        res.json(query.rows);
    } catch (error) {
        console.log(error.message);
    }
});


/**
 * Initialize a Schedule
 */
app.post('/trendsync/initschedule', async(req, res) => {
    try {
        const {date} = req.body;
        console.log(date);
        const schedule = {
            "timeslots": []
        }

        const query = await pool.query('INSERT INTO schedule (schedule_date, schedule) VALUES($1, $2) RETURNING *;',
        [date, schedule]);

        res.json(query.rows);
    } catch (error) {
        console.log(error.message);
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
    }
});

/**
 * Get all users not on the schedule for a given date
 */
app.get('/trendsync/getcrew', async(req, res) => {
    try {
        const { date } = req.body;
        const scheduleQuery = await pool.query('SELECT schedule FROM schedule WHERE schedule_date=$1;', [date]);
        const { timeslots } = scheduleQuery.rows[0].schedule;
        let crewOnJob = [];
        timeslots.forEach(timeslot => {
            const crew = timeslot.crew;
            crew.forEach(crewMember => {
                if(!crewOnJob.includes(crewMember)) {
                    crewOnJob = [...crewOnJob, crewMember];
                }
            });
        });
        const crewQuery = await pool.query('SELECT * FROM users WHERE NOT user_id = ANY ($1);', 
        [crewOnJob]);
        
        res.json(crewQuery.rows);
    } catch (error) {
        console.log(error.message);
    }
});

/**
 * Get all trucks not on the schedule for a given date
 */
app.get('/trendsync/gettrucks', async(req, res) => {
    try {
        const { date } = req.body;
        const scheduleQuery = await pool.query('SELECT schedule FROM schedule WHERE schedule_date=$1;', [date]);
        const { timeslots } = scheduleQuery.rows[0].schedule;
        let trucksOnJob = [];
        timeslots.forEach(timeslot => {
            const trucks = timeslot.trucks;
            trucks.forEach(truck => {
                if(!trucksOnJob.includes(truck)) {
                    trucksOnJob = [...trucksOnJob, truck];
                }
            });
        });
        const trucksQuery = await pool.query('SELECT * FROM truck WHERE NOT truck_id = ANY ($1);', 
        [trucksOnJob]);
        
        res.json(trucksQuery.rows);
    } catch (error) {
        console.log(error.message);
    }
});

/**
 * Get all jobs not on the schedule for a given date
 */
app.get('/trendsync/getjobs', async(req, res) => {
    try {
        const { date } = req.body;
        const scheduleQuery = await pool.query('SELECT schedule FROM schedule WHERE schedule_date=$1;', [date]);
        const { timeslots } = scheduleQuery.rows[0].schedule;
        let jobsOnSchedule = [];
        timeslots.forEach(timeslot => {
            const jobs = timeslot.jobid;
            jobs.forEach(job => {
                if(!jobsOnSchedule.includes(job)) {
                    jobsOnSchedule = [...jobsOnSchedule, job];
                }
            });
        });
        const jobsQuery = await pool.query('SELECT * FROM job WHERE NOT job_id = ANY ($1);', 
        [jobsOnSchedule]);
        
        res.json(jobsQuery.rows);
    } catch (error) {
        console.log(error.message);
    }
});









app.listen(5000, () => {
    console.log("Server has started on port: 5000")
});