const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');
const proxy = require('express-http-proxy')

let app = express();
app.use(serveStatic(__dirname + "/dist"));

app.use('/api', proxy(process.env.VUE_APP_ROOT_API))

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Listening on port ' + port)
});
