const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

// Do work here

/*req is the data we are receiveing

res is the data we are sending back

*/

router.get('/',storeController.homePage);
router.get('/add',storeController.addStore);
router.post('/add', storeController.createStore);

module.exports = router;
