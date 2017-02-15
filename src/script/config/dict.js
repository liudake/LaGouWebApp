'use strict';

angular.module('app').value('dict', {}).run(['dict', '$http', function(dict, $http){
		$http({
			method: 'GET',
			url: '/data/city.json'
		}).then(function(success) {
			dict.city = success.data;
		});
		$http({
			method: 'GET',
			url: '/data/salary.json'
		}).then(function(success) {
			dict.salary = success.data;
		});
		$http({
			method: 'GET',
			url: '/data/scale.json'
		}).then(function(success) {
			dict.scale = success.data;
		});
}]);

