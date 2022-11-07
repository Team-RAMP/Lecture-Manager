var allInputs;
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var subjects = [];
var start_hour = 8;

var sorted_time_slots = [];

// Make inserting at a certain index more readable
Array.prototype.insert = function ( index, ...items ) {
    this.splice( index, 0, ...items );
};

function onload() {    

    $('#largeModal').modal({backdrop: 'static', keyboard: false}, 'show');

    const nSTField = document.getElementById("new-start-time");
    const nETField = document.getElementById("new-end-time");

    document.getElementById("modal-proceed").onclick = function(e) {
        document.getElementById("dialog-page-1").className = "carousel-item";
        document.getElementById("dialog-page-2").className = "carousel-item active";
    }
    
    document.getElementById("add-time-slot-button").onclick = function (e) {

        var nSTData = nSTField.value.split(":");
        var nETData = nETField.value.split(":");

        var startTime = parseInt(nSTData[0]) * 100 + parseInt(nSTData[1]);
        var endTime = parseInt(nETData[0]) * 100 + parseInt(nETData[1]);

        if (startTime > endTime) {
            startTime += endTime;
            endTime = startTime - endTime;
            startTime -= endTime;

            nSTField.value = nETData.join(":");
            nETField.value = nSTData.join(":");
        }

        var insertionIndex = 0;

        var ret = sorted_time_slots.some(function(time_slot) {
            if (startTime > time_slot.startTime) return true;

            if (startTime == time_slot.startTime) {
                if (endTime > time_slot.endTime) return true;                
                if (endTime == time_slot.endTime) {
                    alert("Can't duplicate time slot");
                    exit(0);                    
                }
            }

            ++insertionIndex;
            return false;
        });

        sorted_time_slots.insert(insertionIndex, {
            "startTime": startTime,
            "endTime": endTime
        });

        var time_slots_div_content = '<table style="width: 100%">';

        sorted_time_slots.forEach(function(time_slot) {

            var shr = ("0" + (parseInt(time_slot.startTime / 100) + 1)).slice(-2);            
            var smin = ("0" + (parseInt(time_slot.startTime % 100))).slice(-2);

            var ehr = ("0" + (parseInt(time_slot.endTime / 100) + 1)).slice(-2);            
            var emin = ("0" + (parseInt(time_slot.endTime % 100))).slice(-2);

            time_slots_div_content += `
                <tr>
                    <td colspan="5">${shr}:${smin} - ${ehr}:${emin}</td>
                    <td><button style="margin: 4px" type="button" class="btn btn-danger"><i class="bi bi-trash"></i>
                    </button></td>
                </tr>
            `;
        });

        time_slots_div_content += "</table>";

        document.getElementById("time-slots-div").innerHTML = time_slots_div_content;

        var nSTData = nSTField.value.split(":");
        var nETData = nETField.value.split(":");

        nSTData[0] = ("0" + (parseInt(nSTData[0]) + 1)).slice(-2);
        nETData[0] = ("0" + (parseInt(nETData[0]) + 1)).slice(-2);

        nSTField.value = nSTData.join(":");
        nETField.value = nETData.join(":");
        
        console.log("Start Time:");
        console.log(startTime);
        console.log("End Time:")
        console.log(endTime);
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js');
    }

    allInputs = document.getElementsByClassName('subject-input');
    var dataList = document.getElementById('subjects');

    window.fdb = new ForerunnerDB();
    window.db = fdb.db('commonsampledb');

    Array.prototype.forEach.call(allInputs, function(input) {

        input.addEventListener("focusout", function() {

            input.value = input.value.toUpperCase()

            if (subjects.includes(input.value)) return;

            subjects.push(input.value)
            var option = document.createElement('option');
            option.value = input.value;
            dataList.appendChild(option);
        });
    });

    $("#start-datepicker").datepicker({dateFormat: "dd-mm-yy"}).datepicker("setDate",'now');

    $("#end-datepicker").datepicker({dateFormat: "dd-mm-yy"});
}

function proceedWithTimetable() {

    var data = {};

    Array.prototype.forEach.call(allInputs, function(input) {

        if (input.classList.contains('hasDatepicker')) return;

        var day_no = input.parentElement.getAttribute('data-column').match(/\d/g)[0];

        if (data[day_no] == undefined) data[day_no] = {};
        var sh = start_hour + Object.keys(data[day_no]).length;
        data[day_no][sh] = input.value;
    });

    console.log(data);

    var sdData = $("#start-datepicker").val().split('-');
    var startDate = new Date(sdData[2], sdData[1] - 1, sdData[0]);

    var edData = $("#end-datepicker").val().split('-');
    var endDate = new Date(edData[2], edData[1] - 1, edData[0]);
    
    db.collection('timetables').load(function() {
        if (db.collection('timetables').find().length == 0) {
            const res = db.collection('timetables').insert({"_id": "timetable", "days": {data}, "subjects": subjects})
            if (res.inserted.length == 1) {
                db.collection('timetables').save();
                generateLectures(
                    startDate,
                    endDate,
                    0,
                    function () {
                        alert("Done. Proceeding to dashboard!")
                        window.location.href = "/timetables"; 
                    }
                );
                           
            } else {
                alert("An unexpected error occurred while adding timetable to db")
            }
        } else {
            const res = db.collection('timetables').update({}, {"_id": "timetable", "days": {data}, "subjects": subjects})
            if (res.length == 1) {
                db.collection('timetables').save()
                generateLectures(
                    startDate,
                    endDate,
                    0,
                    function () {
                        alert("Updated. Proceeding to dashboard!")
                        window.location.href = "/timetables";
                    }
                );


            } else {
                alert("An unexpected error occurred while updating timetable to db")
            }
        }
    })

}

function generateLectures(start, end, timetableID, done) {

        var currentDate = new Date(start);
    
        db.collection("lectures").load(function() {

            console.log("End Date: " + end);

            // Clear lectures collection
            db.collection("lectures").remove();
            db.collection("lectures").save();

            var timetableData = db.collection('timetables').find()[timetableID].days.data;
            
            end.setDate(end.getDate() + 1);

            while(currentDate.getDate() != end.getDate()) {

                currentDate.setDate(currentDate.getDate() + 1);

                // console.log("Date: " + startDT + "\n" + "Day: " + currentDate.getDay())

                const timetableDayData = timetableData[currentDate.getDay()];
        
                if (timetableDayData != undefined) {
    
                    for(var startTime in timetableDayData) {
    
                        var subject = timetableDayData[startTime];
    
                        if (!subject || subject == '') continue;
    
                        var startDT = new Date();
                        startDT.setUTCDate(currentDate.getUTCDate());
                        startDT.setUTCHours(startTime);
                        startDT.setUTCMinutes(0, 0, 0);

                        console.log("startDT: " + startDT);

    
                        var endDT = new Date(startDT.getTime());
                        endDT.setUTCHours(endDT.getUTCHours() + 1);
    
                        db.collection("lectures").insert({
                            "title": subject,
                            "subject": subject,
                            "start": startDT,
                            "end": endDT,
                            "attended": false                             
                        });
                    }
                }
    
            }
    
            db.collection("lectures").save();
            done();
      });
}

// var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

// var start_hour = 9;
// var start_hour = 17;
// var period_duration = 1;

// var breaks = [
//     [12, 13]
// ]

// function tableCreate() {
//     const body = document.body, tbl = document.createElement('table');
//     tbl.style.width = '100%';
//     tbl.style.border = '1px solid black';

//     var i = 0;

//     const tr = tbl.insertRow();
//     const td = tr.insertCell();

//     td.appendChild(document.createTextNode(``));

//     for (var i=0; i<days.length; ++i) {
//         const day = days[i];
//         const td = tr.insertCell();

//         td.appendChild(document.createTextNode(day));
//         td.style.border = '1px solid black';

//         // var th = document.createElement('th');
//         // th.classList.add('column100');
//         // th.classList.add('column1');
//         // th.textContent = 'Hello World';
//         // tableheader.append(th);
//     }


//     while(i <= endHour) {
//         const tr = tbl.insertRow();
        
//     }    
  
//     // for (let i = start_hour; i < endHour; i++) {
//     //   const tr = tbl.insertRow();
//     //   for (let j = 0; j < 2; j++) {
//     //     const td = tr.insertCell();
//     //     td.appendChild(document.createTextNode(``));
//     //     td.style.border = '1px solid black';
//     //   }
//     // }
//     body.appendChild(tbl);
//   }

// function onLoad() {


//     tableCreate();

//     // var tableheader = $(".row100 .head");
    
//     // for (var i=0; i<days.length; ++i) {
//     //     const day = days[i];

//     //     var th = document.createElement('th');
//     //     th.classList.add('column100');
//     //     th.classList.add('column1');
//     //     th.textContent = 'Hello World';
//     //     tableheader.append(th);

//     //     console.log(day);
//     // }
// }

// // $('#myModal').modal()