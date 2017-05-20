$(function(){
	var convidadosConfirmados = [];
	var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
	date = date.split(" ")
	date = date[0].replace(/-/gi,"/").split("/")
	date = date[2] +"/"+date[1]+"/"+date[0];
	date = date.split("/")
	$("#data").mask('00/00/0000')
	$("#horario").mask('00:00')
	$("#cep").mask("00000-000")
	$("#dataAlterar").mask('00/00/0000')
	$("#horarioAlterar").mask('00:00')
	$("#cepAlterar").mask("00000-000")
	$(".convidados").hide("fast")
	$(".firebase").hide("fast");
	$("#co").hide("fast")
	$(".nav a").on("click", function(){
	   $(".nav").find(".active").removeClass("active");
	   $(this).parent().addClass("active");
	});

	var eventoid = ""
	var eventoidConvite = ""
	$.each(dadosIniciais.unidade, function(i, item){
		$("#selectBatalhaoC").append('<option value="'+item.id+'">'+item.nome+'</option>')
		$("#selectBatalhaoCC").append('<option value="'+item.id+'">'+item.nome+'</option>')
	})
	atualiza();
	$("a").click(function(event){
		if(typeof ($(this).attr("id"))!="undefined"){
			if($(this).attr("id").match("cadastrar")){
				$("#ca").show("slow")
				$("#co").hide("slow")
			}else if($(this).attr("id").match("consultar")){
				$("#ca").hide("slow")
				$("#co").show("slow")
			}else if($(this).attr("id").match("autoridadess")){
				$(".autoridades").show("slow")
				$(".convidados").hide("slow")
				$(".firebase").hide("slow")
			}else if($(this).attr("id").match("convidadoss")){
				$(".autoridades").hide("slow")
				$(".convidados").show("slow")
				$(".firebase").hide("slow")
			}else if($(this).attr("id").match("firebasess")){
				$(".autoridades").hide("slow")
				$(".convidados").hide("slow")
				$(".firebase").show("slow")
			}
			event.preventDefault();
		}
		
	})
	function adiciona(item){
		var newRow = $("<tr>");
		var cols="";
		cols += "<td data-id='"+item.id+"'>"+item.id+"</td>"
		cols += "<td>"+item.nome+"</td>"
		cols += "<td>"+item.data+"</td>"
		cols += "<td>"+item.hora+"</td>"
		cols += "<td>"+item.cep+"</td>"
		cols += "<td>"+item.uf+"</td>"
		cols += "<td>"+item.cidade+"</td>"
		cols += "<td>"+item.bairro+"</td>"
		cols += "<td>"+item.logradouro+"</td>"
		cols += "<td>"+item.numero+"</td>"
		cols += "<td>"+item.traje_pm+"</td>"
		cols += "<td>"+item.traje_civilvet+"</td>"
		cols += "<td>"+item.traje_ffaa+"</td>"
		cols+= '<td><button onclick="RemoveTableRowAu(this)" class="btn btn-danger" type="button"><span class="glyphicon glyphicon-remove-circle"></span></button>'+
		'<button type="button" onclick = "AlterRow(this)" class="btn btn-success" style="margin:4px;" data-toggle="modal" data-target="#myModal"><span class="glyphicon glyphicon-edit"></span></button>'+
		'<button type="button"  onclick = "EventoConvidar(this)" class="btn btn-warning" data-toggle="modal" data-target="#myModal2"><span class="glyphicon glyphicon-list-alt"></span></button></td>'
		newRow.append(cols)
		$("#eventos").append(newRow)
	};
	function atualiza(){
		$("#eventos tbody").empty()
		$.each(dadosIniciais.evento, function(i, item){
			adiciona(item);

		})
	}
	function limpa_formulário_cep() {
                // Limpa valores do formulário de cep.
		$("#endereco").val("");
		$("#bairro").val("");
		$("#cidade").val("");
		$("#uf").val("");
	}
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
	$("#cep").blur(function(){
		cep('');
	});
	$("#cepAlterar").blur(function(){
		cep('Alterar');
	});
	//cadastrarEvento
	$("#cadastrarE").on('click', function(){
		$('#formCadastrarEventos input').each (function(){
	  		$(this).css({"border" : "1px solid #ccc", "padding": "2px"});
  		})
		var flag = false;
		$('#formCadastrarEventos input').each (function(){
			if($(this).val()==null){
  				$(this).css({"border" : "1px solid #F00", "padding": "2px"});
  				flag=true
  			}
  		})
  		if(flag==true){
  			swal("Ops....", "Preencha corretamente todos os Campos.", "error")
  		}else{
  			var evento = {}
  			var evento = $.grep(dadosIniciais.evento, function(n,i){
  				return n.nome == $("#nome").val();
  			})
  			if(evento[0] == null){
  				var data={}
	  			data.nome = $("#nome").val();
	  			data.data = $("#data").val();
	  			data.hora = $("#horario").val();
	  			data.cep = $("#cep").val();
	  			data.uf = $("#uf").val();
	  			data.cidade = $("#cidade").val();
	  			data.logradouro = $("#logradouro").val();
	  			data.bairro = $("#bairro").val();
	  			data.numero = $("#numero").val();
	  			data.traje_pm = $("#pm").val();
	  			data.traje_civilvet = $("#civisVeteranos").val()
	  			data.traje_ffaa = $("#ffaa").val();
	  			$.ajax({
	  				type:'POST',
	  				contentType: 'application/json; charset=utf-8',
	  				url: '/cadastrarE',
	  				dataType: 'json',
	  				data: JSON.stringify(data),
	  				cache:false,
	  				success: function(response){
	  					if(response.message == "success"){
	  						swal("Sucesso!", "Evento Cadastrado com Sucesso!", "success");
	  						data.id = response.id;
	  						data.idUnidade = response.idUnidade;
	  						dadosIniciais.evento.push(data);
	  						atualiza()

	  					}else{
	  						swal("Ops.....!", response.message , "error");
	  					}
	  				}
  				})
  			}else{
  				swal("Ops...","Já existe um evento com este Nome!", "error")
  			}
  		}
	})
	$('#formCadastrarA select').each (function(){
			if($(this).val()==null){
  				$(this).css({"border" : "1px solid #F00", "padding": "2px"});
  				flag=true
  			}

  		})
	//alterar Evento
	$("#alterarEvento").on('click', function(){
		var flag = false;
		$('#formAlterarEventos input').each (function(){
	  		$(this).css({"border" : "1px solid #ccc", "padding": "2px"});
  		})
		$("#formAlterarEventos input").each(function(){
			if($(this).val()== ""){
				$(this).css({"border":"1px solid #F00", "padding": "2px"})
				flag = true;
			}
		})
		if(flag == false){
			var data = {}
			data.id = eventoid;
			data.nome = $("#nomeAlterar").val();
	  		data.data = $("#dataAlterar").val();
	  		data.hora = $("#horarioAlterar").val();
	  		data.cep = $("#cepAlterar").val();
	  		data.uf = $("#ufAlterar").val();
	  		data.cidade = $("#cidadeAlterar").val();
	  		data.logradouro = $("#logradouroAlterar").val();
	  		data.bairro = $("#bairroAlterar").val();
	  		data.numero = $("#numeroAlterar").val();
	  		data.traje_pm = $("#pmAlterar").val();
	  		data.traje_civilvet = $("#civisVeteranosAlterar").val()
	  		data.traje_ffaa = $("#ffaaAlterar").val();
			$.ajax({
				type: 'POST',
				contentType: 'application/json; charset=utf-8',
				url: '/alterarE',
				dataType:'json',
				data: JSON.stringify(data),
				success: function(response){
					if(response.message == "success"){
						swal("Sucesso!", "Alteração Efetuada!","success");
						$.each(dadosIniciais.evento, function(i, item){
							if(item.id == eventoid){
								item.nome = data.nome;
								item.data = data.data;
								item.hora = data.hora;
								item.cep = data.cep;
								item.uf = data.uf;
								item.cidade = data.cidade;
								item.logradouro = data.logradouro;
								item.bairro = data.bairro;
								item.numero = data.numero;
								item.traje_pm = data.traje_pm;
								item.traje_civilvet = data.traje_civilvet;
								item.traje_ffaa = data.traje_ffaa;
								atualiza()
							}
						})

						$('#myModal').modal('toggle');
						$('#formAlterarEventos').each(function(){
  							this.reset();
  						})
						
					}

				}

			})
		}else{
			swal("Ops....","Preencha corretamente os campos!","error");
		}

	})
	EventoConvidar = function(handler){
		var tr = $(handler).closest('tr')
		eventoidConvite = tr.find('td[data-id]').data('id')
		console.log(tr.find('td[data-id]').data('id'))

		var starCountRef = firebase.database().ref(eventoidConvite+'/convidados');
		starCountRef.on('value', function(snapshot) {
			var cont = 0;
			$("#confirmados tbody").empty()
			convidadosConfirmados = [];
			console.log(convidadosConfirmados);
			$.each(snapshot.val(), function (i, convidadosC) {
				cont+=1;
				var item = $.grep(dadosIniciais.autoridades, function(n, i){
						return n.id == convidadosC.teste;
					})
				convidadosConfirmados.push(item);
			   adicionaAutoridadesConfirmadas(cont, item[0]);
			});
		});

		
		
		$("#autoridadesC tbody").empty()
		$("#autoridades tbody").empty()
		$('#formConsultar').each(function(){
			this.reset();
		})
		$('#formConsultarConvidados').each(function(){
			this.reset();
		})
	}
	//alterRow
	AlterRow = function(handler){
		var tr = $(handler).closest('tr');
		var evento = $.grep(dadosIniciais.evento, function(n, i){
			return n.id == tr.find('td[data-id]').data('id');
		})
		$("#nomeAlterar").val(evento[0].nome);
	  	$("#dataAlterar").val(evento[0].data);
	  	$("#horarioAlterar").val(evento[0].hora);
	  	$("#cepAlterar").val(evento[0].cep);
	  	$("#ufAlterar").val(evento[0].uf);
	  	$("#cidadeAlterar").val(evento[0].cidade);
	  	$("#logradouroAlterar").val(evento[0].logradouro);
	  	$("#bairroAlterar").val(evento[0].bairro);
	  	$("#numeroAlterar").val(evento[0].numero);
	  	$("#pmAlterar").val(evento[0].traje_pm);
	  	$("#civisVeteranosAlterar").val(evento[0].traje_civilvet)
	  	$("#ffaaAlterar").val(evento[0].traje_ffaa);
	  	eventoid = tr.find('td[data-id]').data('id');
	}
	//excluir Evento
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
						type:'POST',
						contentType: 'application/json; charset=utf-8',
						url: '/excluirE',
						dataType: 'json',
						data: JSON.stringify(data),
						cache: false,
						success: function(data) {
							if(data.message=="success"){
								swal("Sucesso!","O Evento foi Excluido!","success");
								dadosIniciais.evento = $.grep(dadosIniciais.evento, function(n,i){
									return n.id != tr.find('td[data-id]').data('id');
								})
								tr.fadeOut(400, function(){ 
								tr.remove(); 
								}); 
							}
						}
					})
				}else {
					swal("Cancelled", "Seus dados estão Seguro!", "error");
				} 
			}
		)
    }
    function adicionaAutoridades(i, item){
		var newRow = $("<tr>");
		var cols="";
		cols += "<td><input type='checkbox' name='convite' value='"+item.id+"'/></td>"
		cols+="<td data-id = '"+item.id+"' >"+i+"</td>";
		cols+="<td data-nome = '"+item.nome+"'>"+item.nome+"</td>"
		cols+="<td data-titulo = '"+item.titulo+"'>"+item.titulo+"</td>"
		cols+="<td data-partido = '"+item.partido+"'>"+item.partido+"</td>"
		cols+="<td data-cidade = '"+item.cidade+"'>"+item.cidade+"</td>"
		cols+="<td data-ultima_atualizacao = '"+item.ultima_atualizacao+"'>"+item.ultima_atualizacao+"</td>"
		
		var nomeUnidade = $.grep(dadosIniciais.unidade, function(n, i){
			return n.id == item.idUnidade
		});
		cols+="<td data-unidade = '"+item.idUnidade+"'>"+(nomeUnidade[0]==null ? "" : nomeUnidade[0].nome)+"</td>"
		newRow.append(cols)
		$("#autoridades").append(newRow)
	};
    function adicionaAutoridadesConfirmadas(i, item){
		var newRow = $("<tr>");
		var cols="";

		cols+="<td data-id = '"+item.id+"' >"+i+"</td>";
		cols+="<td data-nome = '"+item.nome+"'>"+item.nome+"</td>"
		cols+="<td data-titulo = '"+item.titulo+"'>"+item.titulo+"</td>"
		cols+="<td data-partido = '"+item.partido+"'>"+item.partido+"</td>"
		cols+="<td data-cidade = '"+item.cidade+"'>"+item.cidade+"</td>"
		cols+="<td data-ultima_atualizacao = '"+item.ultima_atualizacao+"'>"+item.ultima_atualizacao+"</td>"
		
		var nomeUnidade = $.grep(dadosIniciais.unidade, function(n, i){
			return n.id == item.idUnidade
		});
		cols+="<td data-unidade = '"+item.idUnidade+"'>"+(nomeUnidade[0]==null ? "" : nomeUnidade[0].nome)+"</td>"
		newRow.append(cols)
		$("#confirmados").append(newRow)
	};
	function adicionaAutoridadesC(i, item){
		var newRow = $("<tr>");
		var cols="";
		cols += "<td><input type='checkbox' name='conviteC' value='"+item.id+"'/></td>"
		cols+="<td data-id = '"+item.id+"' >"+i+"</td>";
		cols+="<td data-nome = '"+item.nome+"'>"+item.nome+"</td>"
		cols+="<td data-titulo = '"+item.titulo+"'>"+item.titulo+"</td>"
		cols+="<td data-partido = '"+item.partido+"'>"+item.partido+"</td>"
		cols+="<td data-cidade = '"+item.cidade+"'>"+item.cidade+"</td>"
		cols+="<td data-ultima_atualizacao = '"+item.ultima_atualizacao+"'>"+item.ultima_atualizacao+"</td>"
		
		var nomeUnidade = $.grep(dadosIniciais.unidade, function(n, i){
			return n.id == item.idUnidade
		});
		cols+="<td data-unidade = '"+item.idUnidade+"'>"+(nomeUnidade[0]==null ? "" : nomeUnidade[0].nome)+"</td>"
		newRow.append(cols)
		$("#autoridadesC").append(newRow)
	};
	//change checkbox
	$("#todos").change(function() {
		if($("#todos").is(":checked")) {
			$("input[type=checkbox][name='convite']").each(function(){
			    $(this).prop('checked', true);
			});
		}else{
			$("input[type=checkbox][name='convite']").each(function(){
			    $(this).prop('checked', false);
			});	
		}
	})
	$("#todosC").change(function(){
		if($("#todosC").is(":checked")) {
			$("input[type=checkbox][name='conviteC']").each(function(){
			    $(this).prop('checked', true);
			});
		}else{
			$("input[type=checkbox][name='conviteC']").each(function(){
			    $(this).prop('checked', false);
			});	
		}
	})
	$("#pdfConvitesQR").on('click', function(){
		data = {}
		data.convidados = []
		$("input[type=checkbox][name='conviteC']:checked").each(function(){
		    data.convidados.push($(this).val());
		});
		if(data.convidados[0] != null){
			data.evento = eventoidConvite;
			swal({
				title: "Esse Processo Pode demorar cerca de 5 minutos.",
				type: "warning",
				showCancelButton: true,
				closeOnConfirm: false,
				showLoaderOnConfirm: true,
			}, function(){	
				$.ajax({
					type:'post',
					contentType: "application/json; charset=utf-8",
					url: '/pdfConvitesQR',
					data: JSON.stringify(data),
					dataType: "json",
					success: function(data){
						swal("Sucesso!","Convites Gerados com Exito!", "success");
						function base64ToArrayBuffer(base64) {
						    var binary_string =  window.atob(base64);
						    var len = binary_string.length;
						    var bytes = new Uint8Array( len );
						    for (var i = 0; i < len; i++)        {
						        bytes[i] = binary_string.charCodeAt(i);
						    }
						    return bytes.buffer;
						}
						var pdfArray = base64ToArrayBuffer(data.pdf)
						var blob = new Blob([pdfArray], {type: "application/pdf"});
						var blobUrl = URL.createObjectURL(blob);
						window.open(blobUrl);
					}
				})
			})
		}else{
			swal("Error....","Selecione pelo menos um Convidado!","error");
		}
		
	})
	$("#pdfConvites").on('click', function(){
		data = {}
		data.convidados = []
		$("input[type=checkbox][name='conviteC']:checked").each(function(){
		    data.convidados.push({"id" : $(this).val()});
		});
		data.evento = eventoidConvite;
		swal({
			title: "Esse Processo Pode demorar cerca de 5 minutos.",
			type: "warning",
			showCancelButton: true,
			closeOnConfirm: false,
			showLoaderOnConfirm: true,
		}, function(){	
			$.ajax({
				type:'post',
				contentType: "application/json; charset=utf-8",
				url: '/pdfConvites',
				data: JSON.stringify(data),
				dataType: "json",
				success: function(data){
					swal("Sucesso!","Convites Gerados com Exito!", "success");
					function base64ToArrayBuffer(base64) {
					    var binary_string =  window.atob(base64);
					    var len = binary_string.length;
					    var bytes = new Uint8Array( len );
					    for (var i = 0; i < len; i++)        {
					        bytes[i] = binary_string.charCodeAt(i);
					    }
					    return bytes.buffer;
					}
					var pdfArray = base64ToArrayBuffer(data.pdf)
					var blob = new Blob([pdfArray], {type: "application/pdf"});
					var blobUrl = URL.createObjectURL(blob);
					window.open(blobUrl);
				}
			})
		})
	})
	$("#pdfListaConvidados").on('click', function(){
		data = {}
		data.convidados = []
		$("input[type=checkbox][name='conviteC']:checked").each(function(){
		    data.convidados.push($(this).val());
		});
		data.evento = eventoidConvite;
		swal({
			title: "Esse Processo Pode demorar cerca de 5 minutos.",
			type: "warning",
			showCancelButton: true,
			closeOnConfirm: false,
			showLoaderOnConfirm: true,
		}, function(){	
			$.ajax({
				type:'post',
				contentType: "application/json; charset=utf-8",
				url: '/pdfLista',
				data: JSON.stringify(data),
				dataType: "json",
				success: function(data){
					swal("Sucesso!","Convites Gerados com Exito!", "success");
					function base64ToArrayBuffer(base64) {
					    var binary_string =  window.atob(base64);
					    var len = binary_string.length;
					    var bytes = new Uint8Array( len );
					    for (var i = 0; i < len; i++)        {
					        bytes[i] = binary_string.charCodeAt(i);
					    }
					    return bytes.buffer;
					}
					var pdfArray = base64ToArrayBuffer(data.pdf)
					var blob = new Blob([pdfArray], {type: "application/pdf"});
					var blobUrl = URL.createObjectURL(blob);
					window.open(blobUrl);
				}
			})
		})
	})
	function monthDiff(d1, d2) {
	    var months;
	    months = (d2.getFullYear() - d1.getFullYear()) * 12;
	    months -= d1.getMonth() + 1;
	    months += d2.getMonth();
	    return months <= 0 ? 0 : months;
	}
	function atualizaAutoridades(){
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
				adicionaAutoridades(i, item);
		})
	}
	$("#pesquisar").on("click", function(){
		atualizaAutoridades()
	})

	function atualizaAutoridadesC(){
		$("#autoridadesC tbody").empty()
		var valor = 0;
		var convidados = $.grep(dadosIniciais.convidados, function(n, i){
			return n.idEvento == eventoidConvite;
		})
		var autoridadesConvidadas=[];
		$.each(convidados, function(i, item){
			var teste = $.grep(dadosIniciais.autoridades, function(n,i){
			 return n.id == item.idAutoridade
			})
			autoridadesConvidadas.push(teste[0])
		})
		$.each($.grep(autoridadesConvidadas, function(n, i){
			if($("#selectBatalhaoCC").val()!="" && $("#selectMesC").val()!=""){
				var dia = n.ultima_atualizacao.split("/");
				var valor = monthDiff(
				    new Date(dia[2], dia[1], dia[0]), // November 4th, 2008
				    new Date(date[2], date[1], date[0])  // March 12th, 2010
				);
				return n.cidade.toUpperCase().indexOf($("#cidadeConsultarC").val().toUpperCase()) >= 0 && n.nome.toUpperCase().indexOf($("#nomeConsultarC").val().toUpperCase()) >= 0 && n.idUnidade == $("#selectBatalhaoCC").val() && valor == $("#selectMesC").val();
				
			}else if($("#selectBatalhaoCC").val()!="" && $("#selectMesC").val()==""){
				return n.cidade.toUpperCase().indexOf($("#cidadeConsultarC").val().toUpperCase()) >= 0 && n.nome.toUpperCase().indexOf($("#nomeConsultarC").val().toUpperCase()) >= 0 && n.idUnidade == $("#selectBatalhaoCC").val() 
			}else if($("#selectBatalhaoCC").val()=="" && $("#selectMesC").val()!=""){
				var dia = n.ultima_atualizacao.split("/");
				var dia = n.ultima_atualizacao.split("/");
				var valor = monthDiff(
				    new Date(dia[2], dia[1], dia[0]), // November 4th, 2008
				    new Date(date[2], date[1], date[0])  // March 12th, 2010
				);
				return n.cidade.toUpperCase().indexOf($("#cidadeConsultarC").val().toUpperCase()) >= 0 && n.nome.toUpperCase().indexOf($("#nomeConsultarC").val().toUpperCase()) >= 0 && valor == $("#selectMesC").val();
				
			}else{
				return n.cidade.toUpperCase().indexOf($("#cidadeConsultarC").val().toUpperCase()) >= 0 && n.nome.toUpperCase().indexOf($("#nomeConsultarC").val().toUpperCase()) >= 0;
			}

		}),function(i, item){
				adicionaAutoridadesC(i, item);
		})
		
		
	}

	$("#pesquisarC").on("click", function(){
		atualizaAutoridadesC()
	})
	$("#teste").on('click',function(){
		var data = {}
		data.convidados =[]
		$("input[type=checkbox][name='convite']:checked").each(function(){
		    data.convidados.push({"id" : $(this).val()});
		});
		data.evento = eventoidConvite;
		swal({
			title: "Confirme para realizar o Cadastro.",
			type: "info",
			showCancelButton: true,
			closeOnConfirm: false,
			showLoaderOnConfirm: true,
		}, function(){		
			$.ajax({
				type: 'POST',
				contentType: 'application/json; charset=utf-8',
				url: '/convidarA',
				dataType:'json',
				data: JSON.stringify(data),
				cache: false,
				success: function(response){
					if(response.message == "success"){
						swal("Sucesso!","Autoridades Convidadas com Sucesso!", "success");
						dadosIniciais.convidados = response.convidados;
					}
				}
			})
		})
	})
});