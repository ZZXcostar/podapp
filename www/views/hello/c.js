angular.module("hello.ctrl", [])
.controller("helloCtrl", ['$scope', '$state', function ($scope, $state) {
	$scope.enter = function(){
		$state.go("charge");
		$scope.$broadcast("scroll.refreshComplete");
	};
}]);
