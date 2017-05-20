var mysql = require ('mysql');
var express = require('express');
var async = require('async');
var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
var qrcode=require('qrcode-js');
var pdf = require('html-pdf');
var fs = require('fs')
date = date.split(" ")
date = date[0].replace(/-/gi,"/").split("/")
date = date[2] +"/"+date[1]+"/"+date[0];

exports.eventosC= function(req, res){
	req.getConnection(function(err, connection){
		connection.query("select * from evento order by data", function(error, result){
			
			var response = {}
			response.evento = result;
			res.setHeader('Content-Type','application/json')
			res.end(JSON.stringify(response));

		})
	});
}
exports.batalhao = function(req, res){
	req.getConnection(function(err, connection){
		connection.query("select id, nome from unidade order by nome", function(error, result){
			
			var response = {}
			response.unidade = result;
			res.setHeader('Content-Type','application/json')
			res.end(JSON.stringify(response));

		})
	});
}
exports.cadastrarE = function(req, res){
	var response = {}
	req.getConnection(function(err, connection){
		connection.query("select idUnidade from usuarios where usuario = ?",[req.session.usuario.usuario], function(error, result){
			if(result[0].idUnidade!=null){
				connection.query("insert into evento set idUnidade=?, nome = ?, data = ?, hora = ?, cep = ?, uf = ?, cidade = ?,"+
				 "logradouro = ?, bairro = ?, numero = ?, traje_pm = ?, traje_civilvet=?, traje_ffaa = ?",
				[result[0].idUnidade, req.body.nome, req.body.data, req.body.hora, req.body.cep, req.body.uf, req.body.cidade,
				req.body.logradouro, req.body.bairro, req.body.numero, req.body.traje_pm, req.body.traje_civilvet, req.body.traje_ffaa],
				function(error1, result1){
					response.message = "success";
					response.id = result1.insertId;
					response.idUnidade = result[0].idUnidade;
					res.setHeader('Content-Type','application/json')
					res.end(JSON.stringify(response))
				})
			}else{
				response.message = "Primeiro Selecione uma unidade para seu usuário!";
				res.setHeader('Content-Type','application/json')
				res.end(JSON.stringify(response))
			}
			
		})
		
	})
}
exports.convidarA = function(req, res){
	req.getConnection(function(err, connection){
		var cont = 0;
		var response = {}
		function cadastraConvidado (){
			connection.query("select * from convidados where idAutoridade = ? and idEvento = ?",[req.body.convidados[cont].id, req.body.evento], function(error, result){
				if(result[0]==null){
					connection.query("insert into convidados set idAutoridade = ?, idEvento = ?",[req.body.convidados[cont].id, req.body.evento], function(error1, result1){
						cont  +=1
						if(cont==req.body.convidados.length){
							connection.query("select idUnidade from usuarios where usuario = ?",[req.session.usuario.usuario], function(error, result3){
								connection.query("select * from convidados where idEvento in(select id from evento where idUnidade = ?)",[result3[0].idUnidade], function(error2, result2){
									response.message = "success"
									response.convidados = result2
									res.setHeader('Content-Type','application/json');
									res.end(JSON.stringify(response))
								})
							})
						}else{
							cadastraConvidado ()
						}
					})
				}else{
					cont  +=1
					if(cont==req.body.convidados.length){
						connection.query("select * from convidados", function(error2, result2){
							response.message = "success"
							response.convidados = result2
							res.setHeader('Content-Type','application/json');
							res.end(JSON.stringify(response))
						})
					}else{
						cadastraConvidado ()
					}
				}
			})
		}
		cadastraConvidado ()
	});
}
exports.alterarE = function(req, res){
	req.getConnection(function(err, connection){
		connection.query("update evento set nome = ?, data = ?, hora = ?, cep = ?, uf = ?, cidade = ?, logradouro = ?, bairro = ?, numero = ?, traje_pm = ?, traje_civilvet=?, traje_ffaa = ? where id ="+req.body.id,
		[req.body.nome, req.body.data, req.body.hora, req.body.cep, req.body.uf, req.body.cidade, req.body.logradouro, req.body.bairro, req.body.numero, req.body.traje_pm, req.body.traje_civilvet, req.body.traje_ffaa],
		function(error, result){

			var response= {}
			response.message = "success"
			res.setHeader('Content-Type','application/json')
			res.end(JSON.stringify(response))
			
		})
	})
}
exports.excluirE = function(req, res){
	req.getConnection(function(err, connection){
		connection.query("delete from evento where id = ?",[req.body.id], function(error, result){
			response = {}
			response.message = "success";
			res.setHeader('Content-Type','application/json')
			res.end(JSON.stringify(response))
		})
	})
}
exports.dadosIniciais = function(req, res){
	req.getConnection(function(err, connection){
		connection.query("select idUnidade from usuarios where usuario = ? and senha = ?",[req.session.usuario.usuario, req.session.usuario.senha], function(error, result){
			connection.query("select * from evento where idUnidade = ? order by data",[result[0].idUnidade], function(error, result1){
				connection.query("select * from autoridades order by nome", function(error, result2){
					connection.query("select id, nome from unidade", function(error, result3){
						connection.query("select * from convidados where idEvento in(select id from evento where idUnidade = ?)",[result[0].idUnidade], function(error4, result4){
							var response = {}
							response.autoridades = result2;
							response.unidade = result3;
							response.evento = result1;
							response.convidados = result4;
							res.render('crudEventos',{
								data: JSON.stringify(response)
							})
						})
					})
				})
			})
		})
	})
}
exports.pdfConvitesQR = function(req, res) {
	req.setTimeout(1000000000)
	req.getConnection(function(err, connection){
    var cont = 0;
    connection.query("select * from evento where id = "+req.body.evento, function(error, result1){
		connection.query("select * from unidade where id = "+result1[0].idUnidade, function(error, result2){
	        var message = ''
	        if(fs.existsSync(__dirname +"/Brasao/"+result2[0].id+".jpeg")){
            	result2[0].brasao =("file:///"+__dirname +"/Brasao/"+result2[0].id+".jpeg").replace(/\\/g, '/');
          	}
	        result1[0].genero == 'f' ? message = 'A comandante do ' : message = 'O comandante do '
	        message += result2[0].nome_extenso+' '+result2[0].comandante+' tem a honra de convidar para '+result1[0].nome+'.</br></br>'+result1[0].data+'</br>'+
	    	result1[0].hora+' h</br>'+ result1[0].logradouro +' nº '+result1[0].numero+'</br>'+result1[0].bairro+' - '+result1[0].cidade
	    	var traje = 'Traje:</br>Civil                - '+result1[0].traje_civilvet+'</br>'+
	    	'Policia Militar  - '+result1[0].traje_pm+'</br>FFAA             - '+result1[0].traje_ffaa
	    	connection.query("select id from autoridades where id in ("+req.body.convidados+")", function(error, result){
		        var html= '<style>h4{margin-top:6%; margin-bottom: 10%;} h4, h5{font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;font-weight: 500;}img{width:15%;height: 28%; position: absolute; right:15px;border-radius: 10px;bottom: 15px;} h5{position: absolute;text-align:justify; left:15px;border-radius: 10px;bottom: 15px;} .black{border: 1px solid black; border-radius: 50px;height: auto;padding: 10px;} .red{height: auto; border: 3px solid red;border-radius: 50px; padding: 10px;position: relative; text-align:center;} .bg{ background:url('+result2[0].brasao+'); position: absolute; left: 0; right: 0; top: 0; bottom: 0; margin: auto; width:30%; height:50%; center no-repeat; background-size: 100% 100%;-webkit-filter: opacity(.2); }</style>'
		        function pdfConvite(){
			        var cols = '<div style = "page-break-inside: avoid; border: none;"></br><div class="black" ><div class="red">'
			        cols += '<h4>'+message+'</h4><div class = "bg"></div><h5>'+traje+'</h5>'
			        cols += '<img src="'+qrcode.toDataURL(req.body.evento+","+result[cont].id+"", 4)+'" style="height: 80px; width: 80px;"></img>'
			        cols += '</div></div></br><hr></div>'
			        html +=cols
			        cont +=1
			        if(cont ==req.body.convidados.length){
			            var options = { format: 'Letter', "orientation": "portrait",   "border": {"top": "0px","right": "10px","bottom": "0px","left": "10px"}, timeout: 1000000};
			            var data = {}
			            data.pdf = []
			            
			            pdf.create(html,options).toBuffer(function(err, buffer){
							data.pdf = new Buffer(buffer).toString('base64')
			                res.setHeader("Content-Type" ,"application/json" );
			                res.status(201);
			               	res.end(JSON.stringify(data));
			            })
			        }else{
			            pdfConvite()
			        }
		        }
		        pdfConvite()
	        })
	    })
    })
  })
}
exports.pdfConvites = function(req, res) {
	req.setTimeout(1000000000)
	req.getConnection(function(err, connection){
    var cont = 0;
    connection.query("select * from evento where id = "+req.body.evento, function(error, result1){
		connection.query("select * from unidade where id = "+result1[0].idUnidade, function(error, result2){
	        var message = ''
	        if(fs.existsSync(__dirname +"/Brasao/"+result2[0].id+".jpeg")){
            	var img = fs.readFileSync(__dirname + '/Brasao/'+result2[0].id+".jpeg").toString("base64");
                result2[0].brasao =("file:///"+__dirname +"/Brasao/"+result2[0].id+".jpeg").replace(/\\/g, '/');
          	}
	        message += result2[0].nome_extenso+' '+result2[0].comandante+' tem a honra de convidar para '+result1[0].nome+'.</br></br>'+result1[0].data+'</br>'+
	    	result1[0].hora+' h</br>'+ result1[0].logradouro +' nº '+result1[0].numero+'</br>'+result1[0].bairro+' - '+result1[0].cidade
	    	var traje = 'Traje:</br>Civil                - '+result1[0].traje_civilvet+'</br>'+
	    	'Policia Militar  - '+result1[0].traje_pm+'</br>FFAA             - '+result1[0].traje_ffaa
	        var html= '<style>h4{margin-top:6%; margin-bottom:10%;}h5{position: absolute;text-align:justify; left:15px;border-radius: 10px;bottom: 15px;}h4, h5{font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;font-weight: 500;} .black{border: 1px solid black; border-radius: 50px;height: auto;padding: 10px;} .red{height: auto; border: 3px solid red;border-radius: 50px; padding: 10px;position: relative; text-align:center;} .bg{ background:url('+result2[0].brasao+'); position: absolute; left: 0; right: 0; top: 0; bottom: 0; margin: auto; width:60%; height:80%; center no-repeat; background-size: 100% 100%;-webkit-filter: opacity(.2); }</style>'
	        function pdfConvite(){
		        var cols = '<div style = "page-break-inside: avoid; border: none;"></br><div class="black"><div class="red"></div></div></br><hr></div>'
		        cols += '<h4>'+message+'</h4><div class = "bg"></div><h5>'+traje+'</h5>'
		        html +=cols
		        cont +=1;
		        if(cont ==req.body.convidados.length){
		            var options = { format: 'Letter', "orientation": "portrait",   "border": {"top": "0px","right": "10px","bottom": "0px","left": "10px"}, timeout: 1000000};
		            var data = {}
		            data.pdf = []
		            pdf.create(html,options).toBuffer(function(err, buffer){
						data.pdf = new Buffer(buffer).toString('base64')
		                res.setHeader("Content-Type" ,"application/json" );
		                res.status(201);
		               	res.end(JSON.stringify(data));
		            })
		        }else{
		            pdfConvite()
		        }
	        }
	        pdfConvite()
	    })
    })
  })
}
exports.pdfLista = function(req, res) {
	req.setTimeout(1000000000)
	req.getConnection(function(err, connection){
    var cont = 0;
    connection.query("select * from evento where id = "+req.body.evento, function(error, result1){
		connection.query("select * from unidade where id = "+result1[0].idUnidade, function(error, result2){
	        var message = ''
	        if(result1[0].genero == 'f') message = 'A comandante do '
	        else message = 'O comandante do '
	        message += result2[0].nome_extenso+' '+result2[0].comandante+' tem a honra de convidar para o evento '+result1[0].nome+'.</br></br>'+result1[0].data+'</br>'+
	    	result1[0].hora+' h</br>'+ result1[0].logradouro +' nº '+result1[0].numero+'</br>'+result1[0].bairro+' - '+result1[0].cidade
	    	var traje = 'Traje:</br>Civil                    - '+result1[0].traje_civilvet+'</br>'+
	    	'Policia Militar  - '+result1[0].traje_pm+'</br>FFAA                  - '+result1[0].traje_ffaa
  			var html = '<style>div{border-top: 1px solid black;width: 100%;page-break-inside:avoid !important; height: 70%; padding-top: 1px;margin: 0px} tr, td{height: 1px; margin:0 !important; padding: 0 !important;} </style>'+
  			'<h1 style="text-align: center;">Lista de Convidados</h1><hr><table style="page-break-inside:auto;"><thead><tr><th style="border: 1px solid black;">Presença</th><th style="border: 1px solid black;">Nome</th><th style="border: 1px solid black;">Cidade</th></tr></thead><tbody>'
	        connection.query("select * from autoridades where id in ("+req.body.convidados+") order by nome", function(error, result){
		        function Lista(){
		        	var cols =""
		        	cols += '<td><div></div></td><td><div>'+result[cont].nome+'</div></td><td><div>'+result[cont].cidade+'</div></td>'
		        	html += '<tr>'+cols+'</tr>'
			        cont +=1;
			        if(cont ==req.body.convidados.length){
			        	html+="</tbody></table>"
			            var options = { format: 'Letter', "orientation": "portrait",   "border": {"top": "10px","right": "10px","bottom": "10px","left": "10px"}, timeout: 1000000};
			            	var data = {}
			           	data.pdf = []
			           	pdf.create(html,options).toBuffer(function(err, buffer){
							data.pdf = new Buffer(buffer).toString('base64')
			                   res.setHeader("Content-Type" ,"application/json" );
			               	res.status(201);
		             		res.end(JSON.stringify(data));
		                })
		            }else{
		            	Lista()
		            }
		        }
		        Lista()
	        })
	    })
    })
  })
}