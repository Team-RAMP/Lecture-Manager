var allInputs;
var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
var start_hour = 8;

function onload() {

    var subjects = [];
    
    allInputs = document.getElementsByTagName('input');
    var dataList = document.getElementById('subjects');

    Array.prototype.forEach.call(allInputs, function(input) {

        input.addEventListener("focusout", function() {

            if (subjects.includes(input.value)) return;

            subjects.push(input.value)
            var option = document.createElement('option');
            option.value = input.value;
            dataList.appendChild(option);
        });
    });
    
}

function proceedWithTimetable() {
    var data = new Map();
    Array.prototype.forEach.call(allInputs, function(input) {
        var day_no = input.parentElement.getAttribute('data-column').match(/\d/g)[0];
        var day = days[parseInt(day_no)-2];

        if (!data.has(day)) data.set(day, new Map());
        var sh = start_hour + data.get(day).size;
        data.get(day).set(sh, input.value);
    });
    console.log(data);
    
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