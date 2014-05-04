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
            console.log('Nefarious');
            console.log('data :' + data);
        },
        204: function(data) { // benign
            console.log('Benign');
            console.log('data :' + data);
        }
    }
});
