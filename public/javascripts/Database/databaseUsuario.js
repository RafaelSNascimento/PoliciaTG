var mysql = require ('mysql');
var express = require('express');

var table = 'unidade';
var fs = require('fs');
exports.cadastrarU = function(req, res){
	req.getConnection(function(err, connection){
		connection.query('select * from usuarios where usuario=? or senha=?',[req.body.usuario, req.body.senha], function(error, result){
			var response={}
			if(error){
              response.result = 'error';
              response.message = error;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(response));
            }else{
            	if(result[0]==null){
					connection.query('insert into usuarios set nome= ?, usuario= ?, senha= ?, idUnidade= ?, role = ?',[req.body.nome, req.body.usuario, req.body.senha, req.body.idUnidade, req.body.role],function(err, result1){
						if(err){
							response.result = 'error';
							response.message = error;
							res.setHeader('Content-Type', 'application/json');
							res.end(JSON.stringify(response));
						}else{
							if(req.body.img){
								fs.writeFile(__dirname +"/Usuario/"+result1.insertId+".jpeg",req.body.img.replace(/^data:image\/(png|jpg|jpeg);base64,/, '', ""), 'base64', function(err) {
									response.result = 'success';
									console.log("entrou")
									response.id = result1.insertId;
									res.setHeader('Content-Type', 'application/json');
									res.end(JSON.stringify(response));
								});
							}else{
								response.result = 'success';
								response.id = result1.insertId;
								res.setHeader('Content-Type', 'application/json');
								res.end(JSON.stringify(response));
							}
						}
					});
				}else{
					response.result='error';
					response.message='Ja Exite um Usuario com Esse Usuario ou Senha!';
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(response));
				}
            }
		});
	});
}

exports.deletesingleuser = function(req,res){
	req.getConnection(function(err, connection){
		var response = {}
		console.log(req.body)
		connection.query('select id from usuarios where usuario =? and senha = ? ',[req.body.usuario,req.body.senha], function(error, result1){
			console.log(result1);
			if(result1){
				console.log("/Usuario/"+result1[0].id+".jpeg")
				if(fs.existsSync(__dirname +"/Usuario/"+result1[0].id+".jpeg")){
					console.log("/Usuario/"+result1[0].id+".jpeg")
					fs.unlink(__dirname +"/Usuario/"+result1[0].id+".jpeg")
				}
				
				connection.query('delete from usuarios where usuario ="'+req.body.usuario+'" and senha = "'+req.body.senha+'"', function(error, result){
					if(error){
						response.result="error";
						response.message = error;
						res.setHeader('Content-Type', 'application/json');
						res.end(JSON.stringify(response));
					}else{
						response.result="success";
						res.setHeader('Content-Type', 'application/json');
						res.end(JSON.stringify(response));
					}
				});
			}else{
				response.result="success";
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(response));
			}
		
		})

	})
}
exports.alterarU = function(req,res){
	var response={}
	req.getConnection(function(err, connection){
		connection.query("select * from usuarios where usuario = ? or senha = ?",[req.body.usuario, req.body.senha], function(error, result){
			
			if(error){
				response.result="error";
				response.message=error;
				console.log(error);
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(response));
			}else{
				if(!result[0] || (result.length == 1 && result[0].id == req.body.id)){
					if(fs.existsSync(__dirname +"/Usuario/"+req.body.id+".jpeg")){
						if(!req.body.img.includes(req.body.id+".jpeg")){
							fs.unlink(__dirname +"/Usuario/"+req.body.id+".jpeg", function(err){
								var base64 = req.body.img.replace(/^data:image\/(png|jpg|jpeg);base64,/, '', "")
			            		fs.writeFile(__dirname +"/Usuario/"+req.body.id+".jpeg",base64, 'base64', function(err) {
									console.log(err);
									connection.query('update usuarios set nome = ?, usuario=?, senha=?, idUnidade=? where id="'+req.body.id+'"',[req.body.nome, req.body.usuario, req.body.senha, req.body.idUnidade])
									response.result="success";
									response.img = "/javascripts/Database/Usuario/"+req.body.id+".jpeg";
									req.session.usuario.usuario = req.body.usuario;
									req.session.usuario.senha = req.body.senha;
									res.setHeader('Content-Type', 'application/json');
									res.end(JSON.stringify(response));
								})
							})
						}else{
							connection.query('update usuarios set nome = ?, usuario=?, senha=?, idUnidade=? where id="'+req.body.id+'"',[req.body.nome, req.body.usuario, req.body.senha, req.body.idUnidade])
							response.result="success";
							req.session.usuario.usuario = req.body.usuario;
							req.session.usuario.senha = req.body.senha;
							res.setHeader('Content-Type', 'application/json');
							res.end(JSON.stringify(response));
						}
						

					}else{
						if(!req.body.img.includes("noPerson.jpg")){
							var base64 = req.body.img.replace(/^data:image\/(png|jpg|jpeg);base64,/, "")
		            		fs.writeFile(__dirname +"/Usuario/"+result[0].id+".jpeg",base64, 'base64', function(err) {
								console.log(err);
								connection.query('update usuarios set nome = ?, usuario=?, senha=?, idUnidade=? where id="'+req.body.id+'"',[req.body.nome, req.body.usuario, req.body.senha, req.body.idUnidade])
								response.result="success";
								req.session.usuario.usuario = req.body.usuario;
								req.session.usuario.senha = req.body.senha;
								res.setHeader('Content-Type', 'application/json');
								res.end(JSON.stringify(response));
							})
	            		}else{
            				connection.query('update usuarios set nome = ?, usuario=?, senha=?, idUnidade=? where id="'+req.body.id+'"',[req.body.nome, req.body.usuario, req.body.senha, req.body.idUnidade])
							response.result="success";
							req.session.usuario.usuario = req.body.usuario;
							req.session.usuario.senha = req.body.senha;
							res.setHeader('Content-Type', 'application/json');
							res.end(JSON.stringify(response));
	            		}
					}
					
				}else{
					response.result="error";
					response.message = "Já existe um usuario com esse Login ou Senha";
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(response))
				}
			}
		});
	});
}
exports.dadosBatalhao = function(req, res){
	req.getConnection(function(err, connection){
		var response={}
		connection.query('select * from usuarios where usuario=? and senha=?',[req.session.usuario.usuario, req.session.usuario.senha], function(error, result){
			connection.query('select id, nome from unidade',function(error, result1){
				connection.query("select e.id, e.nome, e.data, COUNT(c.idAutoridade) as total from evento e, convidados c where c.idEvento = e.id AND e.idUnidade = "+result[0].idUnidade+" GROUP BY c.idEvento", function(error, result2){
					if(error){
			            response.result = 'error';
			            response.message = error;
			            res.setHeader('Content-Type', 'application/json');
			            res.end(JSON.stringify(response));
		        	}else{
						if(fs.existsSync(__dirname +"/Usuario/"+result[0].id+".jpeg")){
							result[0].img ="/javascripts/Database/Usuario/"+result[0].id+".jpeg";
							response.usuario = result;
							response.result = 'success';
							response.batalhao = result1;
							response.eventos = result2;
							res.setHeader('Content-Type', 'application/json');
							res.end(JSON.stringify(response));
						}else{
							try{
								result[0].img = "/images/noPerson.jpg";
								response.usuario = result;
								response.result = 'success';
								response.batalhao = result1;
								response.eventos = result2;
								res.setHeader('Content-Type', 'application/json');
								res.end(JSON.stringify(response));
							}catch(err){

							}
						}
					}
				})

			});
		});
	});
}
exports.dadosBatalhaoAdmin = function(req, res){
	req.getConnection(function(err, connection){
		var response={}
		connection.query('select * from usuarios', function(error, result){
			connection.query('select id, nome from unidade',function(error, result1){
				response.usuario = result;
				if(error){
		            response.result = 'error';
		            response.message = error;
		            res.setHeader('Content-Type', 'application/json');
		            res.end(JSON.stringify(response));
	        	}else{
					response.result = 'success',
					response.batalhao = result1,
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(response));
	        	}
			});
		});
	});
}
exports.allUsers = function(req, res){
	req.getConnection(function(err, connection){
		connection.query("select u.*, un.nome as unidadeNome from usuarios u left join unidade un on u.idUnidade = un.id", function(error, result){
			connection.query("select * from unidade", function(error, result1){
				var response = {};
				if(error){
					response.result = 'error';
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(response));	
				}
				else{
					for(var i = 0; i<result.length;i++){
						if(fs.existsSync(__dirname +"/Usuario/"+result[i].id+".jpeg")){
							//var img = fs.readFileSync(__dirname + '/Usuario/'+result[i].id+".jpeg").toString("base64");
							result[i].img = '/javascripts/Database/Usuario/'+result[i].id+".jpeg";
						}
						if(i+1 == result.length){
							response.result = 'success';
							response.usuarios = result;
							response.batalhao = result1;
							res.setHeader('Content-Type', 'application/json');
							res.end(JSON.stringify(response));
						}
					}
					
				}
			})
		})

	})
}