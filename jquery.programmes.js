/*
 * jQuery (BBC) Programmes v0.1
 * https://github.com/hubgit/jquery-programmes
 *
 * Copyright 2014 Alf Eaton
 * Released under the MIT license
 * http://git.macropus.org/mit-license/
 *
 * Date: 2014-01-19
 */
 (function($) {
 	$.programmes = {
 		get: function(path, data, options) {
 			options = $.extend({ tries: 3 }, options);

 			var params = {
 				//url: 'http://open.live.bbc.co.uk/aps/programmes/' + path + '.json',
 				url: 'http://www.bbc.co.uk/programmes/' + path + '.json',
 				dataType: 'json',
 				cache: true,
 			};

 			return $.ajaxQueue(params, options);
 		}
 	};
 })(jQuery);
