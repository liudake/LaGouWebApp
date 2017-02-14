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