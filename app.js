const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const searchRoutes = require('./routes/searchRoutes');

app.listen(port, () => {
    console.log('Server Listening on Port ' + port);
})

app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));

// Route 1
app.use('/search', searchRoutes);