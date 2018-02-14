/**************
	COLOR CODE
***************/
//system color
const HIGH_LIGHT = "#5BD487";
const LIGHT_NUM = 16;
const TRANSPAERENT = "#00000000"
//color temperature
const colortemp2000 = "#ff8a0c";
const colortemp3000 = "#ffb66b";
const colortemp4000 = "#ffd1a1";
const colortemp5000 = "#ffe9d6";
const colortemp6000 = "#fff5f5";
const inactive_ct = "#e6e6e6";
//System const & var
var div = $("div")[0];
const ip = "uni18.hexa.pro";
const port = "20398";
const PATH = "";
//const ip = "13.124.195.114";
//const port = "9000";
//const PATH = "/gw/v1";
const BASE_URL = "http://" + ip + ":" + port + PATH;

const UNIT_DEVICE = "device";
/***************
UI Control CODE
***************/
//init
/*function init(){
  for(var i=4; i<=LIGHT_NUM; i++){
		getStatus(i);
		//saveData("light"+i,"off",colortemp4000+"ff",4000,100);
  }
}
init();*/

//light UI event
$("div .light").mouseenter(function(){
		resetCtBtn();
    $(this).css("border-color", HIGH_LIGHT);
		var id = $(this).attr('id');
		var data = jQuery.data(div, id);
		//set color temp selector
		var colorcode = data.colorcode;
		colorcode = colorcode.substring(0, 7);
		var ct_id = color2id(colorcode);
		$(ct_id).css("background-color",colorcode);
		//set brightness slider bar
		var level = data.level;
		$("#bri-slider").val(level);
		//set highlighted light name
		$("#light-name").text(id);
  })
	.mouseleave(function(){
		$(this).css("border-color", "white");
	})
	.click(function(){
		turnOnOff($(this).attr('id'),null);
	});
function turnOnOff(id,param){
		console.log(id);
		//var id = $(thi).attr('id');
		var light_id = "#"+id;
		var data = jQuery.data(div, id);
		var onoff = null;
		if(param == null)
			onoff = data.onoff;
		else
			onoff = param;
		var colorcode = data.colorcode;
		var level = data.level;
		
		if(onoff == "off"){
			var colorcode = colorcode.substring(0, 7);
			//colorcode = colorcode + deci2hex(level);
			$(light_id).css("background-color",colorcode);
			//$(light_id).css("opacity",level);
			var colortemp = data.colortemp;
			saveData(id,"on",colorcode,colortemp,level,UNIT_DEVICE);
			myRequest("/device/"+data.id+"/light","PUT","onoff","on");
			myRequest("/device/"+data.id+"/light","PUT","level",level);
		}
		else{
			//$(light_id).css("background-color",TRANSPAERENT);
			$(light_id).css("background-color","#e7eaef");
			var data = jQuery.data(div, id);
			var colorcode = data.colorcode;
			var colortemp = data.colortemp;
			var level = data.level;
			saveData(id,"off",colorcode,colortemp,level,UNIT_DEVICE);
			myRequest("/device/"+data.id+"/light","PUT","onoff","off");
		}
}
//Color Temp UI event
$("div .colortemp-btn").mouseenter(function(){
	var id = $(this).attr('id');
	var ct = null;
	ct = id2color("#"+id);
	$(this).css("background-color",ct);
})
.mouseleave(function(){
  var id = $("#light-name").text();
  var light_id = "#"+id;
  var colortemp = $(this).css("background-color");
  var color_code = rgb2hex(colortemp);
	var cur_ct =  $(light_id).css("background-color");
	var cur_code = rgb2hex(cur_ct);
	if(cur_code!=color_code)
		$(this).css("background-color",inactive_ct);
})
.click(function(){
	var ct = "#"+$(this).attr('id');
	var value = ct.substring(3,ct.length);
	var id = $("#light-name").text();
	Colortemp(id,ct,Number(value));
});

function Colortemp(id,ct,value){
	var light_id = "#"+id;
	var colorcode = id2color(ct);
	var data = jQuery.data(div,id);
	var colortemp = value;
	var level = data.level;
	var rgba = colorcode + deci2hex(level);
	resetCtBtn();
	$(ct).css("background-color",colorcode);
	//$(light_id).css("background-color",rgba);
	$(light_id).css("background-color",colorcode);
	saveData(id,"on",colorcode,colortemp,level,UNIT_DEVICE);
  if(data.onoff == "off")
    myRequest("/device/"+data.id+"/light","PUT","onoff","on");
	myRequest("/device/"+data.id+"/light","PUT","colortemp",value);
};

//brightness UI event
$("#bri-slider").change(function(event,ui){
	var id = $("#light-name").text();
	Brightness(event,id);
});
function Brightness(event,id){
	var level = event.currentTarget.value;
	var light_id = "#"+id;
	var data = jQuery.data(div,id);
	var colortemp = data.colortemp;
	var colorcode = data.colorcode.substring(0, 7);
	//colorcode = colorcode + deci2hex(level);
	$(light_id).css("background-color",colorcode);
	saveData(id,"on",colorcode,colortemp,level,UNIT_DEVICE);
	if(data.onoff == "off")
		myRequest("/device/"+data.id+"/light","PUT","onoff","on");
	myRequest("/device/"+data.id+"/light","PUT","level",Number(level));
}

$("#discovery-btn").click(function(){
	myRequest("/device","GET",null,null);
	myRequest("/group","GET",null,null);
})

function rgb2hex(rgb){
 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
 return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

function saveData(name,onoff,cc,ct,level,unit){
	var id = name.replace("조명","");
	id = id.replace("번","");
  jQuery.data(div,name,{
		id: id,
    onoff: onoff,
		colorcode: cc,
    colortemp: ct,
    level: level,
		unit: unit
  });
};

function deci2hex(num){
	var n = num*255/100|0;
	var hexString = n.toString(16);
	if(hexString.length == 1)
		hexString = "0" + hexString;
	return hexString;
}
function id2color(id){
	var ct = null;
  switch(id){
    case "#ct2000":
      ct=colortemp2000;
      break;
    case "#ct3000":
      ct=colortemp3000;
      break;
    case "#ct4000":
      ct=colortemp4000;
      break;
    case "#ct5000":
      ct=colortemp5000;
      break;
    case "#ct6000":
      ct=colortemp6000;
      break;
  }
	return ct;
}
function color2id(color){
	var id=null;
  switch(color){
    case colortemp2000:
			id = "#ct2000";
      break;
    case colortemp3000:
      id = "#ct3000";
      break;
    case colortemp4000:
      id = "#ct4000";
      break;
    case colortemp5000:
      id = "#ct5000";
      break;
    case colortemp6000:
      id = "#ct6000";
      break;
  }
	return id;
}
function resetCtBtn(){
	for(var i=2; i<=6; i++){
		$("#ct"+i+"000").css("background-color",inactive_ct);
	}
};

/***************
HTTP Method CODE
***************/

function myRequest(path,method,key,value){
	var response = '';
	var bodyJson = { };
	bodyJson[key] = value;
	var bodyString = JSON.stringify(bodyJson);
	$.ajax({
    url:  BASE_URL + path,
    type: method,
    data: bodyString,
		contentType: "application/json",
    beforeSend: function(jqXHR) {},
    success: function(jqXHR) {
			response += jqXHR;
			//Discovery
			if(path == "/device" || path == "/group"){
				var unit = (path.split("/"))[1];
				handleDiscovery(jqXHR,unit);
			}
			//voice command
			if(path == "/command-analysis/") operation(response);
		},
    error: function(jqXHR) {
			alert("error:"+JSON.stringify(jqXHR));
		},
    complete: function(jqXHR) {
		}
	});
};

function approxColortemp(colortemp){
	return ((colortemp / 1000 | 0)*1000).toString();
}
function getStatus(device_id,unit,name){
	if (name == undefined)
		name = "조명"+device_id+"번";
	var param = "/light";
	if (unit == "group")
		param = "/dstatus";
	console.log(BASE_URL + "/"+unit+"/" + device_id + param);
  $.ajax({
    url:  BASE_URL + "/"+unit+"/" + device_id + param,
    type: "GET",
    contentType: "application/json",
    beforeSend: function(jqXHR) {},
    success: function(jqXHR){
			console.log(JSON.parse(jqXHR));
			var r = JSON.parse(jqXHR).result_data;
			if(unit == "group"){
				r = r.group_list;
				if(r == undefined) return;
				r = r[0];
			}
			var onoff = r.onoff;
			var colortemp = r.colortemp;
			var colorcode = approxColortemp(colortemp);
			colorcode = id2color("#ct"+colorcode);
			var level = r.level;
			saveData(name,onoff,colorcode+"ff",colortemp,level,unit);
			if(onoff == "on" && unit == "device"){
			  var color_code = colorcode;
			  //color_code = color_code + deci2hex(level);
			  $("#"+name).css("background-color",color_code);
			}
    },
    error: function(jqXHR) {
      alert("error");
    },
    complete: function(jqXHR) {}
  });
}
