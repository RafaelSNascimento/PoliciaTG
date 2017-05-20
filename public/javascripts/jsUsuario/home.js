$(function(){
	var reader = new FileReader();
	var base64=""
	var id= ""
	refresh()
	var dadosIniciais={}
	var starCountRef = []
	try{
		if(firebase.database().ref()){
			starCountRef =  firebase.database().ref();
			starCountRef.on('value', function(snapshot) {
				firebaseDates = snapshot.val();
				preencheEventoInfo();
			}) 
		}
	}catch(err){
		console.log(err);
	}
	var firebaseDates = [];
	var eventoInfo = [];
	
	var preencheEventoInfo = function(){
		var contador = 0;
		$("#confirmados tbody").empty()
		eventoInfo = [];
		$.each(dadosIniciais.eventos,function(w, evento){
			$.each(firebaseDates,function(z, fire){
				console.log(firebaseDates);
				if(z == evento.id){
					var cont = 0;
					$.each(fire.convidados, function(x, y){
						cont +=1;
					})
					eventoInfo.push({'id':evento.id,'nome':evento.nome,'data':evento.data,'confirmados':cont,'convidados':evento.total});

					
					eventoStatus(contador, eventoInfo[contador]);
					contador +=1;
					
				}
			})
		})

	}
	function eventoStatus(i, item){

		var newRow = $("<tr>");
		var cols="";
		console.log(item);
		cols+="<td>"+i+"</td>";
		cols+="<td>"+item.nome+"</td>"
		cols+="<td>"+item.data+"</td>"
		cols+="<td>"+item.confirmados+"</td>"
		cols+="<td>"+item.convidados+"</td>"
		newRow.append(cols)
		$("#confirmados").append(newRow)
	};
	$("#imgUpload").change(function(evt) {
		files = evt.target.files; // FileList object

		reader.onload = function (evt){
			$('.imgAlterar').attr('src', evt.target.result);
			console.log("chamou")
    	};
		if (reader.readAsDataURL) {
			reader.readAsDataURL(files[0]); 
		}
		else if (reader.readAsDataurl) {
			reader.readAsDataurl(files[0]);
		}
	
	});
	var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
	date = date.split(" ")
	date = date[0].replace(/-/gi,"/").split("/")
	date = date[2] +"/"+date[1]+"/"+date[0];
	date = date.split("/")
	$.each($.grep(dataNew.autoridades, function(n, i){
		var dia = n.nascimento.split("/");
		var mes = dia[1];
		dia = dia[0];
		return dia == date[0] && mes == date[1];
	}),function(i, item){
			adiciona(i, item);
	})
	function adiciona(i, item){
		var newRow = $("<tr>");
		var cols="";
		var telefone = "";
		var email = "";
		var emailMessage = " "
		var telefoneMessage = " "

		cols+="<td data-id = '"+item.id+"'' >"+i+"</td>";
		cols+="<td data-nome = '"+item.nome+"''>"+item.nome+"</td>"
		cols+="<td data-apelido = '"+item.apelido+"''>"+item.apelido+"</td>"
		cols+="<td data-partido = '"+item.partido+"''>"+item.partido+"</td>"
		var nomeUnidade = $.grep(dataNew.unidade, function(n, i){
			return n.id == item.unidade
		});
		cols+="<td data-unidade = '"+item.unidade+"'>"+(nomeUnidade[0]==null ? "" : nomeUnidade[0].nome)+"</td>"
		cols+="<td data-ultima_atualizacao = '"+item.ultima_atualizacao+"'>"+item.ultima_atualizacao+"</td>"
		cols+="<td data-empresa = '"+item.empresa+"'>"+item.empresa+"</td>"
		cols+="<td data-funcao = '"+item.funcao+"'>"+item.funcao+"</td>"
		cols+="<td data-nascimento = '"+item.nascimento+"' class = 'success'>"+item.nascimento+"</td>"

		newRow.append(cols)
		$("#autoridades").append(newRow)
	};
	function refresh(){
		$.ajax({
		type: 'GET',
		contentType: 'application/json; charset=utf-8',
		url: '/dadosBatalhao',
		cache:false,
		success(data){
			if(data.result=='success'){

				dadosIniciais = data;
				preencheEventoInfo();
				id = data.usuario[0].id;
				if(data.usuario[0].role == 1 && !$(".userAdmin").length){
					$(".homeMenu").append("<li class='userAdmin'><a href='/crudusuario'> Usuarios <span class='glyphicon glyphicon-user'></span></a></li>")
				}
				$(".modal-title").empty();
				$(".modal-title").append(data.usuario[0].nome);
				$("#imgUsuario").attr('src',data.usuario[0].img)
				$("#nomeUsuario").empty();
				$("#nomeUsuario").append(data.usuario[0].nome)
				//$("#nomeAlterar").val(data.usuario[0].nome)
				//$("#usuarioAlterar").val(data.usuario[0].usuario)
				//$("#senhaAlterar").val(data.usuario[0].senha)
				//$(".imgAlterar").attr('src',data.usuario[0].img);
				//$("#selectBAlterar").val(data.usuario[0].idUnidade)
			}
		}
	});
	}
	$("#modal").click(function(){
		$("#selectBAlterar").empty()
		$.each(dadosIniciais.batalhao, function(i, item){
			$("#selectBAlterar").append('<option value="'+item.id+'">'+item.nome+'</option>')
		});
		$("#nomeAlterar").val(dadosIniciais.usuario[0].nome);
		$("#usuarioAlterar").val(dadosIniciais.usuario[0].usuario);
		$("#senhaAlterar").val(dadosIniciais.usuario[0].senha);
		$("#selectBAlterar").val(dadosIniciais.usuario[0].idUnidade);
		$(".imgAlterar").attr('src',dadosIniciais.usuario[0].img);
	});
	$("#excluir").click(function(){
		swal({
		title: "Você tem certeza?",
		text: "Não é possivel recuperar os dados após a exclusão!",
		type: "warning",
		showCancelButton: true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "Sim, Exclua!",
		cancelButtonText: "Não, Cancele!",
		closeOnConfirm: false,
		closeOnCancel: false },
		function(isConfirm){
			if (isConfirm) {
				$.ajax({
					type: 'POST',
					contentType: 'application/json; charset=utf-8',
					url: '/deletesingleuser',
					dataType: "json",
					cache: false,
					success: function(response) {
						if (response.result == 'success') {
				  			swal("Deletado!", "O Usuario "+dadosIniciais.usuario[0].nome+" foi Deletado com Sucesso!", "success");
				  			$("#form").attr('action','/deslogaruc')
          					$("#form").submit();
		  				}else {
							swal("Oops...", response.message, "error");
		  				}
					}
				});	
			}else {
				swal("Cancelado", "Seu usuario está Seguro!", "error");
			} 
		});
	});
	$("#alterar").click(function(){
		if($("#nomeAlterar").val()!="" && $("#usuarioAlterar").val()!="" && $("#senhaAlterar").val()!=""  && $("#selectBAlterar").val()!=null){
			var data = {}
			data.id = id
			data.nome = $("#nomeAlterar").val()
			data.usuario = $("#usuarioAlterar").val()
			data.senha = $("#senhaAlterar").val()
			data.idUnidade = $("#selectBAlterar").val()
			data.img = $('.imgAlterar').prop('src');

			console.log($('.imgAlterar').prop('src'))
			$.ajax({
				type: 'POST',
				contentType: 'application/json; charset=utf-8',
				url:'/alterarU',
				data:JSON.stringify(data),
				cache:false,
				success: function(data){
					if(data.result == 'success'){
						swal("Bom Trabalho!", "Usuario Alterado com Sucesso","success");
						$("#imgUsuario").attr('src', $('.imgAlterar').prop('src'));
							dadosIniciais.usuario[0].nome = $("#nomeAlterar").val()
							dadosIniciais.usuario[0].usuario = $("#usuarioAlterar").val()
							dadosIniciais.usuario[0].senha = $("#senhaAlterar").val()
							dadosIniciais.usuario[0].idUnidade = $("#selectBAlterar").val()
							dadosIniciais.usuario[0].img = $('.imgAlterar').prop('src');
						$("#nomeUsuario").empty()
						$("#nomeUsuario").append($("#nomeAlterar").val())
						$('#formAlterar').each (function(){
  							this.reset();
  						})
					}else{
						swal("Oops...",data.message,"error");
					}
				}
			});
		}else{
			swal("Oops...", "Preencha corretamente todos os campos!","error");
		}
	});
});