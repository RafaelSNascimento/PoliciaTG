var mysql = require ('mysql');
var express = require('express');


exports.validarLogin = function(req, res) {
  req.getConnection(function(err,connection){
    var response={}
    if(req.body.usuario =="admin" && req.body.senha =="admin"){
      var usuario  = {}
      usuario.usuario = "admin";
      usuario.senha = "admin";
      response.result = 'admin';
      req.session.usuario = usuario;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(response));  
    }else{
      connection.query("SELECT * FROM usuarios where usuario = ? and senha= ?",[req.body.usuario, req.body.senha],function(err,result){
        if(err || result[0]==null){
          response.result = 'error';
          response.errors = err;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(response)); 
        }else{
          var usuario  = {}
          usuario.role = result[0].role;
          usuario.usuario = result[0].usuario;
          usuario.senha = result[0].senha;
          response.result = 'ok';
          response.message = 'Usuario Logado';
          response.usuario = result;
          req.session.usuario = usuario;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(response));               
        }
      });
    }
  });
}