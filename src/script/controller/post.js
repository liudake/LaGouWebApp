'use strict';

angular.module('app').controller('postCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.tabList = [{
		id: 'all',
		name: '全部'
	},{
		id: 'pass',
		name: '面试通知'
	},{
		id: 'fail',
		name: '不合适'
	}]
}]);