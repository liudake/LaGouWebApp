'use strict';

angular.module('app').directive('appPositionInfo', [function() {
	return {
		restrcit: 'A',
		replace: true,
		templateUrl: 'view/template/positionInfo.html',
		scope: {
			isActive: '=',
			isLogin: '=',
			position: '='
		},
		link: function($scope) {
			$scope.imagePath = $scope.isActive?'image/star-active.png':'image/star.png';
		}
	}
}]);