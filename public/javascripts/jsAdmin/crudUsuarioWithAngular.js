angular.module('App', [ngSweetAlert2])
.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    var fr = new FileReader();
                    fr.onload = function () {
                        if(attrs.fileModel == "myFile"){
                            scope.$apply(function(){
                                scope.userSelected.img = fr.result;
                            })
                           
                         }
                        else{
                            scope.$apply(function(){
                                scope.newUser.img = fr.result;
                            })
                        }
                    }
                    if(fr.readAsDataURL) fr.readAsDataURL(element[0].files[0]);
                    else fr.readAsDataurl(element[0].files[0]);
                });
            });
        }
    };
}])
.controller('appController',['$scope','$filter','$http','$window', function($scope, $filter,$http, $window) {
    $scope.userSelected = {};
    $scope.newUser = {};
    $scope.Image = [];
    $http({
        method: 'get', 
        url: '/allusers'
    }).then(function(response){
        $scope.users = response.data.usuarios;
        $scope.batalhao = response.data.batalhao;
    }, function(response){
        console.log("opss..")
    });
    $scope.selectedUser = function(user){
         $("#inputImg").val('').clone(true);
        $scope.userSelected = angular.copy(user);
    }
    $scope.addNewUser = function(){

        var data = {
            'img':$scope.newUser.img,
            'nome': $scope.newUser.nome,
            'usuario': $scope.newUser.usuario,
            'senha': $scope.newUser.senha,
            'idUnidade': $scope.newUser.idUnidade,
            'role': $scope.newUser.role
        }
        //if($scope.myFileNewUser) data.img = $scope.myFileNewUser;
        $http.post("/cadastrarU", data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .success(function(data) {
                console.log(data);
                if(data.result != "error"){
                    angular.forEach($scope.batalhao, function(value,key){
                        if(value.id == $scope.newUser.idUnidade){
                            $scope.newUser.unidadeNome = value.nome;
                        }
                    });
                    $scope.newUser.id = data.id;
                    $scope.users.push($scope.newUser);
                    $scope.newUser = null;
                    console.log($scope.newUser);
                    $scope.myFileNewUser = "";

                    swal("Sucesso!", "Usuário cadastrado com sucesso.", "success");
                }else{
                    swal("Opss", data.message, "error");
                }
            }).error(function(err, data) {
                console.log("error " + err);
        });
    }
    
    $scope.alterUser = function(){
        var fd = new FormData();
        var b64toBlob = function (b64Data, contentType, sliceSize) {
          contentType = contentType || '';
          sliceSize = sliceSize || 512;

          var byteCharacters = $window.atob(b64Data);
          var byteArrays = [];

          for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
          }

          var blob = new Blob(byteArrays, {type: contentType});
          return blob;
        }
      
        if(!$scope.myFile){
            if($scope.userSelected.img){
                if(!$scope.userSelected.img.includes($scope.userSelected.id+".jpeg")){
                    var blob = b64toBlob($scope.userSelected.img.replace(/^data:image\/(png|jpg|jpeg);base64,/, '', ""), 'image/jpeg');
                    fd.append('file',blob,$scope.userSelected.id+'.jpeg');
                }
            }
        } 
        else{

            
            fd.append('file', $scope.myFile,$scope.userSelected.id+'.jpeg');
        }
        fd.append('id', $scope.userSelected.id);
        fd.append('nome', $scope.userSelected.nome);
        fd.append('usuario', $scope.userSelected.usuario);
        fd.append('senha', $scope.userSelected.senha);
        fd.append('idUnidade', $scope.userSelected.idUnidade);
        fd.append('role', $scope.userSelected.role);
        $http.post("/alteruser", fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-type': undefined
            }
        })
        .success(function(data) {
            if(data.result != "error"){
                angular.forEach($scope.batalhao, function(value,key){
                    if(value.id == $scope.userSelected.idUnidade){
                        $scope.userSelected.unidadeNome = value.nome;
                    }
                });
                angular.forEach($scope.users, function(value, key){
                    if(value.id == $scope.userSelected.id){
                        $scope.users[key] = angular.copy($scope.userSelected);
                    }
                })
                swal("Sucesso!", "Usuário alterado com sucesso.", "success");
                $scope.myFile = "";
                $("#inputImg").val('').clone(true);
            }else{
                swal("Opss", data.message, "error");
            }
        }).error(function(err, data) {
            console.log("error " + err);
        });
    }
    $scope.deleteUser = function(user){
       $http.post("/deletesingleuser", {'usuario':user.usuario, 'senha':user.senha}, {
            headers: {
                'Content-type': 'application/json'
            }
        })
        .success(function(data) {
            if(data.result != "error"){
                angular.forEach($scope.users, function(value, key){
                    if(value.usuario == user.usuario && value.senha == user.senha){
                        $scope.users.splice(key, 1);   
                    }
                })
                swal("Sucesso!", "Usuário Deletado com sucesso.", "success");
            }else{
                swal("Opss", data.message, "error");
            }
        }).error(function(err, data) {
            console.log("error " + err);
        });

    }
}])