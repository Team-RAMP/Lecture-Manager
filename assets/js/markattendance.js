function onload() {
    var calendarEl = document.getElementById('calendar');
        
    var calendar = new FullCalendar.Calendar(calendarEl, {
        timeZone: 'UTC',
        initialView: 'listWeek',

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
            onsuccess(
                [
                    {
                      "title": "MPR",
                      "start": "2022-10-10T08:00:00-05:30",
                      "end": "2022-10-10T09:00:00-05:30"
                    },
                    {
                      "id": "TCS",
                      "title": "Repeating Event",
                      "start": "2022-10-10T09:00:00-05:30",
                      "end": "2022-10-10T10:00:00-05:30"
                    },
                    {
                      "id": "CN",
                      "title": "Repeating Event",
                      "start": "2022-10-10T10:00:00-05:30",
                      "end": "2022-10-10T11:00:00-05:30"
                    },
                    {
                      "title": "TCS",
                      "start": "2022-10-10T11:00:00-05:30",
                      "end": "2022-10-10T12:00:00-05:30"
                    },
                    {
                      "title": " ",
                      "start": "2022-10-10T12:00:00-05:30",
                      "end": "2022-10-10T13:00:00-05:30"
                    },
                    {
                      "title": "MPR",
                      "start": "2022-10-10T13:00:00-05:30",
                      "end": "2022-10-10T14:00:00-05:30"
                    },
                    {
                      "title": "DWM",
                      "start": "2022-10-10T14:00:00-05:30",
                      "end": "2022-10-10T15:00:00-05:30"
                    },
                    {
                      "title": "TCS",
                      "start": "2022-10-11T17:30:00-05:00"
                    },
                    {
                      "title": "MPR",
                      "start": "2022-10-11T20:00:00"
                    },
                    {
                      "title": " ",
                      "start": "2022-10-11T07:00:00-05:00"
                    },
                    {
                      "title": "DWM",
                      "url": "http://google.com/",
                      "start": "2022-10-11"
                    }
                  ]
            );
        }
    });

    calendar.render();
}

function onAttendanceActivated() {
    console.log(onAttendanceActivated);
}

