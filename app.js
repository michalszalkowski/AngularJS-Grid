(function () {
	angular.module('BtGrid', ['ngSanitize'])

		.controller('btTestCtrl', ["$scope", function ($scope) {

			$scope.types = [
				{id: 1, name: 'A'},
				{id: 2, name: 'B'}
			];

			$scope.data = [
				{TEST: {ID: 1}, NAME: 'test1', PERSON: {DATE: new Date().getTime(), TYPE: 1}},
				{TEST: {ID: 2}, NAME: 'test2', PERSON: {DATE: new Date().getTime(), TYPE: 2}},
				{TEST: {ID: 3}, NAME: 'test3', PERSON: {DATE: new Date().getTime(), TYPE: 3}},
				{TEST: {ID: 4}, NAME: 'test4', PERSON: {DATE: new Date().getTime(), TYPE: 3}},
				{TEST: {ID: 5}, NAME: 'test5', PERSON: {DATE: new Date().getTime(), TYPE: 3}},
				{TEST: {ID: 6}, NAME: 'test6', PERSON: {DATE: new Date().getTime(), TYPE: 3}},
				{TEST: {ID: 7}, NAME: 'test7', PERSON: {DATE: new Date().getTime(), TYPE: 2}},
				{TEST: {ID: 8}, NAME: 'test8', PERSON: {DATE: new Date().getTime(), TYPE: 2}},
				{TEST: {ID: 9}, NAME: 'test9', PERSON: {DATE: new Date().getTime(), TYPE: 3}},
				{TEST: {ID: 10}, NAME: 'test10', PERSON: {DATE: new Date().getTime(), TYPE: 3}}
			];

			$scope.addRow = function () {
				$scope.data.push({
					TEST: {ID: new Date().getTime()},
					NAME: 'test' + new Date().getTime(),
					PERSON: {DATE: new Date().getTime(), TYPE: 3}
				});
			};

			$scope.addType = function () {
				$scope.types.push({id: 3, name: 'C'});
			};

			$scope.someAction1 = function (data) {
				console.log('action 1', data);
			};

			$scope.someAction2 = function (data) {
				console.log('action 2', data);
			};
		}])

		.directive('btGrid', ["btGridService", function (btGridService) {
			return {
				transclude: true,
				scope: {
					rows: '='
				},
				controller: ["$scope", function ($scope) {
					$scope.columns = [];

					$scope.getCell = function (item, keys) {
						return btGridService.resolveCell(item, keys);
					};

					this.addColumn = function (column) {
						$scope.columns.push(column);
					}
				}],
				templateUrl: 'bt.grid.tpl.html'
			};
		}])

		.directive('btColumn', function () {
			return {
				transclude: true,
				require: '^btGrid',
				scope: {
					label: '@',
					keyModel: '@',
					renderer: '=',
					type: '@',
					click: '&'
				},
				link: function (scope, element, attrs, controller) {

					controller.addColumn({
						label: scope.label,
						keyModel: scope.keyModel,
						renderer: scope.renderer || {name: 'btDefault'},
						type: scope.type || 'cell',
						click: scope.click
					});
				}
			};
		})

		.service('btGridService', function () {
			this.resolveCell = function (item, keys) {
				var p = keys.split(".");
				var _item = item;
				p.forEach(function (key) {
					_item = _item[key];
				});
				return _item;
			}
		})

		.filter('btRendererObj', ["$filter", function ($filter) {
			return function (input, filter, row) {
				if (filter === undefined) {
					return input;
				}
				if (filter.params !== undefined || row !== undefined) {
					return $filter(filter.name)(input, filter.params, row);
				} else if (filter.params !== undefined) {
					return $filter(filter.name)(input, filter.params);
				} else {
					return $filter(filter.name)(input);
				}
			};
		}])

		.filter('btDefault', function () {
			return function (input) {
				return input;
			};
		})

		.filter('btShowRow', ["$filter", function ($filter) {
			return function (input, params, row) {
				return $filter('json')(row);
			};
		}])

		.filter('btLink', function () {
			return function (input, params) {
				var url = params.replace("TEST.ID", input);
				return '<a href="' + url + '">Link</a>';
			};
		})

		.filter('btDictionaryFormatter', function () {
			return function (id, arr) {
				var name = id;
				angular.forEach(arr, function (item) {
					if (item.id == id) {
						name = item.name;
					}
				});
				return name;
			};
		})

	;
})();