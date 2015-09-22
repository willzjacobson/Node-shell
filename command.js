var fs = require('fs');
var request = require('request');

var thingsInThisFile = {};
thingsInThisFile.thisThing = "Here's this thing";

function getInput(cmd){
	if(cmd === "pwd"){
		ifPWD(cmd);
	} else if(cmd === "date"){
		getDate(cmd);
	} else if(cmd === "ls"){
		doLS(cmd);
	} else if (cmd.split(" ")[0] === "echo") {
		var toEcho = cmd.split(" ").slice(1).join(" ");
		doEcho(toEcho);
	} else if(cmd.split(" ")[0] === "head"){	
		var toHead = cmd.split(" ").slice(1).join(" ");
		head(toHead);
	} else if(cmd.split(" ")[0] === "tail"){	
		var toTail = cmd.split(" ").slice(1).join(" ");
		tail(toTail);
	} else if(cmd.split(" ")[0] === "sort"){	
		var toSort = cmd.split(" ").slice(1).join(" ");
		sorting(toSort);
	} else if(cmd.split(" ")[0] === "wc"){	
		var toWC = cmd.split(" ").slice(1).join(" ");
		wordCount(toWC);
	} else if(cmd.split(" ")[0] === "uniq"){	
		var makeUniq = cmd.split(" ").slice(1).join(" ");
		uniq(makeUniq);
	} else if(cmd.split(" ")[0] === "curl"){	
		var toCurl = cmd.split(" ").slice(1).join(" ");
		curl(toCurl);
	} else if(cmd.split(" ")[0] === "find"){	
		var location = cmd.split(" ").slice(1).join(" ");
		find(location);
	} else if (cmd.split(" ")[0] === "cat") {
		var wasVariable;
		var toCat = cmd.split(" ").slice(1).join(" ");
		doCat(toCat, function(data){
			done(data);
		});
	} else {
		process.stdout.write("You typed > " + cmd);
		process.stdout.write('\nprompt > ');
	}

}

function ifPWD(cmd) {
	cmd = process.cwd();
	done(cmd);
}

function getDate(cmd){
	cmd = new Date
	done(String(cmd));
}

function doLS() {
	var output = "";
	fs.readdir('.', function(err, files) {
  	if (err) throw err;
  	files.forEach(function(file) {
    	output += (file.toString() + "\n");
  	});
  	done(output);
	});
}

function doCat(file, cb) {
	fs.readFile(file, "utf-8", function(error, data) {
		if (error) {
			throw new Error('File not found');
		}
		cb(data);
	});	
}

function doEcho(arg){
	var wasVariable;
	var output = "";
	for (var key in thingsInThisFile) {
		if (key === arg) {
			wasVariable = true;
			output += thingsInThisFile[key];
		}
	}
	if (!wasVariable) {
		output += arg;
	}
	done(output);
}

function head(file){
	doCat(file, function(data) {
		var fiveLines = data.split("\n").slice(0, 5).join("\n");
		done(fiveLines);
	});
}

function tail(file){
	doCat(file, function(data) {
		var fiveLines = data.split("\n").slice(-5).join("\n");
		done(fiveLines);
	});

}

function sorting(file){
	doCat(file, function(data){
		var sorted = data.split("\n").sort(function(a,b){ return a.charCodeAt(0)-b.charCodeAt(0) }).join("\n");
		done(sorted);
	})
}

function wordCount(file){
	doCat(file, function(data){
		var lineCount = data.split("\n").length.toString();
		done(lineCount);
	});
}

function uniq(file){
	var output = "";
	doCat(file, function(data){
		var lines = data.split("\n");
		for(var i = 0; i < lines.length; i++){
			if(lines[i] !== lines[i -1]){
				output += (lines[i].toString() + "\n");
			}
		}
		done(output);
	});
}

function curl(destination){
	var output = "";
	request(destination, function(error, response, body) {
		if (error) throw "Bad URL";
		if (!error && response.statusCode === 200) {
			output += (body.toString() + "\n");
		}
		done(output);
	});
} 

function done(output) {
	if (output) process.stdout.write(output);
	process.stdout.write('\nprompt > ');
}

function find(location) {
	var output = "";
	if (location) {
		fs.readdir(location, function(err, files) {
  		if (files) {
  			for (var i = 0; i < files.length; i++) {
  				if (files[i] !== "undefined") {
  					output += files[i] + "/";
  				}
  				done(output + find(files[i]));
  			}
  		}
  	});
	}
	return;
}

module.exports.getInput = getInput;