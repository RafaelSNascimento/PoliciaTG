module.exports = function(app){
	var db = require('../public/javascripts/Database/databaseBatalhao'),
	 autenticar = require('../public/javascripts/Middlewares/autenticar');


	app.route('/crudBatalhao').get(autenticar, db.PreencheBatalhao);
	app.route('/crudBatalhaoAdmin').get(autenticar,db.PreencheBatalhaoA);
	app.route('/cadastrarB').post(autenticar, db.cadastrarB);
	app.route('/alterarB').post(autenticar, db.alterarB);
	app.route('/excluirB').post(autenticar, db.excluirB);
	app.route('/relacionarCB').post(autenticar, db.relacionarCB);
	app.route('/excluirRelacao').post(autenticar, db.excluirRelacao);
}