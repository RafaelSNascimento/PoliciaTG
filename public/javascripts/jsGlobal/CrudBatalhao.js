$(function() {
	$("#cep").mask('00000-000');
	$("#cepAlterar").mask('00000-000');
	$(".cb").hide("fast");
	$(".ab").hide("fast");
	$(".db").hide("fast");
	$(".alterar").hide("fast");
	var base64 = "";
	var base64Alterar = "";
	var reader = new FileReader();

	refresh();
	refreshRelacao()

	$(".nav a").on("click", function() {
		$(".nav").find(".active").removeClass("active");
		$(this).parent().addClass("active");
	});

	function refreshRelacao(id) {
		$(".table").empty();
		$(".table").append('<thead><tr class="info "><th  class="text-center">ID</th><th class="text-center">Nome do Batalhão</th><th  class="text-center">Cidade</th><th  class="text-center">Deletar</th></thead>	')
		$(".table").append("<tbody>")
		$.each($.grep(dadosIniciais.relacao, function(n, i) {
			return n.idUnidade == id;
		}), function(i, item) {
			var newRow = $("<tr>");
			var cols = "";
			cols += '<td data-id="' + item.id + '">' + i + '</td>'
			$.each(dadosIniciais.batalhao, function(i, item1) {
				console.log("e")
				if (item1.id == item.idUnidade) {
					cols += '<td data-unidade="' + item1.nome + '">' + item1.nome + '</td>'
					return false
				}
			})
			$.each(dadosIniciais.cidade, function(i, item1) {
				if (item1.id == item.idCidade) {
					cols += '<td data-cidade="' + item1.nome + '">' + item1.nome + '</td>'
					return false
				}
			})
			cols += '<td><button onclick="RemoveTableRow(this)" class="btn btn-danger" type="button">Excluir</button></td>'
			newRow.append(cols);
			$(".table").append(newRow);
		})
		$(".table").append("</tbody>")
	}
	///excluir Relação
	RemoveTableRow = function(handler) {
		var tr = $(handler).closest('tr');
		console.log(tr.find('td[data-unidade]').data('unidade'))
		console.log(tr.find('td[data-cidade]').data('cidade'))
		var data = {};
		data.id = tr.find('td[data-id]').data('id');
		swal({
				title: "Você tem certeza?",
				text: "Não é possivel recuperar os dados após a exclusão!",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Yes, delete it!",
				cancelButtonText: "No, cancel plx!",
				closeOnConfirm: false,
				closeOnCancel: false
			},
			function(isConfirm) {
				if (isConfirm) {
					$.ajax({
						type: 'POST',
						contentType: 'application/json; charset=utf-8',
						url: '/excluirRelacao',
						dataType: "json",
						data: JSON.stringify(data),
						cache: false,
						success: function(data) {
							var response = data;
							if (response.result == 'ok') {
								swal("Deleted!", "Seus dados foram Excluido!.", "success");
								dadosIniciais.relacao = $.grep(dadosIniciais.relacao, function(n, i) {
									return n.id != tr.find('td[data-id]').data('id');
								})
								tr.fadeOut(400, function() {
									tr.remove();
								});

							} else {
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

	function refresh() {
		$("#selectAlterar").empty();
		$("#selectBatalhao").empty();
		$("#deletarBatalhao").empty();
		$("#selectCidade").append('<option disabled selected value> -- Selecione uma Opção -- </option>')
		$("#selectAlterar").append('<option disabled selected value> -- Selecione uma Opção -- </option>')
		$("#selectBatalhao").append('<option disabled selected value> -- Selecione uma Opção -- </option>')
		$("#deletarBatalhao").append('<option disabled selected value> -- Selecione uma Opção -- </option>')
		$.each(dadosIniciais.batalhao, function(i, item) {
			console.log(item)
			$("#selectAlterar").append('<option value="' + item.id + '">' + item.nome + '</option>')
			$("#selectBatalhao").append('<option value="' + item.id + '">' + item.nome + '</option>')
			$("#deletarBatalhao").append('<option value="' + item.id + '">' + item.nome + '</option>')

		});
		$.each(dadosIniciais.cidade, function(i, item) {
			$("#selectCidade").append('<option value="' + item.id + '">' + item.nome + '</option>')
		});
	}
	//pager
	$("a").click(function(event) {
		var link = $(this);
		if (typeof(link.attr("id")) != "undefined") {
			if (link.attr("id").match("cb")) {
				$(".b").hide("slow");
				$(".cb").show("slow");
				$(".ab").hide("slow");
				$(".db").hide("slow");
			} else if (link.attr("id").match("ab")) {
				$(".cb").hide("slow");
				$(".b").hide("slow");
				$(".ab").show("slow");
				$(".db").hide("slow");
			} else if (link.attr("id").match("db")) {
				$(".cb").hide("slow");
				$(".b").hide("slow");
				$(".ab").hide("slow");
				$(".db").show("slow");
			} else if (link.attr("id").match("b")) {
				$(".cb").hide("slow");
				$(".b").show("slow");
				$(".ab").hide("slow");
				$(".db").hide("slow");
			}
			event.preventDefault();
		}
	});
	$("#imgUpload").change(function(evt) {
		files = evt.target.files; // FileList object

		reader.onload = function(evt) {
			$('.img').attr('src', evt.target.result);
			base64 = evt.target.result;
		};
		if (reader.readAsDataURL) {
			reader.readAsDataURL(files[0]);
		} else if (reader.readAsDataurl) {
			reader.readAsDataurl(files[0]);
		}
	});

	function limpa_formulário_cep() {
		// Limpa valores do formulário de cep.
		$("#endereco").val("");
		$("#bairro").val("");
		$("#cidade").val("");
		$("#uf").val("");
	}
	// Registra o evento blur do campo "cep", ou seja, quando o usuário sair do campo "cep" faremos a consulta dos dados
	$("#cep").blur(function() {
		cep('');
	});
	$("#cepAlterar").blur(function() {
		cep('Alterar');
	})

	function cep(fun) {
		//Nova variável "cep" somente com dígitos.
		var cep = $("#cep" + fun).val().replace(/\D/g, '');
		//Verifica se campo cep possui valor informado.
		if (cep != "") {
			//Expressão regular para validar o CEP.
			var validacep = /^[0-9]{8}$/;
			//Valida o formato do CEP.
			if (validacep.test(cep)) {
				//Preenche os campos com "..." enquanto consulta webservice.
				$("#logradouro" + fun).val("...");
				$("#bairro" + fun).val("...");
				$("#cidade" + fun).val("...");
				$("#uf" + fun).val("...");
				$.getJSON("//viacep.com.br/ws/" + cep + "/json/?callback=?", function(dados) {
					if (!("erro" in dados)) {
						//Atualiza os campos com os valores da consulta.
						$("#logradouro" + fun).val(dados.logradouro);
						$("#bairro" + fun).val(dados.bairro);
						$("#cidade" + fun).val(dados.localidade);
						$("#uf" + fun).val(dados.uf);
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
	//Cadastrar Batalhão
	$('#cadastrarB').click(function(e) {
		var data = {};
		var string;
		var flag = false;
		$('#formCadastrarB input').each(function() {
			if ($(this).val() == "") {
				$(this).css({
					"border": "1px solid #F00",
					"padding": "2px"
				});
				flag = true;
			}
		})
		if (flag == false) {
			data.nome = $('#nome').val();
			data.comandante = $('#comandante').val();
			data.genero = $('#selectGenero').val();
			data.cep = $('#cep').val();
			data.uf = $('#uf').val();
			data.nomeExtenso = $('#nomeExtenso').val();
			data.cidade = $('#cidade').val();
			data.bairro = $('#bairro').val();
			data.logradouro = $('#logradouro').val();
			data.brasao = base64;
			swal({
				title: "Confirme para realizar o Cadastro.",
				type: "info",
				showCancelButton: true,
				closeOnConfirm: false,
				showLoaderOnConfirm: true,
			}, function() {
				$.ajax({
					type: 'POST',
					contentType: 'application/json; charset=utf-8',
					url: '/cadastrarB',
					dataType: "json",
					data: JSON.stringify(data),
					cache: false,
					success: function(data) {
						var response = data;
						if (response.result == 'ok') {
							swal("Bom Trabalho!", "Batalhão Cadastrado com Sucesso", "success");
							dadosIniciais.batalhao.push(response.batalhao[0]);
							$('#formCadastrarB').each(function() {
								this.reset();
							})
							$(".img").attr('src', "/images/noBrasao.png")
							base64 = ""
							refresh();
						} else {
							swal("Oops...", response.message, "error")
						}
					}
				});
			})
		} else {
			var invalid = "Preencha corretamente os campos:\n";
			if ($('#nome').val() == "") invalid += "- Nome \n";
			if ($('#comandante').val() == "") invalid += "- Comandante \n";
			if ($('#cep').val() == "") invalid += "- Cep \n";
			if ($('#uf').val() == "") invalid += "- Uf \n";
			if ($('#nomeExtenso').val() == "") invalid += "- Nome por Extenso \n";
			if ($('#cidade').val() == "") invalid += "- Cidade \n";
			if ($('#bairro').val() == "") invalid += "- Bairro \n";
			if ($('#logradouro').val() == "") invalid += "- Logradouro \n";
			if (base64 == "") invalid += "- Brasão \n";
			swal("Oops...", invalid, "error")
		}
	});

	//Alterar Batalhão
	$("#selectAlterar").change(function() {
		$.each(dadosIniciais.batalhao, function(i, item) {
			if (item.id == $('#selectAlterar').val()) {
				$(".alterar").show("slow");
				$('#nomeAlterar').val(item.nome);
				$('#comandanteAlterar').val(item.comandante);
				$('#selectGeneroA').val(item.genero);
				$('#cepAlterar').val(item.cep);
				$('#ufAlterar').val(item.uf);
				$('#nomeExtensoAlterar').val(item.nome_extenso);
				$('#cidadeAlterar').val(item.cidade);
				$('#logradouroAlterar').val(item.logradouro);
				$('#bairroAlterar').val(item.bairro);
				$('.imgLoad').attr('src', item.brasao);
				base64Alterar = item.brasao;
			}
		});
	});
	$('#alterarB').click(function(e) {
		var data = {};
		var string;
		if ($('#nomeAlterar').val() != "" && $('#comandanteAlterar').val() != "" && $('#cepAlterar').val() != "" && $('#ufAlterar').val() != "" && $('#cidadeAlterar').val() != "" && $('#bairroAlterar').val() != "" && $('#nomeExtensoAlterar').val() != "" && $('#logradouroAlterar').val() != "" && base64Alterar != "") {
			data.id = $('#selectAlterar').val();
			data.nome = $('#nomeAlterar').val();
			data.comandante = $('#comandanteAlterar').val();
			data.genero = $('#selectGeneroA').val();
			data.cep = $('#cepAlterar').val();
			data.uf = $('#ufAlterar').val();
			data.nomeExtenso = $('#nomeExtensoAlterar').val();
			data.cidade = $('#cidadeAlterar').val();
			data.bairro = $('#bairroAlterar').val();
			data.logradouro = $('#logradouroAlterar').val();
			data.brasao = base64Alterar;
			$.ajax({
				type: 'POST',
				contentType: 'application/json; charset=utf-8',
				url: '/alterarB',
				dataType: "json",
				data: JSON.stringify(data),
				cache: false,
				success: function(data) {
					var response = data;
					if (response.result == 'ok') {
						swal("Bom Trabalho!", "Batalhão Alterado com Sucesso!", "success")
						$.each(dadosIniciais.batalhao, function(i, item) {
							if (item.id == $('#selectAlterar').val()) {
								$.each(dadosIniciais.relacao, function(i, item2) {
									if (item2.unidade == item.nome) {
										item2.unidade = $('#nomeAlterar').val();
									}
								})
								item.nome_extenso = $('#nomeExtensoAlterar').val();
								item.nome = $('#nomeAlterar').val();
								item.comandante = $('#comandanteAlterar').val();
								item.genero = $('#selectGeneroA').val();
								item.cep = $('#cepAlterar').val();
								item.uf = $('#ufAlterar').val();
								item.cidade = $('#cidadeAlterar').val();
								item.bairro = $('#bairroAlterar').val();
								item.logradouro = $('#logradouroAlterar').val();
								item.brasao = base64Alterar;
								$('#formAlterar').each(function() {
									this.reset();
									$(".imgLoad").attr('src', "/images/noBrasao.png")
									base64Alterar = ""
								});
								refresh();
								refreshRelacao();
							}
						});
					} else {
						swal("Oops...", response.message, "error");
					}
				}
			});
		} else {
			var invalid = "Preencha corretamente os campos:\n ";
			if ($('#nomeAlterar').val() == "") invalid += "- Nome \n";
			if ($('#comandanteAlterar').val() == "") invalid += "- comandante \n";
			if ($('#selectGeneroA').val() == "") invalid += "- Genero \n";
			if ($('#cepAlterar').val() == "") invalid += "- cep \n";
			if ($('#ufAlterar').val() == "") invalid += "- uf \n";
			if ($('#nomeExtensoAlterar').val() == "") invalid += "- Nome por Extenso \n";
			if ($('#cidadeAlterar').val() == "") invalid += "- cidade \n";
			if ($('#bairroAlterar').val() == "") invalid += "- bairro \n";
			if ($('#logradouroAlterar').val() == "") invalid += "- logradouro \n";
			if (base64Alterar == "") invalid += "- Brasão \n";
			swal("Oops...", invalid, "error")
		}
	});
	$("#imgAlterar").change(function(evt) {
		files = evt.target.files; // FileList object

		reader.onload = function(evt) {
			$('.imgLoad').attr('src', evt.target.result);
			base64Alterar = evt.target.result;
		};
		if (reader.readAsDataURL) {
			reader.readAsDataURL(files[0]);
		} else if (reader.readAsDataurl) {
			reader.readAsDataurl(files[0]);
		}

	});
	//Excluir Batalhao
	$('#excluirBatalhao').click(function(e) {
		var data = {};
		var string;

		if ($('#deletarBatalhao').val() != "" && $('#deletarBatalhao').val() != null) {
			data.id = $('#deletarBatalhao').val();

			swal({
					title: "Você tem certeza?",
					text: "Não será possivel recuperar os dados após a exclusão!",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Sim",
					cancelButtonText: "Não",
					closeOnConfirm: false,
					closeOnCancel: false
				},
				function(isConfirm) {
					if (isConfirm) {
						$.ajax({
							type: 'POST',
							contentType: 'application/json; charset=utf-8',
							url: '/excluirB',
							dataType: "json",
							data: JSON.stringify(data),
							cache: false,
							success: function(data) {
								var response = data;
								if (response.result == 'ok') {
									$.each(dadosIniciais.batalhao, function(i, item) {
										if (item.id == $('#deletarBatalhao').val()) {
											dadosIniciais.relacao = $.grep(dadosIniciais.relacao, function(n, i) {
												return n.idUnidade != item.id;
											})
											console.log(dadosIniciais.relacao)
											dadosIniciais.batalhao.splice(i, 1);
											refresh();
											refreshRelacao()
											return false;
										}
									});
								} else {
									swal("Oops...", response.message, "error");
								}
							}
						});
						swal("Excluido!", "Seus dados foram Excluido!.", "success");
					} else {
						swal("Cancelado", "Seus dados estão Seguro!", "error");
					}
				});

		} else {
			swal("Oops...", "Selecione o Batalhão a ser excluido!", "error")
		}
	});
	$('#selectBatalhao').change(function() {
		refreshRelacao($('#selectBatalhao').val());
	});
	//adicionar relacao
	$('#relacionar').click(function(e) {
		var data = {};
		var string;
		if ($('#selectBatalhao').val() != "" && $('#selectCidade').val() != "" && $('#selectBatalhao').val() != null && $('#selectCidade').val() != null) {
			data.cidade = $('#selectCidade').val();
			data.batalhao = $('#selectBatalhao').val();
			$.ajax({
				type: 'POST',
				contentType: 'application/json; charset=utf-8',
				url: '/relacionarCB',
				dataType: "json",
				data: JSON.stringify(data),
				cache: false,
				success: function(data) {
					var response = data;
					if (response.result == 'ok') {
						var item = {}
						swal("Bom Trabalho!", "Relação adicionada!", "success")
						var newRow = $("<tr>");
						var cols = "";
						item.id = data.id;
						item.idUnidade = $('#selectBatalhao').val();
						item.idCidade = $('#selectCidade').val();
						dadosIniciais.relacao.push(item);
						refreshRelacao($("#selectBatalhao").val());
					} else {
						sweetAlert("Oops...", response.message, "error");
					}
				}
			});
		} else {
			var invalid = "Preencha corretamente os campos:\n";
			if ($('#selectBatalhao').val() == "" || $('#selectBatalhao').val() == null) invalid += "- Batalhão \n";
			if ($('#selectCidade').val() == "" || $('#selectCidade').val() == null) invalid += "- Cidade \n";
			sweetAlert("Oops...", invalid, "error");
		}
	});
});