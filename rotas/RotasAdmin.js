module.exports = function(app){
	var autenticarAdmin = require('../public/javascripts/Middlewares/autenticarAdmin');
	var dbUsuario = require('../public/javascripts/Database/databaseUsuario');
	var autenticar = require('../public/javascripts/Middlewares/autenticar');
	
	app.route('/homeAdmin').post(autenticarAdmin ,function(req,res){
	  res.render('homeAdmin');
	})
	app.route('/homeAdmin').get(autenticarAdmin ,function(req,res){
	  res.render('homeAdmin');
	})
	app.route('/cadastrarU').post(autenticarAdmin, dbUsuario.cadastrarU)
	app.route('/crudUsuarioAdmin').get(autenticarAdmin, function(req,res){
	  res.render('crudUsuarioAdmin');
	});
	app.route('/dadosBatalhaoAdmin').get( autenticarAdmin, dbUsuario.dadosBatalhaoAdmin)
	app.route('/crudusuario').get(autenticarAdmin, function(req,res){
  		res.render('crudUsuario');
	});
	app.route('/deletesingleuser').post(autenticar, dbUsuario.deletesingleuser);

	app.route('/allUsers').get(autenticarAdmin, dbUsuario.allUsers);
}