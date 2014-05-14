// Fire off an alert if site is listed as nefarious
//console.log(document.URL);

/*
$.get(
    'https://sb-ssl.google.com/safebrowsing/api/lookup',  // url
    { // parameters
        client: 'nefarious-detector', 
        appver: '1.0',
        apikey: 'ABQIAAAAgGqnbKoVRuoLDQEoxxUGihTP7ns81A-cdFUHFnGZhr9wEDgGsA', // api key provided by google @ https://developers.google.com/safe-browsing/key_signup
        pver: '3.0',
        url: document.URL //TODO: make sure url is properly encoded (with respect to google safe browsing requirements)
    }, 
    function(data, textStatus) {
        console.log('response code: ' + textStatus);
        console.log('page content: ' + data);
    } 
);
*/

$.ajax({
    type: 'GET',
    url: 'https://sb-ssl.google.com/safebrowsing/api/lookup', // url
    data: { // parameters
        client: 'nefarious-detector', 
        appver: '1.0',
        apikey: 'ABQIAAAAgGqnbKoVRuoLDQEoxxUGihTP7ns81A-cdFUHFnGZhr9wEDgGsA', // api key provided by google @ https://developers.google.com/safe-browsing/key_signup
        pver: '3.0',
        url: document.URL //TODO: make sure url is properly encoded (with respect to google safe browsing requirements)
    },
    statusCode: {
        200: function(data) { // nefarious
            //console.log('Nefarious');
            //console.log('data :' + data);
            phishing = false;
            malware = false;
            if (data == "phishing") {
                phishing = true;
            }else if (data == "malware") {
                malware = true;
            }else if (data == "phishing,malware") {
                phishing = true;
                malware = true;
            }
            /*
            return {
                nefarious: true,
                phishing: phishing,
                malware: malware 
            }; 
            */
            rectifier(true, phishing, malware);
        },
        204: function(data) { // benign
            //console.log('Benign');
            //console.log('data :' + data);
            /*
            return {
                nefarious: false
            };
            */
            rectifier(false, false, false);
        }
    }
});

//rectifier(true, false, false);

function rectifier(nefarious, phishing, malware) {
    console.log("rectifier");
    nefarious = true; // for testing
    if (nefarious) {
        console.log("REx activated");
        rectify_hidden();
        rectify_forms();
        rectify_imgs();
        rectify_iframes();
        rectify_scripts();
    }
}

function rectify_hidden() {
    var exposedCount = 0;
    $("*").each(function() {
        self = $(this);
        var exposed = false;
        if (self.css("visibility") == "hidden") {
            self.css("visibility", "visible !important");
            exposed = true;
        }
        if (self.css("display") == "none") {
            self.css("display", "block !important");
            exposed = true;
        }
        if (self.css("opacity") <= 0.1) {
            self.css("opacity", "1.0 !important");
            exposed = true;
        }
        if (self.is(":hidden")) {
            self.show();
            exposed = true;
        }
    
        if (exposed) {
            exposedCount += 1;
        }    
    });
    /*
    // visibility: hidden -> visibile
    $("*").filter(":hidden").each(function() {
        console.log("found hidden element... exposing!");
        this.css("visibility", "visible !important");
        this.css("display", "block !important");
        exposedCount += 1;
    });
    // display: none -> inline
    $("").each(function() {
        console.log("found display:none element... exposing!");
        this.css("display", "block !important");
        exposedCount += 1;
    });
    $("div[
    */
    return exposedCount;
}

function rectify_forms() {
    $("form").remove();
    //TODO: replace forms or expose their targets
}

function rectify_imgs() {
    $("img").remove();
    //TODO: replace images or check image origins to determine if they should be replaced
}

function rectify_iframes() {
    //TODO: remove ALL iframes reliably
    //$("iframe").attr("src", "");
    //$("iframe").remove();
    $("iframe").each(function() {
        console.log("jQuery detected an iframe");
        $(this).attr("src", "");
        this.parentNode.removeChild(this);
    });
    var iframes = document.getElementsByTagName("iframe");
    for (var i = 0; i < iframes.length; i++) {
        console.log("js detected an iframe");
        iframes[i].src = "";
        iframes[i].parentNode.removeChild(iframes[i]);
    }
    //TODO: remove only certain iframes
}

function rectify_scripts() {
    $("script").remove();
} 
