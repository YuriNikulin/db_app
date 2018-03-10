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

	function login() {
		var lContainer = document.querySelector('.login'),
			lSubmit = lContainer.querySelector('#login_submit'),
			lUsername = lContainer.querySelector('#login_username'),
			lPassword = lContainer.querySelector('#login_password'),
			lParameters, lAnswer, lAnim, unloginButton;

		showElem(lContainer);	

		lSubmit.addEventListener('click', function() {
			lParameters = '?username=' + lUsername.value + '&password=' + lPassword.value + '&script=connect.php';
			xmlhttp = new XMLHttpRequest();
			xmlhttp.onload = function() {
				lAnswer = JSON.parse(this.response);
				lAnim = lAnswer.timer || notificationDuration;
				showNotification(lAnswer.msg, lAnim);
				if (lAnswer.success) {
					fetchAllDb();
					hideElem(lContainer);
				}
			}
			
			xmlhttp.open("GET", 'func.php' + lParameters, true);
			xmlhttp.send();
		})	
	}

})


