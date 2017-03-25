'use strict';

angular.module('app', ['ui.router', 'ngCookies', 'validation', 'ngAnimate']);

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
			error: '不能为空！'
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
	$http({
		method: 'GET',
		url: '/data/myFavorite.json'
	}).then(function(success) {
		$scope.list = success.data;
	});
}]);
'use strict';

angular.module('app').controller('loginCtrl', ['cache', '$scope', '$state', '$http', function(cache, $scope, $state, $http) {
	$scope.submit = function() {
		$http.post('/data/login.json', $scope.user).success(function(resp) {
			cache.put('id', resp.data.id);
			cache.put('name', resp.data.name);
			cache.put('image', resp.data.image);
			$state.go('main');
		})
	}
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

angular.module('app').controller('myCtrl', ['$state','cache', '$scope', '$http', function($state, cache, $scope, $http) {
	if(cache.get('name')) {
		$scope.name = cache.get('name');
		$scope.image = cache.get('image');
	}
	$scope.signout = function() {
		cache.remove('id');
		cache.remove('name');
		cache.remove('image');
		$state.go('main');
	}
}]);
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
	}];

	$http({
		method: 'GET',
		url: '/data/myPost.json'
	}).then(function(success) {
		$scope.positionList = success.data;
	});
	
	$scope.filterObj = {};
	
	$scope.tClick = function(id, name) {
	  switch (id) {
	    case 'all':
	      delete $scope.filterObj.state;
	      break;
	    case 'pass':
	      $scope.filterObj.state = '1';
	      break;
	    case 'fail':
	      $scope.filterObj.state = '-1';         
	      break;
	    default:

	  }
	}
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

angular.module('app').directive('appHead', ['cache', function(cache) {
	return {
		restrict: 'A',
		replace: true,
		templateUrl: 'view/template/head.html',
		link: function($scope) {
			$scope.name = cache.get('name') || '';
		}
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

angular.module('app').directive('appPositionInfo', ['$http', function($http) {
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
			$scope.$watch('position', function(newVal) {
				if(newVal) {
					$scope.position.select = $scope.position.select || false;
					$scope.imagePath = $scope.position.select?'image/star-active.png':'image/star.png';
				}
			})

			$scope.favorite = function() {
				$http.post('/data/favorite.json', {
					id: $scope.position.id,
					select: $scope.position.select
				}).success(function(resp) {
					$scope.position.select = !$scope.position.select;
					$scope.imagePath = $scope.position.select?'image/star-active.png':'image/star.png';
				});
			}
		}
	}
}]);
'use strict';

angular.module('app').directive('appPositionList', ['$http', function($http) {
	return {
		restrict: 'A',
		replace: true,
		templateUrl: 'view/template/positionList.html',
		scope: {
			data: '=',
			filterObj: '=',
			isFavorite: '='
		},
		link: function($scope) {
			$scope.select = function(item) {
				$http.post('/data/favorite.json', {
					id: item.id,
					select: !item.select
				}).success(function(resp) {
					item.select = !item.select;
				});
			}
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
			$scope.selectId = $scope.list[0].id;
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
'use strict';

angular.module('app').service('cache', ['$cookies', function($cookies){
    this.put = function(key, value){
      $cookies.put(key, value);
    };
    this.get = function(key) {
      return $cookies.get(key);
    };
    this.remove = function(key) {
      $cookies.remove(key);
    };
}]);
