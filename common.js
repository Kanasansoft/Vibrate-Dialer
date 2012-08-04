var curkey = {};
var dialkeys = [];

var keysdata = [
	{"id" : "key1",      "value" : "1",      "captions" : ["1", "."],       "vibrationData" : [100]                                          },
	{"id" : "key2",      "value" : "2",      "captions" : ["2", ".."],      "vibrationData" : [100,100,100]                                  },
	{"id" : "key3",      "value" : "3",      "captions" : ["3", "..."],     "vibrationData" : [100,100,100,100,100]                          },
	{"id" : "key4",      "value" : "4",      "captions" : ["4", "...."],    "vibrationData" : [100,100,100,100,100,100,100]                  },
	{"id" : "key5",      "value" : "5",      "captions" : ["5", "-"],       "vibrationData" : [200]                                          },
	{"id" : "key6",      "value" : "6",      "captions" : ["6", "-."],      "vibrationData" : [200,100,100]                                  },
	{"id" : "key7",      "value" : "7",      "captions" : ["7", "-.."],     "vibrationData" : [200,100,100,100,100]                          },
	{"id" : "key8",      "value" : "8",      "captions" : ["8", "-..."],    "vibrationData" : [200,100,100,100,100,100,100]                  },
	{"id" : "key9",      "value" : "9",      "captions" : ["9", "-...."],   "vibrationData" : [200,100,100,100,100,100,100,100,100]          },
	{"id" : "key0",      "value" : "0",      "captions" : ["0", "--"],      "vibrationData" : [200,100,200]                                  },
	{"id" : "keyStar",   "value" : "*",      "captions" : ["*", "---"],     "vibrationData" : [200,100,200,100,200]                          },
	{"id" : "keySquare", "value" : "#",      "captions" : ["#", "----"],    "vibrationData" : [200,100,200,100,200,100,200]                  },
	{"id" : "keyCancel", "value" : "cancel", "captions" : ["Cancel", "~"],  "vibrationData" : [30,30,30,30,30,30,30]                         },
	{"id" : "keyDial",   "value" : "dial",   "captions" : ["Dial", "_ _"],  "vibrationData" : [500,100,500]                                  },
	{"id" : "keyDelete", "value" : "delete", "captions" : ["Delete", "~~"], "vibrationData" : [30,30,30,30,30,30,30,150,30,30,30,30,30,30,30]},
	{"id" : "keyCheck",  "value" : "check",  "captions" : ["_"],            "vibrationData" : [500]                                          }
];

function vibrate(arg) {
	if (navigator.vibrate) {
		navigator.vibrate(arg);
	} else if (navigator.webkitVibrate) {
		navigator.webkitVibrate(arg);
	} else if (navigator.webkitVibrate) {
		navigator.webkitVibrate(arg);
	} else if (navigator.mozVibrate) {
		navigator.mozVibrate(arg);
	} else if (navigator.msVibrate) {
		navigator.msVibrate(arg);
	} else if (navigator.oVibrate) {
		navigator.oVibrate(arg);
	}
}

function setVibrate() {
	for (var i = 0, datalen = keysdata.length; i < datalen; i++) {
		var keydata = keysdata[i];
		keydata.vibrate = (
			function(vibrationData){
				return function() {
					vibrate(vibrationData);
				};
			}
		)(keydata.vibrationData);
	}
}

function detectCollision(event) {
	var x = event.touches[0].pageX;
	var y = event.touches[0].pageY;
	var collisions = [];
	for (var i = 0, datalen = keysdata.length; i < datalen; i++) {
		var keydata = keysdata[i];
		var element = document.getElementById(keydata.id);
		if (x < element.offsetLeft || element.offsetLeft + element.offsetWidth  < x) {continue;}
		if (y < element.offsetTop  || element.offsetTop  + element.offsetHeight < y) {continue;}
		collisions.push(keydata);
	}
	return collisions;
}

function initialize() {
	setVibrate();
	for (var i = 0, datalen = keysdata.length; i < datalen; i++) {
		var keydata = keysdata[i];
		var element = document.getElementById(keydata.id);
		var captions = keydata.captions;
		for (var j = 0, captionslen = captions.length; j < captionslen; j++) {
			var div = document.createElement("div");
			div.textContent = captions[j];
			element.appendChild(div);
		}
	}
	document.body.addEventListener(
		"touchstart",
		function(event){
			var keys = detectCollision(event);
			if (keys.length != 1) {return;}
			vibrate([]);
			curkey = keys[0];
			curkey.vibrate();
		},
		false
	);
	document.body.addEventListener(
		"touchmove",
		function(event){
			var keys = detectCollision(event);
			if (keys.length != 1) {return;}
			if (curkey.id == keys[0].id) {return;}
			vibrate([]);
			curkey = keys[0];
			curkey.vibrate();
		},
		false
	);
	document.body.addEventListener(
		"touchend",
		function(event){
			var value = curkey.value;
			switch (value) {
			case "check":
				break;
			case "cancel":
				break;
			case "dial":
				break;
			case "delete":
				dialkeys.pop();
				break;
			default:
				dialkeys.push(curkey);
			}
			var keys = [];
			var vibrations = [];
			for (var i = 0, len = dialkeys.length; i < len; i++) {
				keys.push(dialkeys[i].value);
				if (i != 0) {
					vibrations.push(500);
				}
				[].push.apply(vibrations, dialkeys[i].vibrationData);
			}
			switch (value) {
			case "check":
				vibrate(vibrations);
				break;
			case "dial":
				location.href = "tel:" + encodeURIComponent(keys.join(""));
				break;
			default:
				document.getElementById("display").textContent = keys.join("");
			}
		},
		false
	);
}

window.addEventListener("load",initialize,false);
