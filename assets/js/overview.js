$(function() {

    function getProgressClass(progress) {
        if (progress == 100) return "progress-bar bg-success";
        else if (progress >= 90) return "progress-bar bg-info";
        else if (progress >= 85) return "progress-bar";
        else if (progress >= 75) return "progress-bar bg-warning";
        return "progress-bar bg-danger";
    }

    db.collection("lectures").load(function() {

        // Get lectures ordered by end timestamp/date
        const lectures = db.collection("lectures").find({}, {"$orderBy": {"end": 1}});

        // Get current date as JS date-time object
        const currentDT = new Date();

        // Get current week start and end
        const currentWeekStart = new Date(currentDT).setDate(currentDT.getDate() - currentDT.getDay());
        const currentWeekEnd = new Date(currentDT).setDate(currentDT.getDate() - currentDT.getDay() + 7);

        // Shift the date 7 days ahead for demonstration purposes
        currentDT.setDate(currentDT.getDate() + 7)


        var subject_attendance_data = new Map();

        var total_lectures = 0;

        var total_attendance = 0;
        var monthly_attendance = 0;

        const fLDT = new Date(lectures[0].start);
        fLDT.setHours(0, 0, 0, 0);

        var lastWeek = {
            "sd": fLDT.getTime(),
            "attended": 0,
            "total": 0
        };

        var currentWeek = null;

        var weekly_attendance_data = [lastWeek];

        // console.log(`currentWeekStart: ${currentWeekStart}`);
        // console.log(`currentWeekEnd: ${currentWeekEnd}`);

        // console.log(`fLDT.getTime(): ${fLDT.getTime()}`);

        if (fLDT.getTime() >= currentWeekStart && fLDT.getTime() <= currentWeekEnd) {
            currentWeek = lastWeek;
        }

        Array.prototype.forEach.call(lectures, function(lecture) {

            var refDT = new Date(lecture.start);
            refDT.setHours(0, 0, 0, 0);

            if (currentDT.getTime() <= refDT.getTime()) return;
            
            if (refDT.getDay() == 1) {
                if (lastWeek.sd != refDT.getTime()) {
                    lastWeek.percentage = parseInt((lastWeek.attended/lastWeek.total)*100);
                    lastWeek = {
                        "sd": refDT.getTime(),
                        "attended": 0,
                        "total": 0
                    };

                    // console.log(`refDT.getTime(): ${refDT.getTime()}`);

                    if (refDT.getTime() >= currentWeekStart && refDT.getTime() <= currentWeekEnd) {
                        currentWeek = lastWeek;
                    }

                    weekly_attendance_data.push(lastWeek);
                }
            }

            // Count lecture for current week and total
            ++lastWeek.total;
            ++total_lectures;

            if (subject_attendance_data[lecture.subject] == undefined) {
                subject_attendance_data[lecture.subject] = {
                    "attended": 0,
                    "total": 0
                };
            }

            ++subject_attendance_data[lecture.subject].total;

            if (lecture.attended) {
                ++total_attendance;
                ++lastWeek.attended;

                if (refDT.getMonth() == currentDT.getMonth() &&
                        refDT.getFullYear() == currentDT.getFullYear()) {
                    ++monthly_attendance;
                }

                ++subject_attendance_data[lecture.subject].attended;
            }

        });

        const overallAttendance = parseInt((total_attendance / total_lectures) * 100);

        lastWeek.percentage = parseInt((lastWeek.attended/lastWeek.total) * 100);
        const weekly_attendance = currentWeek.attended;


        document.getElementById("current-month-attendance-value").textContent = monthly_attendance;
        if (currentWeek != null) {
            document.getElementById("current-week-attendance-val").textContent = weekly_attendance;
        }

        document.getElementById("overall-attendance-val").textContent = `${overallAttendance}%`;
        document.getElementById("overall-attendance-progress-bar").style.width = `${overallAttendance}%`;
        document.getElementById("overall-attendance-progress-bar").className = getProgressClass(overallAttendance);


        const subjectDiv = document.getElementById("subjects-body");
        var subjectsDivContent = "";
        var total_safe_bunks = 0;

        for (var subject in subject_attendance_data) {
            var subject_data = subject_attendance_data[subject];
            subject_data.percentage = parseInt((subject_data.attended / subject_data.total) * 100);
            subject_data.lrfor75 = parseInt(subject_data.attended * 4 / 3);
            subject_data.safebunks = subject_data.lrfor75 - subject_data.total;
            if (subject_data.safebunks < 0) subject_data.safebunks = 0;
            
            total_safe_bunks += subject_data.safebunks;

            subjectsDivContent += `
                <h4 class="small font-weight-bold">${subject}<span class="float-right">${subject_data.percentage}%</span></h4>
                <div class="progress mb-4">
                    <div class="${getProgressClass(subject_data.percentage)}" role="progressbar" style="width: ${subject_data.percentage}%"
                        aria-valuenow="${subject_data.percentage}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `;

            // console.log(subject);
            // console.log(subject_data);
        }

        console.log(subject_attendance_data);

        subject_attendance_data = new Map([...subject_attendance_data].sort((a, b) => b.percentage - a.percentage));

        console.log(subject_attendance_data);

        for (var subject in subject_attendance_data) {

            var subject_data = subject_attendance_data.get(subject);

            subjectsDivContent += `
                <h4 class="small font-weight-bold">${subject}<span class="float-right">${subject_data.percentage}%</span></h4>
                <div class="progress mb-4">
                    <div class="${getProgressClass(subject_data.percentage)}" role="progressbar" style="width: ${subject_data.percentage}%"
                        aria-valuenow="${subject_data.percentage}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `;
        }

        subjectDiv.innerHTML = subjectsDivContent;

        document.getElementById("total-safe-leave-val").textContent = total_safe_bunks; 

        // Array.prototype.forEach.call(subject_attendance_data, function(subject_data) {
        //     console.log(subject_data);
        // });

        // console.log(weekly_attendance_data);
        // console.log(`Total attended lectures: ${total_attendance}`);
        // console.log(`Monthly attended lectures: ${monthly_attendance}`);
        // console.log(`Weekly attended lectures: ${weekly_attendance}`);
        // console.log(`Overall attendance: ${overallAttendance}%`);

        // console.log(`Subject attendance data:`);
        // console.log(subject_attendance_data);            

        // console.log(`Weekly attendance data:`);
        // console.log(weekly_attendance_data);

        // console.log(`Current week data:`);
        // console.log(currentWeek);

   });
    
});




// $(function() {

//     db.collection("timetables").load(function() {

//         var subjects = db.collection("timetables").findOne().subjects;

//         db.collection("lectures").load(function() {

//             Array.prototype.forEach.call(subjects, function(subject) {
//                 if (subject == "") return;
//                 console.log(db.collection("lectures").find({"subject": subject}));
//             });
//        });
//     });

    
// });