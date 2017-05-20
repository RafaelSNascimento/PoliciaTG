var mysql = require ('mysql');
var express = require('express');
var database = 'node_app';
var table = 'unidade';
var fs = require('fs')
exports.cadastrarB = function(req,res){
  req.getConnection(function(err,connection){
    connection.query('select * from unidade where nome= ?',[req.body.nome], function(error, result1){
      var response={};
      if(result1[0]==null){
        var base64 = req.body.brasao.replace(/^data:image\/(png|jpg|jpeg);base64,/, '', "")
        connection.query(
          'Insert into '+table+
          ' set nome= ? , comandante= ?, genero=?, cep= ?, nome_extenso=?, uf= ?, cidade= ?, bairro= ?, logradouro= ?, brasao= ?',
          [req.body.nome, req.body.comandante, req.body.genero, req.body.cep, req.body.nomeExtenso,  req.body.uf, req.body.cidade, req.body.bairro, req.body.logradouro, req.body.nome+'.jpeg'],
          function (error,result2){
            if(error){
              response.result = 'error';
              response.message = error;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(response));
            }else{
              response.result = 'ok';
              connection.query('select * from unidade where nome = ?',[req.body.nome], function(error, batalhao){
                var img = fs.writeFile(__dirname +"/Brasao/"+result2.insertId+".jpeg",base64, 'base64', function(err) {
                  batalhao[0].brasao = "data:image/jpeg;base64,"+base64;
                  response.batalhao = batalhao;
                  response.message = 'Sucesso';
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(response));
                })

              });
            }
          }
          );
        
      }else{
        response.result = "error";
        response.message = "Nome do Batalhão ja existente no Banco de Dados.";
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(response));
      }
    });
  });
}
exports.relacionarCB = function(req,res){
  req.getConnection(function(err,connection){
    connection.query("select * from area_unidade where idUnidade='"+req.body.batalhao+"' and idCidade='"+req.body.cidade+"'",[], function(error, result){
      var response={};
      if(result[0] ==null){
        connection.query(
          'Insert into area_unidade set idUnidade= ? , idCidade= ?',[req.body.batalhao, req.body.cidade],function (error,result2){
            connection.query("select * from area_unidade where idUnidade='"+req.body.batalhao+"' and idCidade='"+req.body.cidade+"'",[], function(error, result3){
              if(error){
                response.result = 'error';
                response.message = error;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(response));
              }else{
                response.result = 'ok';
                response.message = 'Sucesso';
                response.id = result3[0].id;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(response));
              }
            });
          });
      }else{
        response.result = "error";
        response.message = "Nome da Cidade ja Relacionada a esse Batalhão no Banco de Dados.";
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(response));
      }
    });//fecho o validador
  });
}

exports.PreencheBatalhao = function(req, res){
  req.getConnection(function(err,connection){
    connection.query('select * from unidade',[],function(err, batalhao){
      connection.query('SELECT * FROM cidades',[],function(err,cidade){
        connection.query('SELECT * FROM area_unidade',[],function(err,relacao){
          if(err) return res.status(400).json(err);

          else{
            for(var i =0; i<batalhao.length;i++){

              if(fs.existsSync(__dirname +"/Brasao/"+batalhao[i].id+".jpeg")){
                batalhao[i].brasao = "/javascripts/database/Brasao/"+batalhao[i].id+".jpeg";
              }else{
                batalhao[i].brasao = "/images/noBrasao.png";
              }

              if(i +1 ==batalhao.length){
                var result={}
                result.batalhao = batalhao;
                result.cidade = cidade;
                result.relacao = relacao;
                res.render('crudBatalhao',{
                  result: JSON.stringify(result)
                });
              }
            }
          }
        });         
      });
    });
  });
}

exports.PreencheBatalhaoA = function(req, res){
  req.getConnection(function(err,connection){
    connection.query('select * from unidade',[],function(err, batalhao){
      connection.query('SELECT * FROM cidades',[],function(err,cidade){
        connection.query('SELECT * FROM area_unidade',[],function(err,relacao){
          if(err) return res.status(400).json(err);

          else{
            for(var i =0; i<batalhao.length;i++){
              if(fs.existsSync(__dirname +"/Brasao/"+batalhao[i].id+".jpeg")){
                batalhao[i].brasao = "/javascripts/database/Brasao/"+batalhao[i].id+".jpeg";
              }else{
                batalhao[i].brasao = "/images/noBrasao.png";
              }
              if(i +1 ==batalhao.length){
                var result={}
                result.batalhao = batalhao;
                result.cidade = cidade;
                result.relacao = relacao;
                res.render('crudBatalhaoA',{
                  result: JSON.stringify(result)
                });
              }
            }
            
            
          }
        });         
      });
    });
  });
}
exports.alterarB = function(req,res){
  req.getConnection(function(err,connection){
    connection.query('select * from unidade where nome= ?',[req.body.nome], function(error, result1){
      var response={};
      if( result1[0]==null || result1[0].id == req.body.id){
        connection.query('select * from unidade where id = ?',[req.body.id],function(error, resp){
          if(fs.existsSync(__dirname +"/Brasao/"+resp[0].id+".jpeg")){
            fs.unlink(__dirname +"/Brasao/"+resp[0].id+".jpeg", function(err){
              fs.writeFile(__dirname +"/Brasao/"+req.body.id+".jpeg",req.body.brasao.replace(/^data:image\/(png|jpg|jpeg);base64,/, '', ""), 'base64', function(err) {
                connection.query('UPDATE unidade SET nome_extenso = ?,  nome = ?, comandante = ?, genero=?, cep=?, uf=?, cidade=?, bairro=?, logradouro=? where id='+req.body.id,
                  [req.body.nomeExtenso, req.body.nome, req.body.comandante, req.body.genero, req.body.cep, req.body.uf, req.body.cidade, req.body.bairro, req.body.logradouro], function(error, result){
                    var response={};
                    if(error){
                      response.result = 'error';
                      response.message = error;
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify(response));
                    }else{
                      response.result = 'ok';
                      response.message = 'Sucesso';
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify(response));
                    }
                  });
              })
            })
          }else{
            fs.writeFile(__dirname +"/Brasao/"+req.body.id+".jpeg",req.body.brasao.replace(/^data:image\/(png|jpg|jpeg);base64,/, '', ""), 'base64', function(err) {
              connection.query('UPDATE unidade SET nome_extenso = ?,  nome = ?, comandante = ?, genero=?, cep=?, uf=?, cidade=?, bairro=?, logradouro=? where id='+req.body.id,
                [req.body.nomeExtenso, req.body.nome, req.body.comandante, req.body.genero, req.body.cep, req.body.uf, req.body.cidade, req.body.bairro, req.body.logradouro], function(error, result){
                  var response={};
                  if(error){
                    response.result = 'error';
                    response.message = error;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(response));
                  }else{
                    response.result = 'ok';
                    response.message = 'Sucesso';
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(response));
                  }
                });
            })
          }
        })
      }else{
        response.result = 'error';
        response.message = "Ja existe um Batalhão com esse Nome.";
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(response));        
      }
    });
  });
}
exports.excluirB =  function(req,res, next){
  req.getConnection(function(err,connection){
    var response={};
    connection.query('select * from unidade where id = ?',[req.body.id],function(error, result1){
      if(fs.existsSync(__dirname +"/Brasao/"+result1[0].id+".jpeg")){
        fs.unlink(__dirname +"/Brasao/"+result1[0].id+".jpeg")
      }
      connection.query(
        'Delete from unidade WHERE id = ?',
        [parseInt(req.body.id)],function(error,result){
          if(err){
            response.result = 'error';
            response.message = error;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(response));
          }else{
            response.result = 'ok';
            response.message = 'Sucesso';
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(response));
          }
        });
    })

  });
}
exports.excluirRelacao =  function(req,res, next){
  req.getConnection(function(err,connection){
    var response={};
    connection.query(
      'Delete from area_unidade WHERE id = ?',
      [parseInt(req.body.id)],function(error,result){
        if(err){
          response.result = 'error';
          response.message = error;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(response));
        }else{
          response.result = 'ok';
          response.message = 'Sucesso';
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(response));
        }
      });
  });
}