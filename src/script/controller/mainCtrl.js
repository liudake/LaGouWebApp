'use strict';

angular.module('app').controller('mainCtrl', ['$scope', '$http', function($scope, $http) {
	$http({
		method: 'GET',
		url: '/data/positionList.json'
	}).then(function(success) {
		$scope.list = success.data;
	});
}]);