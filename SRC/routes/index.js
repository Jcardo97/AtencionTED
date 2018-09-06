const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.render('index.html');
});

// se exporta el objeto con todas las direcciones
module.exports = router;