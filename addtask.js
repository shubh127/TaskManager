var userList=[];
var list = "";
var ss = JSON.parse(sessionStorage.user);
var form =document.forms["formTask"];
function handleForm(event) { event.preventDefault(); } 
form.addEventListener('submit', handleForm);

getUsersBy();

function addTask(){
    var valueName = document.forms["formTask"]["name"].value;
    var valueDescription = document.forms["formTask"]["description"].value;
    var valueResponsible = document.forms["formTask"]["responsible"].value;
    var valueStartDate = document.forms["formTask"]["startDate"].value;
    var valueEndDate = document.forms["formTask"]["endDate"].value;
    var valueCostPerHours = document.forms["formTask"]["cost_per_hours"].value;
    var valueTaskOwner = ss.email;

    if(isEmpty(valueName)){
        showErrorMessage("Please Enter a Name");
        return;
    }else if(isEmpty(valueDescription)){
        showErrorMessage("Please Enter a Description");
        return;
    }else if(isResponsibleValid(valueResponsible)){
        showErrorMessage("Please Enter the responsible assigned to");
        return;
    }else if(isDateValid(valueEndDate)){
        showErrorMessage("Please Enter A Valid Start date");
        return;
    }else if(isDateValid(valueEndDate)){
        showErrorMessage("Please Enter A Valid End date");
        return;
    }else if(isEmpty(valueCostPerHours)){
        showErrorMessage("Please Enter Cost per hours");
        return;
    }else{
        db.collection("tasks").add({
            name: valueName,
            responsible: valueResponsible,
            description: valueDescription,
            completed: false,
            taskowner: valueTaskOwner,
            from: valueStartDate,
            to: valueEndDate,
            costperhours: valueCostPerHours,
            hoursofwork: 0,
        })
        .then((docRef) => {
            showSuccessMessage('Task Created','Your task was created successfully',
            ).then((value) => {
                setTimeout(function(){
                    console.log("Document written with ID: ", docRef.id);
                    document.forms["formTask"]["name"].value='';
                    document.forms["formTask"]["description"].value='';
                    document.forms["formTask"]["responsible"].value='';
                    document.forms["formTask"]["startDate"].value='';
                    document.forms["formTask"]["endDate"].value='';
                    document.forms["formTask"]["cost_per_hours"].value='';
                    window.location.href="../main/main.html";
                }, 1000)
            });
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
          console.log("adding task");
    }
  }

  function getUsersBy(){
    db.collection("users").where("admin", "==", false)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var user=fromFirestore(doc);
            // doc.data() is never undefined for query doc snapshots
            userList.push(user);
            console.log(doc.id, " => ", doc.data());
        });
        
        populateUserSelect();
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
  }

  function populateUserSelect(){
    console.log("user list lenth = " + userList);
    for (var i = 0; i < userList.length; i++){
        var ls = ""
        ls +="<option value=\""+userList[i].email+"\">"+userList[i].email+"</option>"
        list += ls;
    }

    document.getElementById("responsible").innerHTML = "<option selected>Assigned to</option>"+list;
}


  function fromFirestore (snapshot){
    const data = snapshot.data();
    return new User(data.name, data.email, data.admin);
}

  function cancel(){    
    window.location.href="../main/main.html";
  }

  function checkUser() {
    if(sessionStorage.getItem('user') == null){
      window.location.replace("../index.html")
    }else if (!ss.admin){
        window.location.href="../main/main.html";
    }
}