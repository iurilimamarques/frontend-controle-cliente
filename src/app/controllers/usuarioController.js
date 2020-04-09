var app = angular.module('controleClienteApp');
    app.controller('controleUsuarioController', function($scope, $http, $window){

        $scope.usuarioCadastro = {};
        $scope.usuarioLogin = {};
        $scope.erroFormulario = '';
        $scope.loading = false;        

        $scope.setUsuario = function() {
            $scope.loading = true;
            $http({ 
                method: 'POST',
                url: BASE_URL+'/api/usuario/criar',
                headers : {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic '+window.btoa(CLIENT_ID+':'+CLIENT_SECRET)
                },
                data: $scope.usuarioCadastro
            }).then(function(retorno) {
                $scope.loading = false;
                if (retorno.data.response=='usuario_criado') {
                    $window.location.href = '#/';
                }else if(retorno.data.response=='usuario_existente'){
                    $scope.formCadastro.$setPristine();
                    $scope.erroFormulario = "Já existe usuário com este e-mail.";
                }            
            }, function(erro) {
                console.log(erro);
            });
        }

        $scope.loginUsuario = function() {        
            $scope.loading = true;
            $http({
                method: 'POST',
                url: BASE_URL+'/api/usuario',
                headers : {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic '+window.btoa(CLIENT_ID+':'+CLIENT_SECRET)
                },
                data: $scope.usuarioLogin
            }).then(function(retorno) {                         
                if (retorno.data.response==null) {
                    $scope.formLogin.$setPristine();
                    $scope.erroLogin = 'Usuário ou senha incorreto!';
                    $scope.loading = false;
                }else{
                    Object.keys(retorno.data.response).map(function(key) {
                        localStorage.setItem(key, retorno.data.response[key]);
                    });

                    $window.location.href = '#/clientes';
                }
                    
            }, function(erro) {
                console.log(erro);
            });
        }
        
    });
