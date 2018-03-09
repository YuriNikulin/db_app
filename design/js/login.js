window.addEventListener('load', function() {
	var lContainer = document.querySelector('.login'),
		lSubmit = lContainer.querySelector('#login_submit'),
		lUsername = lContainer.querySelector('#login_username'),
		lPassword = lContainer.querySelector('#login_password'),
		lPhpScript = getScript('connect'),
		lParameters;

	lSubmit.addEventListener('click', function() {
		lParameters = '?username=' + lUsername.value + '&password=' + lPassword.value + '&script=connect.php';
		xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			
			if (this.readyState == 4 && this.status == 200) {
				
				console.log(this.responseText);
			}  
		};
		
		xmlhttp.open("GET", 'func.php' + lParameters, true);
		xmlhttp.send();
	})	
})


