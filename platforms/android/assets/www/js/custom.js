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
        map = plugin.google.maps.Map.getMap({
        	'backgroundColor': 'white',
        	'mapType': plugin.google.maps.MapTypeId.ROADMAP,
			'controls': {
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
				'zoom': 10,
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


function renewPolicy(clickObject, renewalString) {
	if (checkConnection()) {
		submitForm(clickObject.data(), {}, "policyRenewal");
	}
	else {
		window.plugins.socialsharing.shareViaSMS(renewalString, '0612345678', null);
	}
}


//Function to submit form to online server
function submitForm(dataObject, formData, formID) {
	$.mobile.loading("show", {
		text: "",
		textVisible: false,
		theme: "b",
		textonly: false,
		html: ""
    });

    var module = dataObject.module;
    var action = dataObject.action;
    var redirecturl = dataObject.redirecturl;
    
    var request = new MFPRequest("/"+module+"/"+action, MFPRequest.POST);
	request.setQueryParameters(formData);

    request.send(
        function(successResponse){
            var response = JSON.parse(successResponse.responseText);
            if (formID == "loginForm") {
                if (response.status == "valid") {
    				$("#noniciciProfile #name").html(response.data.name);
    				$("#noniciciProfile #mobileNo").html(response.data.mobile);
    				$("#noniciciProfile #emailID").html(response.data.email);
    				$("#noniciciProfile #aadharNo").html(response.data.aadhar);
    				$("#noniciciProfile #gender").html(response.data.gender);
					$("#noniciciProfile").show();
    				$("#iciciProfile").hide();

                    $.mobile.navigate(redirecturl);
					$.mobile.loading("hide");
                }
                else if (response.status == "invalid") {
                	showMessage("Invalid User!", null, null, null);
                	$.mobile.loading("hide");
                }
                else {
                    if (response.code == 200) {
	    				$("#iciciProfile #custID").html(response.userData.custid);
	    				$("#iciciProfile #accountNo").html(response.userData.accountno);
	    				$("#iciciProfile #accountType").html(response.userData.accounttype);
	    				$("#iciciProfile #balance").html(response.userData.balance);
	    				$("#iciciProfile #mobileNo").html(response.userData.mobileno);

	    				if (response.policyData != undefined) {
		    				$("#iciciProfile #product").html(response.policyData.product);
		    				$("#iciciProfile #endDate").html(response.policyData.policy_end_date);
		    				$("#iciciProfile #totalPremium").html(response.policyData.total_premium_amt);
		    				renewalString = "Policy Renewal:\nInsured:"+response.policyData.insured_name+"\nProduct:"+response.policyData.product+"\nMobile:"+response.policyData.mobile_no+"\nEmail:"+response.policyData.email_id+"\nExpiry:"+response.policyData.policy_end_date+"\nDOB:"+response.policyData.dob+"\nAddress:"+response.policyData.resident_add+","+response.policyData.state+","+response.policyData.pincode+"\nRenew For:1 year";
		    			}
						$("#noniciciProfile").hide();
	    				$("#iciciProfile").show();
                    	
						//Code to implement policy renew functionality
						$(".renew-button").off("click").on("click", function(){
							renewPolicy($(this), renewalString);
						});

                    	$.mobile.navigate(redirecturl);
                    	$.mobile.loading("hide");
                    }
                    else {
                        showMessage(response[0].description, null, null, null);
                        //showMessage(response[0].message, null, null, null);
                        $.mobile.loading("hide");
                    }
                }
            }
            else if (formID == "mapForm") {
                map.clear();
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
                $.mobile.loading("hide");
            }
            else if (formID == "policyRenewal") {
            	if (response[0] != undefined && response[0].code == 200) {
					$("#renewalDialog #policyNoOld").html(response[1].policy_no);
					$("#renewalDialog #policyNoNew").html(response[1].new_policy_no);
					$("#renewalDialog #duration").html(response[1].policy_st_date + " to " + response[1].policy_end_date);
					$("#renewalDialog #idv").html(response[1].idv);
					$("#renewalDialog #totalPremium").html(response[1].basic_premium + "(Basic) + " + response[1].serv_tax + "(Service Tax) = " + response[1].tot_premium_amt);
					$("#renewalDialog #custName").html(response[1].cust_name);
					$("#renewalDialog #emailID").html(response[1].email_id);
					$("#renewalDialog #mobileNo").html(response[1].mobile_no);
					$("#renewalDialog #type").html(response[1].vehicle_tp);
					$("#renewalDialog #model").html(response[1].manufacturer + " " + response[1].model);
					$("#renewalDialog #engineNo").html(response[1].engine_no);
					$("#renewalDialog #chasisNo").html(response[1].chasis_no);
					$("#renewalDialog #rto").html(response[1].rto);
					
					$("#renewalDialog").popup("open");
					$.mobile.loading("hide");
					return false;
            	}
            	else {
            		renewalString = "Policy Renewal:\nInsured:John Smith\nProduct:Hyundai Creta\nMobile:9999999999\nEmail:john.smith@xyz.com\nExpiry:01-06-2015\nDOB:12-12-1990\nAddress:Ram Mahal,Mumbai,Maharashtra,400081\nRenew For:1 year";
            		window.plugins.socialsharing.shareViaSMS(renewalString, '0612345678', null);
					$.mobile.loading("hide");
					return false;
            	}
            }
            else if(formID == 'carQuoteForm' || formID == 'bikeQuoteForm'){
            	var premium = 2000;
				var idv = 60000;
				var tpPremium = 4531;
				var totalPremium = 0;
				var NCBVal = 0;
				var NCB = formData.carQuoteNoclaim;
                if(response[0] != undefined && response[0].code == 200){
					premium = parseInt(response[1].premium);
					idv = response[1].idv;
				}
				if(NCB == 'YES'){
					NCBVal = 500;
					totalPremium = (premium + tpPremium) - NCBVal;
				}
				else {
					totalPremium = (premium + tpPremium) - NCBVal;
				}

				$("#carQuoteDialog #premium").html(totalPremium);
				$("#eapp #policyPremium").val(totalPremium); 
				$("#eapp #policyPremiumOG").val(totalPremium); 
				$("#carQuoteDialog #quoteNCBValue").html(NCBVal); 
				$("#carQuoteDialog #quoteTPValue").html(tpPremium)
				$("#carQuoteDialog #quoteIDVValue").html(idv);

				$("#carQuoteDialog").popup("open");
        		$.mobile.loading("hide");
        		return false;
            }
        }, 
        function (failureResponse){
        	// alert(failureResponse);
        	showMessage(failureResponse.errorDescription, null, null, null);
            /*alert("errorCode :: " + failureResponse.errorCode);
            alert("status:: " + failureResponse.status);
            alert("errorDescription :: " + failureResponse.errorDescription);*/
            $.mobile.loading("hide");
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


//Equivalent to JQuery $(document).ready()
$(document).on('pageinit', function() {
    FastClick.attach(document.body);

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

				    if($(form).prop("id") == 'eappForm') {
				    	$("#successDialog").popup("open");
				    	$.mobile.loading("hide");
				    }
				    else {
                    	submitForm($(form).data(), $(form).serializeObject(), $(form).prop("id"));
                    }
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
	$("li[data-tab='account']").click();
    $("li[data-tab='login']").click();
    $("li[data-tab='vehicle']").click();

    $("input[name='locate']").off("change").on("change", function(){
		$("#mapForm").submit();
    });

    map.on(plugin.google.maps.event.MAP_READY, function(map) {
		var div = document.getElementById('map_canvas');
        map.setDiv(div);
    });



    var max = 12;
    var montharray=['MONTH','JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST','SEPTEMBER','OCTOBER', 'NOVEMBER','DECEMBER']

    for (var i = 0; i<=max; i++){
        $('#paymentMonth').append($('<option>', {
            value: i,
            text: montharray[i]
        }));
    }
    for (var i = 1; i<=31; i++){
        $('#paymentDate').append($('<option>', {
            value: i,
            text: i
        }));
    }

    for (var i = 1990; i<=2020; i++){
        $('#paymentYear').append($('<option>', {
            value: i,
            text: i
        }));
    }
    /*-----------Miscellaneous Events end-----------*/
});