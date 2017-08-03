angular.module('podapp', [
    'ionic',
    'ionic-datepicker',
    'highcharts-ng',
    'app.services',
    'hello.ctrl',
    'charge.ctrl',
    'report.ctrl',
  ])
  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })
  .config(function ($stateProvider, $urlRouterProvider, ionicDatePickerProvider) {
    $stateProvider
      .state('hello', {
        url: '/hello',
        views: {
          'menuContent': {
            templateUrl: 'views/hello/p.html',
            controller: 'helloCtrl'
          }
        }
      })
      .state('charge', {
        url: '/charge',
        views: {
          'menuContent': {
            templateUrl: 'views/charge/p.html',
            controller: 'chargeCtrl'
          }
        }
      })
      .state('report', {
        url: '/report',
        views: {
          'menuContent': {
            templateUrl: 'views/report/p.html',
            controller: 'reportCtrl'
          }
        }
      });
    $urlRouterProvider.otherwise('/hello');

    // 日期控件的配置文件：
    // config()需要注入 ionicDatePickerProvider
    // 这个步骤相当于是全局配置，默认配置，
    // 可以在实际应用中覆盖相关的配置（不是必须的）
    var datePickerObj = {
      setLabel: '确定',
      todayLabel: '今天',
      closeLabel: '关闭',
      mondayFirst: true, // 星期一是第一天
      inputDate: new Date(),
      weeksList: ["日", "一", "二", "三", "四", "五", "六"],
      monthsList: [
        "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"
      ],
      templateType: 'popup',
      showTodayButton: true, // 显示 <今天> 按钮
      dateFormat: 'yyyy-MM-dd',
      closeOnSelect: true, // 选择日期后关闭对话框
      disableWeekdays: [],
      from: new Date(2016, 0, 1) // 起始值：本日期前无法选取
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
  })
  .controller('appCtrl', ['$scope', '$state', 'Records', function ($scope, $state, Records) {
    $scope.randata = function () {
      var year = (new Date()).getFullYear();
      var n = prompt("请输入开始年份或年数：");
      if (n == null) return;
      n = n.replace(/[ -]/g, '') * 1;
      year = (n <= year && n > 2000) ? n : (n < 10) ? year - n : year;
      console.log("随机开始年份：", year);
      Records.rand(year);
      $state.go('report');
    };
  }]);
