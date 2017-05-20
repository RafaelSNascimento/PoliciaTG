exports.dadosIniciais = function(req,res){
	req.getConnection(function(err, connection){
		response = {}
		connection.query('select id, Destinatario from pronomes order by Destinatario', function(error1, result1){
			connection.query('select * from autoridades', function(error2, result2){
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
									res.render('home',{
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