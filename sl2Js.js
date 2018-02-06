/***************
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
const inactive_ct = "#c6c6c699";
//System const & var
var div = $("div")[0];
const ip = "13.124.195.114";
const port = "3000";
const PATH = "/gw/v1";
const BASE_URL = "http://" + ip + ":" + port + PATH;

/***************
UI Control CODE
***************/
//init
function init(){
  for(var i=4; i<=LIGHT_NUM; i++){
		getStatus(i);
  }
}
init();

//light UI event
$("div .light").mouseenter(function(){
		resetCtBtn();
    $(this).css("border-color", HIGH_LIGHT);
		var id = $(this).attr('id');
		var data = jQuery.data(div, id);
		//set color temp selector
		var colortemp = data.colortemp;
		colortemp = colortemp.substring(0, 7);
		var ct_id = color2id(colortemp);
		$(ct_id).css("background-color",colortemp);
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
		var id = $(this).attr('id');
		var data = jQuery.data(div, id);
		var onoff = data.onoff;
		var colortemp = data.colortemp;
		var level = data.level;
		
		if(onoff == "off"){
			$(this).css("background-color",colortemp);
			$(this).css("opacity",level);
			saveData(id,"on",colortemp,level);
			myRequest("/device/"+id.substring(5,id.length)+"/light","PUT","onoff","on");
		}
		else{
			$(this).css("background-color",TRANSPAERENT);
			var data = jQuery.data(div, id);
			var  colortemp = data.colortemp;
			var level = data.level;
			saveData(id,"off",colortemp,level);
			myRequest("/device/"+id.substring(5,id.length)+"/light","PUT","onoff","off");
		}
	});

//Color Temp UI event
$("div .colortemp-btn").mouseenter(function(){
	var id = $(this).attr('id');
	var ct = null;
	switch(id){
		case "ct2000":
			ct=colortemp2000;
			break;
    case "ct3000":
      ct=colortemp3000;
      break;
    case "ct4000":
      ct=colortemp4000;
      break;
    case "ct5000":
      ct=colortemp5000;
      break;
    case "ct6000":
      ct=colortemp6000;
      break;
	}
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
	var id = $("#light-name").text();
	var light_id = "#"+id;
	var colortemp = $(this).css("background-color");
	var color_code = rgb2hex(colortemp);
	var data = jQuery.data(div,id);
	var level = data.level;
	var rgba = color_code + deci2hex(level);
	resetCtBtn();
	$(this).css("background-color",color_code);
	$(light_id).css("background-color",rgba);
	saveData(id,"on",color_code,level);
	var ct = $(this).attr('id');
	ct = ct.substring(2,ct.length);
  if(data.onoff == "off")
    myRequest("/device/"+id.substring(5,id.length)+"/light","PUT","onoff","on");
	myRequest("/device/"+id.substring(5,id.length)+"/light","PUT","colortemp",Number(ct));
});

//brightness UI event
$("#bri-slider").change(function(event,ui){
	var level = event.currentTarget.value;
	var id = $("#light-name").text();
	var light_id = "#"+id;
	var data = jQuery.data(div,id);
	var color_code = data.colortemp.substring(0, 7);
	color_code = color_code + deci2hex(level);
	$(light_id).css("background-color",color_code);
	saveData(id,"on",color_code,level);
	if(data.onoff == "off")
		myRequest("/device/"+id.substring(5,id.length)+"/light","PUT","onoff","on");
	myRequest("/device/"+id.substring(5,id.length)+"/light","PUT","level",Number(level));
});

function rgb2hex(rgb){
 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
 return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

function saveData(id,onoff,ct,level){
  jQuery.data(div,id,{
    onoff: onoff,
    colortemp: ct,
    level: level
  });
};

function deci2hex(num){
	var n = num*255/100|0;
	var hexString = n.toString(16);
	if(hexString.length == 1)
		hexString = "0" + hexString;
	return hexString;
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
	var response = null;
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
			console.log("Success: "+bodyString);
		},
    error: function(jqXHR) {
			alert("error");
		},
    complete: function(jqXHR) {}
	});
	return response;
};

function getStatus(device_id){
  $.ajax({
    url:  BASE_URL + "/device/"+device_id+"/light",
    type: "GET",
    contentType: "application/json",
    beforeSend: function(jqXHR) {},
    success: function(jqXHR) {
			var r = jqXHR.result_data;
			var onoff = r.onoff;
			var colortemp = ((r.colortemp / 1000 | 0)*1000).toString();
			switch(colortemp){
				case "2000":
					colortemp = colortemp2000;
					break;
				case "3000":
          colortemp = colortemp3000;
          break;
				case "4000":
          colortemp = colortemp4000;
          break;
				case "5000":
          colortemp = colortemp5000;
          break;
				case "6000":
          colortemp = colortemp6000;
          break;
			}
			var level = r.level;
			saveData("light"+device_id,onoff,colortemp+"ff",r.level);
			if(onoff == "on"){
				$(this).css("background-color",colortemp);
			  var color_code = colortemp;
			  color_code = color_code + deci2hex(level);
			  $("#light"+device_id).css("background-color",color_code);
			}
    },
    error: function(jqXHR) {
      alert("error");
    },
    complete: function(jqXHR) {}
  });
}
