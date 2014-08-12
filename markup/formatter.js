String.prototype.format = function() {
	function randomInt(e,m) {
		return e-1+Math.round(1+Math.random()*(m-e));
	};

	var text = "";
	var pause = false;
	var snippet = -1;
	var snippets = {};
	var replacements = {};
	this.split("\n").forEach(function(v) {
		var v = v.trim();
		if(v == '<!--' || v == '-->' || v.indexOf('..# ') === 0)
			return;

		var snippet_cmd = v.match(/^snippet ([0-9]+) ([begin|end|insert]+)(.*?)$/);
		if(snippet_cmd) {
			if(snippet_cmd[2] == 'begin')
				snippet = snippet_cmd[1];
			else if(snippet_cmd[2] == 'end')
				snippet = -1;
			else if(snippet_cmd[2] == 'insert') {
				var str = snippets[snippet_cmd[1]].join("\n");
				if(snippet_cmd[3]) {
					var args = snippet_cmd[3].trim().split('; ');
					args.forEach(function(v,k) {
						str = str.split('{{'+k+'}}').join(v);
					});
				}
				text += str.format();
			}
			return;
		}

		if(snippet != -1) {
			if(!snippets[snippet])
				snippets[snippet] = [];
			//v = v.replace('<!--', '').replace('-->', '');
			snippets[snippet].push(v);
			return;
		}

		var replace = v.match(/^replace (.+?) with (.+)$/);
		if(replace) {
			replacements[replace[1]] = replace[2];
			return;
		}

		if(v == 'pause formatting') {
			pause = true;
			return;
		}
		else if(v == 'resume formatting') {
			pause = false;
			return;
		}

		for (var replace in replacements) {
			if(replacements.hasOwnProperty(replace)) {
				v = v.split(replace).join(replacements[replace]);
			}
		}

		// check for html tags before autolinking
		var html = v.match(/^[^<>]+$/);

		if(String.prototype.autoLink) {
			v = v.autoLink({
				target: '_blank'
			});
		}

		v = v.replace(/\.\.age\((.+?)\)/g, function(match, date) {
			var birthday = +new Date(date);
			if(isNaN(birthday)) {
				console.error("..age didn't get a valid argument.");
				return 'error';
			}
			var b = ~~((Date.now() - birthday) / (31557600000));
			return b;
		});


		v = v.replace(/\.\.unscramble\(([0-9-]*)\)/g, function(match, scrambled) {
			if(scrambled.length === 0) {
				console.error("..unscramble didn't get a valid argument.");
				return 'error';
			}
			var str = '';
			var codes = scrambled.split('-');
			for(var i = 0; i < codes.length; i++)
				str += String.fromCharCode(codes[i]-i);
			return str;
		});

		v = v.replace(/\.\.pick\((.*?)\)/g, function(match, args) {
			if(args.length === 0) {
				console.error("..pick didn't get enough arguments.");
				return 'error';
			}
			args = args.split('; ');
			return args[randomInt(0, args.length-1)];
		});

		v = v.replace(/\.\.rating\((.*?)\)/g, function(match, args) {
			if(args.length === 0) {
				console.error("..rating didn't get enough arguments.");
				return 'error';
			}
			var head = document.getElementsByTagName('head')[0];
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = 'http://tobiass.nl/play_rating.php?callback=_rating&package='+args;
			head.appendChild(script);
			return '<span data-rating="'+args+'"></span>';
		});
		
		if(pause)
			text += v;
		else {
			var newline = v.match(/^newline( x [0-9]+)?/);
			if(newline) {
				var count = 1;
				if(newline[1])
					count = newline[1].substr(2);
				for(var i = 0; i < count; i++)
					text += '<br>';
			}
			else if(html)
				text += v+'<br>';
			else
				text += v;
		}
	});

	return text;
};

String.prototype.scramble = function() {
	var codes = [];
	for(var i = 0; i < this.length; i++) {
		codes.push(this.charCodeAt(i)+i);
	}
	return codes.join('-');
};

_rating = function(json) {
	if(json && !json.error)
		Sizzle('span[data-rating="'+json.package+'"]')[0].innerHTML = 'Average out of '+json.ratingCount+' ratings: <b>'+(Math.round(json.ratingValue*100)/100)+'</b>';
}