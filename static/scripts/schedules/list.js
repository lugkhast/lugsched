$(document).ready(function() {
    var i, clist, item;
    clist = new ClickList($(".list-test"));

    /*
    for (i = 0; i < 5; i++) {
       item = new ClickListElement()
       item.mainText = "Test Item " + i
       item.subText = "Hello, World!";
       clist.add(item);
    }
    */

    var sdisp = new ScheduleDisplay(document.getElementById("schedule-canvas"));
});


