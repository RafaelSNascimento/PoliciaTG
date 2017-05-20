$(function(){
  $('#myModal').modal('show')
  $('#login').click(function(e) {
    var data = {};
    var string;
    data.usuario = $('#usuario').val().toLowerCase();
    data.senha = $('#senha').val().toLowerCase();
    $.ajax({
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      url: '/ValidarLogin',
      dataType: "json",
      data: JSON.stringify(data),
      success: function(data) {
        var response = data;
        if (data.result == 'ok') {
          $("#form").attr('action','/home')
          $("#form").submit();
        }
        else if (data.result == 'admin') {
          $("#form").attr('action','/homeAdmin')
          $("#form").submit();
        }
        else {
          swal("Ops....", "Login Recusado!", "error")
        }
      }
    }); 
  });
});