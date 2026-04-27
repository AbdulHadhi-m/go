export const calculateDuration = (depTime, arrTime) => {
  if (!depTime || !arrTime) return "8h 45m";
  
  const parseTime = (timeStr) => {
    let [time, modifier] = timeStr.trim().split(/\s+/);
    if (!modifier && timeStr.toLowerCase().includes('am')) { modifier = 'AM'; time = timeStr.replace(/am/i, '').trim(); }
    if (!modifier && timeStr.toLowerCase().includes('pm')) { modifier = 'PM'; time = timeStr.replace(/pm/i, '').trim(); }
    
    let [hours, minutes] = time.split(':').map(Number);
    
    if (modifier) {
      if (modifier.toUpperCase() === 'PM' && hours < 12) hours += 12;
      if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;
    }
    return { hours, minutes: minutes || 0 };
  };

  try {
    const dep = parseTime(depTime);
    const arr = parseTime(arrTime);

    let depTotal = dep.hours * 60 + dep.minutes;
    let arrTotal = arr.hours * 60 + arr.minutes;

    if (arrTotal < depTotal) {
      arrTotal += 24 * 60;
    }

    const diff = arrTotal - depTotal;
    const h = Math.floor(diff / 60);
    const m = diff % 60;

    return `${h}h ${m}m`;
  } catch (e) {
    return "8h 45m";
  }
};

export const formatJourneyDate = (dateString) => {
  if (!dateString) return "19th Apr";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "19th Apr";
    const day = date.getDate();
    const suffix = ["th", "st", "nd", "rd"][((day % 100) >= 11 && (day % 100) <= 13) ? 0 : (day % 10) < 4 ? (day % 10) : 0];
    const month = date.toLocaleString('default', { month: 'short' });
    return `${day}${suffix} ${month}`;
  } catch(e) {
    return "19th Apr";
  }
};

export const getWindowSeatsCount = (tripObj, booked) => {
  if(!tripObj) return 13;
  const typeStr = (tripObj.busType || "").toLowerCase();
  const sleeper = typeStr.includes("sleeper");
  const seater = typeStr.includes("seater") || (!sleeper && typeStr.includes("ac"));
  const layout = sleeper && seater ? "mixed" : (sleeper ? "sleeper" : "seater");

  let totalWindow = 0;
  let bookedWindow = 0;
  const isBooked = (seat) => (booked || []).includes(seat);

  if (layout === "seater") {
     totalWindow = 20; 
     for(let i=1; i<=10; i++) if(isBooked(`S${i}`)) bookedWindow++;
     for(let i=31; i<=40; i++) if(isBooked(`S${i}`)) bookedWindow++;
  } else if (layout === "sleeper") {
     totalWindow = 24; 
     for(let i=1; i<=12; i++) if(isBooked(`U${i}`)) bookedWindow++;
     for(let i=1; i<=12; i++) if(isBooked(`L${i}`)) bookedWindow++;
  } else {
     totalWindow = 26; 
     for(let i=1; i<=10; i++) if(isBooked(`U${i}`)) bookedWindow++;
     for(let i=1; i<=16; i++) if(isBooked(`L${i}`)) bookedWindow++;
  }
  return totalWindow - bookedWindow;
};
