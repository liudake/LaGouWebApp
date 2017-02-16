'use strict';

angular.module('app').controller('positionCtrl', ['$log', 'cache', '$q', '$http', '$state', '$scope', function($log, cache, $q, $http, $state, $scope) {
	$scope.isLogin = !!cache.get('name');

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

	$scope.go = function() {
		if($scope.isLogin) {
			$http.post('/data/handle.json', {
				id: $scope.position.id
			}).success(function(resp) {
				$log.info(resp.data);
			});
		}else{
			$state.go('login');
		}
	}
}]);