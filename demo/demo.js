$(function() {
	var status = $('#status');

	var template = Handlebars.compile($('#episode-template').html());
	Handlebars.registerPartial('segment', $('#segment-template').html());

	var fetchBrands = function() {
		status.text('Finding available shows…');
		$('#programmes').empty();

		$.programmes.get('genres/music/player').done(function(data) {
			status.empty();

			var container = $('#programmes').empty();

			$.each(data.category_slice.programmes, function(i, programme) {
				var link = $('<a/>', {
					href: '#' + programme.pid,
					text: programme.title
				}).data('pid', programme.pid);

				$('<div/>').append(link).appendTo('#programmes');
			});
		});
	};

	var fetchLatestEpisode = function(event) {
		event.preventDefault();
		$('#episode').empty();

		var pid = $(event.target).data('pid');

		status.text('Finding latest episode…');
		$.programmes.get(pid + '/episodes/player').done(function(data) {
			var pid = data.episodes[0].programme.pid;

			status.text('Fetching episode details…');
			$.programmes.get(pid).done(function(data) {
				var episode = data.programme;
				var pid = episode.versions[0].pid;

				status.text('Fetching episode version…');
				$.programmes.get(pid).done(function(data) {
					status.empty();
					data.version.episode = episode;
					console.log(data);
					$('#episode').html(template(data.version));
				})
			})
		});
	};

	var playTrack = function(event) {
		event.preventDefault();

		var track = $(event.target).closest('[itemscope]');

		var player = window.tomahkAPI.Track(track.microdata('byArtist'), track.microdata('name'), {
		    width: 300,
		    height: 300,
		    disabledResolvers: [],
		    handlers: {
		        onended: function() {
		            track.next('[itemscope]').find('button').click();
		        }
		    }
		});

		track.find('.tomahk').html(player.render());
	};

	fetchBrands();
	$('#programmes').on('click', 'a', fetchLatestEpisode);
	$('#episode').on('click', 'button', playTrack);
});