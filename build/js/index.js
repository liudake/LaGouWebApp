'use strict';

angular.module('app', ['ui.router', 'validation']);

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
'use strict';

angular.module('app').config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
	$locationProvider.hashPrefix('');
	$stateProvider.state('main', {
		url: "/main",
		templateUrl: "view/main.html",
		controller: 'mainCtrl'
	}).state('position', {
		url: '/position/:id',
		templateUrl: 'view/position.html',
		controller: 'positionCtrl'
	}).state('company', {
		url: '/company/:id',
		templateUrl: 'view/company.html',
		controller: 'companyCtrl'
	}).state('search', {
		url: '/search',
		templateUrl: 'view/search.html',
		controller: 'searchCtrl'
	}).state('login', {
		url: '/login',
		templateUrl: 'view/login.html',
		controller: 'loginCtrl'
	}).state('register', {
		url: '/register',
		templateUrl: 'view/register.html',
		controller: 'registerCtrl'
	}).state('my', {
		url: '/my',
		templateUrl: 'view/my.html',
		controller: 'myCtrl'
	}).state('favorite', {
		url: '/favorite',
		templateUrl: 'view/favorite.html',
		controller: 'favoriteCtrl'
	}).state('post', {
		url: '/post',
		templateUrl: 'view/post.html',
		controller: 'postCtrl'
	});
	$urlRouterProvider.otherwise("main");
}])
'use strcit';

angular.module('app').config(['$validationProvider', function($validationProvider) {
	var expression = {
		phone: /^1[\d]{10}$/,
		password: function(value) {
			var str = value + '';
			return str.length > 5;
		},
		required: function(value) {
			return !!value;
		}
	};
	var defaultMsg = {
		phone: {
			success: '',
			error: '必须是11位手机号'
		},
		password: {
			success: '',
			error: '长度至少6位'
		},
		required: {
			success: '',
			error: '验证码不能为空！'
		}
	};
	$validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
}]);
'use strcit';

angular.module('app').controller('companyCtrl', ['$http', '$state', '$scope', function($http, $state, $scope) {
	$http({
		method: 'GET',
		url: '/data/company.json?id=' + $state.params.id
	}).then(function(success) {
		$scope.company = success.data;
	});
}]);
'use strict';

angular.module('app').controller('favoriteCtrl', ['$scope', '$http', function($scope, $http) {
	
}]);
'use strict';

angular.module('app').controller('loginCtrl', ['$scope', '$http', function($scope, $http) {
	
}]);
'use strict';

angular.module('app').controller('mainCtrl', ['$scope', '$http', function($scope, $http) {
	$http({
		method: 'GET',
		url: '/data/positionList.json'
	}).then(function(success) {
		$scope.list = success.data;
	});
}]);
'use strict';

angular.module('app').controller('myCtrl', ['$scope', '$http', function($scope, $http) {
	
}]);
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
'use strict';

angular.module('app').controller('searchCtrl', ['dict', '$http', '$scope', function(dict, $http, $scope) {
	$scope.name = '';
	$scope.search = function() {
		$http({
			method: 'GET',
			url: '/data/positionList.json?name=' + $scope.name
		}).then(function(success) {
			$scope.positionList = success.data;
		});
	};
	$scope.search();
	$scope.sheet = {};
	$scope.tabList = [{
		id: 'city',
		name: '城市'
	},{
		id: 'salary',
		name: '薪资'
	},{
		id: 'scale',
		name: '公司规模'
	}];

	 $scope.filterObj = {};
	var tabId = '';
	$scope.tClick = function(id, name) {
		tabId = id;
		$scope.sheet.list = dict[id];
		$scope.sheet.visible = true;
	};

	$scope.sClick = function(id, name) {
		if(id) {
			angular.forEach($scope.tabList, function(item) {
				if(item.id === tabId) {
					item.name = name;
				}
			});
			$scope.filterObj[tabId + 'Id'] = id;

		}else{
			delete $scope.filterObj[tabId + 'Id'];
			angular.forEach($scope.tabList, function(item) {
				if(item.id === tabId) {
					switch (item.id) {
						case 'city':
							item.name = '城市';
							break;
						case 'salary':
							item.name = '薪资';
							break;
						case 'scale':
							item.name = '公司规模';
							break;
					}
				}
			});
		}
	}

}]);
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
'use strict';

angular.module('app').directive('appFoot', [function() {
	return {
		restrcit: 'A',
		replace: true,
		templateUrl: 'view/template/foot.html'
	};
}]);
'use strict';

angular.module('app').directive('appHead', [function() {
	return {
		restrict: 'A',
		replace: true,
		templateUrl: 'view/template/head.html'
	};
}]);
'use strict';

angular.module('app').directive('appHeadBar', [function() {
	return {
		restrict: 'A',
		replace: true,
		templateUrl: 'view/template/headBar.html',
		scope: {
			text: '@',
		},
		link: function($scope) {
			$scope.back = function() {
				window.history.back();
			}
		}
	};
}]);
'use strict';

angular.module('app').directive('appPositionClass', [function() {
	return {
		restrcit: 'A',
		replace: true,
		scope: {
			company: '='
		},
		templateUrl: 'view/template/positionClass.html',
		link: function($scope) {
			$scope.showPositionList = function(index) {
				$scope.positionList = $scope.company.positionClass[index].positionList;
				$scope.isActive = index;
			}
			$scope.$watch('company', function(newVal){
			  if(newVal) $scope.showPositionList(0);
			});
		}
	};
}]);
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
'use strict';

angular.module('app').directive('appPositionList', [function() {
	return {
		restrict: 'A',
		replace: true,
		templateUrl: 'view/template/positionList.html',
		scope: {
			data: '=',
			filterObj: '='
		}
	};
}]);
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
'use strict';

angular.module('app').directive('appTab', [function() {
	return {
		restrict: 'A',
		replace: true,
		scope: {
			list: '=',
			tabClick: '&'
		},
		templateUrl: 'view/template/tab.html',
		link: function($scope) {
			$scope.click = function(tab) {
			  $scope.selectId = tab.id;
			  $scope.tabClick(tab);
			};
		}
	};
}]);
'use strict';

angular.module('app').filter('filterByObj', [function() {
	return function(list, obj) {
		var result = [];
		angular.forEach(list, function(item) {
			var isEqual = true;
			for(var e in obj) {
				if(item[e] !== obj[e]) {
					isEqual = false;
				}
			}
			if(isEqual) {
				result.push(item);
			}
		});
		return result;
	};
}]);