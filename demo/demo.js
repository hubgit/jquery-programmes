var app = angular.module('bbcPlayerApp', ['ngResource']);

app.controller('programmesListController', function ($scope, $http, $rootScope) {
	var url = 'http://www.bbc.co.uk/programmes/genres/music/player.json';

	$http.get(url).success(function(data) {
		$scope.programmes = data.category_slice.programmes;
	});

	$scope.programmeSelected = function(programme) {
		$rootScope.$broadcast('programmeSelected', programme);
	};
});

app.controller('episodeController', function ($scope, $rootScope, $resource) {
	var service = 'http://www.bbc.co.uk/programmes/';

	var Programme = $resource(service + ':pid.json', { pid: '@pid' }, {
		getEpisodes: {
			method: 'GET',
			url: service + ':pid/episodes/player.json',
		}
	});

	$rootScope.$on('programmeSelected', function(event, programme) {
		$scope.player = null;
		$scope.episode = null;
		$scope.version = null;

		//console.log('programme', programme);
		var series = new Programme(programme);

		// fetch episodes
		series.$getEpisodes().then(function(data) {
			//console.log('episodes', data);
			var episode = new Programme(data.episodes[0].programme);

			// fetch episode
			episode.$get().then(function(data) {
				//console.log('episode', data);
				$scope.episode = data.programme;

				var version = new Programme(data.programme.versions[0]);

				// fetch version
				version.$get().then(function(data) {
					//console.log('version', data);
					$scope.version = data.version;

					$rootScope.$broadcast('segmentsUpdated', data.version.segment_events);
				});
			});
		});
	});

	$scope.trackSelected = function(segment) {
		$rootScope.$broadcast('trackSelected', segment);
	};
});

app.controller('trackController', function ($scope, $rootScope, $http, $sce) {
	$rootScope.$on('trackSelected', function(event, segment) {
		var url = 'http://toma.hk/embed.php?disabled=[]&autoplay=true' + '&artist=' + encodeURIComponent(segment.artist) + '&title=' + encodeURIComponent(segment.title);
		$scope.src = $sce.trustAsResourceUrl(url);
	});
});