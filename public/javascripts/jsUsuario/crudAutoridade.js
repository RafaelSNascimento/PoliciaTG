$(function(){
	var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
	date = date.split(" ")
	date = date[0].replace(/-/gi,"/").split("/")
	date = date[2] +"/"+date[1]+"/"+date[0];
	date = date.split("/")
	var autoridadeid;
	$('#numeroTel').mask('(00) 00000-0000');
	$("#cep").mask('00000-000');
	$("#nascimento").mask('00/00/0000')
	$('#numeroTelAlterar').mask('(00) 0000-0000');
	$("#cepAlterar").mask('00000-000');
	$("#nascimentoAlterar").mask('00/00/0000')
	$("#consulta").hide("slow")
	$.each(dadosIniciais.unidade, function(i, item){
		$("#selectUnidade").append('<option value="'+item.id+'">'+item.nome+'</option>')
		$("#selectUnidadeAlterar").append('<option value="'+item.id+'">'+item.nome+'</option>')
		$("#selectBatalhaoC").append('<option value="'+item.id+'">'+item.nome+'</option>')
	})
	

	//pager
	$(".nav a").on("click", function(){
		   $(".nav").find(".active").removeClass("active");
		   $(this).parent().addClass("active");
	});
	$("a").click(function(event){
		if(typeof ($(this).attr("id"))!="undefined"){
			if($(this).attr("id").match("ca")){
				$("#cadastro").show("slow")
				$("#consulta").hide("slow")
			}else if($(this).attr("id").match("co")){
				$("#cadastro").hide("slow")
				$("#consulta").show("slow")
			}
			event.preventDefault();
		}
		
	})
	function adiciona(i, item){
		var newRow = $("<tr>");
		var cols="";
		var telefone = "";
		var email = "";
		var emailMessage = " "
		var telefoneMessage = " "
		$.each($.grep(dadosIniciais.autoridades_email, function(n, i){
			return n.idAutoridade == item.id;

		}),function(i, item2){
			email = $.grep(dadosIniciais.email, function(n, i){
					return n.id == item2.idEmail;

			})
			if(email.length >0) emailMessage += email[0].email+"<br>";
		})
		$.each($.grep(dadosIniciais.autoridades_telefone, function(n, i){
			return n.idAutoridade == item.id;

		}),function(i, item2){
			telefone = $.grep(dadosIniciais.telefone, function(n, i){
					return n.id == item2.idTelefone;

			})
			if(telefone.length >0)telefoneMessage += telefone[0].tipo +":"+telefone[0].telefone+"<br>";
		})	
		cols+="<td data-id = '"+item.id+"' >"+i+"</td>";
		cols+="<td data-nome = '"+item.nome+"'>"+item.nome+"</td>"
		cols+="<td data-apelido = '"+item.apelido+"'>"+item.apelido+"</td>"
		cols+="<td data-partido = '"+item.partido+"'>"+item.partido+"</td>"
		cols+="<td data-genero = '"+item.genero+"'>"+item.genero+"</td>"
		cols+="<td data-cep = '"+item.cep+"'>"+item.cep+"</td>"
		cols+="<td data-uf = '"+item.uf+"''>"+item.uf+"</td>"
		cols+="<td data-cidade = '"+item.cidade+"'>"+item.cidade+"</td>"
		cols+="<td data-bairro = '"+item.bairro+"'>"+item.bairro+"</td>"
		cols+="<td data-logradouro = '"+item.logradouro+"'>"+item.logradouro+"</td>"
		cols+="<td data-numero = '"+item.numero+"'>"+item.numero+"</td>"
		cols+="<td >"+telefoneMessage+"</td>"
		cols+="<td>"+emailMessage+"</td>"
		cols+="<td data-ultima_atualizacao = '"+item.ultima_atualizacao+"'>"+item.ultima_atualizacao+"</td>"
		cols+="<td data-funcao = '"+item.funcao+"'>"+item.funcao+"</td>"
		cols+="<td data-nascimento = '"+item.nascimento+"'>"+item.nascimento+"</td>"
		cols+="<td data-tratamento = '"+item.tratamento+"'>"+item.tratamento+"</td>"
		cols+="<td data-titulo = '"+item.titulo+"'>"+item.titulo+"</td>"
		var nomeUnidade = $.grep(dadosIniciais.unidade, function(n, i){
			return n.id == item.idUnidade
		});
		cols+="<td data-unidade = '"+item.idUnidade+"'>"+(nomeUnidade[0]==null ? "" : nomeUnidade[0].nome)+"</td>"
		cols+="<td data-empresa = '"+item.empresa+"'>"+item.empresa+"</td>"
		cols+= '<td><button onclick="RemoveTableRowAu(this)" class="btn btn-danger" type="button" style="margin:3px;">Excluir</button>'+
		'<button type="button" onclick = "AlterRow(this)" class="btn btn-success" data-toggle="modal" data-target="#myModal">Alterar</button></td>'
		newRow.append(cols)
		$("#autoridades").append(newRow)
	};
	$("#pdf").on('click', function(){
		var nome = $("#nomeConsultar").val()!= "" ? "/"+$("#nomeConsultar").val() : "/0"
		var batalhao = $("#selectBatalhaoC").val() != "" ? "/"+$("#selectBatalhaoC").val() : "/0"
		var mes = $("#selectMes").val() != "" ? "/"+$("#selectMes").val() :  "/0"
		var cidade = $("#cidadeConsultar").val() != "" ? "/"+$("#cidadeConsultar").val() : "/0"
	})
	function monthDiff(d1, d2) {
	    var months;
	    months = (d2.getFullYear() - d1.getFullYear()) * 12;
	    months -= d1.getMonth() + 1;
	    months += d2.getMonth();
	    return months <= 0 ? 0 : months;
	}
	function atualiza(){
		$("#autoridades tbody").empty()
		var valor = 0;
		$.each($.grep(dadosIniciais.autoridades, function(n, i){
			if($("#selectBatalhaoC").val()!="" && $("#selectMes").val()!=""){
				var dia = n.ultima_atualizacao.split("/");
				var valor = monthDiff(
				    new Date(dia[2], dia[1], dia[0]), // November 4th, 2008
				    new Date(date[2], date[1], date[0])  // March 12th, 2010
				);
				return n.cidade.toUpperCase().indexOf($("#cidadeConsultar").val().toUpperCase()) >= 0 && n.nome.toUpperCase().indexOf($("#nomeConsultar").val().toUpperCase()) >= 0 && n.idUnidade == $("#selectBatalhaoC").val() && valor == $("#selectMes").val();
				
			}else if($("#selectBatalhaoC").val()!="" && $("#selectMes").val()==""){
				return n.cidade.toUpperCase().indexOf($("#cidadeConsultar").val().toUpperCase()) >= 0 && n.nome.toUpperCase().indexOf($("#nomeConsultar").val().toUpperCase()) >= 0 && n.idUnidade == $("#selectBatalhaoC").val() 
			}else if($("#selectBatalhaoC").val()=="" && $("#selectMes").val()!=""){
				var dia = n.ultima_atualizacao.split("/");
				var dia = n.ultima_atualizacao.split("/");
				var valor = monthDiff(
				    new Date(dia[2], dia[1], dia[0]), // November 4th, 2008
				    new Date(date[2], date[1], date[0])  // March 12th, 2010
				);
				return n.cidade.toUpperCase().indexOf($("#cidadeConsultar").val().toUpperCase()) >= 0 && n.nome.toUpperCase().indexOf($("#nomeConsultar").val().toUpperCase()) >= 0 && valor == $("#selectMes").val();
				
			}else{
				return n.cidade.toUpperCase().indexOf($("#cidadeConsultar").val().toUpperCase()) >= 0 && n.nome.toUpperCase().indexOf($("#nomeConsultar").val().toUpperCase()) >= 0;
			}

		}),function(i, item){
				adiciona(i, item);
		})
	}
	$("#pesquisarA").click(function(){
		atualiza()
	})


	$("#adicionarT").click(function(){
		var newRow = $("<tr>");
		var cols = "";
		if($("#numeroTel").val()!=""){
			cols+='<td data-tipo="'+ $("#selectTipo").val() +'">'+$("#selectTipo option:selected").text()+'</td>'
			cols+='<td data-numero="'+ $("#numeroTel").val() +'">'+ $("#numeroTel").val()+'</td>'
			cols+= '<td><button onclick="RemoveTableRow(this)" class="btn btn-danger" type="button">Excluir</button></td>'
			newRow.append(cols);
			$("#tTelefone").append(newRow);	
		}
	});
	$("#adicionarE").click(function(){
		var newRow = $("<tr>");
		var cols = "";
		if($("#email").val()!=""){
			cols+='<td data-numero="'+ $("#email").val() +'">'+ $("#email").val()+'</td>'
			cols+= '<td><button onclick="RemoveTableRow(this)" class="btn btn-danger" type="button">Excluir</button></td>'
			newRow.append(cols);
			$("#tEmail").append(newRow);
		}
	});
	$("#adicionarTAlterar").click(function(){
	var newRow = $("<tr>");
	var cols = "";
	if($("#numeroTelAlterar").val()!=""){
		cols+='<td data-tipo="'+ $("#selectTipoAlterar").val() +'">'+$("#selectTipoAlterar option:selected").text()+'</td>'
		cols+='<td data-numero="'+ $("#numeroTelAlterar").val() +'">'+ $("#numeroTelAlterar").val()+'</td>'
		cols+= '<td><button onclick="RemoveTableRowA(this)" class="btn btn-danger" type="button">Excluir</button></td>'
		newRow.append(cols);
		$("#tTelefoneAlterar").append(newRow);	
	}
	});
	$("#adicionarEAlterar").click(function(){
		var newRow = $("<tr>");
		var cols = "";
		if($("#emailAlterar").val()!=""){
			cols+='<td data-numero="'+ $("#emailAlterar").val() +'">'+ $("#emailAlterar").val()+'</td>'
			cols+= '<td><button onclick="RemoveTableRowA(this)" class="btn btn-danger" type="button">Excluir</button></td>'
			newRow.append(cols);
			$("#tEmailAlterar").append(newRow);
		}
	});
	AlterRow = function(handler){
		$('#formAlterarA select').each (function(){
  			$(this).css({"border" : "1px solid #ccc", "padding": "2px"});
  		})
  		$('#formAlterarA input').each (function(){
  			$(this).css({"border" : "1px solid #ccc", "padding": "2px"});
  		})
		var tr = $(handler).closest('tr');
		$("#tEmailAlterar tbody").empty()
		$("#tTelefoneAlterar tbody").empty()
		var autoridade = $.grep(dadosIniciais.autoridades, function(n, i){
			autoridadeid = tr.find('td[data-id]').data('id');
			return n.id == tr.find('td[data-id]').data('id');
		})
		$.each(autoridade, function(i, item){

			$.each($.grep(dadosIniciais.autoridades_email, function(n, i){
				return n.idAutoridade == item.id;

			}),function(i, item2){
				email = $.grep(dadosIniciais.email, function(n, i){
					return n.id == item2.idEmail;

				})
				var newRow = $("<tr>");
				var cols = "";
				cols+='<td data-id="'+ email[0].id +'">'+email[0].email+'</td>'
				cols+= '<td><button onclick="RemoveTableRowA(this)" class="btn btn-danger" type="button">Excluir</button></td>'
				newRow.append(cols);
				$("#tEmailAlterar").append(newRow);
			})
			$.each($.grep(dadosIniciais.autoridades_telefone, function(n, i){
				return n.idAutoridade == item.id;

			}),function(i, item2){
				telefone = $.grep(dadosIniciais.telefone, function(n, i){
						return n.id == item2.idTelefone;

				})
				var newRow = $("<tr>")
				var cols = "";
				cols += '<td data-id="'+item.tipo+'">'+telefone[0].tipo+'</td>'
				cols += '<td data-id="'+telefone[0].id +'">'+telefone[0].telefone+'</td>'
				cols+= '<td><button onclick="RemoveTableRowA(this)" class="btn btn-danger" type="button">Excluir</button></td>'
				newRow.append(cols);
				$("#tTelefoneAlterar").append(newRow);
			})
			$("#funcaoAlterar").val(item.funcao);
			$("#empresaAlterar").val(item.empresa);
			$("#nomeAlterar").val(item.nome);
			$("#tituloAlterar").val(item.titulo);
			$("#apelidoAlterar").val(item.apelido);
			$("#nascimentoAlterar").val(item.nascimento);
			$("#selectPronomesAlterar").val(item.tratamento);
			$("#partidoAlterar").val(item.partido);
			$("#selectUnidadeAlterar").val(item.idUnidade);
			console.log(item.idUnidade);
			$("#selectGeneroAlterar").val(item.genero);
			$("#cepAlterar").val(item.cep);
			$("#ufAlterar").val(item.uf);
			$("#cidadeAlterar").val(item.cidade);
			$("#bairroAlterar").val(item.bairro);
			$("#logradouroAlterar").val(item.logradouro);
			$("#numeroAlterar").val(item.numero);

		})
	}
	RemoveTableRow = function(handler){
		var tr = $(handler).closest('tr')
		tr.fadeOut(400, function(){ 
			tr.remove(); 
		}); 
	}
	RemoveTableRowAu = function(handler) {
    	var tr = $(handler).closest('tr');
    	var data = {};
    	data.id=tr.find('td[data-id]').data('id');
    	swal({
			title: "Você tem certeza?",
			text: "Não é possivel recuperar os dados após a exclusão!",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, delete it!",
			cancelButtonText: "No, cancel plx!",
			closeOnConfirm: false,
			closeOnCancel: false },
			function(isConfirm){
				if (isConfirm) {
					$.ajax({
						type: 'POST',
						contentType: 'application/json; charset=utf-8',
						 url: '/excluirAutoridade',
						 dataType: "json",
						 data: JSON.stringify(data),
						 cache: false,
						success: function(data) {
							var response = data;
				  			if (response.result == 'ok') {
				  				swal("Deleted!", "Seus dados foram Excluido!.", "success");
				  				dadosIniciais.autoridades = $.grep(dadosIniciais.autoridades, function(n, i){
									return n.id != tr.find('td[data-id]').data('id');
								})
								dadosIniciais.autoridades_telefone = $.grep(dadosIniciais.autoridades_telefone, function(n, i){
									return n.idAutoridade != tr.find('td[data-id]').data('id');
								})
								dadosIniciais.autoridades_email = $.grep(dadosIniciais.autoridades_email, function(n, i){
									return n.idAutoridade != tr.find('td[data-id]').data('id');
								})
				  				tr.fadeOut(400, function(){ 
								tr.remove(); 
								}); 

		  					}else {
								swal("Oops...", response.message, "error");
		  					}
						}
					});
						
				} else {
					swal("Cancelled", "Seus dados estão Seguro!", "error");
				} 
			});


    	return false;
	};
	RemoveTableRowA = function(handler) {
    	var tr = $(handler).closest('tr');
    	swal({
			title: "Você tem certeza?",
			text: "Não é possivel recuperar os dados após a exclusão!",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, delete it!",
			cancelButtonText: "No, cancel plx!",
			closeOnConfirm: false
			},
			function(isConfirm){
				if (isConfirm) {
					swal("Deleted!", "Seus dados foram Excluido!.", "success");
				  		tr.fadeOut(400, function(){ 
						tr.remove(); 
						}); 	
				} else {
					swal("Cancelled", "Seus dados estão Seguro!", "error");
				} 
			});
    	return false;
	};

	function limpa_formulário_cep() {
                // Limpa valores do formulário de cep.
		$("#endereco").val("");
		$("#bairro").val("");
		$("#cidade").val("");
		$("#uf").val("");
	}
	// Registra o evento blur do campo "cep", ou seja, quando o usuário sair do campo "cep" faremos a consulta dos dados
	$("#cep").blur(function(){
		cep('');
	});
	$("#cepAlterar").blur(function(){
		cep('Alterar');
	})
	function cep(fun){
	//Nova variável "cep" somente com dígitos.
		var cep = $("#cep"+fun).val().replace(/\D/g, '');
		//Verifica se campo cep possui valor informado.
		if (cep.length == 8) {
			//Expressão regular para validar o CEP.
			var validacep = /^[0-9]{8}$/;
			//Valida o formato do CEP.
			if(validacep.test(cep)) {
				//Preenche os campos com "..." enquanto consulta webservice.
				$("#logradouro"+fun).val("...");
				$("#bairro"+fun).val("...");
				$("#cidade"+fun).val("...");
				$("#uf"+fun).val("...");
				$.getJSON("//viacep.com.br/ws/"+ cep +"/json/?callback=?", function(dados) {
					if (!("erro" in dados)) {
						//Atualiza os campos com os valores da consulta.
						$("#logradouro"+fun).val(dados.logradouro);
						$("#bairro"+fun).val(dados.bairro);
						$("#cidade"+fun).val(dados.localidade);
						$("#uf"+fun).val(dados.uf);
					} //end if.
					else {
						//CEP pesquisado não foi encontrado.
						limpa_formulário_cep();
						alert("CEP não encontrado.");
					}
				});
			} //end if.
			else {
				limpa_formulário_cep();
				alert("Formato de CEP inválido.");
			}
		} //end if.
		else {
			limpa_formulário_cep();
		}
	}
	$("#cadastrarA").click(function(){
		data = {}
		data.email=[]
		data.telefones = []
		$('#formCadastrarA input').each (function(){
	  		$(this).css({"border" : "1px solid #ccc", "padding": "2px"});
  		})
  		$('#formCadastrarA select').each (function(){
  			$(this).css({"border" : "1px solid #ccc", "padding": "2px"});
  		})
		var nome 		= $("#nome").val(),
			titulo		= $("#titulo").val(),
			apelido		= $("#apelido").val(),
			nascimento	= $("#nascimento").val(),
			pronome 	= $("#selectPronomes").val(),
			partido 	= $("#partido").val(),
			unidade 	= $("#selectUnidade").val(),
			genero 		= $("#selectGenero").val(),
			cep 		= $("#cep").val(),
			uf 			= $("#uf").val(),
			cidade		= $("#cidade").val(),
			bairro 		= $("#bairro").val(),
			logradouro 	= $("#logradouro").val(),
			numero 		= $("#numero").val(),
			funcao		= $("#funcao").val(),
			empresa		= $("#empresa").val();

		$('#tTelefone tbody tr').each(function(){
			var colunas = $(this).children();
			data.telefones.push({
	            'tipo': $(colunas[0]).text().toUpperCase(), // valor da coluna Produto
	            'numero': $(colunas[1]).text().toUpperCase() // Valor da coluna Quantidade
	        })
		});
		$('#tEmail tbody tr').each(function(){
			var colunas = $(this).children();
			data.email.push({"email":$(colunas[0]).text().toUpperCase()})
		})
		var flag = false
		$('#formCadastrarA input').each (function(){
  			if($(this).val()=="" && $(this).attr("id") != "numeroTel" && $(this).attr("id")!= "email"){
  				$(this).css({"border" : "1px solid #F00", "padding": "2px"});
  				flag=true
  			}

  		})
  		$('#formCadastrarA select').each (function(){
			if($(this).val()==null){
  				$(this).css({"border" : "1px solid #F00", "padding": "2px"});
  				flag=true
  			}

  		})

  		if(data.telefones[0] == null ){
  			$("#numeroTel").css({"border" : "1px solid #F00", "padding": "2px"})
  			flag=true
 		}
 		if(data.email[0] == null ){
  			$("#email").css({"border" : "1px solid #F00", "padding": "2px"})
  			flag=true
 		}
  		if(flag == false){

	  		data.nome = nome.toUpperCase();
			data.titulo = titulo.toUpperCase();
			data.apelido = apelido.toUpperCase();
			data.nascimento = nascimento.toUpperCase();
			data.tratamento = pronome.toUpperCase();
			data.partido = partido.toUpperCase();
			data.unidade = unidade.toUpperCase();
			data.idUnidade = unidade;
			data.genero = genero.toUpperCase();
			data.cep = cep.toUpperCase();
			data.uf = uf.toUpperCase();
			data.funcao = funcao.toUpperCase();
			data.empresa = empresa.toUpperCase();
			data.cidade = cidade.toUpperCase();
			data.bairro = bairro.toUpperCase();
			data.logradouro = logradouro.toUpperCase();
			data.numero = numero.toUpperCase();
			message = "Nome: "+nome+"\nTitulo: "+titulo+"\nApelido: "+apelido+"\nNascimento: "+nascimento+"\nGrupo de Tratamento: "+pronome+
			"\nPartido: "+partido+"\nUnidade: "+unidade+"\nGenero: "+genero+"\nCep: "+cep+"\nUF: "+uf+"\nCidade: "+cidade+"\nBairro: "+bairro+"\nLogradouro: "+
			logradouro+"\nNumero: "+numero+"\nEmpresa: "+empresa+"\nFunção: "+ funcao;
			$.each(data.telefones, function(i,item){
				message += "\n Telefone "+i+": "+item.tipo+"/"+item.numero;
			})
			$.each(data.email, function(i, item){
				message += "\n Email "+i+": "+item.email;
			})

			swal({
				title: "Confira os Dados e Confirme.",
				text: message,
				type: "info",
				showCancelButton: true,
				closeOnConfirm: false,
				showLoaderOnConfirm: true,
			}, function(){
				var newAutoridade = data;
				$('#cadastrarA').attr('disabled', true);
				$.ajax({
					type:'POST',
					contentType: 'application/json; charset=utf-8',
					url: '/inserirA',
					dataType: 'json',
					data: JSON.stringify(data),
					cache: false,
					success: function(data){
						if(data.message == "success"){
							$('#formAlterarA').each (function(){
  								this.reset();
  							})
  							$('#cadastrarA').attr('disabled', false);
							swal("Sucesso!","Autoridade Cadastrada!", "success");
							newAutoridade.id = data.id;
							newAutoridade.ultima_atualizacao = data.ultima_atualizacao;
							dadosIniciais.autoridades.push(newAutoridade)
							dadosIniciais.email = data.email;
							dadosIniciais.autoridades_email = data.autoridades_email;
							dadosIniciais.telefone = data.telefone;
							dadosIniciais.autoridades_telefone = data.autoridades_telefone;
						}else{
							swal("Ops....",data.message, "error");
						}
					}
				})
			});

		}else{
			swal("Ops....","Preencha Corretamente todos os campos!", "error");
		}
	})
	//alterar
	$("#alterarAutoridade").click(function(){
		var data={},
		flag = false;
		data.email=[]
		data.telefones = []
		//desvalida
		$('#formAlterarA input').each (function(){
	  		$(this).css({"border" : "1px solid #ccc", "padding": "2px"});
  		})
  		$('#formAlterarA select').each (function(){
  			$(this).css({"border" : "1px solid #ccc", "padding": "2px"});
  		})
  		//varrendo as tabelas telefone e email
  		$('#tTelefoneAlterar tbody tr').each(function(){
			var colunas = $(this).children();
			data.telefones.push({
	            'tipo': $(colunas[0]).text().toUpperCase(), // valor da coluna Produto
	            'numero': $(colunas[1]).text().toUpperCase() // Valor da coluna Quantidade
	        })
		});
		$('#tEmailAlterar tbody tr').each(function(){
			var colunas = $(this).children();
			data.email.push({
				"email":$(colunas[0]).text().toUpperCase()
			})
		})
		//valida formulario
		$('#formAlterarA input').each (function(){
  			if($(this).val()=="" && $(this).attr("id") != "numeroTelAlterar" && $(this).attr("id")!= "emailAlterar"){
  				$(this).css({"border" : "1px solid #F00", "padding": "2px"});
  				flag=true
  			}

  		})
  		$('#formAlterarA select').each (function(){
			if($(this).val()==null){
  				$(this).css({"border" : "1px solid #F00", "padding": "2px"});
  				flag=true
  			}

  		})
  		if(data.telefones[0] == null ){
  			$("#numeroTelAlterar").css({"border" : "1px solid #F00", "padding": "2px"})
  			flag=true
 		}
 		if(data.email[0] == null ){
  			$("#emailAlterar").css({"border" : "1px solid #F00", "padding": "2px"})
  			flag=true
 		}
 		if(flag == false){
 			data.id = autoridadeid;
 			data.funcao = $("#funcaoAlterar").val().toUpperCase();
 			data.empresa = $("#empresaAlterar").val().toUpperCase();
 			data.nome = $("#nomeAlterar").val().toUpperCase();
			data.titulo = $("#tituloAlterar").val().toUpperCase();
			data.apelido =$("#apelidoAlterar").val().toUpperCase();
			data.nascimento = $("#nascimentoAlterar").val().toUpperCase();
			data.tratamento = $("#selectPronomesAlterar").val().toUpperCase();
			data.partido = $("#partidoAlterar").val().toUpperCase();
			data.unidade = $("#selectUnidadeAlterar").val().toUpperCase();
			data.genero = $("#selectGeneroAlterar").val().toUpperCase();
			data.cep = $("#cepAlterar").val().toUpperCase();
			data.uf = $("#ufAlterar").val().toUpperCase();
			data.cidade = $("#cidadeAlterar").val().toUpperCase();
			data.bairro = $("#bairroAlterar").val().toUpperCase();
			data.logradouro = $("#logradouroAlterar").val().toUpperCase();
			data.numero = $("#numeroAlterar").val().toUpperCase();

			message = "Nome: "+data.nome+"\nTitulo: "+data.titulo+"\nApelido: "+data.apelido+"\nNascimento: "+data.nascimento+"\nGrupo de Tratamento: "+data.tratamento+
			"\nPartido: "+data.partido+"\nUnidade: "+data.unidade+"\nGenero: "+data.genero+"\nCep: "+data.cep+"\nUF: "+data.uf+"\nCidade: "+data.cidade+"\nBairro: "+data.bairro+"\nLogradouro: "+
			data.logradouro+"\nNumero: "+data.numero+"\nEmpresa: "+data.empresa+"\nFunção: "+ data.funcao;
			$.each(data.telefones, function(i,item){
				message += "\n Telefone "+i+": "+item.tipo+"/"+item.numero;
			})
			$.each(data.email, function(i, item){
				message += "\n Email "+i+": "+item.email;
			})

			swal({
				title: "Confira os Dados e Confirme.",
				text: message,
				type: "info",
				showCancelButton: true,
				closeOnConfirm: false,
				showLoaderOnConfirm: true,
			}, function(){
				var newAutoridade = data;
				$.ajax({
					type:'POST',
					contentType: 'application/json; charset=utf-8',
					url: '/alterarA',
					dataType: 'json',
					data: JSON.stringify(data),
					cache: false,
					success: function(data){
						if(data.message == "success"){
							swal("Sucesso!","Autoridade Alterada!", "success");
							$.each(dadosIniciais.autoridades, function(i, item) {
								if(item.id == data.id){
									item.nome = $("#nomeAlterar").val().toUpperCase();
									item.titulo = $("#tituloAlterar").val().toUpperCase();
									item.apelido =$("#apelidoAlterar").val().toUpperCase();
									item.nascimento = $("#nascimentoAlterar").val().toUpperCase();
									item.tratamento = $("#selectPronomesAlterar").val().toUpperCase();
									item.partido = $("#partidoAlterar").val().toUpperCase();
									item.idUnidade = $("#selectUnidadeAlterar").val().toUpperCase();
									item.genero = $("#selectGeneroAlterar").val().toUpperCase();
									item.cep = $("#cepAlterar").val().toUpperCase();
									item.empresa = $("#empresaAlterar").val().toUpperCase();
									item.funcao = $("#funcaoAlterar").val().toUpperCase();
									item.uf = $("#ufAlterar").val().toUpperCase();
									item.cidade = $("#cidadeAlterar").val().toUpperCase();
									item.bairro = $("#bairroAlterar").val().toUpperCase();
									item.logradouro = $("#logradouroAlterar").val().toUpperCase();
									item.numero = $("#numeroAlterar").val().toUpperCase();
									item.ultima_atualizacao = data.ultima_atualizacao;
								}
							})
							dadosIniciais.email = data.email;
							dadosIniciais.autoridades_email = data.autoridades_email;
							dadosIniciais.telefone = data.telefone;
							dadosIniciais.autoridades_telefone = data.autoridades_telefone;
							atualiza();
							$('#myModal').modal('toggle');
							$("#selectBatalhaoC").change();
							$('#formAlterarA').each (function(){
  								this.reset();
  							})
  							$("#tTelefoneAlterar tbody").empty()
  							$("#tEmailAlterar tbody").empty()
						}else{
							swal("Ops....",data.message, "error");
						}
					}
				})
			});

 		}else{
 			swal("Ops....","Preencha Corretamente todos os campos!", "error");
 		}
	});
});