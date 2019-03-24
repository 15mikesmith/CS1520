var timeoutID;
var timeout = 1000;

function setup() {
	document.getElementById("submit_message").addEventListener("click", postMessage, true);
	timeoutID = window.setTimeout(pollForMessages, timeout);
}

function postMessage() {
	var httpRequest = new XMLHttpRequest();

	if (!httpRequest)
		return false;

	window.clearTimeout(timeoutID);
	var message = document.getElementById("new_message").value;
	
	httpRequest.onreadystatechange = function(){ handlePost(httpRequest, message) };
	
	httpRequest.open("POST", "/new_message");
	httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

	var data = "message=" + message;
	httpRequest.send(data);
}

function handlePost(httpRequest) {
	if (httpRequest.readyState === XMLHttpRequest.DONE) {
		if (httpRequest.status === 200) {
			addMessages(JSON.parse(httpRequest.responseText), true);
			clearInput();
			pollForMessages();
		}
	}
}

function pollForMessages() {

	var httpRequest = new XMLHttpRequest();

	if (!httpRequest)
		return false;

	httpRequest.onreadystatechange = function() { handlePoll(httpRequest) };
	httpRequest.open("GET", "/messages");
	httpRequest.send();
}

function handlePoll(httpRequest) {


	if (httpRequest.readyState === XMLHttpRequest.DONE) {
		if (httpRequest.status === 200) {
			addMessages(JSON.parse(httpRequest.responseText));
			timeoutID = window.setTimeout(pollForMessages, timeout);
		} 
	}
}

function clearInput() {
	document.getElementById("new_message").value = "";
}

function addMessages(messages, isPost) {
	var table = document.getElementById("message_list");
	var new_row, new_cell;
	var num_rows = table.rows.length;
	var num_messages = Object.keys(messages).length;
	
	if (isPost) {
		for (m in messages) {
				new_row = table.insertRow(-1);
				new_cell  = new_row.insertCell(-1);
				new_text  = document.createTextNode(m + " : " + messages[m]);
				new_cell.appendChild(new_text);
			}
	}
	else {
		if (num_messages > num_rows) {
			for (m in messages) {
				if (m < num_rows)
					delete messages[m];
			}
			
			for (m in messages) {
				for (user in messages[m]) {
					new_row = table.insertRow(-1);
					new_cell  = new_row.insertCell(-1);
					new_text  = document.createTextNode(user + " : " + messages[m][user]);
					new_cell.appendChild(new_text);
				}
			}
		}
	}
}

window.addEventListener("load", setup, true);