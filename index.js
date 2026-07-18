const express = require('express');
const path = require('path');
const app = express();

// Serve static files (like index.html)
app.use(express.static(__dirname));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

