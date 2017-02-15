'use strict';

angular.module('app').config(['$provide', function($provide) {
	$provide.decorator('$http', ['$delegate', '$q', function($delegate, $q) {
		$delegate.post = function(url, data, config) {
			var def = $q.defer();
			$delegate.get(url).then(function(success) {
				def.resolve(success);
			}, function(err) {
				def.reject(err);
			});
			return 	{
				success: function(callback){
					def.promise.then(callback);
				},
				error: function(callback) {
					def.promise.then(callback);
				}
			}
		}	
		return $delegate;
	}]);
}]);