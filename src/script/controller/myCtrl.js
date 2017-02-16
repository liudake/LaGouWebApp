'use strict';

angular.module('app').controller('myCtrl', ['$state','cache', '$scope', '$http', function($state, cache, $scope, $http) {
	if(cache.get('name')) {
		$scope.name = cache.get('name');
		$scope.image = cache.get('image');
	}
	$scope.signout = function() {
		cache.remove('id');
		cache.remove('name');
		cache.remove('image');
		$state.go('main');
	}
}]);