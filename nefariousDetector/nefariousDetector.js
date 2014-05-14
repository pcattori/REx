// Fire off an alert if site is listed as nefarious
//console.log(document.URL);

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
    //console.log("rectifier");
    var metric = 0;
    nefarious = true; // for testing
    if (nefarious) {
        console.log("REx activated");
        //console.log("METRIC init to: "+ metric);
        metric += rectify_hidden();
        //console.log("METRIC updated to: "+ metric);
        metric += rectify_forms();
        //console.log("METRIC updated to: "+ metric);
        metric += rectify_imgs();
        //console.log("METRIC updated to: "+ metric);
        metric += rectify_iframes();
        //console.log("METRIC updated to: "+ metric);
        metric += rectify_scripts();
        console.log("METRIC: " + Math.sqrt(Math.sqrt(1/metric)));
    }
}

function metric(element) {
    var elementMetric = 1;
    //console.log("element metric: "+elementMetric);
    elementMetric *= centeredMetric(element);
    //console.log("element metric: "+elementMetric);
    elementMetric *= areaMetric(element);
    //console.log("element metric: "+elementMetric);
    elementMetric *= typeMetric(element);
    //console.log("element metric: "+elementMetric);
    return elementMetric;
}

function centeredMetric(element) {
    var offset = element.offset();
    var width = element.width();
    var height = element.height();
    
    var centerX = offset.left + (width/2.0);
    var centerY = offset.top + (height/2.0);

    var windowCenterX = $(window).width()/2.0;
    var windowCenterY = $(window).height()/2.0;

    //console.log("element coords; x:"+centerX+", y:"+centerY);
    //console.log("window coors; x:"+windowCenterX+", y:"+windowCenterY);
    var r_squared = Math.pow(centerX - windowCenterX, 2) + Math.pow(centerY - windowCenterY, 2);
    //console.log("r^2 : "+r_squared);
    return 2.0/(1 + r_squared);
}

function areaMetric(element) {
    return 1 + (element.width() * element.height());
}

function typeMetric(element) {
    if (element.is("form")) {
        return 0.5/(1+element.parents().length);
    }else if (element.is("iframe")) {
        var windowRadius = Math.pow($(window).width()/2.0,2) + Math.pow($(window).height()/2.0, 2);
        if (centeredMetric(element) < windowRadius/2.0) {
            return 0.8;
        }else {
            return 0.1/(1+element.parents().length);
        }
    }else if (element.is("img")) {
        return 0.4/(1+element.parents().length);
    }else if (element.is("script")) {
        return 0.6;
    }else {
        return 0;
    }
}

function rectify_hidden() {
    var exposedMetric = 0;
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
            exposedMetric += metric(self);
            //console.log("EXPOSED METRIC updated to: " + exposedMetric);
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
    return exposedMetric;
}

function rectify_forms() {
    var formMetric = 0;
    $("form").each(function() {
        $this = $(this);
        formMetric += metric($this);
        $this.remove();
    });
    //TODO: replace forms or expose their targets
    return formMetric;
}

function rectify_imgs() {
    var imgMetric = 0;
    $("img").each(function() {
        $this = $(this);
        imgMetric += metric($this);
        $this.remove();
    });
    return imgMetric;
    //TODO: replace images or check image origins to determine if they should be replaced
}

function rectify_iframes() {
    //TODO: remove ALL iframes reliably
    //$("iframe").attr("src", "");
    //$("iframe").remove();
    var iframeMetric = 0;
    $("iframe").each(function() {
        $this = $(this);
        console.log("jQuery detected an iframe");
        $this.attr("src", "");
        iframeMetric += metric($this); 
        this.parentNode.removeChild(this);
    });
    //var iframes = document.getElementsByTagName("iframe");
    //for (var i = 0; i < iframes.length; i++) {
    //    console.log("js detected an iframe");
    //    iframes[i].src = "";
    //    iframes[i].parentNode.removeChild(iframes[i]);
    //}
    //TODO: remove only certain iframes
    return iframeMetric;
}

function rectify_scripts() {
    var scriptsMetric = 0;
    $("script").each(function() {
        $this = $(this);
        scriptsMetric += metric($this);
        $this.remove();
    });
    return scriptsMetric;
} 
