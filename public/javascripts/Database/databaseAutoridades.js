var mysql = require ('mysql');
var express = require('express');
var async = require('async');
var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
date = date.split(" ")
date = date[0].replace(/-/gi,"/").split("/")
date = date[2] +"/"+date[1]+"/"+date[0];
exports.autoridades = function(req,res){
	req.getConnection(function(err, connection){
		connection.query('select * from autoridades',function(error, result){
			res.setHeader('Content-Type','application/json')
			res.end(JSON.stringify(result))
		})
	})
}
exports.convidadosApp = function(req, res){
	req.getConnection(function(err, connection){
		connection.query('select * from convidados', function(error, result){
			res.setHeader('Content-Type','application/json')
			res.end(JSON.stringify(result))
		});
	});
}
exports.dadosIniciais = function(req,res){
	req.getConnection(function(err, connection){
		response = {}
		connection.query('select id, tratamento from pronomes order by tratamento', function(error1, result1){
			connection.query('select * from autoridades order by nome', function(error2, result2){
				connection.query('select id, nome from unidade',function(error3, result3){
					connection.query('select * from email', function(error4, result4){
						connection.query('select * from autoridades_email', function(error5, result5){
							connection.query('select * from telefones', function(error6,result6){
								connection.query('select * from autoridades_telefone', function(error7, result7){
									response.pronomes = result1
									response.autoridades = result2
									response.unidade = result3
									response.email = result4
									response.autoridades_email = result5
									response.telefone = result6
									response.autoridades_telefone = result7
									res.render('crudAutoridade',{
										data: JSON.stringify(response),
									})
								})
							})
						})
					})
				})
			})
		})
	});
}
exports.excluirA = function(req, res){
	req.getConnection(function(err, connection){
		var data = {}
		connection.query("delete from autoridades where id = "+req.body.id, function(error, result){
			connection.query("delete from convidados where idAutoridade = "+req.body.id,function(errors,result){
				connection.query("delete from email where id not in (select idEmail from autoridades_email)", function(err, result){
					connection.query("delete from telefones where id not in (select idTelefone from autoridades_telefone)", function(err, result){
						if(error){
							console.log(error)
							data.message = error;
							res.setHeader('Content-Type','application/json')
							res.end(JSON.stringify(data))
						}else{
							data.result = "ok"
							res.setHeader('Content-Type','application/json')
							res.end(JSON.stringify(data))
						}
					})
				})
			})
			
		})
	})
}
exports.alterarA = function(req, res){
	req.getConnection(function(err, connection){
		connection.query("update autoridades set empresa = ?, ultima_atualizacao = ?, nome= ?, apelido = ?, partido = ?, genero = ?, cep = ?, uf = ?, cidade = ?, bairro = ?, logradouro = ?, numero = ?,  funcao = ?, nascimento = ?, tratamento = ?, titulo = ?, idUnidade = ? where id = "+req.body.id,
		[req.body.empresa, date, req.body.nome, req.body.apelido, req.body.partido, req.body.genero, req.body.cep, req.body.uf, req.body.cidade, req.body.bairro, req.body.logradouro, req.body.numero, req.body.funcao, req.body.nascimento, req.body.tratamento, req.body.titulo, req.body.unidade],
		function(error, result){
			var telefone = 0;
			var email = 0;
			var arrayemail=[],
				arraytelefone=[];
			async.parallel([
				function(callback){
					function recursiveTelefone(){
							connection.query("select * from telefones where telefone = '"+req.body.telefones[telefone].numero+"'",function(error, result){
								if(result[0] == null){
									console.log(req.body.telefones[telefone].numero)
									connection.query("insert into telefones set telefone = ?, tipo = ?",[req.body.telefones[telefone].numero, req.body.telefones[telefone].tipo], function(error1, result1){
										idTelefone = result1.insertId;
										arraytelefone.push(idTelefone)
										connection.query("insert into autoridades_telefone set idAutoridade = ?, idTelefone = ?",[req.body.id, idTelefone], function(){
											telefone +=1;
											if(telefone != req.body.telefones.length){
												recursiveTelefone();
											}else{
												connection.query("delete from autoridades_telefone where idAutoridade = "+req.body.id+" and idTelefone not in ("+arraytelefone+")",function(e,r){
													connection.query("delete from telefones where id not in (select idTelefone from autoridades_telefone)", function(e,r){
														callback();
													})
												})
											}
										})
									});
								}else{
									arraytelefone.push(result[0].id)
									connection.query("select * from autoridades_telefone where idAutoridade = ? and idTelefone = ?",[req.body.id, result[0].id],function(error1, result1){
										if(result1[0]== null){
											connection.query("insert into autoridades_telefone set idAutoridade = ?, idTelefone = ?",[req.body.id, result[0].id],function(){
												telefone +=1
												if(telefone != req.body.telefones.length){
													recursiveTelefone();
												}else{
													connection.query("delete from autoridades_telefone where idAutoridade = "+req.body.id+" and idTelefone not in ("+arraytelefone+")", function(e,r){
														connection.query("delete from telefones where id not in (select idTelefone from autoridades_telefone)", function(e,r){
															callback();
														})
													});
												}
											})
										}else{
											telefone +=1
											if(telefone != req.body.telefones.length){
													recursiveTelefone();
											}else{
												connection.query("delete from autoridades_telefone where idAutoridade = "+req.body.id+" and idTelefone not in ("+arraytelefone+")", function(e,r){
													connection.query("delete from telefones where id not in (select idTelefone from autoridades_telefone)", function(e,r){
														callback();
													})
												});
											}
										}
									})
			
								}
							});
						}
						recursiveTelefone();
					},
					function(callback){
						function recursiveEmail(){
							var idEmail;
							connection.query("select * from email where email = ?",[req.body.email[email].email], function(error, result){
								if(result[0]==null){
									connection.query("insert into email set email = ?",[req.body.email[email].email], function(error1, email){
										idEmail = email.insertId;
										arrayemail.push(idEmail);
										connection.query("insert into autoridades_email set idAutoridade = ?, idEmail = ?",[req.body.id, idEmail],function(err, r){
											email+=1
											if(email != req.body.email.length){
												recursiveEmail();
											}else{
												connection.query("delete from autoridades_email where idAutoridade = "+req.body.id+" and idAutoridade not in ("+arrayemail+")", function(e,r){
													connection.query("delete from email where id not in (select idEmail from autoridades_email)", function(e,r){
														callback();
													})
												});
											}
										})
									})
								}else{
									arrayemail.push(result[0].id);
									connection.query("select * from autoridades_email where idAutoridade = ? and idEmail = ?",[req.body.id, result[0].id], function(error1, result1){
										console.log("resultado:", result1)
										if(result1[0]==null){
											connection.query("insert into autoridades_email set idAutoridade = ?, idEmail = ?",[req.body.id, result[0].id], function(error2, result2){
												email+=1
												if(email != req.body.email.length){
													recursiveEmail();
												}else{
													connection.query("delete from autoridades_email where idAutoridade = "+req.body.id+" and idEmail not in ("+arrayemail+")", function(e,r){
														connection.query("delete from email where id not in (select idEmail from autoridades_email)", function(e,r){
															callback();
														})
													});
												}
											})
										}else{
											email+=1
											if(email != req.body.email.length){
												recursiveEmail();
											}else{
												connection.query("delete from autoridades_email where idAutoridade = "+req.body.id+" and idEmail not in ("+arrayemail+")", function(e,r){
													connection.query("delete from email where id not in (select idEmail from autoridades_email)", function(e,r){
														callback();
													})
												});
											}
										}
									})
								}
							})
					
						}
					recursiveEmail();
				}
			],function(err) { 
				connection.query('select * from email', function(error4, result4){
					connection.query('select * from autoridades_email', function(error5, result5){
						connection.query('select * from telefones', function(error6,result6){
							connection.query('select * from autoridades_telefone', function(error7, result7){
								if(error4 != ""){
									var data = {}
									data.id = req.body.id;
									data.email = result4
									data.autoridades_email = result5
									data.telefone = result6
									data.autoridades_telefone = result7
									data.ultima_atualizacao = date;
									data.message = "success";
									res.setHeader('Content-Type', 'application/json')
									res.end(JSON.stringify(data))
								}else{
									data.message = erro;
									res.setHeader('Content-Type', 'application/json')
									res.end(JSON.stringify(data))
								}
							})
						})
					})
				})
			})
		})
	})
	
}
exports.inserirA = function(req, res){
	req.getConnection(function(err, connection){
		var data = {}
		var idUsuario;
		var idEmail;
		var erro;
		var email = 0;
		async.parallel([
			function(callback){
				console.log(date)
				connection.query("insert into autoridades set  empresa = ?,ultima_atualizacao = ?, nome= ?, apelido = ?, partido = ?, genero = ?, cep = ?, uf = ?, cidade = ?, bairro = ?, logradouro = ?, numero = ?,  funcao = ?, nascimento = ?, tratamento = ?, titulo = ?, idUnidade = ?",
				[ req.body.empresa, date, req.body.nome, req.body.apelido, req.body.partido, req.body.genero, req.body.cep, req.body.uf, req.body.cidade, req.body.bairro, req.body.logradouro, req.body.numero, req.body.funcao, req.body.nascimento, req.body.tratamento, req.body.titulo, req.body.unidade],
				function(error, result){
					if(error){
						console.log(error)
					}
					idUsuario = result.insertId;
					callback();
				})
			},function(callback){
				var idTelefone, telefone = 0;
				function recursiveTelefone(){
					connection.beginTransaction(function(err) {
						connection.query("select * from telefones where telefone = '"+req.body.telefones[telefone].numero+"'",function(error, result){
							if(result[0] == null){
								connection.query("insert into telefones set telefone = ?, tipo = ?",[req.body.telefones[telefone].numero, req.body.telefones[telefone].tipo], function(error1, result1){
									idTelefone = result1.insertId;
									connection.query("insert into autoridades_telefone set idAutoridade = ?, idTelefone = ?",[idUsuario, idTelefone])
								});
							}else{
								connection.query("select * from autoridades_telefone where idAutoridade = ? and idTelefone = ?",[idUsuario, result[0].id], function(error1, result1){
									if(result1[0] == null){
										connection.query("insert into autoridades_telefone set idAutoridade = ?, idTelefone = ?",[idUsuario, result[0].id])
									}
								})
							}
						});
						connection.commit(function(err) {
							if (err) { 
								connection.rollback(function() {
									throw err;
								});
					        }else{
								telefone +=1;
								if(telefone == req.body.telefones.length){
									callback();
								}else{
									recursiveTelefone();
								}
					        }
					    })
					})
				}
				recursiveTelefone();
			},
			function (callback){
				function recursiveEmail(){
					connection.beginTransaction(function(err) {
						connection.query("select * from email where email = '"+req.body.email[email].email+"'", 
						function(error, result){
							if(result[0]==null){
								connection.query("insert into email set email= ?",[req.body.email[email].email], function(error1, result1){
									idEmail = result1.insertId;
									connection.query("insert into autoridades_email set idAutoridade = ?, idEmail= ?",[idUsuario, idEmail]);
								});
							}else{
								connection.query("select * from autoridades_email where idAutoridade = ? and idEmail=?",[idUsuario, result[0].id], function(error1, result1){
									if(result1[0]==null){
										connection.query("insert into autoridades_email set idAutoridade = ?, idEmail=?",[idUsuario, result[0].id])	
									}
								})

							}			
						});
						connection.commit(function(err) {
							if (err) { 
								connection.rollback(function() {
									throw err;
								});
					        }else{
					        	console.log(email)
					        	email+=1;
					        	if(email == req.body.email.length){
									callback();
								}else{
									recursiveEmail();
								}
					        }
					    })
					})
				}
				recursiveEmail()
			}
		],function(err) { //This is the final callback
			connection.query('select * from email', function(error4, result4){
				connection.query('select * from autoridades_email', function(error5, result5){
					connection.query('select * from telefones', function(error6,result6){
						connection.query('select * from autoridades_telefone', function(error7, result7){
							if(erro != ""){
								data.id = idUsuario;
								data.email = result4
								data.autoridades_email = result5
								data.telefone = result6
								data.autoridades_telefone = result7
								data.ultima_atualizacao = date;
								data.message = "success";
								res.setHeader('Content-Type', 'application/json')
								res.end(JSON.stringify(data))
							}else{
								data.message = erro;
								res.setHeader('Content-Type', 'application/json')
								res.end(JSON.stringify(data))
							}
						})
					})
				})
			})
		})
	});
}