/*

FILE:           index.js
PROJECT:        giftr (mad9022)
PROGRAMMER:     Eric Lachapelle

INFO:           A cordova app for storing 
                birthday gift ideas

VERSION:        1.0.4

DATE:           03/31/2017


*/

var savedPersonList = [];
var loadedPersonList = [];
var clickedOn = "";
var dateClickedOn = "";
var edit = false;
var key = "giftr-lach0192";

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        
        if(document.querySelector("#gift-list")){
            
            loadGifts();
            trashListener();
            
            // LOAD GIFTS
            function loadGifts(){
                
                dateClickedOn = localStorage.getItem("dateClickedOn");
                giftObject = JSON.parse(localStorage.getItem(key));
                
                personGifts = document.getElementById("personGifts");
                
                console.log("loading gifts for: " + dateClickedOn);
              
                for(var x = 0; x < giftObject.length; x++){
                    
                    if(dateClickedOn == giftObject[x].id){
                        
                        let title = document.querySelector(".title");
                        title.innerHTML = giftObject[x].name + "'s Gifts";
                        personGifts.innerHTML = giftObject[x].name;
                        
                        for(var i = 0; i < giftObject[x].ideas.length; i++){
                            
                            if(giftObject[x].ideas[i].idea != ""){
                                
                                let ul = document.getElementById("gift-list");

                                let li = document.createElement("li");
                                li.classList.add("table-view-cell");
                                li.classList.add("media");

                                let span = document.createElement("span");
                                span.classList.add("pull-right");
                                span.classList.add("icon");
                                span.classList.add("icon-trash");
                                span.classList.add("midline");
                                span.setAttribute("id", giftObject[x].ideas[i].giftid);

                                let div = document.createElement("div");
                                div.classList.add("media-body");

                                // store
                                let p = document.createElement("p");
                                p.innerHTML = giftObject[x].ideas[i].at;

                                // url
                                let p2 = document.createElement("p");
                                let a = document.createElement("a");
                                a.href = giftObject[x].ideas[i].url;
                                a.setAttribute("target", "_blank");
                                a.innerHTML = giftObject[x].ideas[i].url;

                                // price
                                let p3 = document.createElement("p");
                                p3.innerHTML = giftObject[x].ideas[i].cost;

                                // gift idea
                                let giftIdeaText = document.createTextNode(giftObject[x].ideas[i].idea);
                                div.appendChild(giftIdeaText);
                                
                                
                                div.appendChild(p);
                                div.appendChild(p2);
                                p2.appendChild(a);
                                div.appendChild(p3);
                                li.appendChild(span);
                                li.appendChild(div);

                                ul.appendChild(li);
                            }
                        }
                    }
                }
            }
            
            function trashListener(){
                
                var trash = document.querySelectorAll(".icon-trash");
                
                for(var i = 0; i < trash.length; i++){
                    
                    trash[i].addEventListener("click", function(ev){
                        
                        let thisTrash = this.id;
                        console.log("test trash on:" + thisTrash);
                        
                        let data = JSON.parse(localStorage.getItem(key));
                        
                        for(var x = 0; x < data.length; x++){
                            
                            for(var y = 0; y < data[x].ideas.length; y++){
                                
                                if(thisTrash == data[x].ideas[y].giftid){
                                    
                                    console.log("deleting" + data[x].ideas[y].giftid);
                                    
                                    data[x].ideas[y].idea = "";
                                    data[x].ideas[y].at = "";
                                    data[x].ideas[y].cost = "";
                                    data[x].ideas[y].url = "";
                                    data[x].ideas[y].giftid = "";
                                }
                            }
                        }
                        
                        localStorage.setItem(key, JSON.stringify(data));
                        document.getElementById("gift-list").innerHTML = "";
                        
                        loadGifts();
                        trashListener();
                    });
                }
                
            }
            
            document.getElementById("giftCancelBtn").addEventListener("click", function(){
                
                let modal = document.querySelector("#giftModal");
                modal.classList.remove("active");
            });
            
            document.getElementById("saveGiftBtn").addEventListener("click", function(){
                
                console.log("saved gift.");
                
                let personId = localStorage.getItem("dateClickedOn");
                let peopleObject = JSON.parse(localStorage.getItem(key));
                
                let idea = document.getElementById("ideaText").value;
                let store = document.getElementById("storeText").value;
                let url = document.getElementById("urlText").value;
                let cost = document.getElementById("costText").value;
                
                var giftTimestamp = Date.now();
                
                for(var i = 0; i < peopleObject.length; i++){
                    
                    if(personId == peopleObject[i].id){
                        
                        console.log("match");
                        
                        peopleObject[i].ideas.push({
                            giftid: giftTimestamp,
                            idea: idea,
                            at: store,
                            url: url,
                            cost: cost
                        });
                    }
                }
                
                localStorage.setItem(key, JSON.stringify(peopleObject));
                
                document.getElementById("ideaText").value = "";
                document.getElementById("storeText").value = "";
                document.getElementById("urlText").value = "";
                document.getElementById("costText").value = "";
                
                let modal = document.querySelector("#giftModal");
                modal.classList.remove("active");
                
                console.log(personId);
                console.log(peopleObject);
                
                console.log(idea);
                console.log(store);
                console.log(url);
                console.log(cost);
                
                document.getElementById("gift-list").innerHTML = "";
                loadGifts();
                trashListener();
                
            });
            
            
            // back btn
            document.querySelector("#backBtn").addEventListener("click", function(){            
                console.log("back button click.");
                
                document.location.href = "index.html";
            });
            
        }
        else if(!document.querySelector("#gift-list")){
            
            loadPersonList();
            nameLinker();
            dateLinker();

            // add person button
            document.getElementById("addPersonBtn").addEventListener("click", function(){

                document.getElementById("fullNameInput").value = "";
                document.getElementById("dobInput").value = "";

                var modal = document.getElementById("personModal");
                modal.classList.add("active");
            });

            // click listener on dates
            function dateLinker(){
                var dateLinks = document.querySelectorAll(".dateLink");

                for(var i = 0; i < dateLinks.length; i++){
                    dateLinks[i].addEventListener("click", function(ev){

                        console.log("date click");

                        dateClickedOn = this.id;
                        
                        localStorage.setItem("dateClickedOn", dateClickedOn);
                        
                        document.location.href = "gifts.html";
                    });

                }
            }

            // click listener on names
            function nameLinker(){
                var nameLinks = document.querySelectorAll(".nameLink");
                for(var i = 0; i < nameLinks.length; i++){
                    nameLinks[i].addEventListener("click", function(ev){

                        document.getElementById("fullNameInput").value = "";
                        document.getElementById("dobInput").value = "";

                        // get id of clicked name
                        clickedOn = this.id;
                        console.log("clicked on: " + clickedOn);

                        var modal = document.getElementById("personModal");
                        modal.classList.add("active");

                        loadedPersonList = JSON.parse(localStorage.getItem(key));
                        console.log("loaded:\n" + loadedPersonList);

                        if(loadedPersonList == null){

                        }
                        else{
                            for(var i = 0; i < loadedPersonList.length; i++){

                                if(loadedPersonList[i].id == clickedOn){

                                    edit = true;
                                    
                                    document.getElementById("fullNameInput").value = loadedPersonList[i].name;
                                    document.getElementById("dobInput").value = loadedPersonList[i].dob;
                                }
                            }
                        }
                    });
                }
            }

            // SAVE PERSON
            document.getElementById("savePersonBtn").addEventListener("click", function(){

                // get data from inputs
                var fullName = document.getElementById("fullNameInput").value;
                var dob = document.getElementById("dobInput").value;
                console.log("fullName: " + fullName + "\ndob: " + dob);

                // load data to see if person exists (edit)
                savedPersonList = JSON.parse(localStorage.getItem(key));
                console.log("savedPersonList:\n" + savedPersonList);

                if(savedPersonList == null){

                    savedPersonList = [];
                }
                
                if(edit == true){

                    for(var i = 0; i < savedPersonList.length; i++){

                        if(savedPersonList[i].id == clickedOn){
                            console.log("matched: " + clickedOn + "with - " + savedPersonList[i].id);

                            savedPersonList[i].name = fullName;
                            savedPersonList[i].dob = dob;
                        }
                    }

                    // resave changes to localStorage
                    localStorage.setItem(key, JSON.stringify(savedPersonList));

                    // relist people
                    document.getElementById("contact-list").innerHTML = "";
                    loadPersonList();

                    nameLinker();
                    dateLinker();

                    var modal = document.getElementById("personModal");
                    modal.classList.remove("active");

                    console.log("edit saved.");
                    edit = false;
                }
                // SAVE NEW
                else{

                    if (fullName != "" && dob != ""){

                        document.getElementById("errorLabel").innerHTML = "";

                        // create timestamp to use for id
                        var timestamp = Date.now();

                        // push data to array and save to localStorage
                        savedPersonList.push({
                            id: timestamp, 
                            name: fullName, 
                            dob: dob,
                            ideas: [{
                                "giftid":"",
                                "idea":"",
                                "at":"",
                                "cost":"",
                                "url":""
                            }]
                        });
                        console.log(savedPersonList);
                        localStorage.setItem(key, JSON.stringify(savedPersonList));

                        // reset inputs
                        document.getElementById("fullNameInput").value = "";
                        document.getElementById("dobInput").value = "";

                        // load list
                        document.getElementById("contact-list").innerHTML = "";
                        loadPersonList();

                        // add click listener
                        nameLinker();
                        dateLinker();

                        var modal = document.getElementById("personModal");
                        modal.classList.remove("active");

                        document.getElementById("savedLabel").innerHTML = "Person Saved"; 

                        setTimeout(function(){ 
                            document.getElementById("savedLabel").innerHTML = "";
                        }, 2000);
                    }
                    else{
                        document.getElementById("errorLabel").innerHTML = "Both fields are required";

                        setTimeout(function(){ 
                            document.getElementById("errorLabel").innerHTML = "";
                        }, 2000);
                    }
                }
            });

            // LOAD PEOPLE
            function loadPersonList(){

                edit = false;
                
                loadedPersonList = JSON.parse(localStorage.getItem(key));
                console.log("loaded:\n" + loadedPersonList);

                if(loadedPersonList == null){
                    
                    console.log("list is empty");
                }
                else{
                    
                // SORT LIST
                function compare(a, b) {
                    if (a.dob.substring(5) < b.dob.substring(5)) return -1;
                    if (a.dob.substring(5) > b.dob.substring(5)) return 1;
                    return 0;
                }
                    
                loadedPersonList.sort(compare);
                    
                    for(var i = 0; i < loadedPersonList.length; i++){
                        let li = document.createElement("li");
                        li.classList.add("table-view-cell");

                        let span = document.createElement("span");
                        span.classList.add("name");

                        let a = document.createElement("a");

                        // set name
                        let loadedName = loadedPersonList[i].name;

                        let name = document.createTextNode(loadedName);
                        a.appendChild(name);
                        a.classList.add("nameLink");
                        a.setAttribute("id", loadedPersonList[i].id);

                        span.appendChild(a);

                        li.appendChild(span);

                        let a2 = document.createElement("a");
                        a2.classList.add("navigate-right");
                        a2.classList.add("pull-right");
                        a2.classList.add("dateLink");
                        a2.setAttribute("id", loadedPersonList[i].id);

                        let span2 = document.createElement("span");
                        span2.classList.add("dob");

                        // set date
                        let loadedDate = loadedPersonList[i].dob;

                        moment.locale();
                        
                        let formattedDate = moment(loadedDate).format("MMM Do");
                        
                        let dob = document.createTextNode(formattedDate);
                        span2.appendChild(dob);

                        a2.appendChild(span2);

                        li.appendChild(a2);

                        let ul = document.getElementById("contact-list");
                        ul.appendChild(li);
                    }
                }
            }
        }
    },
    
    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();