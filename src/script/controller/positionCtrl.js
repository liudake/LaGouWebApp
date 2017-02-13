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