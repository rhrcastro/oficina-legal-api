module.exports = function(router) {
    const Veiculo =  require('../controller/veiculo.controller.js');
    const verifyJWT = require("../config/user.auth.js");


    router.post('/create', verifyJWT, Veiculo.create);

    return router;
}