$(function(){
	var reader = new FileReader();
	var base64=""
	$.ajax({
		type: 'GET',
		contentType: 'application/json; charset=utf-8',
		url: '/dadosBatalhaoAdmin',
		cache:false,
		success(data){
			if(data.result=='success'){
				$.each(data.batalhao, function(i, item){
					$("#selectBatalhao").append('<option value="'+item.id+'">'+item.nome+'</option>')
				});
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
	$("#cadastrar").click(function(){
		if($("#nome").val()!=null && $("#usuario").val()!=null && $("#senha").val()!=null && base64!=""  && $("#selectBatalhao").val()!=null){
			var data = {}
			data.nome = $("#nome").val()
			data.usuario = $("#usuario").val()
			data.senha = $("#senha").val()
			data.batalhao = $("#selectBatalhao").val()
			data.img = base64;
			$.ajax({
				type: 'POST',
				contentType: 'application/json; charset=utf-8',
				url:'/cadastrarU',
				data:JSON.stringify(data),
				cache:false,
				success: function(data){
					if(data.result == 'success'){
						swal("Bom Trabalho!", "Usuario Cadastrado com Sucesso","success");
					}else{
						swal("Oops...",data.message,"error");
					}
				}
			});
		}else{
			
		}
	});
});