$(document).ready(function(){
  $.preloadCssImages({ 'imgDir': 'img' });
}); 








function refreshLoginBtn(){
    if(!google.accounts.user.checkLogin('https://www.google.com/m8/feeds')){
        $("#log").removeClass("logout");
        $("#log").addClass("login");
        $("#log").click(function(){logMeIn();});
    }
    else{
        getUsername();
        $("#log").removeClass("login");
        $("#log").addClass("logout");
        $("#log").click(function(){logMeOut();});
        $("#log").mouseover(function(){$("#infoUser").fadeIn(200)});
        $("#log").mouseout(function(){$("#infoUser").fadeOut(200)});
        
    }
}

function updateUserInfos(username){
    $("#infoUser").html("Logged as " + username);
}

function search(input){
    $("#dynamicContent").fadeOut(200);
    $("#searchImg").attr("src", "img/loader.gif");
    searchMyContacts(input);
    $("#loader").fadeTo(400, 1);
    $("#loupe").fadeTo(400, 0.0001);
}

function showContactList(contacts){
    $("#dynamicContent").empty();
    for (var i = 0; i < contacts.length; i++) {
       var contactHTML = '<div class="contactSmall"><a href="'+contacts[i][3]+'"></a><div class="photo"><img src=""/></div><h3 class="name">'+ contacts[i][0]+'</h3><p class="email">'+ contacts[i][1]+'</p><p class="tel">'+contacts[i][2]+'</p></div>';
        $("#dynamicContent").append(contactHTML);
    }
    $("#dynamicContent").fadeIn(200);
    $("#loupe").fadeTo(400, 1);
    $("#loader").fadeTo(400, 0.0001);
    $(".contactSmall").click(function(event){clickContact(event.currentTarget.childNodes[0].href);});
}

function clickContact(id){
    $("#dynamicContent").fadeOut(200);
    var contactInfo = getContactInfos(id)
}

function showNoResult(){
    $("#dynamicContent").empty();
    var noResult = '<p class="noResult">Sorry, nothing found.</p>';
    $("#dynamicContent").append(noResult);
    $("#dynamicContent").fadeIn(200);
    
}