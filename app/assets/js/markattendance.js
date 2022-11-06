const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function generateLectures() {

    var currentDate = new Date();
    var end = new Date();

    db.collection("lectures").load(function() {
        var timetableData = db.collection('timetables').find()[0].days.data;
        
        while(currentDate.getDate() != end.getDate()) {
            const timetableDayData = timetableData[currentDate.getDay()];

            if (timetableDayData) {

                for(var startTime in timetableDayData) {

                    var subject = timetableDataDay[startTime];

                    if (!subject || subject == '') continue;

                    var startDT = new Date();
                    startDT.setUTCDate(currentDate.getUTCDate() + offset);
                    startDT.setUTCHours(startTime);
                    startDT.setUTCMinutes(0, 0, 0);

                    var endDT = new Date(startDT.getTime());
                    endDT.setUTCHours(endDT.getUTCHours() + 1);

                    db.collection("lectures").insert({
                        "title": subject,
                        "subject": subject,
                        "start": startDT,
                        "end": endDT,
                        "attendance": "absent"                             
                    });
                }
            }

            currentDate.setDate(currentDate.getDate() + 1)
        }

        db.collection("lectures").save();

        // for(var day in timetableData) {
        //     var dayIndex = days.indexOf(day);
        //     if (dayIndex >= cDIndex) {
        //             var offset = dayIndex - cDIndex;

        //             var timetableDataDay = ;
                    
        //     }
        // }

        db.collection("lectures").load(function() {
            db.collection("lectures").remove();
            Array.prototype.forEach.call(lectures, function(lecture) {
                console.log(lecture);
                db.collection("lectures").insert(lecture);
            });
            db.collection("lectures").save();
            done();
        });
    });
}

function toggleLectureAttendance(lectureID) {

    var newAttendanceVal = !db.collection("lectures").findOne({"_id": lectureID})["attended"];

    db.collection("lectures").update({"_id": lectureID}, {"attended": newAttendanceVal});
    db.collection("lectures").save();

    var ele = document.getElementById(lectureID + "-button");

    if (newAttendanceVal) {
        ele.className = "btn btn-primary";
        ele.textContent = "Present";
    } else {
        ele.className = "btn btn-danger";
        ele.textContent = "Absent";
    }

}

function onload() {
    var calendarEl = document.getElementById('calendar');
        
    var calendar = new FullCalendar.Calendar(calendarEl, {
        timeZone: 'UTC',
        initialView: 'listMonth',

        // customize the button names,
        // otherwise they'd all just say "list"
        views: {
            listDay: { buttonText: 'Today' },
            listWeek: { buttonText: 'This week' },
            listMonth: { buttonText: 'This month' }
        },

        headerToolbar: {
            left: 'title',
            center: '',
            right: 'listDay,listWeek,listMonth'
        },

        events: function (info, onsuccess, onfailure) {

            // onsuccess([
            //     {
            //         "title": "TCS",
            //         "subject": "TCS",
            //         "start": 1667672678012,
            //         "end": 1667672678012,
            //         "attended": true,
            //         "_id": "3b55a7825912120"
            //     }
            // ]);

            db.collection("lectures").load(function() {
                 onsuccess(
                    db.collection("lectures").find()
                 );
            });
        },

        eventContent: function (args, createElement) {

            // var lectureIsDone = args.isPast;
            var lectureIsDone = true;

            if (lectureIsDone) {

                var lectureData = args.event._def.extendedProps;
                var lectureID = lectureData._id;

                var hasAttended = lectureData.attended;

                if (hasAttended) {

                    return {
                        html: args.event._def.title + `<button id="${lectureID}-button" type="button" onclick="toggleLectureAttendance(\'${lectureID}\')" class="btn btn-primary" style="float: right">Present</button>`,
                    };

                } else {
                    return {
                        html: args.event._def.title + `<button id="${lectureID}-button" type="button" onclick="toggleLectureAttendance(\'${lectureID}\')" class="btn btn-danger" style="float: right">Absent</button>`,
                    };
                }

            } else {
                return {
                    html: args.event._def.title + '<button type="button" class="btn btn-secondary" style="float: right">Upcoming</button>',
                }
            }
      },


        // eventRender: function(info) {
        //     console.log(info);
        //     let selector = info.el.querySelector('.fc-title');
        //     if (selector) { 
        //       selector.innerHTML = info.event.title + '<br><span class="text-muted" style="font-size: 90%">Subtitle'</span>';
        //     }
        
        //   }

        // eventClick: function(info) {
        //     alert('Event: ' + info.event.title);
        //     alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
        //     alert('View: ' + info.view.type);
        
        //     // change the border color just for fun
        //     info.el.style.borderColor = 'red';
        // }
    });

    calendar.render();
}

function onAttendanceActivated() {
    console.log(onAttendanceActivated);
}

