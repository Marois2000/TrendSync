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

/**
 * Gets all customers
 */
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
 * Get a Schedule, and check if the jobs have been changed and update them
 */
app.post('/trendsync/getschedule', async(req, res) => {
    try {
        const {date} = req.body;

        const jobsOnThatDate = await pool.query('SELECT * FROM job WHERE job_date=$1;', [date]);

        let jobIds = [];
        jobsOnThatDate.rows.forEach(job => {
            jobIds = [...jobIds, job.job_id];
        });

        const query = await pool.query('SELECT * FROM schedule WHERE schedule_date=$1;',
        [date]);


        query.rows[0].schedule.timeslots.forEach(timeslot => {
            for (let index = 0; index < timeslot.jobid.length; index++) {
                const job = timeslot.jobid[index];

                if(jobIds.includes(job.job_id)) {
                    for (let jobindex = 0; jobindex < jobsOnThatDate.rows.length; jobindex++) {
                        const jobToCheck = jobsOnThatDate.rows[jobindex];
                        if(jobToCheck.job_id == job.job_id) {
                            timeslot.jobid[index] = jobToCheck;
                        }
                    }
                } else {
                    timeslot.jobid.splice(index, 1);
                }
                
            }
        });


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



        const jobsOnThatDate = await pool.query('SELECT * FROM job WHERE job_date=$1;', [date]);

        let jobIds = [];
        jobsOnThatDate.rows.forEach(job => {
            jobIds = [...jobIds, job.job_id];
        });

        const scheduleQuery = await pool.query('SELECT schedule FROM schedule WHERE schedule_date=$1;',
        [date]);

        console.log(scheduleQuery.rows[0].schedule.timeslots)

        scheduleQuery.rows[0].schedule.timeslots.forEach(timeslot => {
            for (let index = 0; index < timeslot.jobid.length; index++) {
                const job = timeslot.jobid[index];

                if(jobIds.includes(job.job_id)) {
                    for (let jobindex = 0; jobindex < jobsOnThatDate.rows.length; jobindex++) {
                        const jobToCheck = jobsOnThatDate.rows[jobindex];
                        if(jobToCheck.job_id == job.job_id) {
                            timeslot.jobid[index] = jobToCheck;
                        }
                    }
                } else {
                    timeslot.jobid.splice(index, 1);
                }
                
            }
        });



        
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

        res.json(query.rows[0]);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
});

/**
 * Update a job
 */
app.put('/trendsync/updatejob', async(req, res) => {
    try {
        const { pickup, dropoff, crew, trucks, date, notes, estimate, rate, id } = req.body;

        const query = await pool.query('UPDATE job SET pickup=$1, dropoff=$2, num_crew=$3, num_trucks=$4, job_date=$5, notes=$6, estimate=$7, rate=$8 WHERE job_id=$9 RETURNING *;', 
        [pickup, dropoff, crew, trucks, date, notes, estimate, rate, id]);

        res.json(query.rows[0]);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
});

/**
 * Set a customers balance
 */
app.put('/trendsync/setbalance', async(req, res) => {
    try {
        const { balance, id } = req.body;

        const query = await pool.query('UPDATE customer SET balance=$1 WHERE customer_id=$2 RETURNING *;', 
        [balance, id]);

        res.json(query.rows[0]);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
});

/**
 * Update a customer
 */
app.put('/trendsync/updatecustomer', async(req, res) => {
    try {
        const { first, last, email, phone, id } = req.body;

        const query = await pool.query('UPDATE customer SET first_name=$1, last_name=$2, email=$3, phone=$4 WHERE customer_id=$5 RETURNING *;', 
        [first, last, email, phone, id]);

        res.json(query.rows[0]);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
});


/**
 * Delete a job
 */
app.delete('/trendsync/deletejob', async(req, res) => {
    try {
        const { id } = req.body;

        const query = await pool.query('DELETE FROM job WHERE job_id=$1 RETURNING *;', 
        [id]);

        res.json(query.rows[0]);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
});

/**
 * Sets a jobs start time
 */
app.put('/trendsync/startjob', async(req, res) => {
    try {
        const { time, id } = req.body;
        const query = await pool.query('UPDATE job SET start_time=$1 WHERE job_id=$2;', [time, id]);
    } catch (error) {
        console.log(error.message);
    }
});

/**
 * Sets a jobs end time
 */
app.put('/trendsync/endjob', async(req, res) => {
    try {
        const { time, id } = req.body;
        const query = await pool.query('UPDATE job SET end_time=$1 WHERE job_id=$2;', [time, id]);
    } catch (error) {
        console.log(error.message);
    }
});

/**
 * Sets a jobs Total
 */
app.put('/trendsync/jobtotal', async(req, res) => {
    try {
        const { id } = req.body;
        const jobQuery = await pool.query('SELECT * FROM job WHERE job_id=$1', [id]);
        const services = await pool.query('SELECT js.*, s.name, s.price FROM job_service js JOIN service s ON js.service_id = s.service_id WHERE js.job_id = $1;', [id]);
        const materials = await pool.query('SELECT jm.*, m.name, m.price FROM job_material jm JOIN material m ON jm.material_id = m.material_id WHERE jm.job_id = $1;', [id]);

        const job = jobQuery.rows[0];

        let materialCost = 0;
        materials.rows.forEach(material => {
            materialCost += material.quantity * material.price;
        });

        let serviceCost = 0;
        services.rows.forEach(service => {
            serviceCost += service.quantity * service.price;
        });

        const end = job.end_time.split(":");
        const start = job.start_time.split(":");

        const hours = end[0] - start[0];
        const minutes = end[1] - start[1];

        const minutesPercentage = minutes / 60;
        let total = 0;
        if(hours + minutesPercentage < job.estimate) {
            total += job.estimate * job.rate;
        } else {
            total += hours * job.rate;
            if(15 <= minutes < 30) {
                total += 0.25 * job.rate;
            } else if(30 <= minutes < 45) {
                total += 0.5 * job.rate;
            } else if(45 <= minutes < 60) {
                total += 0.75 * job.rate;
            }
        }

        total += materialCost + serviceCost;

        const totalQuery = await pool.query('UPDATE job SET price=$1 WHERE job_id=$2;', [total, id]);

        res.json(total);
    } catch (error) {
        console.log(error.message);
    }
});

/**
 * Completes a job
 */
app.put('/trendsync/finishjob', async(req, res) => {
    try {
        const { customerId, balance, jobId } = req.body;
        await pool.query('UPDATE customer SET balance=$1 WHERE customer_id=$2;', [balance, customerId]);
        await pool.query('UPDATE Job SET complete=true WHERE job_id=$1;', [jobId])

        res.json("OK");
    } catch (error) {
        console.log(error.message);
    }
});


app.listen(5000, () => {
    console.log("Server has started on port: 5000")
});