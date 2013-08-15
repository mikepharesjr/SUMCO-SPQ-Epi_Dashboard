var oLanAddress;
var oWanAddress;

var oDB;

var oJQTouch = $.jQTouch({
    statusBar: 'black-translucent',
    useAnimations: true,
    fixedViewport: false,
    cacheGetRequests: false,
    addGlossToIcon: false,
    themeSelectionSelector: '#oHome #oThemes ul',
    preloadImages: []
});

var oPictureSource;
var oDestinationType;

document.addEventListener("deviceready", onDeviceReady, false);

$(document).ready(initBasic);

function initBasic() {
    var oResults = false;
    try {
        updateLog("initBasic Entry");
        oLanAddress = "http://192.168.174.50:8181/WebGet/Query/";
        oWanAddress = "http://71.210.249.143:8181/WebGet/Query/";
        if (!localStorage.oUsername) { localStorage.oUsername = ""; }
        if (!localStorage.oPassword) { localStorage.oPassword = ""; }
        if (!localStorage.oDisplayName) { localStorage.oDisplayName = ""; }
        if (!localStorage.oIsAdmin) { localStorage.oIsAdmin = "N"; }
        if (!localStorage.oUseLanAddress) { localStorage.oUseLanAddress = false; }
        if (!localStorage.oJsonServerIp) { localStorage.oJsonServerIp = ""; }
        if (!localStorage.oLanTimeStamp) { localStorage.oLanTimeStamp = ""; }
        if (!localStorage.oWanTimeStamp) { localStorage.oWanTimeStamp = ""; }
        if (localStorage.oDisplayName != "") { updateWelcomeInfo(); }
        $('#oSettings').bind('pageAnimationStart', loadSettings);
        $('#oSettings form').submit(saveSettings);
        //$('#oASDF').bind('click touchend', GetAsdf);
        initDataBase();
        initExtraJavaFunctions();
        initHttpContextInfo(true);
        initHttpContextInfo(false);
        updateLog("initBasic Exit");
    }
    catch (err) { updateLog(err.message); }
    return oResults;
}

function initDataBase() {
    var oResults = false;
    try {
        updateLog("initDataBase Entry");
        if (typeof (openDatabase) === 'function') {
            updateLog("initDataBase True");
            var shortName = 'SPQ';
            var version = '1.1';
            var displayName = 'SPQ';
            var maxSize = 65536;
            oDB = openDatabase(shortName, '', displayName, maxSize);
            if (oDB.version == '1.0') {
                oDB.changeVersion('1.0', version,
                    function (transaction) {
                        transaction.executeSql('ALTER TABLE entries ADD COLUMN longitude TEXT');
                        transaction.executeSql('ALTER TABLE entries ADD COLUMN latitude TEXT');
                    },
                    function (e) { alert('DB upgrade error: ' + e.message); }
                );
            } else if (oDB.version == '') { oDB.changeVersion('', version); }
            oDB.transaction(function (transaction) { transaction.executeSql('CREATE TABLE IF NOT EXISTS entries (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, longitude TEXT, latitude TEXT);'); });
        }
        updateLog("initDataBase Exit");
    }
    catch (err) { updateLog(err.message); }
    return oResults;
}

function initExtraJavaFunctions() {
    var oResults = false;
    try {
        updateLog("initExtraJavaFunctions Entry");
        $(function () {
            $('a[target="_blank"]').bind('click', function () { if (confirm('This link opens in a new window.')) { return true; } else { return false; } });
            $('a[title="Results"]').bind('click', function (event) { clearResults(event.target || event.srcElement); });
            $('#mikepharesjr').bind('turn', function (e, data) {
                $('#orient').html('Orientation: ' + data.orientation);
            });
            $('#pageevents').
                bind('pageAnimationStart', function (e, info) {
                    $(this).find('.info').append('Started animating ' + info.direction + '&hellip;  And the link ' +
                        'had this custom data: ' + $(this).data('referrer').data('custom') + '<br>');
                }).
                bind('pageAnimationEnd', function (e, info) {
                    $(this).find('.info').append('Finished animating ' + info.direction + '.<br><br>');
                });
            $('#callback').bind('pageAnimationEnd', function (e, info) {
                if (!$(this).data('loaded')) {
                    $(this).append($('<div>Loading</div>').load('ajax.html .info', function () {
                        $(this).parent().data('loaded', true);
                    }));
                }
            });
            $('#swipeme').swipe(function (evt, data) {
                var details = !data ? '' : '<strong>' + data.direction + '/' + data.deltaX + ':' + data.deltaY + '</strong>!';
                $(this).html('You swiped ' + details);
                $(this).parent().after('<li>swiped!</li>')
            });
            $('#tapme').tap(function () {
                $(this).parent().after('<li>tapped!</li>')
            });
        });
        updateLog("initExtraJavaFunctions Exit");
    }
    catch (err) { updateLog(err.message); }
    return oResults;
}

function onDeviceReady() {
    var oResults = false;
    try {
        updateLog("onDeviceReady Entry");
        try {
            document.addEventListener("menubutton", onMenuKeyDown, false);
            document.addEventListener("searchbutton", onSearchKeyDown, false);
        }
        catch (err) { updateLog(err.message); }
        try {
            oPictureSource = navigator.camera.PictureSourceType;
            oDestinationType = navigator.camera.DestinationType;
        }
        catch (err) { updateLog(err.message); }
        updateLog("onDeviceReady Exit");
    }
    catch (err) { updateLog(err.message); }
    return oResults;
}

function onMenuKeyDown() {
    var oResults = false;
    try {
        updateLog("onMenuKeyDown Entry");
        oJQTouch.goTo('#oSettings', 'slideup');
        updateLog("onMenuKeyDown Exit");
    }
    catch (err) { updateLog(err.message); }
    return oResults;
}

function onSearchKeyDown() {
    var oResults = false;
    try {
        updateLog("onSearchKeyDown Entry");
        oJQTouch.goTo('#oAbout', 'slideup');
        updateLog("onSearchKeyDown Exit");
    }
    catch (err) { updateLog(err.message); }
    return oResults;
}

function saveSettings() {
    var oResults = false;
    try {
        updateLog("saveSettings Entry");
        localStorage.oUsername = document.getElementById("oUsername").value;
        localStorage.oPassword = document.getElementById("oPassword").value;
        //if (document.getElementById("oASDF").checked == true) { localStorage.oASDF = true; }
        oJQTouch.goBack();
        updateLog("saveSettings Exit");
    }
    catch (err) { updateLog(err.message); }
    return oResults;
}

function loadSettings() {
    var oResults = false;
    try {
        updateLog("loadSettings Entry");
        document.getElementById("oUsername").value = localStorage.oUsername;
        document.getElementById("oPassword").value = localStorage.oPassword;
        //document.getElementById("oASDF").checked = false;
        //if (localStorage.oASDF == true || localStorage.oASDF == "true") { document.getElementById("oASDF").checked = true; }
        document.getElementById("oSettingsInfo").innerHTML = localStorage.oJsonServerIp + " " + localStorage.oLanTimeStamp + localStorage.oWanTimeStamp;
        updateLog("loadSettings Exit");
    }
    catch (err) { updateLog(err.message); }
    return oResults;
}

function updateLog(oMessage) {
    var oResults = false;
    try { $("<li/>").text(oMessage).appendTo("#oLog"); }
    catch (err) { alert(err.message); }
    return oResults;
}

function initHttpContextInfo(oTestLanConnection) {
    var oResults = false;
    try {
        var oDate = new Date();
        var oHost = oWanAddress;
        if (oTestLanConnection == true || oTestLanConnection == "true") { oHost = oLanAddress; }
        var oURL = oHost + "GetHttpContextInfo" + "?NowTicks=" + oDate.toJSON() + "&" + "callback=?" //must end with callback=?
        $.getJSON(oURL, function (oData, oStatus, oXMLHttpRequest) {
            $.each(oData, function (oCount, oRow) {
                console.log(oRow);
                localStorage.oJsonServerUsername = oRow.C01;
                localStorage.oJsonServerIp = oRow.C02;
                if (oTestLanConnection == true || oTestLanConnection == "true") { localStorage.oUseLanAddress = true; localStorage.oLanTimeStamp = oRow.C03 }
                if (oTestLanConnection == false || oTestLanConnection == "false") { localStorage.oUseLanAddress = false; localStorage.oWanTimeStamp = oRow.C03 }
            });
        })
    }
    catch (err) { updateLog(err.message); }
    return oResults;
}

function GetHost() { var oResults = oWanAddress; if (localStorage.oUseLanAddress == true || localStorage.oUseLanAddress == "true") { oResults = oLanAddress; } return oResults; }

function GetUtilizationEventForSubTypeFromDC(oSubType) {
    var oResults = false;
    try {
        var oDate = new Date();
        document.getElementById("oMiniEpiDashboardResultsList").innerHTML = "";
        if (localStorage.oUsername.length < 3) {
            $("<li/>").text("Please update your Username in the settings first. {" + oDate.toJSON() + "}").appendTo("#oMiniEpiDashboardResultsList");
        } else {
            $("<li/>").text("Loading data for {" + oSubType + "} Please wait... {" + oDate.toJSON() + "}").appendTo("#oMiniEpiDashboardResultsList");
            var oURL = GetHost() + "GetUtilizationEventForSubTypeFromDC" + "?SubType=" + oSubType + "&NowTicks=" + oDate.toJSON() + "&" + "callback=?" //must end with callback=?
            $.getJSON(oURL, function (oData, oStatus, oXMLHttpRequest) {
                document.getElementById("oMiniEpiDashboardResultsList").innerHTML = "";
                $.each(oData, function (oCount, oRow) {
                    $("<li/>")
                        .text(oRow.C01 + " " + oRow.C02 + " " + oRow.C03 + " " + oRow.C04 + " " + oRow.C05 + " " + oRow.C06 + " " + oRow.C07)
                        .css({ color: oRow.C08 })
                        .appendTo("#oMiniEpiDashboardResultsList");
                });
            })
        }
        oJQTouch.goTo('#oMiniEpiDashboardResults', 'cube');
    }
    catch (err) { updateLog(err.message); }
    return oResults;
}

function CheckUserName() {
    var oResults = false;
    try {
        var oUsername = document.getElementById("oUsername");
        if (!oUsername) {
            updateLog("Couldn't get the oUsername Object.");
        }
        else {
            if (oUsername.value == "") {
                updateLog("oUsername is empty after lost focus.");
            } else {
                oUsername.value = oUsername.value.toUpperCase();
                GetOperatorInfo(oUsername.value);
            }
        }
    }
    catch (err) { updateLog(err.message); }
}

function GetOperatorInfo(oUsername) {
    var oResults = false;
    try {
        var oDate = new Date();
        var oURL = GetHost() + "GetOperatorInfo" + "?Username=" + oUsername.toUpperCase() + "&NowTicks=" + oDate.toJSON() + "&" + "callback=?" //must end with callback=?
        $.getJSON(oURL, function (oData, oStatus, oXMLHttpRequest) {
            $.each(oData, function (oCount, oRow) {
                //console.log(oRow);
                localStorage.oUsername = oRow.C01;
                localStorage.oDisplayName = oRow.C02;
                localStorage.oIsOperator = oRow.C03;
                localStorage.oIsLead = oRow.C04;
                localStorage.oExcursion = oRow.C05;
                localStorage.oIsAdmin = oRow.C06;
                localStorage.oCreatedDate = oRow.C07;
                localStorage.oLastUpdated = oRow.C08;
                updateWelcomeInfo();
            });
        })
    }
    catch (err) { updateLog(err.message); }
    return oResults;
}

function updateWelcomeInfo() {
    var oResults = false;
    try {
        document.getElementById("oWelcomeInfo").innerHTML = "Welcome back " + localStorage.oDisplayName;
    }
    catch (err) { updateLog(err.message); }
}

function clearResults(oTarget) {
    var oResults = false;
    try {
        switch (oTarget.id.toUpperCase()) {
            case "oMiniEpiDashboardResultsBackButton".toUpperCase(): document.getElementById("oMiniEpiDashboardResultsList").innerHTML = ""; break;
            default: throw "Case else for {" + oTarget.id + "}";
        }
    }
    catch (err) { updateLog(err.message); }
}

function onPhotoDataSuccess(oImageData) {
    var oResults = false;
    try {
        document.getElementById('oASDF').src = "data:image/jpeg;base64," + oImageData;
    }
    catch (err) { updateLog(err.message); }
}

function onPhotoURISuccess(oImageURI) {
    var oResults = false;
    try {
        document.getElementById('oASDF').src = oImageURI;
    }
    catch (err) { updateLog(err.message); }
}

function capturePhoto() {
    var oResults = false;
    try {
        //$('#spinwrap').fadeIn(500);
        navigator.camera.getPicture(onPhotoDataSuccess, updateLog("Failed to capture photo."), { quality: 50 });
    }
    catch (err) { updateLog(err.message); }
}

function getPhoto() {
    var oResults = false;
    try {
        oSource = pictureSource.PHOTOLIBRARY;
        navigator.camera.getPicture(onPhotoURISuccess, updateLog("Failed to get photo."), { quality: 50, destinationType: destinationType.FILE_URI, sourceType: oSource });
    }
    catch (err) { updateLog(err.message); }
}

function onCurrentPositionSuccess(oPosition) {
    var oResults = false;
    try {
        updateLog("Your current location: Latitude ~ {" + oPosition.coords.latitude + "} Longitude ~ {" + oPosition.coords.longitude + "}");
        //var oLatLng = new google.maps.LatLng(oPosition.coords.latitude, oPosition.coords.longitude);
    }
    catch (err) { updateLog(err.message); }
}

function getCurrentPosition() {
    var oResults = false;
    try { navigator.geolocation.getCurrentPosition(onCurrentPositionSuccess, updateLog("Couldn't get your location.")); }
    catch (err) { updateLog(err.message); }
}

function getCurrentAcceleration() {
    var oResults = false;
    try {
        navigator.accelerometer.getCurrentAcceleration(onAccelerationSuccess, updateLog("Failed to capture photo."));
    }
    catch (err) { updateLog(err.message); }
}

function onAccelerationSuccess(oAcceleration) {
    var oResults = false;
    try {
        alert('Acceleration X: ' + acceleration.x + '\n' +
              'Acceleration Y: ' + acceleration.y + '\n' +
              'Acceleration Z: ' + acceleration.z + '\n' +
              'Timestamp:    ' + acceleration.timestamp + '\n');
    }
    catch (err) { updateLog(err.message); }
}

function updateX() {
    var oResults = false;
    try { }
    catch (err) { updateLog(err.message); }
}