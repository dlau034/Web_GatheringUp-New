/**
 * 
 */
var myInterval;
var interval_delay = 5000;

jQuery(document).ready(function() {

/*  jQuery(".hoverli").hover(
		  
			function () {
				var obj = $('.file_menu', this);
				obj.stop(true, true).slideDown(200);
	  		},
	  		function () {
				var obj = $('.file_menu', this);
	  			obj.stop(true, true).slideUp(200);
	  		}
		);*/
  jQuery(".eventtitle").click(function()
		  {			    jQuery(this).next(".eventbody").slideToggle('slow');
			  });


	getactivitycount();

	$(window).focus(function () {
        clearInterval(myInterval); // Clearing interval if for some reason it has not been cleared yet
//        getactivitycount();
        myInterval = setInterval(getactivitycount, interval_delay);
    }).blur(function () {
        clearInterval(myInterval); // Clearing interval on window blur
    });

	
	$.ajaxSetup({ cache: false });

});
function getnewmessages()
{
    clearInterval(myInterval); // Clearing interval if for some reason it has not been cleared yet
    getactivitycount();
    myInterval = setInterval(getactivitycount, interval_delay);
}

function getactivitycount() {
		$.getJSON('/bit/eventnummsgs', function (data){
			if(data == null){
				return;
			}
//			$("#activity").html(JSON.stringify(data));
			var loadedactivity = $(".activitymsg").attr('name');
			$.each(data.activity, function(){
				if(this.count>0){
					var thisid=this.id;
					var thiscount=this.count;
//			   		$("#activity").append("key "+thisid);
//		   			$("#activity").append(" - val "+thiscount);
					if(loadedactivity == this.id)
					{
						if(this.count>0 )
						{
							$.get("/bit/eventmessages/unread?activity="+thisid+"&count="+thiscount,
//							$.get("/bit/eventmessages?activity="+thisid+"&count="+thiscount,
								function(data){
								$(data).prependTo(".activitymsg").hide().slideDown(1000);
							});
						}
					}else{
						$("#id"+this.id).html('<br><font color="#ff0000">( '+thiscount+' messages )</font>');
					}
				}
			});
			$("#id"+loadedactivity).html("");
			
		});

		//get activity id, then prepend msgs
		//   		$(".activitymsg").attr('name');
}
	
	
/*
function loadurl(urllink)
{
//	alert("1 - working"+urllink);
	//var data;
	// Sending 0 to getactivitycount because we don't want to reload new msgs when using ajax load of page.
//	$(".grandcentral").load(urllink);
	$("#grandcentral").load(urllink, getactivitycount);
	
}*/

function loadeventdetail(idactivity)
{

	var outdata;

	$.getJSON('/activity/detailsbit?activity='+idactivity, function(data){
		if(data == null || data.status==false){
			return;
		}
		var template  = $("#eventdetails").html();
//		console.log(data);
		var temp = _.template(template, {event : data.activity[0], members: data.members[0], messages: data.messages[0]});
		$("#calendar").hide();
		$("#event_main").html(temp).show();
	});
}
function loadbusinessbookmark()
{
	$.getJSON('/bookmarks/mybusinesses', function(data){
		if(data == null || data.status==false){
			return;
		}
		var template  = $("#bookmarks").html();
//		console.log(data);
		var temp = _.template(template, {bookmarks : data});
		$("#bookmarkbusiness div.yourBookmarks").html(temp);
		populatepopover(data);
	});

}
function loadplacebookmark()
{
	$.getJSON('/bookmarks/myplaces', function(data){
		if(data == null || data.status==false){
			return;
		}
		var template  = $("#bookmarks").html();
//		console.log(data);
		var temp = _.template(template, {bookmarks : data});
		$("#bookmarkplace div.yourBookmarks").html(temp);
		populatepopover(data);
	});

}
function loadeventsbookmark()
{
	$.getJSON('/bookmarks/myevents', function(data){
		if(data == null || data.status==false){
			return;
		}
		var template  = $("#bookmarks").html();
//		console.log(data);
		var temp = _.template(template, {bookmarks : data});
		$("#bookmarkevents div.yourBookmarks").html(temp);
		populatepopover(data);
	});

}
function populatepopover(data)
{
	_.each(data, function(one) {
		var title =one.destname;
		var content='';
		if(one.location){
			content = one.location+" <br /> "; // <br>
		}
		if(one.startdate){
			content = content+one.startdate+' '+one.starttime+'-'+one.endtime+" <br />  ";
		}
		if(one.phone){
			content = content+one.phone+" <br />  ";
		}
		content = content+one.county+", "+one.state+"  <br /> ";
		if(one.description){
			content = content+'<br><p>'+one.description+" </p>  ";
		}
//		var content = content+'<a href="#"><img src="/images/gtk-save.png" align="bottom">create event</a>'
		
		$("#"+one.id+"pop").popover({delay: 700, html: true, placement:'right', title: title, content: content});
//		alert(one.id);
//		$('#'+one.id+'pop').text("working");

	});
}

function deletebookmarks(bookmarktype, id)
{
	if(bookmarktype=='business'){
		url="/dining/unbookmark?idbiz="+id;
		
	}else if(bookmarktype=='places'){
		url="/places/unbookmark?idplace="+id;
		
	}else if(bookmarktype=='events'){
		url="/events/unbookmark?idevent="+id;
		
	}else{
		return;
	}
		$.ajax({
	     type: "GET",
	     url: url,
	     success: function(data){
	         if(data=='true') {
	        	 $("#"+id).remove()
//	             $("#"+id).html('<img src="/images/gtk-bookmark.png" width="30" align="bottom">');
	         }
	      },
	      error: function(errMsg) {
	      }
	});
}
function opencreateevent(data, showevent){
	var template  = $("#createeventtemplate").html();
//	console.log(data);
	var temp = _.template(template, {activity : data});
	$("#modalholder").html(temp);

//	$(".chzn-select").chosen();

	if(showevent){
	$('#CreateEvent').modal('show');
	}
    $("#done_button").click(function(){
        $("#emailModal").hide();
      });            
      $("#done_button2").click(function(){
        $("#emailModal").hide();
      });        
      $("#add_button").click(function(){
        $("#emailModal").toggle();    
      });	
  	$("#datepicker3" ).datepicker({ dateFormat: "yy-mm-dd", minDate: 0 });
	$('#timepicker3').timepicker({ampm: true});
	$('#timepicker2').timepicker({ampm: true});
	$(".chzn-select").chosen({ search_contains: true });

}
/*
function opendialog(url)
{
//	alert("1 - working"+urllink);
	//var data;
	$("#dialogdiv").dialog({
		autoOpen: false,
		modal: true,
		title: 'Select friend to invite',
		width: 500,
		close: function (){
//			$(this).dialog('close').dialog('destroy');
		}
	}).load(url).dialog("open");
}

function opengroupdialog(groupurl)
{
	// alert("1 - working"+urllink);
	//var data;
	var group=$('#selectedgroup').val();

	$("#dialogdiv").dialog({
		autoOpen: false,
		modal: true,
		title: 'Select friend to invite',
		width: 500,
		close: function (){
//			$(this).dialog('close').dialog('destroy');
		}
	}).load(groupurl, {'Groups': group}).dialog("open");
} */
/*
function createpersonaleventform(data)
{
//	alert(_.templateSettings.interpolate);
	var template  = $("#createpersonalevent").html();
	var temp = _.template(template, {outdata : data, friends: friends});
	$(".grandcentral").html(temp);
	$('#datetimepicker3').datetimepicker({ ampm: true, minDate: 0 });
	$('#datetimepicker2').datetimepicker({ ampm: true, minDate: 0 });
	$("#datepicker3" ).datepicker({ dateFormat: "yy-mm-dd", minDate: 0 });
	$("#datepicker2" ).datepicker({ dateFormat: "yy-mm-dd", minDate: 0 });
	$('#timepicker3').timepicker({ampm: true});
	$('#timepicker2').timepicker({ampm: true});
	$(".chzn-select").chosen({ search_contains: true });

}
*/
function createevent()
{
	if($("#summary").val() == ''   || $("#datepicker3").val()=='')
	{
		$("#CreateEventErrors").html('<font color="#ff3333">Please make sure you have correctly filled in the Event Title and Event Date.</font>');
		return;
	}
	var summary_id, location_id, startdate_id,  starttime_id,  endtime_id, city_id,  state_id,  description_id,  friendadd_id;
	
	if($("#summary").val())		{ summary_id 	= $("#summary").val();		}	
	if($("#location").val())	{ location_id 	= $("#location").val();		}	
	if($("#datepicker3").val())	{ startdate_id 	= $("#datepicker3").val();	}	
	if($("#timepicker3").val())	{ starttime_id 	= $("#timepicker3").val();	}	
	// if($("#enddate").val())		{ enddate_id 	= $("#enddate").val();		}	
	if($("#timepicker2").val())		{ endtime_id 	= $("#timepicker2").val();		}	
	if($("#city").val())		{ city_id 		= $("#city").val();			}	
	if($("#state").val())		{ state_id 		= $("#state").val();		}	
	if($("#description").val())	{ description_id = $("#description").val();	}	
	if($("#friendadd").val())	{ friendadd_id 	= $("#friendadd").val();	}	
	
//	createdata = $("#createeventform").serialize();
	createdata={summary: summary_id, location: location_id, startdate: startdate_id, 
			starttime: starttime_id, endtime: endtime_id, city: city_id, state: state_id, 
			description: description_id, friendadd: friendadd_id};
//	alert(createdata.description);
//	return;
	$.post('/activity/createactivitybit', createdata, function(data) {
		data2=jQuery.parseJSON(data);
//		alert(data2.status);
		if(data2.status==true)
		{
//			$("#logindiv").dialog("close");
//			window.location="/calendar?activity="+data2.id;
//			alert("working: "+data2.friends);
			$('#CreateEvent').modal('hide');
			window.location="/datebook?activity="+data2.id;
//			$("#redirect").val("");
		}else if(data2.status=='facebook'){
			$('#CreateEvent').modal('hide');
			window.location=data2.url;
		}else{
		$("#CreateEventErrors").html('false: <font color="#ff3333">'+data+'</font>');
		}
		//alert(logindata.toSource());
	    //alert("Data Loaded: " + data);
	  });
	
}

function addemail()
{
	var emailfirstname = emailaddress = '';
//	console.log("working");
//	console.log(": "+$("#emailfullname").val() +", "+$("#emailaddress").val());

//		console.log("working2");
	emailfullname 	= $("#emailfullname").val();		
	emailaddress 	= $("#emailaddress").val();
	var flag_emailfullname = validname(emailfullname);
	var flag_emailaddress = validemail(emailaddress);
	
//	console.log(": "+emailfullname+", "+emailaddress);
	if(flag_emailfullname && flag_emailaddress){
//		console.log("working3");
		
		newemail = {name: emailfullname, email: emailaddress};
		$.post('/profile/addfriendemail', newemail, function(data) {
			if(data=="true")
			{
				$("#emailfullname").val('');		
				$("#emailaddress").val('');
				var friend = '<div class=" alert Friends"><button type="button" class="close" data-dismiss="alert">&times;</button><p>'+emailfullname+'<br>'+emailaddress+'</p></div>';
				var friendoption = '<option value="'+emailaddress+'"> '+emailfullname+'</option>';
				$(friend).prependTo(".friends_module").hide().slideDown(1000);
				
				$("#friendadd").append(friendoption);
				$('#friendadd').trigger("liszt:updated");
				$("#emailerrormsg").html("");
			}
		});
	}else{
//		console.log("flag_emailfullname: "+emailfullname+", "+emailaddress);
		$("#emailerrormsg").html("Please ensure fields are entered correctly.");
	}
}
function removeemail(email)
{
	console.log("email removed:"+email);
	removeemaildata = {email: email};
	$.post('/profile/removefriendemail', removeemaildata, function(data) {
		$('#friendadd > option[value="'+email+'"]').remove();
		$('#friendadd').trigger("liszt:updated");
		
		console.log(data);
	});
}

function validname(name)
{
	var regexp = /^[a-zA-Z0-9\-\.\,\_\s]+$/;
	if(name==null || name.length==0)
	{		return false;	}
	if (name.search(regexp) == -1)
	    { return false; }
	else
	    { return true; }
}
function validemail(name)
{
	console.log(name+"\n");
	var regexp = /^[a-zA-Z0-9\.\_]+@[a-zA-Z0-9\.\_]+\.[a-zA-Z]{2,4}$/;
	if(name==null || name.length==0)
	{		return false;	}
	if (name.search(regexp) == -1)
	    { return false; }
	else
	    { return true; }
}

