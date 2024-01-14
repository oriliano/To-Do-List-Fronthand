let objects = loadObjectsFromStorage()
let tasks = loadTasksFromStorage()
let objectDetails = loadObjectsDetailsFromStorage()
let currentIndex = null;
let counter = []
let countElement = []

$(function(){
    // init page
    // set focus to textbox
    $(".new-list").on("click", function(){
        $("#newtab").css("visibility", "visible");
        $("#overlay").css("visibility", "visible");
        $("#textBox").focus();
        });
    
       $("#tabCancel").on("click", function(){
        $("#newtab").css("visibility", "hidden");
        $("#overlay").css("visibility", "hidden");
        $("#textBox").val("");
       });
    
    renderAllObjects()

    
    
    $("#btnAdd").on("click", function(){
        let title = $("#object").val()

        console.log(currentIndex);
        if(currentIndex == null)
            currentIndex=0;
        else 
            currentIndex++;
        console.log(currentIndex);    

        let newObject = {title, completed : false}  ; 
        objects.push(newObject)
        const newIndex = objects.length - 1;
        renderObject(newObject, newIndex)
        
        saveAllObjects() ;
        saveAllObjectDetails() ;
        createObjectDetails(newObject, newIndex)
        $("#object").val("").focus()
        $("#newtab").css("visibility", "hidden");
        $("#overlay").css("visibility", "hidden");
        $("#textBox").val("");
    })

    $("#clickMember").on("click", function(){
        dispMain();
    })

    $("#object").on("keydown", function(e){
        if ( e.key == "Enter"){
            let title = $("#object").val()

            console.log(currentIndex);
        if(currentIndex == null)
            currentIndex=0;
        else 
            currentIndex++;
        console.log(currentIndex); 

            let newObject = {title, completed : false}  ; 
            objects.push(newObject)
            const newIndex = objects.length - 1;
            renderObject(newObject, newIndex)
            saveAllObjects() ;
            saveAllObjectDetails() ;
            createObjectDetails(newObject, newIndex)
            $("#object").val("").focus()
            $("#newtab").css("visibility", "hidden");
            $("#overlay").css("visibility", "hidden");
            $("#textBox").val("");
        }
    })

    $("ul").on("click", "li #garbage", function (e) {
        
        let idx = $(this).parent().index();

        if(idx > 0) {
            displayObjectDetails(idx - 1);
        } 
        else 
            dispMain();

        for (let i = idx; i < objects.length; i++) {
            counter[i] = counter[i+1]; 
        }
        counter[objects.length] = 0;
        
        objects.splice(idx, 1);

        saveAllObjects();
        saveAllObjectDetails();
        saveAllTasks();
        $(this).parent().remove();
        e.stopPropagation();
        
        
        
    });

    $("ul").on("click", "li", function () {
        const index = $(this).data("index");
        displayObjectDetails(index);
        currentIndex = index;
    })

    $("#rightPanel").on("keydown", "#missionEntry", function(e) {
        if ( e.key == "Enter"){
            if(counter[currentIndex] == null)
                counter[currentIndex] = 0;
            
            let title = $("#missionEntry").val()
            let newTask = {title, completed : false}  ; 
            console.log(currentIndex);
            console.log(counter[currentIndex]);
            console.log(newTask);
            tasks[currentIndex][counter[currentIndex]] = newTask;
            renderTask(newTask)
            saveAllTasks() ;
            counter[currentIndex]++;
            objectDetails[currentIndex] = $('#rightPanel').html();
            saveAllObjectDetails();
            updateCounterDisplay();
        }
    })

    $("#rightPanel").on("click", ".boxes", function() {
        console.log("Entered");
        const $taskItem = $(this).closest('li');
        $taskItem.toggleClass("completed", this.checked);

        // Update the tasks array with completion status
        const idx = $taskItem.index();
        tasks[currentIndex][idx].completed = this.checked;
        if(this.checked) {
            counter[currentIndex]--;
        }
        else {
            counter[currentIndex]++;
        }
        updateCounterDisplay();
        saveAllTasks();
    });

})

function saveAllObjects(){
    localStorage.setItem("objects", JSON.stringify(objects))
}

function saveAllTasks(){
    localStorage.setItem("tasks", JSON.stringify(tasks))
}


// initialize objects using the persistent storage
function loadObjectsFromStorage(){
    let data = localStorage.getItem("objects")  // null if objects is not availabe.
    return data ? JSON.parse(data) : [] 
}

function loadTasksFromStorage(){
    let data = localStorage.getItem("tasks")  // null if objects is not availabe.
    return data ? JSON.parse(data) : [] 
}

function saveAllObjectDetails(){
    localStorage.setItem("objectDetails", JSON.stringify(objectDetails))
}

// initialize objects using the persistent storage
function loadObjectsDetailsFromStorage(){
    let data = localStorage.getItem("objectDetails")  // null if objects is not availabe.
    return data ? JSON.parse(data) : [] 
}

function renderAllObjects(){
    
    objects.forEach((object, index) => {
     renderObject(object, index);
    });

    
}

function renderAllTasks(){
    
    tasks.forEach((task, index) => {
     renderTask(task, index);
    });

    
}

function renderObject(object, index) {
    const counterValue = counter[index] || 0; 

    $("ul").append(`<li 
        style="color:black" data-index="${index}"
        class="${object.completed ? 'line-through' : ''}"
    ><span id="menu-icon">&#9776</span>${object.title}<span id="garbage">&#128465</span><span class="cnt">${counterValue}</span></li>`);
}

function updateCounterDisplay() {
    $("ul li").each(function(index) {
        const $cntSpan = $(this).find('.cnt');
        const counterValue = counter[index] || 0;
        if(counterValue > 0)
            $cntSpan.css("visibility", "visible");
        else {
            $cntSpan.css("visibility", "hidden");
        }
        $cntSpan.text(counterValue);
    });
}

function renderTask(task) {

    $(".mid ul").append(`<li 
    style="color:black"
    class="${task.completed ? 'line-through' : ''}"
    ><span> <input type="checkbox" class="boxes" unchecked></span>${task.title}</li>`);

}

function createObjectDetails(object, index) {
    $("#rightPanel").empty();

    objectDetails[index] = `<div class="newRight">
    <div class="top">
        <h1 style="text-align: center; font-weight: bold;" >
            ${object.title} 
        </h1>
    </div>
    <div class="mid">
    <ul class="${object.completed ? 'missions' : ''}">
                
    </ul>
    </div>
    <div class="bottom">
    <span class="plus">&#43</span>
    <input type="text" placeholder="Add a task" id="missionEntry">
    </div>
</div>`;


    $("#rightPanel").html(objectDetails[index]);
    saveAllObjectDetails();
}

function displayObjectDetails(index){
    $("#rightPanel").empty();
    $("#rightPanel").html(objectDetails[index]);
}

function dispMain(){
    $("#rightPanel").empty();
    
    let right = `<div id="right">
    <div class="members2">
        <p id="star2">&#9734</p>
        <p>Project Members</p>
    </div>
    <div id="students">
       
        <div id="info">
            <img src="emir.jpeg">
            <div>
                <p class="names">Emir İnaner</p>
                <p>Id: 22103363</p>
                <p>Section: 002</p><br>
            </div>
           </div>
        <div id="info">
            <img src="orhan.jpeg">
            <div>
                <p class="names">Orhan Kemal Koç</p>
                <p>Id: 22003861</p>
                <p>Section: 002</p><br></div>
        </div>
        
        <div id="info">
            <img src="cavit.jpeg">
            <div>
                <p class="names">Cavit Mert Ergül</p>
                <p>Id: 22001809</p>
                <p>Section: 002</p><br></div>
        </div>
        <div id="info"> 
            <img src="ali.eray.jpeg">
            <div>
                <p class="names">Ali Eray</p>
                <p>Id: 22202068</p>
                <p>Section: 001</p>
            </div>
        </div>
       
    </div>
</div>`

    $("#rightPanel").html(right);
}

function updateCounter(index, value) {
    counter[index] = value;

    // Save the updated counter to localStorage
    localStorage.setItem('counter', JSON.stringify(counter));
}