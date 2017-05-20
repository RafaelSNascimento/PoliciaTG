module.exports = function(app){
	var autenticar = require('../public/javascripts/Middlewares/autenticar');
	var dbUsuario = require('../public/javascripts/Database/databaseUsuario');
	var dbAutoridades = require('../public/javascripts/Database/databaseAutoridades');
	var dbHome = require('../public/javascripts/Database/databaseHome');
	var dbEventos = require('../public/javascripts/Database/databaseEventos');

	app.get('/autoridades', dbAutoridades.autoridades);
	app.get('/eventosC', dbEventos.eventosC);
	app.get('/batalhaoApp', dbEventos.batalhao);
	app.get('/convidadosApp', dbAutoridades.convidadosApp);
}