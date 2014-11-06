window.onload = function() {
	var textElement = document.getElementById('text');
	textElement.innerHTML = textElement.innerHTML.format();
	textElement.style.display = 'block';
	
	(function(hash) {
		if(hash) {
			location.hash = "#";
			location.hash = hash;
		}
	})(location.hash);

	var commitsUnfold = document.getElementById('commits-unfold');
	var commitsArrow = document.getElementById('commits-arrow');
	var commitsHidden = document.getElementById('commits-hidden');
	commitsUnfold.onclick = function() {
		if(commitsArrow.className === 'arrow-down') {
			commitsArrow.className = 'arrow-up';
			commitsHidden.className = '';
			window.scrollTo(0, document.body.scrollHeight);
		}
		else if(commitsArrow.className === 'arrow-up') {
			commitsArrow.className = 'arrow-down';
			commitsHidden.className = 'hidden';
		}
	};
};

window._gh_commits = function(data) {
	var count = 0;
	var commits = document.getElementById('commits-hidden');
	if(data.meta['status'] !== 200)
		return;
	document.getElementById('commits').style.display = 'block';
	data.data.every(function(v) {
		console.log(v.sha.substr(0, 7));
		var div = document.createElement('DIV');
		div.className = 'commit';
		div.innerHTML = '<a href="'+v.html_url+'" target="_blank">'+v.sha.substr(0, 7)+'</a>: '+v.commit.message;
		commits.appendChild(div);
		count++;
		return count < 5;
	});
};