const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'db5010528762.hosting-data.io',
  user: 'dbu3010544',
  password: 'Regenmedglobal23',
  database: 'dbs8914405',
});


connection.connect((error) => {''
  if (error) {
    console.error('Error connecting to the database:', error);
    return;
  }
  console.log('Connected to the database!');
});
