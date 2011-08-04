google.load("gdata", "2.x");
google.setOnLoadCallback(init);

var contactsService;

function init() {
    setupContactsService();
    refreshLoginBtn();
}

function setupContactsService() {
  contactsService = new google.gdata.contacts.ContactsService('carnet-carnet-1.0');
  
}

function logMeIn() {
    $("#log").removeClass("login");
    var scope = 'https://www.google.com/m8/feeds';
    var token = google.accounts.user.login(scope);
    alert("1 " + token);
    refreshLoginBtn();
    
}

function logMeOut() {
    /*google.accounts.user.logout();
    refreshLoginBtn();
    window.location.reload();*/
    getContactInfos("http://www.google.com/m8/feeds/contacts/elsa.prieto.m%40gmail.com/base/736f43558be86552");
}



function getMyContacts() {
    var contactsFeedUri = 'https://www.google.com/m8/feeds/contacts/default/full';
    var query = new google.gdata.contacts.ContactQuery(contactsFeedUri);
  
    // Set the maximum of the result set to be 5
    query.setMaxResults(5);
    //query.setParam('q',"lalala");
  
    contactsService.getContactFeed(query, handleContactsFeed, handleError);
}

function searchMyContacts(searchInput){
    var contactsFeedUri = 'https://www.google.com/m8/feeds/contacts/default/full';
    var query = new google.gdata.contacts.ContactQuery(contactsFeedUri);
  
    // Set the maximum of the result set to be 5
    query.setMaxResults(5);
    query.setParam('q', searchInput);
  
    contactsService.getContactFeed(query, handleContactsFeed, handleError);
}

var handleContactsFeed = function(result) {
    
    var entries = result.feed.entry;
    if(entries == ""){
        showNoResult();
        return;
    }
    var contacts = []; 
    for (var i = 0; i < entries.length; i++) {
        var contactEntry = entries[i];
        var name = formatNames(contactEntry.getTitle().getText());
        var emailAddress = "-";
        if(contactEntry.getEmailAddresses().length >0){
            emailAddress = contactEntry.getEmailAddresses()[0].getAddress();
        }        
        var phoneNumber = "-"
        if(contactEntry.getPhoneNumbers().length > 0){
            phoneNumber = formatTel(contactEntry.getPhoneNumbers()[0].getValue());
        }        
        //var linkPhoto = contactEntry.getContactPhotoLink();
        if(emailAddress.length > 30){
            emailAddress=emailAddress.substring(0, 28) + "..";
        }
        var scope = 'https://www.google.com/m8/feeds';
        var id = contactEntry.getId().getValue();
        var token = google.accounts.user.login(scope);
        //alert("token " + token +"  " + contactEntry.getContactPhotoLink().getHref());
        //$.ajaxSetup({'beforeSend': function(xhr) {xhr.setRequestHeader("Authorization", 'AuthSub token="'+ token +'"')}});
        /*$.ajax({
            type:"GET",
            url:contactEntry.getContactPhotoLink().getHref(),           
            success:function(){
                alert("PHOTOOK");
            },
            error:function(e){alert("error" + e);}
        });*/
        $.ajax({
            type: 'GET',
            async: false,
            url: 'proxy.php',
            data: {
                token: token,
                url: contactEntry.getContactPhotoLink().getHref()
            },
            success: function(data) {
                //alert("SUCCESS" + data)
                img = data;
            },
            error:function(){
                alert('error');
            }
        });
        //$.get(contactEntry.getContactPhotoLink().getHref(), function(){alert("success")});
        contacts.push([name, emailAddress, phoneNumber, id]);
    }
    showContactList(contacts);
}

function formatNames(name){
    if(name == "") name = "No name";
    else{
        var nameArray = name.split(" ");
        name = "";
        for(var i=0; i<nameArray.length; i++){
            name += nameArray[i].charAt(0).toUpperCase() + nameArray[i].substr(1).toLowerCase() + " " ;
        }
    }
    if(name.length > 21){
        name=name.substring(0, 19) + "..";
    }
    return name;
}

function formatTel(num){
    if(num.length == 10){
        num = num.substr(0,2) + " " + num.substr(2, 2) + " " + num.substr(4,2) + " " + num.substr(6,2) + " " + num.substr(8,2); 
    }
    else{
        num = num.substr(0,3) + " " + num.substr(3, 1) + " " + num.substr(4,2) + " " + num.substr(6,2) + " " + num.substr(8,2)+" "+num.substr(10,2);  
    }
    return num;
}

function getMyGroups(){
    var feedGroups = 'http://www.google.com/m8/feeds/groups/default/full';
    contactsService.getContactGroupFeed(feedGroups, callGetMyGroups, handleError);
}

var callGetMyGroups = function(result) {
  
  // An array of contact group entries
  var entries = result.feed.entry;
  
  // Iterate through the array of contact groups, and print out their title and ID
  for (var i = 0; i < entries.length; i++) {
    var groupEntry = entries[i];
    var groupTitle = groupEntry.getTitle().getText();
    var groupId = groupEntry.getId().getValue();

    alert('group title = ' + groupTitle);
    //PRINT('group id = ' + groupId);
  }
}

function getUsername(){
    var contactsFeedUri = 'https://www.google.com/m8/feeds/contacts/default/full';
    var query = new google.gdata.contacts.ContactQuery(contactsFeedUri);
    query.setMaxResults(1);  
    contactsService.getContactFeed(query, handleUsername, handleError);    
}

var handleUsername = function(result) {    
    var entries = result.feed.entry;
    var username = entries[0].getId().getValue();
    username = username.split("%40")[0].split("http://www.google.com/m8/feeds/contacts/")[1];
    updateUserInfos(username);
}

function handleError(e) {
    alert("There was an error!" + e);
    alert(e.cause ? e.cause.statusText : e.message);
}

function essai(){
    //alert("essai");
    /*var contactsFeedUri = 'https://www.google.com/m8/feeds/contacts/default/full';
    var query = new google.gdata.contacts.ContactQuery(contactsFeedUri);
    query.setMaxResults(1);
    query.setParam('q', "elsa"); 
    contactsService.getContactFeed(query, handleEssai, handleError);*/
     var scope = 'https://www.google.com/m8/feeds';
        var img;
        var token = google.accounts.user.login(scope);
    $.ajax({
            type: 'GET',
            async: false,
            url: 'proxy.php',
            dataType: 'xml',
            data: {
                token: token,
                url: 'https://www.google.com/m8/feeds/contacts/elsa.prieto.m%40gmail.com/base/736f43558be86552'
            },
            success: function(data) {
                console.log("SUCCESS")
                $(data).find("email").each(function(){
                    console.log($(this).attr("address"));
                });
            },
            error:function(){
                alert('error');
            }
        });
    
}

var handleEssai = function(result) {
    //alert(result.feed.getText()); 
    var entries = result.feed.entry;
    for (var i = 0; i < entries.length; i++) {
        var contactEntry = entries[i];
        var name = contactEntry.getId().getValue();
        console.log("YOUHOU  " + name);
    }
}

function getContactInfos(id){
    var contact = new ContactEntry();
    var scope = 'https://www.google.com/m8/feeds';
    var token = google.accounts.user.login(scope);
    id = "https" + id.split("http")[1];
    /*$.ajax({
        type: 'GET',
        async: false,
        url: 'proxy.php',
        dataType: 'xml',
        data: {
            token: token,
            url: id
        },
        success: function(data) {
            console.log(data);
            var name = $(data).find("title").text();
            var emails = [];
            var phoneNumvers = [];
            $(data).find("email").each(function(){
                //emails.push([$(this).attr("address"),$(this).attr("rel").split("#")[1]]);
                console.log("OUI " + $(this).attr("rel"));
            });
            $(data).find("email").each(function(){
                emails.push([$(this).attr("address"),$(this).attr("rel").split("#")[1]]);
            });
            
        },
        error:function(){
            alert('error');
        }
    });*/
    
    
    $.ajax({
        type: 'GET',
        async: false,
        url: 'http://www.google.com/m8/feeds/contacts/elsa.prieto.m%40gmail.com/base/736f43558be86552',
        success: function(data) {
            console.log(data);
            var name = $(data).find("title").text();
           /* var emails = [];
            var phoneNumvers = [];
            $(data).find("email").each(function(){
                //emails.push([$(this).attr("address"),$(this).attr("rel").split("#")[1]]);
                console.log("OUI " + $(this).attr("rel"));
            });
            $(data).find("email").each(function(){
                emails.push([$(this).attr("address"),$(this).attr("rel").split("#")[1]]);
            });*/
            
        },
        error:function(){
            alert('error');
        }
    });
}


function ContactEntry(){
    this.name;
    this.phoneNumbers;
    this.emails;
}

ContactEntry.prototype.setName = function(name){
    this.name = name;
}

ContactEntry.prototype.setPhoneNumbers = function(numbers){
    this.phoneNumbers = numbers;
}

ContactEntry.prototype.setEmails = function(numbers){
    this.phoneNumbers = numbers;
}
























