var allInputs;
var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
var subjects = [];
var start_hour = 8;

function onload() {    
    allInputs = document.getElementsByTagName('input');
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
    
}

function proceedWithTimetable() {

    var data = {};

    Array.prototype.forEach.call(allInputs, function(input) {
        var day_no = input.parentElement.getAttribute('data-column').match(/\d/g)[0];
        var day = days[parseInt(day_no)-2];

        if (data[day] == undefined) data[day] = {};
        var sh = start_hour + Object.keys(data[day]).length;
        data[day][sh] = input.value;
    });

    console.log(data);

    db.collection('timetables').load(function() {
        if (db.collection('timetables').find().length == 0) {
            const res = db.collection('timetables').insert({"_id": "timetable", "days": {data}, "subjects": subjects})
            if (res.inserted.length == 1) {
                db.collection('timetables').save()
                alert("Done. Proceeding to dashboard!")
                window.location.href = "/timetables";
            } else {
                alert("An unexpected error occurred while adding timetable to db")
            }
        } else {
            const res = db.collection('timetables').update({}, {"_id": "timetable", "days": {data}, "subjects": subjects})
            if (res.length == 1) {
                db.collection('timetables').save()
                alert("Updated. Proceeding to dashboard!")
                window.location.href = "/timetables";
            } else {
                alert("An unexpected error occurred while updating timetable to db")
            }
        }
    })

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