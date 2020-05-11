const express = require('express');

const app = express();

const PORT = 4242;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));