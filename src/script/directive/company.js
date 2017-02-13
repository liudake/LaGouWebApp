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