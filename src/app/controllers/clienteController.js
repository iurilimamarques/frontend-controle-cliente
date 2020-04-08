var app = angular.module('controleClienteApp');
    app.controller('controleClienteController', function($scope, $http, $window){

        $scope.listaClientes = [];
        $scope.listaNumeros = [];
        $scope.numeroCliente = {};
        $scope.numeroCliente.numero = '';

        $scope.nomeUsuario = localStorage.getItem('nome');

        $scope.getClientes = function() {
            $http({ 
                method: 'GET',
                url: BASE_URL+'/api/cliente/'+localStorage.getItem('id'),
                headers : {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+localStorage.getItem('accessToken')
                },
                data: $scope.usuarioCadastro
            }).then(function(retorno) {
                $scope.listaClientes = retorno.data.response;
            }, function(erro) {
                console.log(erro);
            });
        }

        $scope.abreModalAddCliente = function() {
            $('#modalAddCliente').modal('show');
        }

        $scope.fechaModalAddCliente = function() {
            $scope.objCliente = {};
            $scope.listaNumeros = [];
            $scope.numeroCliente.numero = '';
            $scope.formCliente.$setPristine();
            $('#modalAddCliente').modal('hide');
        }

        $scope.addNumero = function() {
            $scope.listaNumeros.push(angular.copy($scope.numeroCliente));
            $scope.numeroCliente.numero = '';
        }

        $scope.addNumeroReq = function() {
            $http({ 
                method: 'POST',
                url: BASE_URL+'/api/telefone/criar/'+$scope.id_cliente,
                headers : {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+localStorage.getItem('accessToken')
                },
                data: $scope.numeroCliente
            }).then(function(retorno) {
                if (retorno.data.response!=null) {
                    swal("Salvo com sucesso!", "", "success");
                    $scope.numeroCliente.numero = '';
                    $scope.listaNumeros = retorno.data.response;
                }else{
                    swal("Não foi possível adicionar!", "", "error");
                }
            }, function(erro) {
                console.log(erro);
            });

        }

        $scope.removeNumeroReq = function(id_numero) {
            $http({ 
                method: 'GET',
                url: BASE_URL+'/api/telefone/remove/'+id_numero+'/'+$scope.id_cliente,
                headers : {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+localStorage.getItem('accessToken')
                }
            }).then(function(retorno) {
                swal("Salvo com sucesso!", "", "success");
                $scope.numeroCliente.numero = '';
                $scope.listaNumeros = retorno.data.response;
            }, function(erro) {
                console.log(erro);
            });

        }

        $scope.removeNumero = function(key) {
            var novaLista = $scope.listaNumeros.filter((v, k) => k!=key);
            $scope.listaNumeros = novaLista;
        }

        $scope.abreModalAddEndereco = function(id_cliente) {
            $scope.id_cliente = id_cliente;
            $('#modalAddEndereco').modal('show');
        }

        $scope.fechaModalAddEndereco = function() {
            $scope.objEndereco = {};
            $scope.id_cliente = '';
            $scope.formEndereco.$setPristine();
            $('#modalAddEndereco').modal('hide');
        }

        $scope.abreModalVisualizaDados = function(id_cliente) {
            $scope.id_cliente = id_cliente;
            $scope.getTelefoneEnderecos(id_cliente);
            $('#modalVisualizaDados').modal('show');
        }

        $scope.fechaModalVisualizaDados = function() {
            $scope.numeroCliente = {};
            $scope.listaNumeros = [];
            $('#modalVisualizaDados').modal('hide');
        }

        $scope.getTelefoneEnderecos = function(id_endereco) {
            $http({ 
                method: 'GET',
                url: BASE_URL+'/api/cliente/dados/'+$scope.id_cliente,
                headers : {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+localStorage.getItem('accessToken')
                }
            }).then(function(retorno) {
                $scope.enderecos = retorno.data.response.enderecos;
                $scope.listaNumeros = retorno.data.response.telefones;
            }, function(erro) {
                console.log(erro);
            });
        }

        $scope.deletaEndereco = function(id_endereco) {
            $http({ 
                method: 'GET',
                url: BASE_URL+'/api/endereco/desativar/'+id_endereco+'/'+$scope.id_cliente,
                headers : {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+localStorage.getItem('accessToken')
                }
            }).then(function(retorno) {
                swal("Deletado com sucesso!", "", "success");
                $scope.enderecos = retorno.data.response;
            }, function(erro) {
                console.log(erro);
            });
        }

        $scope.salvaCliente = function() {
            $http({ 
                method: 'POST',
                url: BASE_URL+'/api/cliente/criar/'+localStorage.getItem('id'),
                headers : {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+localStorage.getItem('accessToken')
                },
                data: { cpfCnpj: $scope.objCliente.cpfCnpj, nome: $scope.objCliente.nome, telefone: $scope.listaNumeros }
            }).then(function(retorno) {
                if (retorno.data.response=='cliente_salvo') {
                    swal("Salvo com sucesso!", "", "success");
                    $scope.fechaModalAddCliente();
                    $scope.getClientes();
                }else if(retorno.data.response=='cliente_existente') {
                    swal("Cliente já existente!", "", "warning");
                }
            }, function(erro) {
                console.log(erro);
            });
        }
        
        $scope.salvaEndereco = function() {
            $scope.objEndereco.status = ($scope.objEndereco.status==undefined || !$scope.objEndereco.status) ? 'N' : 'P'; 
            
            $http({ 
                method: 'POST',
                url: BASE_URL+'/api/endereco/criar/'+$scope.id_cliente,
                headers : {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+localStorage.getItem('accessToken')
                },
                data: $scope.objEndereco
            }).then(function(retorno) {
                if (retorno.data.response=='endereco_salvo') {
                    swal("Salvo com sucesso!", "", "success");
                    $scope.fechaModalAddEndereco();
                    $scope.getClientes();
                }else if(retorno.data.response=='nao_salvo') {
                    swal("Não foi possível salvar!", "", "error");
                }
            }, function(erro) {
                console.log(erro);
            });
        }

        $scope.getClientes();

        
    });

    app.filter('mask', function () {
        var cache = {};
        var maskDefinitions = {
        '9': /\d/,
            'A': /[a-zA-Z]/,
            '*': /[a-zA-Z0-9]/
        };
        function getPlaceholderChar(i) {
        return '_';
        }
        function processRawMask(mask) {
        if (cache[mask]) return cache[mask];
        var characterCount = 0;

        var maskCaretMap = [];
        var maskPatterns = [];
        var maskPlaceholder = '';
        var minRequiredLength = 0;
        if (angular.isString(mask)) {


            var isOptional = false,
            numberOfOptionalCharacters = 0,
            splitMask = mask.split('');

            angular.forEach(splitMask, function(chr, i) {
            if (maskDefinitions[chr]) {

                maskCaretMap.push(characterCount);

                maskPlaceholder += getPlaceholderChar(i - numberOfOptionalCharacters);
                maskPatterns.push(maskDefinitions[chr]);

                characterCount++;
                if (!isOptional) {
                minRequiredLength++;
                }

                isOptional = false;
            }
            else if (chr === '?') {
                isOptional = true;
                numberOfOptionalCharacters++;
            }
            else {
                maskPlaceholder += chr;
                characterCount++;
            }
            });
        }
        // Caret position immediately following last position is valid.
        maskCaretMap.push(maskCaretMap.slice().pop() + 1);
        return cache[mask] = {maskCaretMap: maskCaretMap, maskPlaceholder: maskPlaceholder};
        }

        function maskValue(unmaskedValue, maskDef) {
        unmaskedValue = unmaskedValue || '';
        var valueMasked = '',
            maskCaretMapCopy = maskDef.maskCaretMap.slice();

        angular.forEach(maskDef.maskPlaceholder.split(''), function (chr, i) {
            if (unmaskedValue.length && i === maskCaretMapCopy[0]) {
            valueMasked += unmaskedValue.charAt(0) || '_';
            unmaskedValue = unmaskedValue.substr(1);
            maskCaretMapCopy.shift();
            }
            else {
            valueMasked += chr;
            }
        });
        return valueMasked;

        }

        return function (value, mask) {
        var maskDef = processRawMask(mask);
        var maskedValue = maskValue(value, maskDef);
        return maskedValue;
        };
    });
