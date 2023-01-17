let is_sort_by_date = true;
let editedConferenceId = "";

$("document").ready(homePageIsReady);

function homePageIsReady() {
    // get and show all artists
    get_conferences();
    // add conference click listener --> open the form

    $(".add_conf").click(function (e) {
        var modal = document.getElementById("myModal");
        var span = document.getElementsByClassName("close")[0];

        // open the modal
        span.onclick = function () {
            modal.style.display = "none";
        };
        modal.style.display = "block";

        // client-side form validation of the inputes
        // formValidation();/**/
        // process the form

        // add conference form details
        $("#conference_form").submit(function (event) {

         


var regex1 = /^[a-zA-Z\s]+$/;
var name = $("#name").val();

if (regex1.test(name)) {
// the value contains only letters
} else {
alert("Only english letters should be entered in the name field");
return;
// the value contains either digits or other characters
}


            var details = getFormVariables();
            console.log(details)
            addConference(details);
            event.preventDefault();
        });
    });
    //--------------------------------------------------------
    // select button ---> show the list of conference in selected order
    //--------------------------------------------------------
    $(".select").change((e) => {
        console.log(e.target.value);

        if (e.target.value === "name") {
            console.log("uhuih");
            is_sort_by_date = false;
        } else {
            is_sort_by_date = true;
        }
        document.getElementById("conference_form").reset(); //reset the form
        get_conferences();
    });
}

//--------------------------------------------------------
// client-side validation of the form fields
//--------------------------------------------------------
function formValidation() {
    $("form[name='conference_form']").validate({
        rules: {
            id_field: {
                required: true,
                digits: true,
            },
            date: {
                required: true,
                digits: true,
                maxlength: 10,
                minlength: 10,
            },
            name: {
                required: true,
            },
            img_url: {
                required: true,
            },
            director: {
                required: true,
            },
            isSeries: {
                required: true,
            },
            series_number: {
                digits: true,
            },
        },
        // Specify validation error messages
        messages: {
            field_id: "Please enter only digits",
            date: "Please enter only digits",
        },
    });
}

//--------------------------------------------------------
// get all the fileds values (FormVariables)
//--------------------------------------------------------
function getFormVariables() {
    
const FormVariables ={
    id:  $("#id_field").val().replaceAll(' ', ''),
    name: $("#name").val(),
    logo_picture:  $("#img_url").val(),
    director:  $("#director").val(),
    date:  $("#date").val(),
    isSeries:  $('input[name="add_is_series"]:checked').val() ==='true',
    series_number: $('input[name="add_is_series"]:checked').val() === 'true'? $('input[name="add_series_number"]').val() : 1
    //TO DO:validation, is series always false
    //get value from chosen radio btn
}
console.log(FormVariables)
return FormVariables;
}

function getFormVariables_add_lecture(e) {
    if ($("#lecturer_website" + e.target.id).val() != null) {
        return [
            $("#in" + e.target.id).val(),
            $("#photo_of_a_lecturer" + e.target.id).val(),
            $("#lecturer_website" + e.target.id).val(),
        ];
    } else {
        return [
            $("#in" + e.target.id).val(),
            $("#photo_of_a_lecturer" + e.target.id).val(),
        ];
    }
}

   
    
    function getFormVariables_check(e) {
        if(($("#lecturer_website"+ e.target.id).val()) !=null)
        {
            $("#in"+ e.target.id).val(),
            $("#photo_of_a_lecturer"+ e.target.id).val(),
            $("#lecturer_website"+ e.target.id).val()
        return true;
        }
        else{
           $("#in"+ e.target.id).val(),
            $("#photo_of_a_lecturer"+ e.target.id).val()
            return true;
        }
      
    }
//--------------------------------------------------------
// send the conference detailes to the related function in the server-side
//--------------------------------------------------------

function addConference(conferenceDetails) {
    $.ajax({
        type: "POST", // define the type of HTTP verb we want to use (POST for our form)
        url: "/conferences", // the url where we want to POST
        contentType: "application/json",
        data: JSON.stringify(conferenceDetails),
        processData: false,
        encode: true,
        success: function (data, textStatus, jQxhr) {
            location.href = "/list";
            document.getElementById("conference_form").reset(); //reset the form
            get_conferences(); //TODO uncomment
        },
        error: function (jqXhr, textStatus, errorThrown) {
            alert(errorThrown);
        },
    });
    
}

//--------------------------------------------------------
// send GET request to get the conference list (sorted)
//--------------------------------------------------------
function get_conferences() {
    console.log("get");
    $.ajax({
        type: "GET",
        url: "http://localhost:3001/conference",
        success: function (data) {
            console.log("success");
            show_conferences(data);
        },
        error: function (data) {
            console.log("error");
            alert(data);
        },
    });
}

//--------------------------------------------------------
// send DELETE request to delete an conference
//--------------------------------------------------------
function delConference(e) {
        var conference_id = e.target.id
        var conference_id_cut =conference_id.substr(6, 8);
    $.ajax({
            type: 'DELETE',
            url: 'http://localhost:3001/conferences/' + conference_id_cut,
        processData: false,
        encode: true,
            success: function(data, textStatus, jQxhr) {
                
            get_conferences();
        },
            error: function(jqXhr, textStatus, errorThrown) {
            alert(errorThrown);
            }
    });
}

//--------------------------------------------------------
// send POST request to add lecture to an conference
//--------------------------------------------------------
    function add_lecture(lectureDetails,e) {
    console.log("add_lecture");
if(lectureDetails[2]!=null)
{
    
    }
    $.ajax({
            type: 'PUT', // define the type of HTTP verb we want to use (POST for our form)
            url: 'conferences/lecture/' + e.target.id, // the url where we want to POST
            contentType: 'application/json',
        data: JSON.stringify({
                "name": lectureDetails[0],
                "picture": lectureDetails[1],
                 "site": lectureDetails[2]
        }),
        processData: false,
        encode: true,
            success: function(data, textStatus, jQxhr) {
            console.log(lectureDetails[0]);
            document.getElementById("conference_form").reset(); //reset the form
            get_conferences(); //TODO uncomment
        },
            error: function(jqXhr, textStatus, errorThrown) {
            console.log(lectureDetails[0]);
                console.log("error")
            alert(errorThrown);
            }
    });
}

//--------------------------------------------------------
// send DELETE request to delete lecture of an conference
//--------------------------------------------------------
    function delLecture(e,lecture_id) {
        console.log("lecture name:   "+lecture_id);
 console.log("conference id:  "+e.target.id);
    $.ajax({
    type: 'DELETE',
    url: 'http://localhost:3001/conferences/' + e.target.id +"/lectures/" + lecture_id,
    dataType: 'text',
    // data: lecture_id,
        processData: false,
        encode: true,
    success: function(data, textStatus, jQxhr) {
        get_conferences();
        },
    error: function(jqXhr, textStatus, errorThrown) {
            alert(errorThrown);
    }
    });
}

//-------------------------------------------------------
// get lectures
//-------------------------------------------------
    function getLectures(e){
    $.ajax({
            type: 'GET',
            url: 'http://localhost:3001/conferences',
            success: function(data) {
                console.log("data:");
            console.log(data);
                showLectures(e,data);
        },
            error: function(data) {
            alert(data);
            }
    });
}
               function showLectures(e,data){
                let lecture_id;
                // var e_view=e.target.id;
                var e_view=e;
                console.log(e);
                var mylist;
    console.log(data);
                if(data==null)
                {
                    console.log("there");
                }
    // if this is the confernces field --> need another table
    for (val in data) {
                   
                    if(val===e.target.id){
            // add table, and generic buttons for each conference
                    mylist = $("<table></table>");
                    // mylist.append("<br>");
                    // mylist.append($("<tr></tr>"));
            for (i in data[val]) {
                      
                mylist.append($("<tr></tr>"));

                mylist.append($("<tr></tr>"));

                // if this is the confernces field --> need another table
                 if (typeof(data[val][i])==='object' && data[val][i] !== null) {
                   
                    var lectures = $("<table></table>");
                    for (j in data[val][i]) {
                        lecture_id=data[val][i][j].name;
                        lectures.append($("<tr></tr>"));
                        lectures.append(data[val][i][j].name);
                        lectures.append($("<tr></tr>"));
                        lectures.append('<img src="' + (data[val][i][j].picture + '">'));
                        lectures.append($("<tr></tr>"));
                        if(data[val][i][j].site)
                        {
                               lectures.append(data[val][i][j].site);
                          
                        }
                         lectures.append($("<br></br>"));
                       
                         var button = $('<input class="deletebtn" id="' +data[val][i][j].name+  '" type="button" value="delete">');
                        lectures.append(button);
                        lectures.append($("<tr></tr>"));
                        lectures.append($("<td></td>"));
                    }
                    var btn_close = $('<input class="close_btn" id="'+ '" type="button" value="close">');
                    lectures.append(btn_close);
                    lectures.appendTo(mylist);
                    continue;
                }
                // else --> append the field and value
            }
            // add space between conferences
            mylist.append($("<tr></tr>"));
            mylist.append("<br>");
             mylist.appendTo($("#div" + e.target.id));
        }
        $(".deletebtn").click(function(e) {
            console.log("deletebtn");
            console.log("from deletebtn: ");
            console.log(e.target.id);
             delLecture(e_view,e.target.id);
        });

        $(".close_btn").click(function(e) {
             mylist.hide();
             console.log("try2");
             console.log(e_view.target.id);
             $("#"+e_view.target.id).show();
             console.log("after");
         
        });
    }
}
//--------------------------------------------------------
// the front-end side --> show the list, add buttons & listeners
//--------------------------------------------------------
function show_conferences(data) {
    $("table").remove(); // remove the previous elements
    if (is_sort_by_date) {
        data = sort_by_date(data);
    } else {
        data = sort_by_name(data);
    }
    let index_conference=0;
    for (val in data) {
        // add table, and generic buttons for each conference
        var mylist = $("<table></table>");
        mylist.append("<strong class='color'> conference </strong>");
        mylist.append("<strong class='color'>" + index_conference + "</strong>");
        index_conference++;
        mylist.append("<strong class='color'>:</strong>");
        mylist.append("<br>");
        mylist.append($("<tr></tr>"));
        var button5 = $(
            '<button type="button" id="open_edit_' +
                data[val].id +
                '" class="btn btn-primary edit-conference" data-toggle="modal" data-target="#editConferenseModal">Edit Conferences</button>'
        );
        mylist.append(button5);
        var button1 = $(
            '<button class="delart btn btn-primary" id="delart'
             + data[val].id + 
                '">Delete conference</button>'
        );
        mylist.append(button1);
        var button3 = $(
            '<button class="viewLecture btn btn-primary" id="' +
                data[val].id +
                '">View lecture</button>'
        );
        mylist.append(button3);
        var button2 = $(
            '<button class="addLecture btn btn-primary" id="' +
                data[val].id +
                '">Add lecture</button>'
        );
        mylist.append(button2);
        var input = $(
            '<input class="in form-control" id="in' +
                data[val].id +
                '" type="input" placeholder="lecture name...">'
        );
        mylist.append(input);
        mylist.append($("<tr></tr>"));
        var input2 = $(
            '<input class="in form-control" id="photo_of_a_lecturer' +
                data[val].id +
                '" type="input" placeholder="Photo of a lecturer...">'
        );
        mylist.append(input2);
        mylist.append($("<tr></tr>"));
        var input3 = $(
            '<input class="in form-control" id="lecturer_website' +
                data[val].id +
                '" type="input" placeholder="lecturer website...">'
        );
        mylist.append(input3);
        var button4 = $(
            '<button type="button" class="btn btn-primary submit_add_lecture" id="' +
                data[val].id +
                '">Submit</button>'
        );
        mylist.append(button4);

        mylist.append($("<tr></tr>"));
        var div = $(
            '<div class="div" id="div' +
                data[val].id +
                '" type="button" value="lecture list:">'
        );
        mylist.append(div);
        for (i in data[val]) {
            mylist.append($("<tr></tr>"));
            if (i == "isSeries") {
                if (data[val][i] === "true" ||data[val][i] === true  ) {
                    mylist.append($("<th></th>").text("series"));
                    Object.keys(data[val])
                        .map((key, index) => {
                            if (key === "series_number")
                                mylist.append(
                                    $("<td></td>").text(data[val][key])
                                );
                        })
                        .join(" ");
                    break;
                }
            } else {
                mylist.append($("<th></th>").text(i));
            }

            if (data[val][i] == data[val].logo_picture) {
                mylist.append('<img src="' + data[val][i] + '">');
                continue;
            }
            if (i == "isSeries") {
                break;
            } else {
                mylist.append($("<td></td>").text(data[val][i])); /**/
            }
        }
        // add space between artists
        mylist.append($("<tr></tr>"));
        mylist.append("<br>");
        mylist.append("<div id = 'lecturesList'></div>");
        mylist.append("<tr><tr>");
        mylist.appendTo($("#conferences_list"));
        $("#in" + data[val].id).hide();
        $("#photo_of_a_lecturer" + data[val].id).hide();
        $("#lecturer_website" + data[val].id).hide();
        $(".submit_add_lecture").hide();
       
    }

    // add event listeners
    $(".delart").click(function (e) {
        delConference(e);
    });
// add event listeners
$(".delart").click(function(e) {
    delConference(e);
});
$(".submit_add_lecture").click(function(e) {
    var inputValue = $('#lecturer_website' + e.target.id).val();
    console.log("inputValue+="+inputValue);
    if(inputValue!=""){
try {
 var url = new URL(inputValue);
 // the value is a valid URL
} catch (e) {
 alert("the value in lecture website is not a valid URL");
   return;
 // the value is not a valid URL
}}
var inputValue1 = $('#photo_of_a_lecturer' + e.target.id).val();

try {
var url = new URL(inputValue1);
var extension = url.pathname.split('.').pop();
if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'gif') {
// the value is a valid URL of an image
} else {
// the value is a valid URL, but it is not an image
}
} catch (e) {
// the value is not a valid URL
alert("the value in photo of a lecturer is not a valid URL image");
return;
}

var inputValue2 = $('#in' + e.target.id).val();

var regex = /^[a-zA-Z\s]+$/;


if (regex.test(inputValue2)) {
// the value contains only letters
} else {
alert("Only english letters should be entered in the lecturer's name field");
return;
// the value contains either digits or other characters
}

    if ($("#in" + e.target.id).val() == '')
    {
        alert("lecture name must be filled out");
        return;
    } 
    if ($("#photo_of_a_lecturer" + e.target.id).val() == '')
    {
        alert("A photo of a lecturer must be added");
        return;
    } 
    console.log("submit_add_lecture");
    $("#in"+e.target.id).hide();
    $("#photo_of_a_lecturer"+e.target.id).hide();
    $("#lecturer_website"+e.target.id).hide();
    $(".submit_add_lecture").hide();
    ($("#lecturer_website" + e.target.id).val()). required = true;
    var check = getFormVariables_check(e);
    console.log("check:"+check);
    var details1 = getFormVariables_add_lecture(e);
    console.log("details1");
    console.log(details1);
    add_lecture(details1,e);
    // modal.style.display = "none";
});


    $(".addLecture").click(function (e) {
        console.log("hide");
        $("#in" + e.target.id).show();
        $("#photo_of_a_lecturer" + e.target.id).show();
        $("#lecturer_website" + e.target.id).show();
        $(".submit_add_lecture").show();
        console.log("addLecture click");
    });
        $(".viewLecture").click(function(e) {  
            console.log("good");  
            console.log(e.target.id);
            $("#"+e.target.id).hide();
        getLectures(e);
    });
    // $(".deletebtn").click(function (e) {
    //     console.log("deletebtn");
    //     delLecture(e);
    // });
    $(".edit-conference").on("click", function (event) {
        console.log(event.target.id.split("_")[2]);
        editedConferenceId = event.target.id.split("_")[2];
    });
    $("#edit_is_series_false").change(function(e){
        console.log("false")
        $('#edit_series_number_wrapper').css('display', 'none');
    })
    $("#edit_is_series_true").change(function(e){
        $('#edit_series_number_wrapper').css('display', 'block');

    })
    $("#is_series_false").change(function(e){
        console.log("false")
        $("#series_number").removeAttr('required');
        $('#series_number_wrapper').css('display','none');
    })
    $("#is_series_true").change(function(e){
        $("#series_number").attr('required', true);
        $('#series_number_wrapper').css('display', 'block');
    })
    $("#edit_form_submit").on("click", function (e) {

//     if($('input[name="edit_is_series"]:checked').val() === 'true'){
//         series_number = $('input[name="edit_is_series"]:checked').val().required ==true;
// console.log(('input[name="edit_is_series"]:checked').val() === 'true');
// return alert("Number of series must be entered. try again")
    // }
        const newConferenceDetails = {           
               id:editedConferenceId,
                name: $("#edit_name").val(),
                logo_picture: $("#edit_img_url").val() ,
                director: $("#edit_director").val(),
                date:$("#edit_date").val() ,
                isSeries: $('input[name="edit_is_series"]:checked').val() === 'true',
                series_number: $('input[name="edit_is_series"]:checked').val() === 'true'? +$('#edit_series_number').val() : 1            
            };
   
        console.log("from new conference edit")
      console.log(newConferenceDetails)  
        //PUT
       putConference(newConferenceDetails)
        editedConferenceId = '';
    });
}
function sort_by_date(data) {
    const sortedDataByDate = Object.values(data).sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    console.log(sortedDataByDate);
    return sortedDataByDate;
}
function sort_by_name(data) {
    const sortedDataByName = Object.values(data).sort((a, b) => {
        return ("" + a.name).localeCompare(b.name);
    });
    return sortedDataByName;
}
function putConference(newConferenceDetails){
    console.log(newConferenceDetails)
    $.ajax({
        type: "PUT", // define the type of HTTP verb we want to use (POST for our form)
        url: "/conferences/" + newConferenceDetails.id, // the url where we want to POST
        contentType: "application/json",
        data: JSON.stringify(newConferenceDetails),
        processData: false,
        encode: true,
        success: function (data, textStatus, jQxhr) {
            get_conferences(); 
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log("error");
            alert(errorThrown);
        },
    });

}
function isId(id) {
    return /^\d{6}-?\d{4}$/.test(id);
}