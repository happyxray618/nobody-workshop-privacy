'use strict';
function shiftHours(start, end, breakMinutes) {
  const time = value => {
    if (typeof value !== 'string' || !/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(value)) throw new Error('Enter valid start and end times.');
    const [h,m] = value.split(':').map(Number); return h*60+m;
  };
  const s=time(start), e=time(end);
  if (!Number.isInteger(breakMinutes) || breakMinutes<0 || breakMinutes>720) throw new Error('Enter a whole-minute break between 0 and 720.');
  const duration=(e-s+1440)%1440;
  if (breakMinutes>duration || (duration>0 && breakMinutes===duration)) throw new Error('The unpaid break must be shorter than the shift.');
  return {duration, paid:duration-breakMinutes, breakMinutes, crossesMidnight:e<s};
}
if (typeof module!=='undefined') module.exports={shiftHours};
if (typeof document!=='undefined') {
  const el=id=>document.getElementById(id);
  const format=n=>Math.floor(n/60)+' h '+String(n%60).padStart(2,'0')+' min';
  function calculate(event) {
    if(event) event.preventDefault();
    try {
      const raw=el('break').value.trim();
      if(raw==='') throw new Error('Enter the unpaid break in minutes, including 0 if none.');
      const r=shiftHours(el('start').value,el('end').value,Number(raw));
      el('error').textContent='';
      el('result').replaceChildren();
      const grid=document.createElement('div');grid.className='numbers';
      for(const [label,value] of [['Paid hours & minutes',format(r.paid)],['Paid decimal hours',(r.paid/60).toFixed(2)]]) {
        const card=document.createElement('div');const heading=document.createElement('h3');heading.textContent=label;
        const valueText=document.createElement('p');valueText.className='big';valueText.textContent=value;card.append(heading,valueText);grid.append(card);
      }
      el('result').append(grid);
      const detail=document.createElement('p');detail.textContent=format(r.duration)+' elapsed − '+r.breakMinutes+' min unpaid break.';el('result').append(detail);
      const note=document.createElement('p');note.className='muted';note.textContent=r.crossesMidnight?'End time is treated as the next day.':(r.duration===0?'Equal times represent zero hours, not 24 hours.':'Start and end are on the same day.');el('result').append(note);
    } catch(error) {el('result').replaceChildren();el('error').textContent=error.message;}
  }
  el('shift-form').addEventListener('submit',calculate);
  el('example').addEventListener('click',()=>{el('start').value='22:00';el('end').value='06:00';el('break').value='30';calculate();});
  el('reset').addEventListener('click',()=>{el('start').value='09:00';el('end').value='17:00';el('break').value='0';el('error').textContent='';el('result').textContent='Ready for a new shift.';});
}
