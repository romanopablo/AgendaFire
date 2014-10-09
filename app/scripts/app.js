

var agenda =
        angular.
            module('agenda',[
                    'ngRoute',
                    'firebase'
                  ]);


//******************************* ROUTE PROVIDER **************************************************

agenda.config(["$routeProvider",
    function($routeProvider){
        $routeProvider
            .when('/agregar', {
                templateUrl: '/views/agregar.html'
                //, controller:'AgendaController'
            })
            .when('/ver', {
                templateUrl: '/views/ver.html'
                //, controller:'AgendaController'
            })
            .when('/', {
                templateUrl: '/views/home.html'
                //, controller:'AgendaController'
            });
    }]);


//******************************* CONTROLADOR AgencaController **************************************************

agenda.controller('AgendaController',['$scope','peopleService',
    function ($scope, peopleService){
        $scope.persona = {};
        $scope.personas = peopleService.getPeopleArray();

        $scope.cargarPersona = function (){
            peopleService.addPeople($scope.persona);
            $scope.persona ={};
        };

        $scope.eliminarPersona = function (id){
            peopleService.deletePeople(id);
                    };

        $scope.editarPersona = function (person) {
                console.log(person.id);
              $scope.persona = person;
        };


        $scope.cargarAgenda = function (){
            peopleService.loadPeople();
        };

        $scope.limpiarAgenda = function(){
            peopleService.cleanPeople();
        };
    }]);

//******************************* SERVICIO peopleService (ARRAY DE PERSONAS) **************************************************

agenda.service('peopleService',['$firebase','$http', function ($firebase, $http){

    var ref = new Firebase("https://crud1.firebaseio.com/");  //Aca debes colocar el nombre de tu BD Firebase
    // create an AngularFire reference to the data
    var sync = $firebase(ref);
    var peopleArray = sync.$asArray();


    this.addPeople = function(person){

        if( person.id){   //si el objeto tiene id, estoy editando uso $save, sino uso $add para uno nuevo
            peopleArray.$save(person);

        }else{
                person.id = peopleArray.length;
                console.log('guardati nuevo id: ' + person.id);
                peopleArray.$add(person);

            }
        };




    this.deletePeople = function(id){
        peopleArray.$remove(id);
    };

    this.getPeopleArray = function(){
        return peopleArray;
    };


    this.loadPeople = function(){       //NO RECIBE PARAMETROS, CARGO CONTACTOS DEL JSON "DATA"
        $http.get('scripts/data.json').success(function(data){
            console.log(data.data);
            var i;
            for (i = 0; i < data.data.length; i++) { //Recorrer el objeto data dentro del JSON y guardar de a uno
                console.log(data.data[i]);
                peopleArray.$add(data.data[i]);}
        });


    };

    this.cleanPeople = function(){
        var i;
        for (i = 0; i < peopleArray.length; i++) { //rrecorrer el array peopleArray y eliminar 1 por 1 los elem
            console.log(i);
            peopleArray.$remove(i);}
    };

}]);


//******************************* DIRECTIVA AGREGAR**************************************************

agenda.directive('directivaAgregar', function(){
    return{
        restrict: 'EA',
        templateUrl: '/views/directivaAgregar.html',
        scope:{
            persona: "=",
            funcion: "="
        }
    }
});

//******************************* FILTRO TELEFONO **************************************************

agenda.filter('tel', function() {
    return function(tel) {
        if (!tel) { //si es vacio no hace nada
            return '';
        }
        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }
        var city, number; //numero, prefijo, codigo de area
        switch (value.length) { //Case por longitud del numero 10,11 o 12.
            case 10:
                city = value.slice(0, 3);
                number = value.slice(3);
                break;

            case 11:
                city = value.slice(0, 4);
                number = value.slice(4);
                break;


            default: //cualquier otro caso, devuelvo el num sin hacer nada.
                return tel;
        }

        number = number.slice(0, 3) + '-' + number.slice(3);
        return (" (" + city + ") " + number).trim();
    };
});

