var express = require('express'),
multer  = require('multer'),  
path    = require('path'),
favicon = require('serve-favicon'),
logger  = require('morgan'),
cookieParser = require('cookie-parser'),
bodyParser = require('body-parser'),
connection  = require('express-myconnection'),
routes = require('./routes/index'),
users = require('./routes/users'),
mysql = require ('mysql'),
app = express(),
load = require('express-load'),
session = require('express-session')
var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, './public/javascripts/Database/Usuario/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({ //multer settings
  storage: storage
}).single('file');

var pdf = require('html-pdf');
var fs = require('fs');
var async = require('async');
var options = { format: 'Letter', "orientation": "portrait", "border": "20",  timeout: 60000, "header": {
  "height": "45mm",
  "contents": '<div style="text-align: center;"></div>'
}};



//Bancos de Dados
var dbLogin   = require('./public/javascripts/Database/databaseLogin');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
/*function ensureSecure(req, res, next){
if(req.secure){
// OK, continue
return next();
};
res.redirect('https://'+req.hostname); // handle port numbers if non 443
};*/

//app.all('*', ensureSecure);
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended : true }));
app.use(session({
  secret: '2C44-4D44-WppQ38S',
  resave: false,
  saveUninitialized: true
}));   

app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin',"*");
  res.header('Access-Control-Allow-Methods','GET, PUSH, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.locals.session  = req.session.usuario;
  next();
})

app.use('/', routes);
app.use('/users', users);

app.use(
  connection(mysql,{
    host: '127.0.0.1',
    user: 'root',
    password : 'root',
port : 3306, //port mysql
database:'policiasjc'
},'request')
  );
app.post('/alteruser',  upload, (req, res) =>{
  var response={}
  req.getConnection(function(err, connection){

    connection.query('select * from usuarios where usuario=? or senha = ?',[req.body.usuario, req.body.senha], function(error, result){
      if(error){
        response.result="error";
        response.message=error;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(response));
      }else{
        if(!result[0] || result[0].id == req.body.id || result[0]==null){
          connection.query('update usuarios set nome = ?, usuario=?, senha=?, idUnidade=?, role=? where id="'+req.body.id+'"',[req.body.nome, req.body.usuario, req.body.senha, req.body.idUnidade, req.body.role])
          response.result="success";
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(response));
        }else{
          response.result="error";
          response.message = "Já existe um usuario com esse Login ou Senha";
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(response))
        }
      }
    });
  });
});

load('rotas').into(app);

app.post('/pdf', function(req, res, next) {
  var html = '<h1 style="text-align: center;">Autoridades</h1><hr><div class="table-responsive"><table class="table" style="margin: 0 auto; float: none; border: 1px solid black;"><thead><tr class="info "><th style="border: 1px solid black;" class="text-center">ID</th><th style="border: 1px solid black;" class="text-center">Nome</th><th style="border: 1px solid black;" class="text-center">Cidade</th><th style="border: 1px solid black;" class="text-center">Unidade</th><th style="border: 1px solid black;" class="text-center">Ultima Att</th></thead><tbody>'
  var qr = "select a.*, u.nome as unidade from autoridades a left join unidade u on a.idUnidade = u.id where not isnull(a.id)"
  if(req.body.data.nome != "") qr+= " and a.nome like '%"+req.body.data.nome+"%' "
    if(req.body.data.batalhao != "") qr+= "and a.idUnidade = "+req.body.data.batalhao
      if(req.body.data.cidade != "") qr+= " and a.cidade like '%"+req.body.data.cidade+"%'"
        if(req.body.data.mes != ""){
          qr+=" having TIMESTAMPDIFF(YEAR,  date_format(STR_TO_DATE(ultima_atualizacao, '%d/%m/%Y'), '%Y-%m-%d'), curdate())*12+"+
          "TIMESTAMPDIFF(MONTH, date_format(STR_TO_DATE(ultima_atualizacao, '%d/%m/%Y'), '%Y-%m-%d') + "+
          "INTERVAL TIMESTAMPDIFF(YEAR,  date_format(STR_TO_DATE(ultima_atualizacao, '%d/%m/%Y'), '%Y-%m-%d'), curdate()) YEAR , curdate()) = "+req.body.data.mes
        }
        req.getConnection(function(err, connection){
          connection.query(qr, function(error, result){
            if(error) console.log(error)
              if(result[0]!=null){
                for(var i=0; i<result.length; i++){
                  var cols = "";
                  cols += '<td style="border: 1px solid black;" data-id="'+result[i].id+'">'+result[i].id+'</td>'
                  cols += '<td style="border: 1px solid black;" data-id="'+result[i].nome+'">'+result[i].nome+'</td>'
                  cols += '<td style="border: 1px solid black;" data-id="'+result[i].cidade+'">'+result[i].cidade+'</td>'
                  cols += '<td style="border: 1px solid black;" data-id="'+result[i].unidade+'">'+result[i].unidade+'</td>'
                  cols += '<td style="border: 1px solid black;" data-id="'+result[i].ultima_atualizacao+'">'+result[i].ultima_atualizacao+'</td>'
                  html += "<tr>"+cols+"</tr>"
                  if((i+1)==result.length){
                    html+="</tbody></table></div>"
                    pdf.create(html).toBuffer(function(err, buffer){
                      res.writeHead(200, {"Content-Type" : "application/pdf" });
                      res.end(buffer, "binary");
                    });
                  }
                }
              }else{
                html = "<h1>Não Possui Autoridades com este Filtro!</h1>"
                pdf.create(html).toBuffer(function(err, buffer){
                  res.writeHead(200, {"Content-Type" : "application/pdf" });
                  res.end(buffer, "binary");
                })
              }
            })
        })
      })


app.post('/ValidarLogin', dbLogin.validarLogin);


app.get('/deslogaruc', function(req,res){
  req.session.destroy();
  res.redirect('/');
});
app.post('/deslogaruc', function(req,res){
  req.session.destroy();
  res.redirect('/');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;