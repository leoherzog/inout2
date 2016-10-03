function doGet(request) {
  return HtmlService.createTemplateFromFile('index.html')
    .evaluate()
    .setTitle("In/Out Board")
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
    .getContent();
}

/**
* Checks if a Google Calendar ID has any busy events happening right now, or coming up in the next 5 minutes
*
* @param {string} the id of the google calendar
* @return {object} the status of the calendar right now (free, busy, or not found), the calendar's name, and the details of the event if busy
*/
function checkIfBusy(id) {
  
  if (!id) {
    return {id: id, busy: "Please call this method with a valid Google Calendar ID"};
  }
  
  // get the array of events from that user's calendar
  var now = new Date();
  var fiveMinutesFromNow = new Date(now.getTime() + (5 * 60 * 1000));
  now = now.toISOString();
  fiveMinutesFromNow = fiveMinutesFromNow.toISOString();
  
  try {
  
    var events = Calendar.Events.list(id, {timeMin: now, timeMax: fiveMinutesFromNow, singleEvents: true, orderBy: "updated"}).items;
  
  }
  catch(err) {
    
    return {id: id, busy: "Error: " + err};
    
  }
    
  // check if there are any other problems with that array of events
  if (!events) {
    return {id: id, busy: "Calendar not found or not shared"};
  }
  
  if (events.length == 0) { // there is nothing going on at all right now
    
    return {id: id, busy: false};
    
  } else { // go through the logic of determining which event (if any) should be returned
    
    // build an array of event objects that are set to 'busy' status that I'm attending
    var busyEvents = [];
    
    for (var i in events) { // go through each event
      
      var eventId = events[i].id;
      var verboseEvent = Calendar.Events.get(id, eventId); // use the advanced calendar service to grab all the event's deets
      
      if (!verboseEvent.transparency) { // if the event is 'busy', not 'available'
        
        for (var j in verboseEvent.attendees) { // go through the attendees of the event to find "self"
          
          if (verboseEvent.attendees[j].self && verboseEvent.attendees[j].responseStatus != "declined") { // check the "self" attendee and see if it's declined the event. If I haven't...
            
            busyEvents.push(verboseEvent); // add the event to our array
            
          }
        
        }
        
      }
    
    }
    
    if (busyEvents.length == 0) { // if there WERE one or more events, but none were set to 'busy'
      
      return {id: id, busy: false};
      
    } else if (busyEvents.length == 1) { // we've got one busy event going on right now
      
      var eventName = busyEvents[0].summary;
      var eventLocation = busyEvents[0].location;
      if (busyEvents[0].start.dateTime) {
        var allDay = false;
        var start = busyEvents[0].start.dateTime;
      } else {
        var allDay = true;
        var start = busyEvents[0].start.date;
      }
      if (busyEvents[0].end.dateTime) {
        var end = busyEvents[0].end.dateTime;
      } else {
        var end = busyEvents[0].end.date;
      }
      
      return {id: id, busy: true, eventDetails: {name: eventName, location: eventLocation, startTime: start, endTime: end, allDay: allDay}};
    
    } else { // we've got two more more busy events going on right now
               
      var selectedEvent = busyEvents[0]; // select the first busy event in the array
      
      for (var i in busyEvents) { // go through each busy event
        
        if (busyEvents[i].end.dateTime == null) { // (if there's an all-day/multi-day event, it may not have a dateTime... just a date)
          busyEvents[i].end.dateTime = busyEvents[i].end.date + "T00:00:00-05:00"; // (this converts that date to a dateTime for the comparison below)
        }
        
        if (busyEvents[i].end.dateTime > selectedEvent.end.dateTime) { // if this event ends later than the selected event...
          selectedEvent = busyEvents[i]; // ...make this event the new selected event
        }
        
      }
      
      if (selectedEvent.end.date) { // now that we've done our comparisons with time, we might have an all-day event with both an end.date and end.dateTime...
        delete selectedEvent.end.dateTime; // remove the dateTime so that it only has a date again
      }
      
      var eventName = selectedEvent.summary;
      var eventLocation = selectedEvent.location;
      if (selectedEvent.start.dateTime) {
        var allDay = false;
        var start = selectedEvent.start.dateTime;
      } else {
        var allDay = true;
        var start = selectedEvent.start.date;
      }
      if (selectedEvent.end.dateTime) {
        var end = selectedEvent.end.dateTime;
      } else {
        var end = selectedEvent.end.date;
      }
      
      return {id: id, busy: true, eventDetails: {name: eventName, location: eventLocation, startTime: start, endTime: end, allDay: allDay}};
      
    }
    
  }
  
}

function testShit_() {
  var freeOrBusy = checkIfBusy("blah@gmail.com");
  
  Logger.log(freeOrBusy.busy); // boolean
  
  if (freeOrBusy.eventDetails) {
    Logger.log(freeOrBusy.eventDetails.name); // string
    Logger.log(freeOrBusy.eventDetails.location); // string
    Logger.log(freeOrBusy.eventDetails.startTime); // 'date' or 'dateTime' string
    Logger.log(freeOrBusy.eventDetails.endTime); // 'date' or 'dateTime' string
    Logger.log(freeOrBusy.eventDetails.allDay); // boolean
  }
}
