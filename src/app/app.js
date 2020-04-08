'use strict';

var app = angular.module('controleClienteApp', ['ngRoute', 'angularUtils.directives.dirPagination', 'ui.utils.masks']);

app.config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when("/", {
                controller: "controleUsuarioController",
                templateUrl:"./loginUsuario.html"
            })

            .when("/cadastro", {
                controller: "controleUsuarioController",
                templateUrl:"./cadastroUsuario.html"
            })

            .when("/clientes", {
                controller: "controleClienteController",
                templateUrl:"./clientes.html"
            })
            
            .otherwise({redirectTo: '/'});

        $locationProvider.hashPrefix('');
});
