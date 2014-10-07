

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
            $scope.personas = peopleService.getPeopleArray();
            $scope.persona ={};
        };

        $scope.eliminarPersona = function (id){
            peopleService.deletePeople(id);
            $scope.personas = peopleService.getPeopleArray();
        };

        $scope.editarPersona = function (id){    //CREO UNA INSTANCIA NUEVA Y COPIO LOS ATRIBUTOS EN EL OBJETO PERSONA DEL SCOPE
            var copiape = angular.copy($scope.personas[id]);
            $scope.persona.id = id;
            $scope.persona.name = copiape.name;
            $scope.persona.email = copiape.email;
            $scope.persona.phone = copiape.phone;
        }

        $scope.cargarAgenda = function (){
            peopleService.loadPeople().then(function(){
                $scope.personas = peopleService.getPeopleArray();
            },function(){
                alert("No es posible cargar la agenda!");});
        };

        $scope.limpiarAgenda = function(){
            peopleService.cleanPeople();
            $scope.personas = peopleService.getPeopleArray();
        };
    }]);

//******************************* SERVICIO peopleService (ARRAY DE PERSONAS) **************************************************

agenda.service('peopleService',['$firebase', function ($firebase){

    var ref = new Firebase("https://crud1.firebaseio.com/");
    // create an AngularFire reference to the data
    var sync = $firebase(ref);
    var peopleArray = sync.$asArray();


    this.addPeople = function(person){      //RECIBE UN OBJ PERSONA.
           /* if (person.id == null){          //SI EL OBJ NO TIENE ID, NO ESTOY EDITANDO, LE ASIGNO LA ULTIMA POSICION
                person.id = peopleArray.length;
            };
            peopleArray[person.id] = person; //COLOCO EL OBJ EN LA POS DE SU ID*/
            peopleArray.$add(person);
    };

    this.deletePeople = function(id){       //RECIBE  ID
        peopleArray.splice(id, 1);
    };


    this.getPeopleArray = function(){       //NO RECIBE PARAMETROS, DEVUELVE EL ARRAY CON PERSONAS
        /*var peopleArrayCopy = angular.copy(peopleArray); //COPIO EL ARRAY, PARA TENERLO ENCAPSULADO
        return peopleArrayCopy;*/
        var promise = peopleArray;
        console.log(promise);
        return promise;
    };

    this.loadPeople = function(){       //NO RECIBE PARAMETROS, CARGO CONTACTOS DEL JSON "DATA"
       /* var q = $q.defer();
        $http.get('scripts/data.json').success(function(data){
            peopleArray = peopleArray.concat(data.data);
            q.resolve(data);
        }).error(function(data,status){
            q.reject(data);
        });
        return q.promise;*/

    };

    this.cleanPeople = function(){
        peopleArray = [];
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

