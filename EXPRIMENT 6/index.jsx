function changeText(){

    let msg =
        document.getElementById("message").value;

    document.getElementById("heading").innerHTML = msg;
}

function changeColor(){

    document.body.style.backgroundColor = "lightblue";
}

function changeFont(){

    document.getElementById("heading").style.fontSize =
        "50px";
}

function togglePara(){

    let para = document.getElementById("para");

    if(para.style.display == "none"){
        para.style.display = "block";
    }

    else{
        para.style.display = "none";
    }
}

function resetPage(){

    location.reload();
}