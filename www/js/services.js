angular.module("app.services", [])
	.factory("Records", function () {
		/*var classif = [
			["餐饮伙食", "出行交通", "休闲娱乐", "话费网费", "生活日用", "服装饰品", "电器家私", "教育培训", "育儿养老", "医疗保健", "红包礼金", "房租按揭", "善款彩票", "保险投资", "其它支出"],
			["工资收入", "投资收入", "礼金收入", "其它收入"]
		];*/
    var classif = [
      [
        {name: '餐饮伙食', img: './img/D_1.png'},{name: '出行交通', img: './img/D_2.png'},
        {name: '休闲娱乐', img: './img/D_3.png'},{name: '话费网费', img: './img/D_4.png'},
        {name: '生活日用', img: './img/D_5.png'},{name: '服装饰品', img: './img/D_6.png'},
        {name: '电器家私', img: './img/D_7.png'},{name: '教育培训', img: './img/D_8.png'},
        {name: '育儿养老', img: './img/D_9.png'},{name: '医疗保健', img: './img/D_10.png'},
        {name: '红包礼金', img: './img/D_11.png'},{name: '房租按揭', img: './img/D_12.png'},
        {name: '善款彩票', img: './img/D_13.png'},{name: '保险投资', img: './img/D_14.png'},
        {name: '其它支出', img: './img/D_15.png'}
      ],
      [
        {name: '工资收入', img: './img/E_1.png'},{name: '投资收入', img: './img/E_2.png'},
        {name: '礼金收入', img: './img/E_3.png'},{name: '其它收入', img: './img/E_4.png'}
    ]
    ];
    var data = [];
		var key = "__POD_RECORDS__";
		// 载入全部数据
		var loadData = function () {
			var rd = localStorage[key];
			if (typeof rd === 'undefined' || !angular.isString(rd) || rd === 'undefined' || rd.length < 2) {
				data = [];
			} else {
				data = angular.fromJson(rd);
			}
		};
		// 保存全部数据
		var saveData = function () {
			localStorage[key] = angular.toJson(data);
		};
		// 取得id对应数据的下标值
		var getIndex = function (id) {
			for (var i = 0; i < data.length; i++) {
				if (data[i].id == id) {
					return i;
				}
			}
			return -1;
		};
		// 载入数据: 取得指定年份和月份的所有记录
		var load = function (year, month) {
			loadData();
			// console.log("all data:", data);
			var arr = [];
			var ts = (new Date(year, month - 1, 1)).getTime(); //开始日期
			var te = (new Date(year, month, 0)).getTime();//结束
			// console.log("数据日期：", year +'年'+ month +'月');
			// console.log("时间段：", ts +'～'+ te);
			for(var i = 0; i < data.length; i++){
				// 在开始和结束日期之间
				if (data[i].date >= ts && data[i].date <= te){
					arr.push(data[i]);
				}
			}
			return arr;
		};
		// 保存数据: 新增或更新
		var save = function (arr) {
			if (angular.isObject(arr)) {
				loadData();
				var index =
					(typeof arr.id === 'undefined' || arr.id == '') ?
					-1 : getIndex(arr.id);
				if (index > -1) {
					// 更新数据
					data[index].class = arr.class * 1;
					data[index].subClass = arr.subClass * 1;
					data[index].value = arr.value * 1;
					data[index].date = Date.now();
				} else {
					// 添加数据
					data.push({
						id: Date.now() +''+ Math.round(Math.random() * 899 + 100),
						class: arr.class * 1,
						subClass: arr.subClass * 1,
						value: arr.value * 1,
						date: arr.date
					});
				}
				saveData();
			}
		};
		// 删除数据
    var remove = function (id) {
      loadData();
      var index = getIndex(id);
      if (index > -1) {
        data.splice(index, 1);
        saveData();
      }
    };
    var rnd = function (a, b) {
      return parseInt(Math.random() * Math.abs(b - a) + Math.min(a, b));
    };
    return {
      get: function () {
        return classif;
      },
      all: function () {
        loadData();
        return data;
      },
      load: load,
      save: save,
      remove: remove,
      rand: function (n) {
        data = [];
        // 随机数组模型：不同的主类和子类有不同的概率和数值区间
        // 收支分类金额区间
        var values = [
          [
            [5, 50], // "餐饮伙食"
            [2, 30], // "出行交通"
            [50, 200], // "休闲娱乐"
            [50, 100], // "话费网费"
            [20, 150], // "生活日用"
            [100, 400], // "服装饰品"
            [100, 1200], // "电器家私"
            [600, 3000], // "教育培训"
            [500, 2000], // "育儿养老"
            [200, 1000], // "医疗保健"
            [20, 200], // "红包礼金"
            [1500, 2200], // "房租按揭"
            [2, 50], // "善款彩票"
            [300, 3000], // "保险投资"
            [1, 100] // "其它支出"
          ],
          [
            [16000, 18000], // "工资收入"
            [1200, 5000], // "投资收入"
            [200, 600], // "礼金收入"
            [50, 300] // "其它收入"
          ]
        ];
        // 收支概率因子
        var facts = [
          [
            252, //.. "餐饮伙食" 月 84 周 21 日  3
            168, //.. "出行交通" 月 56 周 14 日  2
            12, //... "休闲娱乐" 月  4 周  1 日.16
            3, //.... "话费网费" 月  1 周.25 日.04
            84, //... "生活日用" 月 28 周  7 日  1
            12, //... "服装饰品" 月  4 周  1 日.14
            3, //.... "电器家私" 月  1 周.25 日.04
            1, //.... "教育培训" 月 .3 周.08 日.01
            3, //.... "育儿养老" 月  1 周.25 日.04
            12, //... "医疗保健" 月  4 周  1 日.14
            24, //... "红包礼金" 月  8 周  2 日.28
            3, //.... "房租按揭" 月  1 周.25 日.04
            12, //... "善款彩票" 月  4 周  1 日.14
            3, //.... "保险投资" 月 .3 周.08 日.01
            84 //.... "其它支出" 月 28 周  7 日  1
            //..................... 每日合计：8.04
          ],
          [
            3, //.... "工资收入" 月  1 周.25 日.04
            1, //.... "投资收入" 月 .3 周.08 日.01
            12, //... "礼金收入" 月  4 周  1 日.14
            24 //.... "其它收入" 月  8 周  2 日.28
            //..................... 每日合计：0.47
          ]
          //....................... 每日共计：8.51
        ];
        // 生成概率数组 chance = [ [收支主类, 收支子类], [收支主类, 收支子类], ... ]
        var chance = [];
        for (var i = 0; i < facts.length; i++) { //..... i ... 主类
          for (var j = 0; j < facts[i].length; j++) { // j ... 子类
            for (var k = 0; k < facts[i][j]; k++) { //.. k ... 概率因子
              chance.push([i, j]); //......................... 概率分布数组
            }
          }
        }
        // console.log("收支分类概率数组：", chance);
        // 产生随机数据
        var year = n || 2017; // 开始年份, 默认2017
        var t = new Date();
        var dateStart = (new Date(year, 0, 1)).getTime(); // 开始: 年份1月1日
        var dateToday = (new Date(t.getFullYear(), t.getMonth(), t.getDate() + 1)).getTime(); // 结束：明天0点前
        // console.log("开始日期：", new Date(dateStart));
        // console.log("结束日期：", new Date(dateToday));
        var p = 1000 * 60 * 60 * (24 / 8.51); // 每日 8.51 数据项
        for (i = dateStart; i < dateToday; i += p) {
          var r = rnd(0, chance.length); // 随机收支类别
          //   console.log("随机收支类别：", r);
          k = values[chance[r][0]][chance[r][1]]; // 分类金额区间
          //   console.log("分类金额区间：", k);
          data.push({
            id: i, // + '' + rnd(0, 10000), // 时间序列值 + 随机字符, 尽量避免产生重复的 id
            class: chance[r][0], // 主类
            subClass: chance[r][1], // 子类
            value: rnd(k[0], k[1]), // 随机金额：在金额区间内取随机值
            date: i
          });
        }
        // 保存!
        saveData();
      }
    };
  });
