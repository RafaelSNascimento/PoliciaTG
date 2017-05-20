$(function(){
	var reader = new FileReader();
	var base64=""
	var id= ""
	$.ajax({
		type: 'GET',
		contentType: 'application/json; charset=utf-8',
		url: '/dadosBatalhao',
		cache:false,
		success(data){
			if(data.result=='success'){
				$.each(data.batalhao, function(i, item){
					$("#selectBAlterar").append('<option value="'+item.id+'">'+item.nome+'</option>')
				});
				id = data.usuario[0].id
				$("#nomeAlterar").val(data.usuario[0].nome)
				$("#usuarioAlterar").val(data.usuario[0].usuario)
				$("#senhaAlterar").val(data.usuario[0].senha)
				$(".img").attr('src',data.usuario[0].img)
				base64 = data.usuario[0].img;
				$("#selectBAlterar").val(data.usuario[0].idUnidade)
			}
		}
	});
	$("#imgUpload").change(function(evt) {
		files = evt.target.files; // FileList object
		if(files[0].type!='image/jpg' && files[0].type!='image/jpeg'){
			alert("Selecione uma imagem com o formato JPG!");
			$("#imgUpload").val('');
		}else{
			reader.onload = function (evt){
				$('.img').attr('src', evt.target.result);
				base64 = evt.target.result;
	    	};
			if (reader.readAsDataURL) {
				reader.readAsDataURL(files[0]); 
			}
			else if (reader.readAsDataurl) {
				reader.readAsDataurl(files[0]);
			}
		}
	});
	$("#alterar").click(function(){
		if($("#nomeAlterar").val()!=null && $("#usuarioAlterar").val()!=null && $("#senhaAlterar").val()!=null && base64!=""  && $("#selectBAlterar").val()!=null){
			var data = {}
			data.id = id
			data.nome = $("#nomeAlterar").val()
			data.usuario = $("#usuarioAlterar").val()
			data.senha = $("#senhaAlterar").val()
			data.idUnidade = $("#selectBAlterar").val()
			data.img = base64;
			$.ajax({
				type: 'POST',
				contentType: 'application/json; charset=utf-8',
				url:'/alterarU',
				data:JSON.stringify(data),
				cache:false,
				success: function(data){
					if(data.result == 'success'){
						swal("Bom Trabalho!", "Usuario Alterado com Sucesso","success");
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