var div = $("div")[0];
function operation(jsonText){
	alert(jsonText);
	var json = JSON.parse(jsonText);
	var action = json.action;
	var value = Number(json.value);
	var name = json.friendlyName;

	var data = jQuery.data(div,name);
	if(data == undefined){
		sendVoice(name + "[P1]없습니다");
		return;
	}
	var num = data.id;
	var unit = data.unit;
  switch(action){
    case "TurnOn":
    case "TurnOff":
      handlePowerControl(name,num,action,unit);
      break;
    case "SetColortemp":
    case "IncreaseColortemp":
		case "DecreaseColortemp":
      handleColortempControl(name,num,action,value,unit);
      break;
    case "SetBrightness":
    case "IncreaseBrightness":
		case "DecreaseBrightness":
      handleBrightnessControl(name,num,action,value,unit);
      break;
    default:
			sendVoice("다시[P1]해보세요");
      alert("다시해보세요");
  }
};

function handleDiscovery(res,unit){
	alert("Discovery..");
	res = JSON.parse(res);
	var success = res.result_code;
	if(success != 200){
		alert("error code "+success);
		return;
	}

	var rd = res.result_data;
	var list_name = null;
	var id = null;
	if(unit == "device"){
		list_name = "device_list";
		_id = "did";
	}
	else if(unit == "group"){
		list_name = "group_list";
		_id = "gdid";
	}
	
	var list = rd[list_name];
	for(l in list){
		var id = (list[l])[_id];
		/*var friendlyName = list[l].group_name;
		if(friendlyName != undefined)
			friendlyName = friendlyName.replace(" ","");
		getStatus(id.toString(),unit,friendlyName);*/
		if(unit == "group"){
			var friendlyName = list[l].group_name;
			friendlyName = friendlyName.replace(" ","");
			var gdid = id.toString();
			var json = {
					id: gdid,
					unit: unit
				}
			jQuery.data(div,friendlyName,json);
		}
		else{
			getStatus(id.toString(),unit,undefined);
		}
	}
}

function handlePowerControl(name,num,action,unit){
	switch(action){
		case "TurnOn":
			alert("on");
			sendVoice(name + "[P1]켰습니다");
			if(unit == "device")
				turnOnOff(name,"off");
			else if(unit == "group")
				myRequest("/group/"+num+"/status","PUT","onoff","on");
			break;
		case "TurnOff":
			alert("off");
			sendVoice(name + "[P1]껐습니다");
			if(unit == "device")
				turnOnOff(name,"on");
			else if(unit == "group"){
				myRequest("/group/"+num+"/status","PUT","onoff","off");
			}
			break;
	}
}

function handleColortempControl(name,num,action,value,unit){
	alert(t_id);
  switch(action){
		case "SetColortemp":
			alert("set colortemperature: "+value);
			var t = ((value / 1000) | 0) * 1000;
			var t_id = "#ct"+t.toString();
			sendVoice(name + "의 색온도[P1]"+value+"캘빈으로 설정했습니다");
			if(invalidRange(action,value))
				return;
			if(unit == "device")
				Colortemp(name,t_id,value);
			else if(unit == "group")
				myRequest("/group/"+num+"/status","PUT","colortemp",value);
			break;
    case "DecreaseColortemp":
			var data = jQuery.data(div, name);
			var v = data.colortemp - value;
			var t = ((v / 1000) | 0) * 1000;
			var t_id = "#ct"+t.toString();
      alert("warmer: "+v);
			if(invalidRange(action,v))
				return;
			sendVoice(name + "의 색온도가[P1]"+value+"캘빈 감소했습니다");
			if(unit == "device")
				Colortemp(name,t_id,v);
			else if(unit == "group")
				myRequest("/group/"+num+"/status","PUT","colortemp",v);
      break;
    case "IncreaseColortemp":
			var data = jQuery.data(div, name);
			var v = data.colortemp + value;
			var t = ((v / 1000) | 0) * 1000;
			var t_id = "#ct"+t.toString();
      alert("cooler: "+v);
			if(invalidRange(action,v))
				return;
			sendVoice(name + "의 색온도가[P1]"+value+"캘빈 증가했습니다");
			if(unit == "device")
				Colortemp(name,t_id,v);
			else if(unit == "group")
				myRequest("/group/"+num+"/status","PUT","colortemp",v);
      break;
  }
};

function handleBrightnessControl(name,num,action,value,unit){
	var e = {};
  switch(action){
		case "SetBrightness":
			alert("set brightness: "+value);
      e = {
            currentTarget: {
              value: value
            }
          };
			if(invalidRange(action,value))
				return;
			sendVoice(name + "의 밝기를 "+value+"퍼센트로  설정했습니다");
			if(unit == "device")
				Brightness(e,name);
			else if(unit == "group")
				myRequest("/group/"+num+"/status","PUT","level",value);
			break;
    case "IncreaseBrightness":
			var data = jQuery.data(div, name);
			var v = data.level + value;
      alert("brighter: "+v);
			e = {
						currentTarget: {
							value: v
						}
					};
			if(invalidRange(action,v))
				return;
			sendVoice(name + "의 밝기를 "+value+"퍼센트  증가시켰습니다");
			if(unit == "device")
				Brightness(e,name);
			else if(unit == "group")
				myRequest("/group/"+num+"/status","PUT","level",v);
      break;
    case "DecreaseBrightness":
			var data = jQuery.data(div, name);
			var v = data.level - value;
      alert("darker: "+v);
      e = {
            currentTarget: {
              value: v
            }
          };
			if(invalidRange(action,v))
				return;
			sendVoice(name + "의 밝기를 "+value+"퍼센트 감소시켰습니다");
  		if(unit == "device"){
				Brightness(e,name);
			}
			else if(unit == "group"){
				myRequest("/group/"+num+"/status","PUT","level",v);
			}
      break;
  }
};

function invalidRange(action,value){
  var fail = false;
	var str = "invalid action";
	switch(action){
    case "SetColortemp":
    case "IncreaseColortemp":
    case "DecreaseColortemp":
			str = "색온도를 ";
      if(value>6500 || value<2700)
				fail = true;
      break;
    case "SetBrightness":
    case "IncreaseBrightness":
    case "DecreaseBrightness":
			str = "밝기를 ";
      if(value>100 || value<0)
				fail = true;
      break;
		default:
			fail = true;
			break;
	}
	if(fail)
		sendVoice(str+value+"로 설정할 수 없습니다");
	return fail;
}
