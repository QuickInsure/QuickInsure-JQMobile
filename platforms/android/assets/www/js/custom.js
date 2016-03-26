//Cordova auto-generated code start
var map;
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("backbutton", this.onBackKeyDown, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        BMSClient.initialize("http://qi.au-syd.mybluemix.net", "542f2cb5-9b79-4162-b0a8-d7b4c835e6fe");
        var points = [
			new plugin.google.maps.LatLng(19.33, 72.75),
			new plugin.google.maps.LatLng(19.33, 73.08),
			new plugin.google.maps.LatLng(18.88, 72.75),
			new plugin.google.maps.LatLng(18.88, 73.08)
		];
		var latLngBounds = new plugin.google.maps.LatLngBounds(points);
        map = plugin.google.maps.Map.getMap({
        	'backgroundColor': 'white',
        	'mapType': plugin.google.maps.MapTypeId.ROADMAP,
			'controls': {
				// 'compass': true,
				// 'myLocationButton': true,
				// 'indoorPicker': true,
				'zoom': true
			},
			'gestures': {
				'scroll': true,
				'tilt': true,
				'rotate': true,
				'zoom': true
			},
			'camera': {
				'latLng': new plugin.google.maps.LatLng(19.079278, 72.879134),
				// 'tilt': 30,
				'zoom': 10,
				// 'bearing': 50
			}
        });
    },
    onBackKeyDown: function(e) {
        e.preventDefault();
        e.stopPropagation();
    }
};
app.initialize();
//Cordova auto-generated code end


//Global variables
var networkErrorMessage = 'Network error! Please try again.';


//Function to convert form data into JSON object
(function($,undefined){
    '$:nomunge'; // Used by YUI compressor.
    $.fn.serializeObject = function(){
        var obj = {};

        $.each( this.serializeArray(), function(i,o){
            var n = o.name,
            v = o.value;

            obj[n] = obj[n] === undefined ? v
            : $.isArray( obj[n] ) ? obj[n].concat( v )
            : [ obj[n], v ];
        });

        return obj;
    };
})(jQuery);


//Function to check for network connectivity
function checkConnection() {
    if (typeof navigator.connection === 'undefined') {
        return true;
    }
    else {
        var networkState = navigator.connection.type;
        if (networkState == Connection.NONE) {
            return false;
        }
        else {
            return true;
        }   
    }
}


//Function to display customized notification messages
function showMessage(message, callback, title, buttonName) {
    title = title || "Alert";
    buttonName = buttonName || 'OK';

    if (navigator.notification && navigator.notification.alert) {
        navigator.notification.alert(
            message,    // message
            null,   // callback
            title,      // title
            buttonName  // buttonName
        );
    } else {
        alert(message);
    }
}


function renewPolicy(clickObject) {
	if (checkConnection()) {
		submitForm(clickObject.data(), {}, "policyRenewal");
	}
	else {
		window.plugins.socialsharing.shareViaSMS('Policy Renewal:\n'+clickObject.data('renewal'), '0612345678', null);
	}
}


//Function to submit form to online server
function submitForm(dataObject, formData, formID) {
    var module = dataObject.module;
    var action = dataObject.action;
    var redirecturl = dataObject.redirecturl;

    var values = {};
    $.each($('#'+formID).serializeArray(), function(i, field) {
        values[field.name] = field.value;
        console.log(field.name+"<-->"+field.value)
    });
    
	if (formID =="carQuoteForm" ){
		$("#carQuoteDialog").popup("open");
		return false;
	}
	else if (formID =="bikeQuoteForm" ){
		$("#carQuoteDialog").popup("open");
		return false;
    }
    /*else if (formID =="loginForm") {
        $.mobile.navigate(redirecturl); return false;
    }*/
    
    var request = new MFPRequest("/"+module+"/"+action, MFPRequest.POST);
	request.setQueryParameters(formData);

    request.send(
        function(successResponse){
            var response = JSON.parse(successResponse.responseText);
            if (formID == "loginForm") {
                if (response.status == "valid") {
    				var summaryString = "<p>Name: " + response.data.name + "</p>";
    				summaryString += "<p>Mobile No.: " + response.data.mobile + "</p>";
    				summaryString += "<p>Email ID: " + response.data.email + "</p>";
    				summaryString += "<p>Aadhar No.: " + response.data.aadhar + "</p>";
    				summaryString += "<p>Gender: " + response.data.gender + "</p>";
    				$("#account_details").append(summaryString);

                    $.mobile.navigate(redirecturl);
                }
                else if (response.status == "invalid") {
                	showMessage("Invalid User!", null, null, null);
                }
                else {
                    if (response.code == 200) {
                        var summaryString = "<p>Customer ID: " + response.userData.custid + "</p>";
                        summaryString += "<p>Account No.: " + response.userData.accountno + "</p>";
                        summaryString += "<p>Account Type: " + response.userData.accounttype + "</p>";
                        summaryString += "<p>Balance: " + response.userData.balance + "</p>";
                        summaryString += "<p>Mobile No.: " + response.userData.mobileno + "</p>";

                        summaryString += "<h3>Policy Details</h3>";
                        summaryString += "<p>Product: " + response.policyData.product + "</p>";
                        summaryString += "<p>Policy End Date: " + response.policyData.policy_end_date + "</p>";
                        summaryString += "<p>Total Premium: " + response.policyData.total_premium_amt + "</p>";
                        renewalString = "Policy Renewal:\nInsured:"+response.policyData.insured_name+"\nProduct:"+response.policyData.product+"\nMobile:"+response.policyData.mobile_no+"\nEmail:"+response.policyData.email_id+"\nExpiry:"+response.policyData.policy_end_date+"\nDOB:"+response.policyData.dob+"\nAddress:"+response.policyData.resident_add+","+response.policyData.state+","+response.policyData.pincode+"\nRenew For:1 year";
                        summaryString += "<button class='ui-btn ui-btn-inline renew-button' data-renewal='"+renewalString+"' data-module='login' data-action='policyRenewal'>Renew</button>";
                        $("#account_details").html(summaryString);
                    	
						//Code to implement policy renew functionality
						$(".renew-button").off("click").on("click", function(){
							renewPolicy($(this));
						});

                    	$.mobile.navigate(redirecturl);
                    }
                    else {
                        showMessage(response[0].description, null, null, null);
                        //showMessage(response[0].message, null, null, null);
                    }
                }
            }
            else if (formID == "mapForm") {
                map.clear();
                /*var points = [
					new plugin.google.maps.LatLng(19.33, 72.75),
					new plugin.google.maps.LatLng(19.33, 73.08),
					new plugin.google.maps.LatLng(18.88, 72.75),
					new plugin.google.maps.LatLng(18.88, 73.08)
				];
				var latLngBounds = new plugin.google.maps.LatLngBounds(points);

				map.animateCamera({
					'target' : latLngBounds,
					'duration' : 1000
				});*/
                $.each(response, function(branchName, branchData) {
                    var snippet;
                    if (branchData.ifsc)
                        snippet = "Address: "+branchData.address+"\nIFSC Code: "+branchData.ifsc+"\nPhone No.: "+branchData.phoneno;
                    else
                        snippet = "Address: "+branchData.address+"\nPhone No.: "+branchData.phoneno;
					map.addMarker({
						'position': new plugin.google.maps.LatLng(branchData.lattitude, branchData.longitude),
                        'title': branchName,
                        'snippet': snippet
					});
                });
            }
            else if (formID == "policyRenewal") {
            	if (response[0].code == 200) {
					var summaryString = "<h6><b>Policy Details:</b></h6>";
					summaryString += "<p><b>Existing Policy No.</b>: " + response[1].policy_no + "</p>";
					summaryString += "<p><b>New Policy No.</b>: " + response[1].new_policy_no + "</p>";
					summaryString += "<p><b>Duration</b>: " + response[1].policy_st_date + " to " + response[1].policy_end_date + "</p>";
					summaryString += "<p><b>Insured Declared Value (IDV):</b>" + response[1].idv + "</p>";
					summaryString += "<p><b>Total Premium:</b>" + response[1].basic_premium + "(Basic) + " + response[1].serv_tax + "(Service Tax) = " + response[1].tot_premium_amt + "</p>";
					summaryString += "<h6><b>Customer Details:</b></h6>";
					summaryString += "<p><b>Customer Name:</b>" + response[1].cust_name + "</p>";
					summaryString += "<p><b>Email ID:</b>" + response[1].email_id + "</p>";
					summaryString += "<p><b>Mobile No.:</b>" + response[1].mobile_no + "</p>";
					summaryString += "<h6><b>Vehicle Details:</b></h6>";
					summaryString += "<p><b>Type:</b>" + response[1].vehicle_tp + "</p>";
					summaryString += "<p><b>Model:</b>" + response[1].manufacturer + " " + response[1].model + "</p>";
					summaryString += "<p><b>Engine No.:</b>" + response[1].engine_no + "</p>";
					summaryString += "<p><b>Chasis No.:</b>" + response[1].chasis_no + "</p>";
					summaryString += "<p><b>RTO:</b>" + response[1].rto + "</p>";
					$("#renewalDialog div[role='main']").html(summaryString);
					
					$("#renewalDialog").popup("open");
					return false;
            	}
            }
            else if(formID == 'carQuoteForm'){
                alert("api for car quote")
                if(response[0].code==200){
                    alert(response[1].eamil_id+"<<my email");
                     var premium = 100;
                var tpPremium = 20;
                var totalPremium=0;
                var NCBVal = 0;
                var NCB = $('input[name="carQuoteNoclaim"]:checked').val();
                if(NCB == 'YES'){
                   // alert("yes")
                    NCBVal = 5;
                    totalPremium = (premium + tpPremium)- NCBVal;
                 //   alert(totalPremium)
                }else{
                 //   alert("no")
                    NCBVal = 0;
                    totalPremium = (premium + tpPremium)- NCBVal;
                 //   alert(totalPremium);
                }
                
                $( "#carQuoteDialog" ).on( "popupbeforeposition", function( event, ui ) {
                    console.log(totalPremium+"><><><>")
                   $( "p:first" ).text(parseInt(totalPremium)+" Rs"); 
                } );
            $("#carQuoteDialog").popup("open");
                }
            }

        }, 
        function (failureResponse){
        	alert(failureResponse);
            /*alert("errorCode :: " + failureResponse.errorCode);
            alert("status:: " + failureResponse.status);
            alert("errorDescription :: " + failureResponse.errorDescription);*/
        }
    );

    return false;
}


//Initialize JQuery mobile defaults on mobile init
$(document).on('mobileinit', function() {
    $.mobile.defaultPageTransition = 'none';
    $.mobile.defaultDialogTransition = 'none';
    $.mobile.phonegapNavigationEnabled = true;
    $.mobile.page.prototype.options.domCache = true;

    if (navigator.userAgent.indexOf("OS X") != -1) {
        $.mobile.pushStateEnabled = false;
    }

    //Configure loader widget
    $.mobile.loader.prototype.options.text = "Loading";
    $.mobile.loader.prototype.options.textVisible = true;
    $.mobile.loader.prototype.options.theme = "b";
    $.mobile.loader.prototype.options.html = "";
});


//Code to load data for listing pages from online server
$(window).on('hashchange', function() {
    var currentHash = jQuery.mobile.path.parseLocation().hash;

    if (currentHash == "#map") {
        $("#mapForm").submit();
    }
});

function getEapp(){
	//alert("going to eapp")
	redirecturl = "#eapp"
	console.log("fffff"+redirecturl)
	//location.href="www/fragments/eapp.html"
	$.mobile.navigate(redirecturl); 
	//event.preventDefault;
	return false;
}

//Equivalent to JQuery $(document).ready()
$(document).on('pageinit', function() {
    FastClick.attach(document.body);

    $(".car-list").on("click", function(){
        console.log("fsdjfhsdjfs");
    });


    /*-----------Code to validate each form and submit to online server if connected start-----------*/
    $.validator.addMethod("pwcheck", function(value) {
        return /[a-z]/.test(value) // has a lowercase letter
            && /[A-Z]/.test(value) // has a lowercase letter
            && /\d/.test(value) // has a digit
            && /[!,%,&,@,#,$,^,*,?,_,~]/.test(value) // has special character
    }, "Password should consist of atleast 1 upper case, 1 lower case, 1 number & 1 special character");
    
    $.validator.addMethod("contact", function(value, element) {
        return this.optional(element) || /^(\+[0-9]?[0-9]?-|\+[0-9]?[0-9]?|[0-9])?\d{10}$/.test(value);
    }, "Please enter valid contact no.");
    
    $("form").each(function(){
        $(this).validate({
            ignore: [],
            errorElement: "em",
            rules: {
                Cust_Pass: {
                    minlength: 8,
                    maxlength: 20
                },
                confirmUserEmail: {
                    equalTo: "#Cust_Email"
                },
                confirmUserPassword: {
                    equalTo: "#Cust_Pass"
                }
            },
            messages: {
                Cust_Pass: {
                    minlength: "Password should be minimum of 8 characters",
                    maxlength: "Password should not be maximum of 20 characters"
                }
            },
            errorPlacement: function (error, element) {
                element.parents("div.ui-body-inherit").after(error);
            },
            highlight: function(element, errorClass) {
            },
            unhighlight: function(element, errorClass) {
            },
            invalidHandler: function(form, validator) {
                validator.showErrors();
                showMessage("Please enter all required fields!", null, null, null);
            },
            submitHandler: function(form) {
                if (checkConnection()) {
                    $("input[type='date']").each(function(){
                        var dateArray = $(this).val().split("/");
                        if (dateArray.length == 3) {
                            $(this).val(dateArray[2]+"-"+dateArray[0]+"-"+dateArray[1]);
                        }
                    });
                    submitForm($(form).data(), $(form).serializeObject(), $(form).prop("id"));
                }
                else {
                    showMessage(networkErrorMessage, null, null, null);
                }
                return false;
            }
        }).resetForm();       
    });
    /*-----------Code to validate each form and submit to online server if connected end-----------*/


    /*-----------Miscellaneous Events start-----------*/
    //Code to add close event to exit buttons
    if (navigator.userAgent.indexOf("OS X") != -1) {
        $(".exit").hide();
    }
    $(".exit").click(function(){
        navigator.app.exitApp();
    });


	$("li[data-tab='account']").click();
    $("li[data-tab='login']").click();

    var carQuote = "420102";
    $(".quotePrice").text(carQuote);

    $("input[name='locate']").off("change").on("change", function(){
		$("#mapForm").submit();
    });

    //var map = plugin.google.maps.Map.getMap();
    map.on(plugin.google.maps.event.MAP_READY, function(map) {
		/*var points = [
			new plugin.google.maps.LatLng(19.33, 72.75),
			new plugin.google.maps.LatLng(19.33, 73.08),
			new plugin.google.maps.LatLng(18.88, 72.75),
			new plugin.google.maps.LatLng(18.88, 73.08)
		];
		var latLngBounds = new plugin.google.maps.LatLngBounds(points);

		map.animateCamera({
			'target' : latLngBounds,
			'duration' : 1000
		});*/

        var div = document.getElementById('map_canvas');
        map.setDiv(div);
    });
    /*-----------Miscellaneous Events end-----------*/
});