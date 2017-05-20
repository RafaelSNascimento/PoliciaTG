module.exports = function(app){
	var autenticar = require('../public/javascripts/Middlewares/autenticar');
	var dbUsuario = require('../public/javascripts/Database/databaseUsuario');
	var dbAutoridades = require('../public/javascripts/Database/databaseAutoridades');
	var dbHome = require('../public/javascripts/Database/databaseHome');
	var dbEventos = require('../public/javascripts/Database/databaseEventos');


	app.route('/alterarU').post(autenticar, dbUsuario.alterarU)
	app.route('/home').post(autenticar, dbHome.dadosIniciais);
	app.route('/home').get(autenticar, dbHome.dadosIniciais);
	app.route('/crudAutoridade').get(autenticar,dbAutoridades.dadosIniciais)
	app.post('/inserirA', dbAutoridades.inserirA)
	app.route('/excluirAutoridade').post(autenticar, dbAutoridades.excluirA)
	app.route('/alterarA').post(autenticar, dbAutoridades.alterarA)
	app.route('/crudEventos').get(autenticar, dbEventos.dadosIniciais)
	app.post('/cadastrarE', dbEventos.cadastrarE);
	app.route('/excluirE').post(autenticar, dbEventos.excluirE);
	app.post('/alterarE', dbEventos.alterarE)
	app.post('/convidarA', dbEventos.convidarA)
	app.post('/pdfConvitesQR',dbEventos.pdfConvitesQR)
	app.post('/pdfConvites',dbEventos.pdfConvites)
	app.post('/pdfLista',dbEventos.pdfLista)

}