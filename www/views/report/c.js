angular.module("report.ctrl", []).controller("reportCtrl", [
  "$scope",
  "Records",
  "$interval",
  function ($scope, Records, $interval) {
    $scope.classif = Records.get();
    // console.log("收支分类：", $scope.classif);

    $scope.data = $scope.records = [];

    // 今年收支汇总统计清单
    $scope.lists = function () {
      $scope.data = [];
      $scope.list = [0, 0, 0];
      $scope.records = Records.all();
      // console.log("所有收支数据：", $scope.records);

      // 初始化统计数组
      for (var i = 0; i < $scope.classif.length; i++) {
        $scope.data.push([]);
        for (var j = 0; j < $scope.classif[i].length; j++) {
          $scope.data[i].push({
            name: $scope.classif[i][j].name,
            y: 0
          });
        }
      }

      // 筛选今年
      var year = (new Date()).getFullYear();
      var dateStart = (new Date(year, 0, 1)).getTime();
      var dateEnd = Date.now();

      // 汇总统计
      for (i = 0; i < $scope.records.length; i++) {
        var d = $scope.records[i].date;
        if (d >= dateStart && d <= dateEnd) {
          var c = $scope.records[i].class;
          var s = $scope.records[i].subClass;
          var v = $scope.records[i].value;
          $scope.data[c][s].y += v;
          $scope.list[c] += v;
          $scope.list[2] += v * (c ? 1 : -1);
        }
      }
      // 排序：按金额降序
      $scope.data[1].sort(function (a, b) {
        return a.y < b.y;
      });
      $scope.data[0].sort(function (a, b) {
        return a.y < b.y;
      });
      // console.log("收支分类汇总统计数据：", $scope.data);
      console.log("饼图-支出分类汇数据：", $scope.data[0]);
    };
    $scope.lists();
    // 饼图：支出分类汇总统计
    // 刷新标志变量（真值：刷新，假值：不刷新；设定标志可减少网页压力）
    $scope.refresh = false;
    // 饼图
    $scope.pieConfig = {
      title: {
        text: "支出分类汇总统计"
      },
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        ///////////////////////////////////////////////////////////////////////////////////
        events: { // ----- 饼图事件
          load: function (event) { // ----- 加载数据模块
            var _data = this.series[0]; // 必须转换饼图数据对象为静态值才能够在事件中调用到！
            $interval(function () {
              if ($scope.refresh) { // 标志值 $scope.refresh 为真才刷新饼图
                for (var i = 0; i < $scope.data[0].length; i++) {
                  // 动态加入数据：highcharts .series .addPoint(数据, 重绘布尔值, 即时布尔值)
                  _data.addPoint({
                    name: $scope.data[0][i].name,
                    y: $scope.data[0][i].y
                  }, true, true);
                }
                $scope.refresh = false; // 完成刷新，标志恢复为假值，直到下次真值……
              }
            }, 1000);
          }
        }
        ///////////////////////////////////////////////////////////////////////////////////
      },
      // tooltip: {
      //   pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      // },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false
          },
          showInLegend: true
        }
      },
      series: [{
        name: "支出分类",
        data: $scope.data[0]
      }],
    };
    // 刷新饼图
    $scope.reDraw = function () {
      console.log("重绘饼图……");
      $scope.lists(); // 取新的数据
      $scope.refresh = true; // 激活饼图刷新事件！
      $scope.$broadcast("scroll.refreshComplete");
    };
  }
]);

/*
 $scope.info = {
 enabled: true,
 alpha: 0,
 beta: 0,
 depth: 0,
 ad: 10,
 bd: 10,
 dd: 5
 };
 $scope.chartData = [.5, .25, .8, .7, .32];
 $scope.chartConfig = {
 title: {
 text: "更新数据"
 },
 chart: {
 type: 'column',
 options3d: $scope.info,
 colorToPoint: true,
 inverse: true,
 events: {
 load: function (event) {
 var _dat = this.series[0];
 var _bar = this.options.chart.options3d;
 // var _bar = ["options3d"];
 $interval(function () {
 $scope.info.alpha += $scope.info.ad;
 if ($scope.info.alpha > 90 || $scope.info.alpha < 0) {
 $scope.info.ad = -$scope.info.ad;
 }
 _bar.alpha = $scope.info.alpha;
 $scope.info.beta += $scope.info.bd;
 if ($scope.info.beta > 90 || $scope.info.beta < 0) {
 $scope.info.bd = -$scope.info.bd;
 }
 _bar.beta = $scope.info.beta;
 $scope.info.depth += $scope.info.dd;
 if ($scope.info.depth > 100 || $scope.info.depth < 0) {
 $scope.info.dd = -$scope.info.dd;
 }
 _bar.depth = $scope.info.depth;
 _dat.addPoint(Math.random(), true, true);
 }, 550);
 }
 }
 },
 plotOptions: {
 column: {
 depth: 25
 }
 },
 xAxis: {
 //categories: Highcharts.getOptions().lang.shortMonths
 },
 yAxis: {
 title: {
 text: null
 }
 },
 legend: {
 enabled: false
 },
 series: [{
 data: $scope.chartData
 }],
 };
 }

 // 条形对比图
 var categories = ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月'];
 $scope.blockConfig = {
 chart: {
 type: 'bar'
 },
 title: {
 text: '历年每月收支汇总对比图'
 },
 subtitle: {
 text: ''
 },
 xAxis: [{
 categories: categories,
 reversed: false,
 labels: {
 step: 1
 }
 }, {
 opposite: true,
 reversed: false,
 categories: categories,
 linkedTo: 0,
 labels: {
 step: 1
 }
 }],
 yAxis: {
 title: {
 text: null
 },
 labels: {
 formatter: function () {
 return Math.abs(this.value); // + '%'
 }
 }
 },
 plotOptions: {
 series: {
 stacking: 'normal'
 }
 },
 tooltip: {
 formatter: function () {
 return '<b>' + this.point.category + ' 总' + this.series.name + '</b><br>' +
 '金额 ' + Highcharts.numberFormat(Math.round(this.point.y), 0) + ' 元';
 }
 },
 series: [{
 name: '收入',
 data: $scope.plot[1] // [1000.5, 1500.5, 2000.7, 1600, 1800, 2000.4, 2100, 1500.9, 2000, 1600, 2000, 1600]
 }, {
 name: '支出',
 data: $scope.plot[0] // [-1500.5, -1100, -1000, -1600, -1300, -1800, -1900, -1200, -1200, -1000, -1200, -1100]
 }]
 };
 // 条形图：历年每月收支对比统计
 $scope.reload = function () {
 var data = [];
 for (var i = 0; i < $scope.classif[0].length; i++) {
 data.push(0);
 }
 for (i = 0; i < $scope.records.length; i++) {
 if ($scope.records[i].class == 0) {
 data[$scope.records[i].subClass] += $scope.records[i].value;
 }
 }
 $scope.pieData = []; // 用于 饼图
 for (i = 0; i < data.length; i++) {
 $scope.pieData.push({
 name: $scope.classif[0][i],
 y: data[i]
 });
 }
 // 条形图数据
 $scope.plot = [
 [],
 []
 ];
 for (var i = 0; i < 12; i++) {
 $scope.plot[0].push(0); // 每月支出
 $scope.plot[1].push(0); // 每月收入
 }
 for (i = 0; i < $scope.records.length; i++) {
 var m = (new Date($scope.records[i].date)).getMonth(); // 取原数据的月份值
 $scope.plot[$scope.records[i].class][m] += $scope.records[i].value;
 }
 for (var i = 0; i < 12; i++) {
 $scope.plot[0][i] = -$scope.plot[0][i]; // 修正每月支出：改为负值
 }
 };
 // 取得饼图数据
 // $scope.reload();

 */
