var timeoutID;
var timeout = 1000;

function setup() {
	document.getElementById("theButton").addEventListener("click", addTodo, true);
	document.getElementById("theButton2").addEventListener("click", addTodo2, true);

	poller();
}

function makeReq(method, target, retCode, action, data) {
	var httpRequest = new XMLHttpRequest();

	if (!httpRequest) {
		alert('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	}

	httpRequest.onreadystatechange = makeHandler(httpRequest, retCode, action);
	httpRequest.open(method, target);
	
	if (data){
		httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		httpRequest.send(data);
	}
	else {
		httpRequest.send();
	}
}

function makeHandler(httpRequest, retCode, action) {
	function handler() {
		if (httpRequest.readyState === XMLHttpRequest.DONE) {
			if (httpRequest.status === retCode) {
				console.log("recieved response text:  " + httpRequest.responseText);
				action(httpRequest.responseText);
			} else {
				alert("There was a problem with the request.  you'll need to refresh the page!");
			}
		}
	}
	return handler;
}

function addTodo() {
	var newName = document.getElementById("newName").value

	var newAmount = document.getElementById("newAmount").value
	var newCategory = document.getElementById("newCategory").value
	var newDate = document.getElementById("newDate").value


	var data;
	data = "name=" + newName +","+ newAmount +","+  newCategory+","+ newDate;
	window.clearTimeout(timeoutID);
	makeReq("POST", "/purchases", 201, poller, data);

	document.getElementById("newName").value = "";
	document.getElementById("newAmount").value = "";
	document.getElementById("newCategory").value = "";
	document.getElementById("newDate").value = "";


}


function addTodo2() {
	var catName = document.getElementById("catName").value

	var catAmount = document.getElementById("catAmount").value

	var data;
	data = "cat=" + catName +","+ catAmount;
	window.clearTimeout(timeoutID);
	makeReq("POST", "/cat", 201, poller, data);
	document.getElementById("catName").value = "";
	document.getElementById("catAmount").value = "";

}


function poller() {
	//makeReq("GET", "/purchases", 200, repopulate);
	makeReq("GET", "/cat", 200, repopulate2);

}

function deleteTodo(taskID) {
	makeReq("DELETE", "/purchases/" + taskID, 204, poller);
}

function deleteCategory(taskID) {
	makeReq("DELETE", "/cat/" + taskID, 204, poller);
}


// helper function for repop:
function addCell(row, text) {
	var newCell = row.insertCell();
	var newText = document.createTextNode(text);
	newCell.appendChild(newText);
}

function addCellColon(row) {
	var newCell = row.insertCell();
	var newText = document.createTextNode(":");
	newCell.appendChild(newText);
}

function repopulate(responseText) {
	console.log("repopulating!");
	var todos = JSON.parse(responseText);
	var tab = document.getElementById("theTable");
	var newRow, newCell, t, task, newButton, newDelF;

	while (tab.rows.length > 0) {
		tab.deleteRow(0);
	}
	count = 1;
	for (t in todos) {
		newRow = tab.insertRow();
		addCell(newRow, count +". ");
		//addCell(newRow, t);
		for (task in todos[t]) {
			//console.log(task)
			addCell(newRow, task);
			addCellColon(newRow)
			addCell(newRow, todos[t][task]);
		}
		count++;
		newCell = newRow.insertCell();
		// newButton = document.createElement("input");
		// newButton.type = "button";
		// newButton.value = "Delete " + t;
		// (function(_t){ newButton.addEventListener("click", function() { deleteTodo(_t); }); })(t);
		// newCell.appendChild(newButton);
	}

	//timeoutID = window.setTimeout(poller, timeout);
}



function repopulate2(responseText) {
	console.log("repopulating!");
	var todos = JSON.parse(responseText);
	var tab = document.getElementById("theTable2");
	var newRow, newCell, t, task, newButton, newDelF;

	while (tab.rows.length > 0) {
		tab.deleteRow(0);
	}
	count = 1;
	for (t in todos) {
		newRow = tab.insertRow();
		addCell(newRow, count +". ");

		count2 = 0;
		for (task in todos[t]) {

			if(!isNaN(todos[t][task])){
				console.log(todos[t][task])

			}

						if (count2 == 0) {



					addCell(newRow, "$");

			}

			addCell(newRow, todos[t][task]);

			tab.insertRow();
			tab.insertRow();
			tab.insertRow();
			tab.insertRow();

			if (count2 == 0) {



					addCell(newRow, "/ $");

			}
			else if(count2 == 1){
				addCell(newRow, " left for ");

		}

		count2++;

		}


		count++;




		newCell = newRow.insertCell();
		newButton = document.createElement("input");
		newButton.type = "button";
		newButton.value = "Delete"; //+ t;
		(function(_t){ newButton.addEventListener("click", function() { deleteCategory(_t); }); })(t);
		newCell.appendChild(newButton);
	}

	//timeoutID = window.setTimeout(poller, timeout);
}

// setup load event
window.addEventListener("load", setup, true);
