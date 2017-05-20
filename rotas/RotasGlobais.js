module.exports  = function(app) {

	var dbUsuario = require('../public/javascripts/Database/databaseUsuario'),
	autenticar = require('../public/javascripts/Middlewares/autenticar');

	app.route('/dadosBatalhao').get(autenticar, dbUsuario.dadosBatalhao)
}