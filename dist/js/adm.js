/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/adm/admin.js":
/*!**************************!*\
  !*** ./src/adm/admin.js ***!
  \**************************/
/***/ (() => {

eval("/*\r\n// Server side code.\r\nconst admin = require('firebase-admin');\r\nconst serviceAccount = require('path/to/serviceAccountKey.json');\r\n\r\n// The Firebase Admin SDK is used here to verify the ID token.\r\nadmin.initializeApp({\r\n  credential: admin.credential.cert(serviceAccount)\r\n});\r\n\r\nfunction getIdToken(req) {\r\n  const authorizationHeader = req.headers.authorization || '';\r\n  const components = authorizationHeader.split(' ');\r\n  return components.length > 1 ? components[1] : '';\r\n}\r\n\r\nfunction checkIfSignedIn(url) {\r\n  return (req, res, next) => {\r\n    if (req.url == url) {\r\n      const idToken = getIdToken(req);\r\n\r\n      admin.auth().verifyIdToken(idToken).then((decodedClaims) => {\r\n\r\n        res.redirect('/profile');\r\n      }).catch((error) => {\r\n        next();\r\n      });\r\n    } else {\r\n      next();\r\n    }\r\n  };\r\n}\r\n\r\napp.use(checkIfSignedIn('/'));\r\n*/\n\n//# sourceURL=webpack://webpack-demo/./src/adm/admin.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/adm/admin.js"]();
/******/ 	
/******/ })()
;