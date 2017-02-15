'use strict';

angular.module('app').controller('registerCtrl', ['$interval', '$scope', '$http','$state', function($interval, $scope, $http, $state) {
	$scope.submit = function() {
		$http.post('/data/regist.json', $scope.user).success(function(success) {
			$state.go('login');
		});
	}
	var count = 60;
	$scope.send = function() {
		$http({
			method: 'GET',
			url: '/data/code.json'
		}).then(function(success) {
			if(success.data.state === 1) {
				count = 60;
				$scope.time = '60s';
				var interval = $interval(function() {
					if(count <= 0) {
						$interval.cancel(interval);
						$scope.time = '';
						return;
					}else{
						count--;
						$scope.time = count + 's';
					}
				},1000);
			}
		});
	}
}]);