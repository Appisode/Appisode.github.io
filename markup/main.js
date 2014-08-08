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
};