function operation(device,num,action){
  switch(action){
    case "꺼줘":
    case "켜줘":
      handlePowerControl(device,num,action);
      break;
    case "따뜻하게":
    case "차갑게":
      handleColortempControl(device,num,action);
      break;
    case "밝게":
    case "어둡게":
      handleBrightnessControl(device,num,action);
      break;
    default:
      alert("다시해보세요");
  }
};

function handlePowerControl(device,num,action){
	switch(action){
		case "켜줘":
			alert("on");
			turnOnOff("light"+num,"off");
			break;
		case "꺼줘":
			alert("off");
			turnOnOff("light"+num,"on");
			break;
	}
};

function handleColortempControl(device,num,action){
  switch(action){
    case "따뜻하게":
      alert("warm");
			var id = "light"+num;
			Colortemp(id,"#ct3000",3000);
      break;
    case "차갑게":
      alert("cool");
      Colortemp("light"+num,"#ct6000",6000);
      break;
  }
};

function handleBrightnessControl(device,num,action){
	var e = {};
  switch(action){
    case "밝게":
      alert("bright");
			e = {
						currentTarget: {
							value: 100
						}
					};
      Brightness(e,"light"+num);
      break;
    case "어둡게":
      alert("dark");
      e = {
            currentTarget: {
              value: 10
            }
          };
      Brightness(e,"light"+num);
      break;
  }
};
