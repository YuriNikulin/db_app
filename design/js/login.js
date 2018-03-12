window.addEventListener('load', function() {
	var parameters = "?script=login.php",
		answer;
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onload = function() {
		answer = JSON.parse(this.response);
		
		if (answer.success) {
			fetchAllDb();
		} else {
			login();
		}
	}
	xmlhttp.open("GET", 'func.php' + parameters, true);
	xmlhttp.send();
})


