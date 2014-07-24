String.prototype.format = function() {
	var text = "";
	var pause = false;
	this.split("\n").forEach(function(v) {
		var v = v.trim();
		if(v == 'pause formatting') {
			pause = true;
			return;
		}
		else if(v == 'resume formatting') {
			pause = false;
			return;
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