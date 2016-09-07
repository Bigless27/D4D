var bodyParser = require('body-parser');
var override = require('method-override');
var cors = require('cors');

module.exports = function(app) {
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());
	app.use(override());
	app.use(cors());
}