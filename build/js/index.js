'use strict';

angular.module('app', ['ui.router']);

'use strict';

angular.module('app').config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
	$locationProvider.hashPrefix('');
	$stateProvider.state('main', {
		url: "/main",
		templateUrl: "view/main.html",
		controller: 'mainCtrl'
	}).state('position', {
		url: '/position/:id',
		templateUrl: 'view/position.html',
		controller: 'positionCtrl'
	}).state('company', {
		url: '/company/:id',
		templateUrl: 'view/company.html',
		controller: 'companyCtrl'
	});
	$urlRouterProvider.otherwise("main");
}])
'use strcit';

angular.module('app').controller('companyCtrl', ['$http', '$state', '$scope', function($http, $state, $scope) {
	$http({
		method: 'GET',
		url: '/data/company.json?id=' + $state.params.id
	}).then(function(success) {
		$scope.company = success.data;
	});
}]);
'use strict';

angular.module('app').controller('mainCtrl', ['$scope', '$http', function($scope, $http) {
	$http({
		method: 'GET',
		url: '/data/positionList.json'
	}).then(function(success) {
		$scope.list = success.data;
	});
}]);
'use strict';

angular.module('app').controller('positionCtrl', ['$q', '$http', '$state', '$scope', function($q, $http, $state, $scope) {
	$scope.isLogin = false;
	function getPosition() {
		var def = $q.defer();
		$http({
			method: 'GET',
			url: '/data/position.json?id=' + $state.params.id
		}).then(function(success) {
			$scope.position = success.data;
			def.resolve(success);
		}).catch(function(err) {
			def.reject(err);
		});
		return def.promise;
	}
	function getCompany(id) {
		$http({
			method: 'GET',
			url: '/data/company.json?id=' + id
		}).then(function(success) {
			$scope.company = success.data;
		})
	}
	getPosition().then(function(success) {
		getCompany(success.data.companyId);
	});
}]);
'use strict';

angular.module('app').directive('appCompany', [function() {
	return {
		restrict: 'A',
		replace: true,
		scope: {
			company: '='
		},
		templateUrl: 'view/template/company.html'
	}
}]);
'use strict';

angular.module('app').directive('appFoot', [function() {
	return {
		restrcit: 'A',
		replace: true,
		templateUrl: 'view/template/foot.html'
	};
}]);
'use strict';

angular.module('app').directive('appHead', [function() {
	return {
		restrict: 'A',
		replace: true,
		templateUrl: 'view/template/head.html'
	};
}]);
'use strict';

angular.module('app').directive('appHeadBar', [function() {
	return {
		restrict: 'A',
		replace: true,
		templateUrl: 'view/template/headBar.html',
		scope: {
			text: '@',
		},
		link: function($scope) {
			$scope.back = function() {
				window.history.back();
			}
		}
	};
}]);
'use strict';

angular.module('app').directive('appPositionClass', [function() {
	return {
		restrcit: 'A',
		replace: true,
		scope: {
			company: '='
		},
		templateUrl: 'view/template/positionClass.html',
		link: function($scope) {
			$scope.showPositionList = function(index) {
				$scope.positionList = $scope.company.positionClass[index].positionList;
				$scope.isActive = index;
			}
			$scope.$watch('company', function(newVal){
			  if(newVal) $scope.showPositionList(0);
			});
		}
	};
}]);
'use strict';

angular.module('app').directive('appPositionInfo', [function() {
	return {
		restrcit: 'A',
		replace: true,
		templateUrl: 'view/template/positionInfo.html',
		scope: {
			isActive: '=',
			isLogin: '=',
			position: '='
		},
		link: function($scope) {
			$scope.imagePath = $scope.isActive?'image/star-active.png':'image/star.png';
		}
	}
}]);
'use strict';

angular.module('app').directive('appPositionList', [function() {
	return {
		restrict: 'A',
		replace: true,
		templateUrl: 'view/template/positionList.html',
		scope: {
			data: '='
		}
	};
}]);