String.prototype.format = function() {
	var text = "";
	var pause = false;
	var snippet = -1;
	var snippets = {};
	var replacements = {};
	this.split("\n").forEach(function(v) {
		var v = v.trim();

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
			snippets[snippet].push(v.replace('<!--', '').replace('-->', ''));
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

		v = v.autoLink({
			target: '_blank'
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
			else if(v.match(/^[^<>]+$/))
				text += v+'<br>';
			else
				text += v;
		}
	});

	return text;
};