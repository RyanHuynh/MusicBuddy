var express = require('express');
var bodyParser = require('body-parser');
var mailman = require('nodemailer');
var app = express();

var router = express.Router();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

var smtpTransport = mailman.createTransport("SMTP", {
	service: "Gmail",
	auth: {
		user: "",
		pass: ""
	}
});

app.use('/api', router);

router.route('/feedback/:appType')
	.post(function(req, res){
		var data = req.body;
		var textSent = "Name: " + data.Name + "\nEmail: " + data.Email + "\nMessage: " + data.Message;

		//Send mail
		smtpTransport.sendMail({
			transport: smtpTransport,
			from: "The Mailman <dragonvzmisc@gmail.com>", // sender address.  Must be the same as authenticated user if using GMail.
			to: "Ryan Huynh <chienhhuynh@gmail.com>", // receiver
			subject: req.params.appType + 'Feedback', // subject
			text: textSent // body
		}, function(error, response){
			if(error)
				console.log(error);
			else{
				console.log("Feedback is sent: " + response.message);
				res.json({ message: "Email is sent."});
			}
			smtpTransport.close();
		});
	});
app.listen(3000);
console.log('app is listening on port 3000');
