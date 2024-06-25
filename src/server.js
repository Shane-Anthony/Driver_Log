const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express(); 

/**
 * Server configuration and setup for handling requests related to drivers, vehicles, and journeys.
 * Utilizes Express.js framework with additional packages for routing, database interaction, and security.
*/

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Database configuration
const db = mysql.createConnection({
  host: '754659.vps-10.com',
  port: 3306,
  user: 'puregarden_appmin',
  password: 'Pc911Add3!',
  database: 'puregarden_app'
});

// Test database connection
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database successfully');
});



/* 
Post for pin validation when logging in. 
As it was required to only use a pin to log in, have nothing to compare pin to user. 
In this case we need to iterate through each user to find a pincode that matches. 
Hashing pincodes is done using $2b$12$. 
*/ 
app.post('/validate-pin', async (req, res) => {
  try {
    const enteredPin = req.body.pincode;
    //const userName = req.body.username; 
    console.log('Entered PIN:', enteredPin);
    

    /*
    If entername.js used, use the following instead:
    db.query('SELECT pincode, driver_name FROM drivers WHERE driver_name LIKE ?', [`%${userName}%`], async function(err, results) {
    */ 

    // Execute the query to fetch all rows of pincodes for the specific user from the database
    db.query('SELECT pincode, driver_name FROM drivers', async function(err, results) {
      if (err) {
        console.error('Error fetching pincode rows:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      console.log('Fetched pincode rows:', results);

      if (!results || results.length === 0) {
        console.log('No pincode rows found in the database for the specified user');
        res.status(401).json({ isValid: false });
        return;
      }

      // Initialize driverName to null
      let driverName = null;

      // Iterate through each row to check for a matching PIN
      for await(const row of results) {
        console.log('Current row:', row);
        const hashedPincode = row.pincode;
        const tempDriverName = row.driver_name;

        // Compare the entered PIN directly with the hashed pincode from the database
        const bcryptRes = await bcrypt.compare(enteredPin, hashedPincode);
        console.log('bcrypt result:', bcryptRes);

        if (bcryptRes) {
          // PIN is valid
          console.log('Valid PIN found!');
          driverName = tempDriverName;
          break; // Exit the loop
        }
      }

      if (driverName) {
        // Send the response if a valid PIN is found
        res.status(200).json({ isValid: true, driverName: driverName });
      } else {
        // If the loop finishes without finding a matching PIN
        console.log('No matching PIN found in the database');
        res.status(401).json({ isValid: false });
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* 
Endpoint to handle POST request to add a vehicle.
Inserts the vehicle details into the database.
*/
app.post('/addvehicle', async (req, res) => {
  console.log('Received request to add vehicle:', req.body);

  const { make, model, registration } = req.body;

  try {
    console.log('Adding vehicle to database...');
    
    // Construct the SQL query to insert the new vehicle into the vehicles table
    const sqlQuery = `INSERT INTO vehicles (VEHICLE_REG, VEHICLE_MAKE, VEHICLE_MODEL) VALUES (?, ?, ?)`;
    
    // Execute the SQL query with the provided vehicle details
    db.query(sqlQuery, [registration, make, model], (err, result) => {
      if (err) {
        console.error('Error adding vehicle:', err);
        res.status(500).json({ error: 'Failed to add vehicle' });
        return;
      }

      console.log('Vehicle added successfully');
      
      // Send a success response back to the client
      res.status(201).json({ message: 'Vehicle added successfully' });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to handle GET request to fetch vehicles
app.get('/vehicles', (req, res) => {
  // Query to fetch van data from the database
  const query = 'SELECT * FROM vehicles';

  // Execute the query
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching vehicle data:', error);
      res.status(500).json({ error: 'Failed to fetch vehicle data' });
    } else {
      // Send the fetched van data as a response
      res.status(200).json(results);
    }
  });
});

// Endpoint to handle POST request to start a journey
app.post('/startjourney', (req, res) => {
  // Extract journey data from the request body
  const { date, start_time, vehicle_reg, driver_name } = req.body;

  // Perform database insertion to start the journey
  db.query('INSERT INTO journeys (date, start_time, vehicle_reg, driver_name) VALUES (?, ?, ?, ?)', [date, start_time, vehicle_reg, driver_name], (err, result) => {
    if (err) {
      console.error('Error starting journey:', err);
      res.status(500).json({ error: 'Failed to start journey' });
    } else {
      console.log('Journey started successfully');
      res.status(200).json({ message: 'Journey started successfully' });
    }
  });
});

// Route to get the last journey of the current day for a specific driver
app.get('/lastjourney', (req, res) => {
  const { driver_name } = req.query;

  // Query the database to find the last journey of the current day for the specified driver
  const query = `
    SELECT *
    FROM journeys
    WHERE driver_name = ? AND DATE(date) = CURDATE()
    ORDER BY DATE(date) DESC, start_time DESC
    LIMIT 1
  `;

  // Execute the query
  db.query(query, [driver_name], (err, result) => {
    if (err) {
      console.error('Error fetching last journey:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Send the result (last journey) back to the client
    res.json(result && result.length > 0 ? result[0] : null);
  });
});

// Route to update the end time of the last journey if it's not recorded
app.post('/updateJourney', (req, res) => {
  const { driver_name, end_time } = req.body;

  // Update the end time of the last journey of the current day for the specified driver
  
  const updateQuery = `
    UPDATE journeys
    SET END_TIME = ?
    WHERE DRIVER_NAME = ? AND DATE(date) = CURDATE() AND END_TIME IS NULL
    ORDER BY DATE(date) DESC, start_time DESC
    LIMIT 1
  `;

  // Execute the update query
  db.query(updateQuery, [end_time, driver_name], (err, result) => {
    if (err) {
      console.error('Error updating end time:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Send a success response back to the client
    res.json({ message: 'End time updated successfully' });
  });
});

// Endpoint to handle POST request to add a driver
app.post('/addDriver', async (req, res) => {
  console.log('Received request to add Driver:', req.body);

  const { driver_name, pincode } = req.body;

  try {
    console.log('Adding Driver to database...');

    // Check if the pincode has exactly 5 numeric characters
    if (!/^\d{5}$/.test(pincode)) {
      console.log('Invalid pincode format');
      return res.status(400).json({ error: 'Pincode must be exactly 5 numeric characters' });
    }

    // Check if the provided pincode already exists in the database
    db.query('SELECT PINCODE FROM drivers', async function(err, results) {
      if (err) {
        console.error('Error fetching pincode rows:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      console.log('Fetched pincode rows:', results);

      // Iterate through each row to check if any pincode matches the provided pincode
      for(const row of results) {
        const hashedPincode = row.PINCODE;

        // Compare the provided pincode with the hashed pincode from the database
        const bcryptRes = await bcrypt.compare(pincode, hashedPincode);
        console.log('bcrypt result:', bcryptRes);

        if (bcryptRes) {
          // If a match is found, return an error response
          console.log('Pincode already exists in the database');
          return res.status(409).json({ error: 'Pincode already exists' });
          break;
        }
      }

      // If no matching pincode is found, proceed to add the new driver
      const hashedPincode = await bcrypt.hash(pincode, 12); // Hash with salt rounds of 12
      
      // Construct the SQL query to insert the new driver into the drivers table
      const sqlQuery = `INSERT INTO drivers (DRIVER_NAME, PINCODE) VALUES (?, ?)`;
      
      // Execute the SQL query with the provided driver details
      db.query(sqlQuery, [driver_name, hashedPincode], (err, result) => {
        if (err) {
          console.error('Error adding Driver.');
          res.status(500).json({ error: 'Failed to add Driver' });
          return;
        }

        console.log('Driver added successfully');
        
        // Send a success response back to the client
        res.status(201).json({ message: 'Driver added successfully' });
      });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Endpoint to handle DELETE request to remove a vehicle by registration number
app.delete('/removevehicle/:registration', async (req, res) => {
  const registration = req.params.registration;

  try {
    console.log('Removing vehicle from database...');
    
    // Construct the SQL query to delete the vehicle from the vehicles table
    const sqlQuery = `DELETE FROM vehicles WHERE VEHICLE_REG = ?`;
    
    // Execute the SQL query with the provided registration number
    db.query(sqlQuery, [registration], (err, result) => {
      if (err) {
        console.error('Error removing vehicle:', err);
        res.status(500).json({ error: 'Failed to remove vehicle' });
        return;
      }

      // Check if any rows were affected by the delete operation
      if (result.affectedRows === 0) {
        console.log('No vehicle found with the specified registration number');
        res.status(404).json({ error: 'No vehicle found with the specified registration number' });
        return;
      }

      console.log('Vehicle removed successfully');
      
      // Send a success response back to the client
      res.status(200).json({ message: 'Vehicle removed successfully' });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to get the list of drivers
app.get('/drivers', async (req, res) => {
  try {
    console.log('Received request to fetch list of drivers');
    // Fetch the list of drivers from the database

    const query = 'SELECT DRIVER_ID, DRIVER_NAME FROM drivers';

    // Execute the query to fetch the list of drivers from the database
    db.query(query, (error, drivers) => {
      if (error) {
        console.error('Error fetching drivers:', error);
        res.status(500).json({ error: 'Failed to fetch drivers' });
      } else {
        // Extract relevant data and send it to the client
        const driverData = drivers.map(driver => ({
          id: driver.DRIVER_ID,
          name: driver.DRIVER_NAME
        }));

        console.log('Sending drivers:', driverData);
        
        res.json(driverData);
      }
    });
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
});

// Endpoint to handle DELETE request to remove a driver
app.delete('/removedriver/:driverId', async (req, res) => {
  const driverId = req.params.driverId;

  try {
    // Delete the driver from the database
    await db.query('DELETE FROM drivers WHERE DRIVER_ID = ?', [driverId]);
    console.log(`Driver with ID ${driverId} removed successfully`);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error removing driver:', error);
    res.status(500).json({ error: 'Failed to remove driver' });
  }
});

// Endpoint to handle GET request for fetching journeys data for a specific date
app.get('/dailyjourneys', (req, res) => {
  // Extract the date parameter from the request query
  const dateParam = req.query.date;

  // Ensure the date parameter is provided and valid
  if (!dateParam) {
    res.status(400).json({ error: 'Date parameter is required' });
    return;
  }

  // Construct the SQL query to fetch journeys data for the specified date
  const sqlQuery = `
    SELECT j.DATE, j.DRIVER_NAME, j.START_TIME, v.VEHICLE_MAKE, v.VEHICLE_MODEL, j.VEHICLE_REG, j.END_TIME
    FROM journeys j
    LEFT JOIN vehicles v ON j.VEHICLE_REG = v.VEHICLE_REG
    WHERE DATE(j.DATE) = ?;
  `;

  // Execute the SQL query with the provided date parameter
  db.query(sqlQuery, [dateParam], (err, results) => {
    if (err) {
      console.error('Error fetching journeys data:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.status(200).json(results);
  });
});

// Endpoint to handle GET request for fetching weekly journeys data
app.get('/weeklyjourneys', (req, res) => {
  const { startDate, endDate } = req.query;
  const sqlQuery = `
    SELECT j.DATE, j.DRIVER_NAME, j.START_TIME, v.VEHICLE_MAKE, v.VEHICLE_MODEL, j.VEHICLE_REG, j.END_TIME
    FROM journeys j
    LEFT JOIN vehicles v ON j.VEHICLE_REG = v.VEHICLE_REG
    WHERE DATE(j.DATE) BETWEEN ? AND ?;
  `;
  db.query(sqlQuery, [startDate, endDate], (err, results) => {
    if (err) {
      console.error('Error fetching journeys data:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.status(200).json(results);
  });
});



// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});