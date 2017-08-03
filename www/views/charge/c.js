angular.module("charge.ctrl", [])
.controller("chargeCtrl", ['$scope', 'ionicDatePicker', '$state', 'Records', //$state 注入下拉进入
    function($scope, ionicDatePicker, $state, Records){
    $scope.classif = Records.get();
    //console.log("收支分类：", $scope.classif);
    $scope.data = [];
    // 日常记账数据：
    $scope.info = {
        id: '',
        class: 0,
        subClass: 0,
        value: '0',
        date: Date.now()
    };
    // 日期控件, 基本数据结构在 .config()里定义
    $scope.openp = function (){
        var config = {
            callback: function (val) {
                $scope.info.date = val; // 回调函数：日期取值
            },
            to: new Date(),
            inputDate: new Date($scope.info.date)
        };
        ionicDatePicker.openDatePicker(config);
    };
    // 输入
    $scope.N = function(s){
        if ($scope.info.value === '0') {
            if (s === '00') return;
            $scope.info.value = '' + s;
        } else {
            $scope.info.value += ''+ s;
        }
    };
    // 清空
    $scope.C = function(){
        $scope.info.value = '0';
    };
    // 退格
    $scope.B = function(){
        var len = $scope.info.value.length;
        if (len < 2) {
            $scope.info.value = "0";
        } else {
            $scope.info.value = $scope.info.value.substr(0, len - 1);
        }
    };
    // 小数点
    $scope.P = function(){
        if ($scope.info.value.indexOf('.') > -1) return;
        $scope.info.value += '.';
    };
    // 记录：保存到 localStorage
    $scope.I = function(){
        if ($scope.info.value > 0) {
            console.log("输入值：", $scope.info);
            Records.save($scope.info);
            $scope.info.value = '0';
            $scope.list();
        }
    };
    // 结束
    $scope.F = function(){
        $scope.I();
        $state.go('report'); //下拉进入
    };
    // 收支分类选择:
    $scope.set = function(n, index){
        $scope.info.class = n;
        $scope.info.subClass = index;
    };
    // 取得本月所有记录数据
    $scope.list = function(){
        var md = new Date($scope.info.date * 1);
        $scope.data = Records.load(md.getFullYear(), md.getMonth() + 1);
        // console.log("list data:", $scope.data);
        $scope.tabstat();
    };
    // 监视刷新列表
    $scope.$watch("info.date", function(){
        // console.log("刷新数据...");
        $scope.list();
    });
    // 删除指定数据项
    $scope.delete = function(id){
        if(confirm("真的要删掉吗？")){
            Records.remove(id);
            $scope.list();
        }
    };
    // 数据汇总统计
    $scope.sum = [0, 0, 0];
    $scope.tabstat = function(){
        $scope.sum = [0, 0, 0];
        for(var i = 0; i < $scope.data.length; i++){
            $scope.sum[$scope.data[i].class] += $scope.data[i].value * 1;
        }
        $scope.sum[2] = $scope.sum[1] - $scope.sum[0];
    };
}])
