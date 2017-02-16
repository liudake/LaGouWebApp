'use strict';

angular.module('app').controller('favoriteCtrl', ['$scope', '$http', function($scope, $http) {
	$http({
		method: 'GET',
		url: '/data/myFavorite.json'
	}).then(function(success) {
		$scope.list = success.data;
	});
}]);