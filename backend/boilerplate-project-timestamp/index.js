var express = require('express');
var app = express();
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.static('public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/api/hello", function (req, res) {
  res.json({ greeting: 'hello API' });
});

// New API endpoint for date conversion
app.get("/api/:date?", function (req, res) {
  const dateParam = req.params.date;

  // If dateParam is not provided, return current time
  if (!dateParam) {
    const currentTime = new Date();
    return res.json({ unix: currentTime.getTime(), utc: currentTime.toUTCString() });
  }

  let inputDate;

  // Check if the dateParam is a valid Unix timestamp
  if (!isNaN(dateParam) && isFinite(dateParam)) {
    inputDate = new Date(parseInt(dateParam));
  } else {
    // Otherwise, treat it as a date string
    inputDate = new Date(dateParam);
  }

  // Check if the input date is valid
  if (!isNaN(inputDate.getTime())) {
    return res.json({ unix: inputDate.getTime(), utc: inputDate.toUTCString() });
  }

  // Invalid date
  return res.json({ error: "Invalid Date" });
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
