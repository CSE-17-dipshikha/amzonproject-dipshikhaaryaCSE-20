function calculateResult(){

    let subjects =
        document.getElementById("subjects").value;

    let total = 0;

    // Loop for taking marks

    for(let i = 1; i <= subjects; i++){

        let marks = parseInt(

            prompt(
                "Enter marks for Subject " + i
            )
        );

        total = total + marks;
    }

    // Calculate average

    let average = total / subjects;

    let grade = "";

    let result = "";

    // Conditions

    if(average >= 90){

        grade = "A+";

        result = "Pass";
    }

    else if(average >= 75){

        grade = "A";

        result = "Pass";
    }

    else if(average >= 60){

        grade = "B";

        result = "Pass";
    }

    else if(average >= 40){

        grade = "C";

        result = "Pass";
    }

    else{

        grade = "F";

        result = "Fail";
    }

    // Display Result

    document.getElementById("result").innerHTML =

        "<h3>Total Marks : " + total + "</h3>" +

        "<h3>Average : " + average + "</h3>" +

        "<h3>Grade : " + grade + "</h3>" +

        "<h3>Result : " + result + "</h3>";
}