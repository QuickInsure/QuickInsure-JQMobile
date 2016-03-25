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
        map = plugin.google.maps.Map.getMap();
    },
    onBackKeyDown: function(e) {
        e.preventDefault();
        e.stopPropagation();
    }
};
app.initialize();
//Cordova auto-generated code end


//Global variables
//development
//var serverURL = 'http://localhost/eWarranty/mobileAPI.php';
//production
//var serverURL = 'http://phpapi.net78.net/eWarranty/mobileAPI.php';
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
	}
	else {
		//if (device.platform == "Android") {
		    //window.plugins.socialsharing.share(null, null, null, 'https://play.google.com/store/apps/details?id=com.clifford.eWarranty');
		    window.plugins.socialsharing.shareViaSMS('Policy Renewal:\n'+clickObject.data('renewal'), '0612345678', null);
		/*}
		else if (device.platform == "iOS") {
		    window.plugins.socialsharing.setIPadPopupCoordinates(clickObject.offset().left + ',' + clickObject.offset().top + ',' + clickObject.width() + ',' + clickObject.height());
		    window.plugins.socialsharing.share(null, null, null, 'https://itunes.apple.com/in/app/hopeless-2-cave-escape/id1048438762?mt=8');
		}
		else if (device.platform == "WinCE" || device.platform == "Win32NT") {
		    window.plugins.socialsharing.share(null, null, null, 'http://www.windowsphone.com/<language>-<country>/store/app/<app-name>/<app-id>');   
		}*/		
	}
}

//Function to get data from online server if connected
function getData(pageID, module, action, dataID) {
    if (checkConnection()) {
        $.ajax({
            url: serverURL,
            data: {
                module: module,
                action: action,
                dataID: dataID,
                formData: "loginEmail="+window.localStorage.getItem("loginEmail")+"&loginType="+window.localStorage.getItem("loginType")+"&loginMemberid="+window.localStorage.getItem("loginMemberid")
            },
            dataType: 'json',
            type: 'POST',                   
            async: true,
            beforeSend: function() {
                $.mobile.loading("show");
            },
            complete: function() {
                $.mobile.loading("hide");
            },
            success: function (result) {
                if(result.status) {
                    $.mobile.navigate(pageID);
                }
            },
            error: function (request,error) {
                showMessage(networkErrorMessage, null, null, null);
            }
        });
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
     console.log("Module-->"+module+"<--action-->"+action+"<--redirectURL-->"+redirecturl);
     console.log(formData+"formData");
    
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
                        renewalString = "Insured:"+response.policyData.insured_name+"|Product:"+response.policyData.product+"|Mobile:"+response.policyData.mobile_no+"|Email:"+response.policyData.email_id+"|Expiry:"+response.policyData.policy_end_date+"|DOB:"+response.policyData.dob+"|Address:"+response.policyData.resident_add+","+response.policyData.state+","+response.policyData.pincode+"|Renew For:1 year";
                        summaryString += "<button class='ui-btn ui-btn-inline renew-button' data-renewal='"+renewalString+"'>Renew</button>";
                        $("#account_details").append(summaryString);
                    	
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
        }, 
        function (failureResponse){
            alert("errorCode :: " + failureResponse.errorCode);
            alert("status:: " + failureResponse.status);
            alert("errorDescription :: " + failureResponse.errorDescription);
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
        //getData("#viewProfile", "user", "profile");
        $("#mapForm").submit();
    }
});


//Initialize image size in popup
$(document).on("pagecreate", function() {
    $(".photopopup").on({
        popupbeforeposition: function() {
            var maxHeight = $(window).height() - 60 + "px";
            $(".photopopup img").css("max-height", maxHeight);
        }
    });
});


/*-----------Camera callback functions start-----------*/
function onBillScanSuccess(imageData) {
    $("#billCopyPopup img").attr("src", "data:image/jpeg;base64," + imageData);
    $("#billCopyPopup").popup("open");
}
function onAMCScanSuccess(imageData) {
    $("#amcCopyPopup img").attr("src", "data:image/jpeg;base64," + imageData);
    $("#amcCopyPopup").popup("open");
}
function onUploadBillScanSuccess(imageData) {
    $("#uploadBillPopup img").attr("src", "data:image/jpeg;base64," + imageData);
    $("#uploadBillPopup").popup("open");
}
function onUploadAMCScanSuccess(imageData) {
    $("#uploadBillAMCCopyPopup img").attr("src", "data:image/jpeg;base64," + imageData);
    $("#uploadBillAMCCopyPopup").popup("open");
}
function onFail(message) {
    showMessage('Failed because: ' + message, null, null, null);
}
/*-----------Camera callback functions end-----------*/


//Equivalent to JQuery $(document).ready()
$(document).on('pageinit', function() {
    FastClick.attach(document.body);

    /*-----------Code to trigger upload & validation of images from gallery start-----------*/
    //Button click triggers click of associated file input
    $(".galleryButton").off("click").on("click", function(){
        if (device.platform == "Android") {
            $("#"+$(this).data("target")).trigger("click");
        }
        else if (device.platform == "iOS") {
            if($(this).data("target") == "billCopyTemp") {
                navigator.camera.getPicture(onBillScanSuccess, onFail, { 
                    quality: 50,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    destinationType: Camera.DestinationType.DATA_URL
                });
            }
            else if($(this).data("target") == "amcCopyTemp") {
                navigator.camera.getPicture(onAMCScanSuccess, onFail, { 
                    quality: 50,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    destinationType: Camera.DestinationType.DATA_URL
                });
            }
            else if($(this).data("target") == "uploadBillCopyTemp") {
                navigator.camera.getPicture(onUploadBillScanSuccess, onFail, { 
                    quality: 50,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    destinationType: Camera.DestinationType.DATA_URL
                });
            }
            else if($(this).data("target") == "uploadBillAMCCopyTemp") {
                navigator.camera.getPicture(onUploadAMCScanSuccess, onFail, { 
                    quality: 50,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    destinationType: Camera.DestinationType.DATA_URL
                });
            }
        }
    });


    $("#scanBill").off("click").on("click", function(){
        navigator.camera.getPicture(onBillScanSuccess, onFail, { quality: 50,
            destinationType: Camera.DestinationType.DATA_URL
        });
    });
    $("#scanAMC").off("click").on("click", function(){
        navigator.camera.getPicture(onAMCScanSuccess, onFail, { quality: 50,
            destinationType: Camera.DestinationType.DATA_URL
        });
    });
    $("#scanUploadBill").off("click").on("click", function(){
        navigator.camera.getPicture(onUploadBillScanSuccess, onFail, { quality: 50,
            destinationType: Camera.DestinationType.DATA_URL
        });
    });
    $("#scanUploadAMC").off("click").on("click", function(){
        navigator.camera.getPicture(onUploadAMCScanSuccess, onFail, { quality: 50,
            destinationType: Camera.DestinationType.DATA_URL
        });
    });


    //Successful file input validates the file & displays in popup
    $("input[type='file']").off("change").on("change", function(){
        var popupID = $(this).data("target");
        var imageFile = this.files[0];
        var reader = new FileReader();

        reader.onloadend = function () {
            $("#"+popupID+" img").attr("src", reader.result);
            $("#"+popupID).popup("open");
        }
        
        if(imageFile && imageFile.type.indexOf("image/") == 0 && parseInt(imageFile.size) <= 2097152) {
            reader.readAsDataURL(imageFile);
        }
        else {
            showMessage("Please select an image with size less than 2MB.", null, null, null);
        }
    });


    //Cancel image clears the file input and closes the popup
    $(".confirmImage").click(function(){
        $(this).parent().popup("close");
        var image = $(this).siblings("img");
        $("#"+image.data("target")).val(image.prop("src"));
    });

    $(".cancelImage").click(function(){
        $(this).parent().popup("close");
        var image = $(this).siblings("img");
        $("#"+image.data("target")).val("");
    });
    /*-----------Code to trigger upload & validation of images from gallery end-----------*/


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
                    maxlength: "Password should be maximum of 20 characters"
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


    //Code to destroy login info upon logout buttons
    $(".logout").click(function(){
    	window.localStorage.clear();
        window.localStorage.setItem("tutorialFl", "true");
   		$.mobile.navigate("#preLogin"); 	
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
		var points = [
			new plugin.google.maps.LatLng(19.33, 72.75),
			new plugin.google.maps.LatLng(19.33, 73.08),
			new plugin.google.maps.LatLng(18.88, 72.75),
			new plugin.google.maps.LatLng(18.88, 73.08)
		];
		var latLngBounds = new plugin.google.maps.LatLngBounds(points);

		map.animateCamera({
			'target' : latLngBounds
		});

        var div = document.getElementById('map_canvas');
        map.setDiv(div);
    });
    /*-----------Miscellaneous Events end-----------*/
});