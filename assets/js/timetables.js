var start_hour = 8;

function onload() {
    const timetable_div = document.getElementById('content')

    db.collection('timetables').load(function() {
        const timetable_data = db.collection('timetables').findOne()
        construct_table(timetable_div, timetable_data['days']['data'])
    })
}

function construct_table(timetable_div, timetable_data) {

    const days = [];

    for (const [day, _] of Object.entries(timetable_data)) {
        days.push(day)
    }

    var table = document.createElement('TABLE');
    table.border = '1';

    var tableHead = document.createElement('THEAD');
    table.appendChild(tableHead);

    Array.prototype.forEach.call(days, function(day) {
        var th = document.createElement('TH');
        tableHead.appendChild(th);
        th.appendChild(document.createTextNode(day));
    })
  
    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);

    while(true) {
        if (timetable_data[days[0]][start_hour] == undefined) break;

        var tableRow = document.createElement('TR');
        tableBody.appendChild(tableRow);

        var td = document.createElement('TD');
        tableRow.appendChild(td);
        td.appendChild(document.createTextNode(start_hour));

        for (var dn=0; dn<days.length; ++dn) {
            var cellData = timetable_data[days[dn]][start_hour];
            var td = document.createElement('TD');
            tableRow.appendChild(td);
            td.appendChild(document.createTextNode(cellData));            
        }

        start_hour += 1;
    }
  
    // for (var i = 0; i < 3; i++) {
    //   var tr = document.createElement('TR');
    //   tableBody.appendChild(tr);
  
    //   for (var j = 0; j < 4; j++) {
    //     var td = document.createElement('TD');
    //     td.width = '75';
    //     td.appendChild(document.createTextNode("Cell " + i + "," + j));
    //     tr.appendChild(td);
    //   }
    // }
    timetable_div.appendChild(table);
}