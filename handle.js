var div = $("div")[0];
function operation(jsonText){
	alert(jsonText);
	var json = JSON.parse(jsonText);
	var device = json.device;
	var num = Number(json.num);
	var action = json.action;
	var value = Number(json.value);
  switch(action){
    case "TurnOn":
    case "TurnOff":
      handlePowerControl(device,num,action);
      break;
    case "SetColortemp":
    case "IncreaseColortemp":
		case "DecreaseColortemp":
      handleColortempControl(device,num,action,value);
      break;
    case "SetBrightness":
    case "IncreaseBrightness":
		case "DecreaseBrightness":
      handleBrightnessControl(device,num,action,value);
      break;
    default:
      alert("다시해보세요");
  }
};

function handlePowerControl(device,num,action){
	switch(action){
		case "TurnOn":
			alert("on");
			turnOnOff("light"+num,"off");
			break;
		case "TurnOff":
			alert("off");
			turnOnOff("light"+num,"on");
			break;
	}
};

function handleColortempControl(device,num,action,value){
	var id = "light"+num;
	var t = ((value / 1000) | 0) * 1000;
	var t_id = "#ct"+t.toString();
  switch(action){
		case "SetColortemp":
			alert("set colortemperature: "+value);
			Colortemp(id,t_id,value);
			break;
    case "DecreaseColortemp":
			var data = jQuery.data(div, id);
			var v = data.colortemp - value;
      alert("warmer: "+v);
			Colortemp(id,t_id,v);
      break;
    case "IncreaseColortemp":
			var data = jQuery.data(div, id);
			var v = data.colortemp + value;
      alert("cooler: "+v);
      Colortemp(id,t_id,v);
      break;
  }
};

function handleBrightnessControl(device,num,action,value){
	var e = {};
	var id = "light"+num;
  switch(action){
		case "SetBrightness":
			alert("set brightness: "+value);
      e = {
            currentTarget: {
              value: value
            }
          };
			Brightness(e,id);
			break;
    case "IncreaseBrightness":
			var data = jQuery.data(div, id);
			var v = data.level + value;
      alert("brighter: "+v);
			e = {
						currentTarget: {
							value: v
						}
					};
			Brightness(e,id);
      break;
    case "DecreaseBrightness":
			var data = jQuery.data(div, id);
			var v = data.level - value;
      alert("darker: "+v);
      e = {
            currentTarget: {
              value: v
            }
          };
			Brightness(e,id);
      break;
  }
};
