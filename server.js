// =================================================================
// get the packages we need ========================================

var express 	  = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
const colors    = require('colors');
const path      = require('path');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var User   = require('./db/user.js'); // get our mongoose model
var Svnr = require('./db/svnr.js');
var Comment = require('./db/comment.js');

// var config = require('./config'); // get our config file
var config = process.env;

var passwordHash = require('password-hash');

// before deploying
// 1- change config

// =============================================================================
// CONFIGURATION ===============================================================

var port = process.env.PORT || 8000; // used to create, sign, and verify tokens

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));
	 // .use(express.static('styles'))                                          // Deprecated ?
	 // .use(express.static('scripts'))
   // .use(express.static('./ImgUsers'))

app.set('tokenSecret', config.secret); // secret variable

colors.setTheme({
   important : ['bgWhite', 'black'],
   success : ['green'],
   error : ['bgRed', 'white'],
   operations : ['bgCyan', 'black'],
   info : ["grey"],
   result : ['magenta']
 });


// Database Shit ---------------------------------------------------------------
mongoose.connect(config.database); // connect to database
mongoose.connection.on("error", function(err) {
  console.log('== Erreur connexion à la DB : %s'.error, err);
});
mongoose.connection.on('open', function() {
  console.log('== Connexion réussie à la DB'.success);
});

// =============================================================================
// TESTING =====================================================================


// Svnr.deleteOne({ _id: '5b0d9963f552960de7c1c06e' }, function (err) {
//   if (err) return console.error(err);
//   // deleted at most one tank document
// });


// =============================================================================
// FUNCTIONS ===================================================================


// =============================================================================
// API Shit ====================================================================

// TEST
app.get('/decode/:token', function(req, res) {
  console.log('decoding...');
  jwt.verify(req.params.token, app.get('tokenSecret'), function(err, decoded) {
    if (err) {
      return res.json({ success: false, message: 'Failed to authenticate token.' });
    } else {
      // if everything is good, save to request for use in other routes
      // req.decoded = decoded;
      console.log(decoded)
      res.json({ success: false, message: decoded });
    }
  });
});

app.get('/getAnecdotes/:id', (req,res) => {
  Comment.find({ svnrId : req.params.id }, (err, comments) => {
    if (err) {
      console.log("Error getting comment".error)
      return console.error(err);
    }
    if (comments) {
      console.log(comments);
      res.json(comments);
    }
  }).populate("createdBy").sort("-date")
})


// get an instance of the router for api routes SYNTHAX ------------------------
var apiRoutes = express.Router();

// =============================================================================
// AUTHENTICATION SHIT =========================================================

apiRoutes.post('/authenticate', (req, res) => {
  console.log(req.body);
	// find the user
	User.findOne({
		username: req.body.username
	}, function(err, user) {

		if (err) return console.error(err);

		if (!user) {
			res.json({ success: false, message: 'Authentication failed : no user with this name.' });
      return console.log('no user');
    } else if (user) {
			// check if password matches
			// if (!passwordHash.verify(req.body.password, user.password)) {
      if (req.body.password !== user.password) {
				res.json({ success: false, message: 'Authentication failed : wrong password.' });
        console.log("tried to login : FAIL - wrong password")
			} else {
        console.log("connection ok".success);
				// if user is found and password is right
				// create a token
        var token = jwt.sign({
          _id : user._id,
        }, app.get('tokenSecret'), {
					expiresIn: 86400*7 // expires in 24 hours
				});
				res.json({
					success: true,
					message: 'Successfully connected',
					token: token,
          // username : user.username,
          // photo_address : user.photo_address
				});
			}

		}

	});
});

// =============================================================================
// route middleware to authenticate and check token ============================

apiRoutes.use(function(req, res, next) {
  console.log("apiRoutes called".info);
 // https://auth0.com/blog/ten-things-you-should-know-about-tokens-and-cookies/#token-storage
	// check header or url parameters or post parameters for token
  // query has been added by me
	var token = req.body.token || req.params.token || req.query.token || req.headers['x-access-token'];

	// decode token
	if (token) {
    console.log('Token has been provided'.success)
		// verifies secret and checks exp
		jwt.verify(token, app.get('tokenSecret'), function(err, decoded) {
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });
			} else {
				// if everything is good, save to request for use in other routes
        req.decoded = decoded;
				next();
			}
		});

	} else {
    console.log("ERROR".error)
		// if there is no token
		// return an error
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});

	}

});

// =============================================================================
// AUTHENTICATED ROUTES (APRES APIROUTES.USE) ==================================

// Récupère les souvenirs pour le mur
apiRoutes.get('/recall_souvenir_wall', function(req,res) {
  Svnr.find({$or :
    [
      {"createdBy": req.decoded._id},
      {"sharedFriends": req.decoded._id}
    ]},
  function(err, svnrs) {
    if (err) return console.error(err);
    // console.log(svnrs);
    res.json({ success : true, souvenirList : svnrs});
  }).populate("createdBy").sort("-creation_date").limit(10);
});

// Récupère les infos du souvenir pour le focus
apiRoutes.get('/getSvnrInfo', (req, res) => {
  console.log("working".operations)
  Svnr.findOne({ '_id' : req.query.id }, (err, svnr) => {
    if (err) return console.error(err);
    if(svnr) {
      console.log(req.decoded._id);
      console.log(svnr.createdBy[0]._id);
      // console.log(svnr.sharedFriends);
      // console.log("1".error)
      // console.log(svnr.sharedFriends.filter(a => a._id == req.decoded._id).length)
      if (svnr.createdBy[0]._id == req.decoded._id ||
       svnr.sharedFriends.filter(a => a._id == req.decoded._id).length > 0) {
        return res.json({ success : true, svnr : svnr});
      } else {
        return res.json({ success : false, message : 'Not allowed to display this memory'});
      }
    } else {
      return res.json({ success : false, message : 'No matching memory'});
    }
  }).populate("createdBy sharedFriends")


  // send only if id is createdBy or shared !!
})

apiRoutes.post('/editOrCreateSvnr', (req, res) => {
  var s = req.body.svnrInfo;
  // EDIT SOUVENIR
  if (req.body.typeOfAction === "EDITER") {
    Svnr.findById(s.idSvnr, (err, svnr) => {
      if (err) return console.error('Error getting Svnr to edit ', err);
      svnr.titre = s.titre;
      svnr.description = s.description;
      svnr.lieu = s.lieu;
      // svnr.latLng = s.latLng;
      svnr.file_addresses = s.file_addresses;
      svnr.presentFriends = s.presentFriends;
    })
  } else if (req.body.typeOfAction === "CREER") {
    var n = new Svnr({
    	createdBy : req.decoded,
    	titre : s.titre,
    	lieu : s.lieu,
      // latLng : s.latLng,
    	svnr_date : s.svnr_date,
    	creation_date : new Date(),
    	description : s.description,
    	file_addresses : s.file_addresses,
      presentFriends : s.presentFriends
    });
    n.save((err, dat) => {
      if (err) {
        console.error('Err saving new Svnr ', err);
        return res.json({ success : false, message : err})
      }
      console.log("souvenir enregistré".green);
      console.log(dat);
      res.json({ success : true });
  })
  }
})

apiRoutes.post('/addNewComment', (req, res) => {
  var b = req.body;
  var c = new Comment({
    svnrId : b.svnrId,
    createdBy : req.decoded._id,
    content : b.content,
    creationDate : new Date()
  });
  c.save((err, result) => {
    if (err) {
      res.json({ success : false, message : err })
      return console.error("Error saving comment ", err);
    }
    res.json({success : true})
  })
})

apiRoutes.post('/manageSharedFriend', (req, res) => {
  console.log(req.body)
  if (req.body.action === 'ADD') {
    Svnr.update(
      { _id : req.body.svnrId},
      {$push : { sharedFriends : req.body.sharedFriend }}, (err, result) => {
        if (err) return console.error('Pb sharing ' + err);
        console.log(result)
        res.json({ success : true, message : result });
    })
  } else if (req.body.action === "REMOVE") {
    Svnr.update(
      { _id : req.body.svnrId},
      { $pullAll : { sharedFriends : [req.body.sharedFriend] }}, (err, result) => {
        if (err) return console.error('Pb sharing ' + err);
        console.log(result)
        res.json({ success : true, message : result });
    })
  }

})


apiRoutes.get('/getFriendsList', (req, res) => {
  User.findOne({ _id : req.decoded}, (err, user) => {
    if (err) return console.log('ERR getting friends ' + err);
    console.log('OMG working')
    for (var i in user.friends) {
      user.friends[i].password = 'ENCRYPTED';
    }
    res.json({ success : true, friendList : user.friends })
  }).populate(' friends ').select('-password')
})

// apiRoutes.get('/last_svnrs', function(req, res) {
//   console.log('Recovering Memories');
//   Svnr.find({"createdBy" : req.decoded._id}).limit(10).sort("-creation_date").exec(
//     function(err, svnrs) {
//       if (err) {
//         return console.error(err);
//       }
//       console.log(svnrs);
//       res.json(svnrs);
//     }
//   )
// });

// apiRoutes.get('/myUserHeaderInfos', function(req, res) {
//   console.log("/myUserHeaderInfos called");
//   User.findOne({"_id" : req.decoded._id}).select('photo_address')
//     .exec(function(err, user){
//     if (err) {
//       return console.error(err);
//     }
//     console.log("sending user infos " + user);
//     res.json(user);
//   })
// });

apiRoutes.get('/getProfilePicUrl', function(req, res) {
	User.findOne({ '_id' : req.decoded._id}, (err, user) => {
    if (err) return console.error(err);
    res.json(user.photo_address);
  })
});


// Part of the synthax ---------------------------------------------------------
app.use('/api', apiRoutes);

// =============================================================================
// start the server ============================================================

// Serve static files from React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Other requests that triggers the index display
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});


app.listen(port);
console.log('== Server running on port %s'.info, port);
