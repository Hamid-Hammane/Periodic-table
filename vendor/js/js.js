$(function(){
	$.getJSON("./vendor/data/tp.json", function (data) {
		let str = "<tr><td style='min-width: 0px;'></td>";
		let cols = parseInt(data["cols"]), lines =parseInt(data["lines"]);
		for(let c=1;c<=cols;c++){
			str += "<td><div class='group-cell' onmouseleave='cellLeave()' onmouseover='cellHover("+c+",\"col\")'>"+c+"</div></td>";
		}
		str += "</tr>";
		for(let i=1; i<=lines; i++){
			str += "<tr><td style='min-width: 0px;'>"+(i<=8?"<div class='group-cell w-100 p-1' onmouseleave='cellLeave()' onmouseover='cellHover("+i+",\"line\")'>"+i+"</div>":"")+"</td>";
			for(let j=1; j<=cols; j++){
				let colClass = j,lineClass = i;
				if(i == 9 || i == 10) {
					colClass = 3;
					lineClass -= 3;
				}

				if(i == 1){
					if(j == 4){
						str += "<td style='padding:0;margin:0;' colspan='3' rowspan='3'><div class='info p-2' style='border-radius:5px;text-align:center;'></div></td>";
						j = 7;colClass = 7;
					}
					if(j == 7){
						str += "<td style='padding:0;margin:0;' colspan='3' rowspan='3'><div class='info_2 p-2' style='border-radius:5px;text-align:center;'></div></td>";
						j = 10;colClass = 10;
					}
					if(j == 10){
						str += "<td style='padding:0;margin:0;' colspan='3' rowspan='3'><div class='info_3 p-2' style='border-radius:5px;text-align:center;'></div></td>";
						j = 13;colClass = 13;
					}
					lineClass = 1;
				}
				if(i == 2){
					if (j == 4)  { j = 7; colClass = 7; lineClass = 2; }
					if (j == 7)  { j = 10;colClass = 10;lineClass = 2; }
					if (j == 10) { j = 13;colClass = 13;lineClass = 2; }
				}
				if(i == 3){
					if (j == 4)  { j = 7; colClass = 7; lineClass = 3; }
					if (j == 7)  { j = 10;colClass = 10;lineClass = 3; }
					if (j == 10) { j = 13;colClass = 13;lineClass = 3; }
				}

				str += "<td style='padding:0.5px 0.5px 1px 0.5px;' class='val-cell col"+colClass+" line"+lineClass+"'";
				let element = data["elements"].filter(e => e.xpos == j && e.ypos == i);
				if(element && element.length > 0) {
					let obj = element[0];
					str += "onmouseover='info(" + obj.number + ", \"" + 
												  obj.symbol + "\", \"" + 
												  obj.name + "\", \"" + 
												  obj.category + "\"," + 
												  obj.atomic_mass +  ",\"" + 
												  obj.electron_configuration_semantic + "\",\"" + 
												  obj.phase + "\")' onmouseleave='clearInfo()'>";
					str += getElementButton(obj);
				}
				str += "</td>";
			}
			str += "</tr>";
		}
		$(".element-container").html(str);
	});
});

function getElementButton(obj){
	obj.summary = obj.summary.replace("'"," ");
	return "<div class='btn w-100' onclick='showInfo("+JSON.stringify(obj)+")' data-toggle='modal' data-target='#modalCenter' style='padding:1px;background-color:"+getCategoryBG(obj.category)+";border:1px solid black;'>"+
				"<div>"+
					"<span style='font-weight:bolder;font-size:19px;color:"+getPhaseBG(obj.phase)+"'>"+obj.symbol+"</span>&nbsp;&nbsp;&nbsp;"+
					"<span class='badge badge-light' style='font-size:11px;'>"+obj.number+"</span>"+
				"</div>"+
				"<div style='font-size:13px;'>"+obj.name.trim()+"</div>"+
			"</div>";
}
function getCategoryBG(category){
	let background="rgba(200, 200, 200, 0.5)";
	switch(category){
		case "noble gas" :background ="rgba(52, 152, 219, 0.6)"; break;
		case "unknown, predicted to be noble gas" :background ="rgba(52, 152, 219, 0.6)"; break

		case "alkali metal" :background ="rgba(100, 100, 100, 0.5)"; break;
		case "unknown, but predicted to be an alkali metal" :background ="rgba(100, 100, 100, 0.5)"; break

		case "alkaline earth metal" :background ="rgba(150, 150, 150, 0.5)"; break;

		case "metalloid" :background ="rgba(149, 175, 192, 0.7)"; break;
		case "probably metalloid" :background ="rgba(149, 175, 192, 0.7)"; break

		case "polyatomic nonmetal" :background ="rgba(249, 202, 36,1.0)"; break;
		case "diatomic nonmetal" :background ="rgba(249, 202, 36,1.0)"; break;

		case "post-transition metal" :background ="rgba(50, 50, 50, 0.5)"; break;
		case "unknown, probably post-transition metall" :background ="rgba(50, 50, 50, 0.5)"; break

		case "transition metal" :background ="rgba(50, 50, 200, 0.5)"; break;
		case "unknown, probably transition metall" :background ="rgba(50, 50, 200, 0.5)"; break

		case "lanthanide" :background ="rgba(255, 190, 118,1.0)"; break;

		case "actinide" :background ="rgba(126, 255, 245,1.0)"; break;
	}
	return background;
}
function getPhaseBG(phase){
	switch(phase){
		case "Gas" : return "red";
		case "Solid" :return "black";
		case "Liquid" :return "blue";
		default : return "black";
	}
}
function showInfo(obj){
	$("#modalCenter .modal-title").text(obj.name+" ("+obj.symbol+")");
	$("#modalCenter .modal-body p").text(obj.summary);
	$("#modalCenter .modal-footer a").attr("href",obj.source);
}
function cellHover(val,type){
	$("."+type+val).css({"transitionDuration":"0.5s","opacity":1});
	$("td.val-cell:not(."+type+val).css({"transitionDuration":"0.2s","opacity":0.2});
	if (type == "line") {$(".info").html("Period : <b>"+val+"</b>");}
	if (type == "col") {$(".info").html("Group : <b>"+val+"</b>");}

	switch (val) {
		case 2:  $(".info_2").html("<b>Alkaline earth metal</b>"); break;
		case 15: $(".info_2").html("<b>Pnictogens</b>"); break;
		case 16: $(".info_2").html("<b>Chalcogens</b>"); break;
		case 17: $(".info_2").html("<b>Halogens</b>"); break;
		case 18: $(".info_2").html("<b>Noble gas</b>"); break;
	}
}
function cellLeave(){
	$("td").css("opacity",1);
	$(".info, .info_2").html("");
}

function info(number, symbol, name, bg, mass, configuration, phase) {
	let info = "<p>Atomic number : <b>"+number+ "</b></p><p>Symbol : <b>"+symbol+ "</b></p><p>Name : <b>"+name+ "</b></p>";
	let info_2 = "<p>Atomic mass : <b>"+mass+ "</b></p><p>Electron configuration : <b><br>"+configuration+ "</b></p>";
	let info_3 = "<p>Phase : <b>"+phase+ "</b></p>";
	$(".info").html(info).css("background-color",getCategoryBG(bg));
	$(".info_2").html(info_2);
	$(".info_3").html(info_3);
}
function clearInfo(){
	$(".info").html("").css({"backgroundColor":""});
	$(".info_2, .info_3").html("");
}
