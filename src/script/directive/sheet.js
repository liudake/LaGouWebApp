'use strict';

angular.module('app').directive('appSheet', [function() {
	return {
		restrcit: 'A',
		replace: true,
		scope: {
			list: '=',
			visible: '=',
			select: '&'
		},
		templateUrl: 'view/template/sheet.html'
	};
}]);