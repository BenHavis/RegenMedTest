<?php
$host_name = 'db5010528762.hosting-data.io';
$database = 'dbs8914405';
$user_name = 'dbu3010544';
$password = '<Regenmedglobal23';

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Requested-With, Accept');

// Create a connection to the database
$link = new mysqli($host_name, $user_name, $password, $database);

if ($link->connect_error) {
  die('<p>Failed to connect to MySQL: ' . $link->connect_error . '</p>');
}

// Handle GET request to retrieve data
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  // Perform a database query to fetch data
  $query = "SELECT * FROM maindata";
  $result = $link->query($query);

  if ($result) {
    // Convert the result into an array of associative arrays
    $data = [];
    while ($row = $result->fetch_assoc()) {
      $data[] = $row;
    }

    // Return the data as a JSON response
    header('Content-Type: application/json');
    echo json_encode($data);
  } else {
    // Return an error response
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['error' => 'Failed to retrieve data from the database.']);
  }
}

// Close the database connection
$link->close();
?>
