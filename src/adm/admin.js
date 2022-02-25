/*
// Server side code.
const admin = require('firebase-admin');
const serviceAccount = require('path/to/serviceAccountKey.json');

// The Firebase Admin SDK is used here to verify the ID token.
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

function getIdToken(req) {
  const authorizationHeader = req.headers.authorization || '';
  const components = authorizationHeader.split(' ');
  return components.length > 1 ? components[1] : '';
}

function checkIfSignedIn(url) {
  return (req, res, next) => {
    if (req.url == url) {
      const idToken = getIdToken(req);

      admin.auth().verifyIdToken(idToken).then((decodedClaims) => {

        res.redirect('/profile');
      }).catch((error) => {
        next();
      });
    } else {
      next();
    }
  };
}

app.use(checkIfSignedIn('/'));
*/