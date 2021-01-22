const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('server/public'));

const listRouter = require('./routes/list.js');
app.use('/list', listRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`listening on port`, PORT);
});