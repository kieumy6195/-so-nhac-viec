/* Sổ Nhắc Việc — đọc câu tiếng Việt thành sự kiện / việc / thói quen / ghi chú.
   Chạy hoàn toàn trên máy, không gửi dữ liệu đi đâu.
   parseVi(text, ctx) -> {type,title,label,date,endDate,time,end,repeat,days,times,remind,lunar,allDay,chips[]}
   ctx: {today:'YYYY-MM-DD', labels:[{id,name}], lunarToSolar:fn(d,m,fromDs)->ds} */
(function(g){
'use strict';
var B='(?<![\\p{L}\\d])',E='(?![\\p{L}\\d])';
function rx(src,fl){return new RegExp(src.replace(/\\b</g,B).replace(/\\b>/g,E),(fl||'')+'gu');}
function pad(n){return (n<10?'0':'')+n;}
function ymd(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());}
function parse(s){var p=s.split('-');return new Date(+p[0],+p[1]-1,+p[2]);}
function addDays(s,n){var d=parse(s);d.setDate(d.getDate()+n);return ymd(d);}
function dow(s){return parse(s).getDay();}
function stripOne(c){if(c==='đ')return 'd';var b=c.normalize('NFD').replace(/[̀-ͯ]/g,'');return b.length===1?b:c;}
function plainOf(s){var o='';for(var i=0;i<s.length;i++)o+=stripOne(s[i]);return o;}
var WD_NAME={'2':1,'hai':1,'3':2,'ba':2,'4':3,'tư':3,'tu':3,'5':4,'năm':4,'6':5,'sáu':5,'7':6,'bảy':6,'bẩy':6};
var WD_S=['CN','T2','T3','T4','T5','T6','T7'];
var HABIT_WORDS=/(uống thuốc|cho mèo uống|uống nước|uống vitamin|nhỏ mắt|bôi thuốc|thiền|vitamin)/;
var EVENT_WORDS=/(sinh nhật|họp|khám|hẹn|đi chơi|du lịch|tiệc|đám cưới|cưới|lễ|giỗ|bay|chuyến|tập|học|xem phim|concert|đá banh|tennis|gym|yoga|bơi|meeting|call|phỏng vấn)/;

function parseVi(input,ctx){
  var today=ctx.today, raw=(input||'').normalize('NFC').trim();
  var r={type:'',title:'',label:'',date:'',endDate:'',time:'',end:'',repeat:'none',days:[],times:[],remind:null,lunar:false,allDay:true,chips:[]};
  if(!raw)return r;
  // explicit prefix
  var pm=/^(ghi chú|ghi chu|note|việc|viec|todo|sự kiện|su kien|thói quen|thoi quen|nhật ký|nhat ky)\s*[:：-]\s*/i.exec(raw);
  var forced='';
  if(pm){var k=plainOf(pm[1].toLowerCase());forced=k==='ghi chu'||k==='note'?'note':k==='viec'||k==='todo'?'todo':k==='su kien'?'event':k==='thoi quen'?'habit':'diary';raw=raw.slice(pm[0].length);}
  if(forced==='note'||forced==='diary'){var lines=raw.split('\n');r.type=forced;r.title=lines[0].trim();r.body=lines.slice(1).join('\n').trim();if(forced==='diary'){r.body=raw;r.date=today;}return r;}

  var low=raw.toLowerCase(), pl=plainOf(low), used=new Array(raw.length).fill(false);
  function take(m){for(var i=m.index;i<m.index+m[0].length;i++)used[i]=true;}
  function free(m){for(var i=m.index;i<m.index+m[0].length;i++)if(used[i])return false;return true;}
  function each(re,str,fn){re.lastIndex=0;var m,out=[];while((m=re.exec(str))){if(free(m))out.push(m);if(!m[0].length)re.lastIndex++;}out.forEach(function(m){if(fn(m)!==false)take(m);});}

  // reminders
  each(rx('\\b<(?:nhac|bao) (?:toi |minh )?(?:truoc )?(\\d+)\\s*(phut|p|tieng|gio|h|ngay)(?: truoc)?\\b>'),pl,function(m){var n=+m[1],u=m[2];r.remind=u==='ngay'?n*1440:(u==='tieng'||u==='gio'||u==='h')?n*60:n;});
  each(rx('\\b<khong nhac\\b>'),pl,function(){r.remind=-1;});
  // lunar
  each(rx('\\b<(?:theo )?(?:am lich|al)\\b>'),pl,function(){r.lunar=true;});
  // repeat words
  var weeklyHint=false;
  each(rx('\\b<(?:moi|hang|cac) ngay\\b>'),pl,function(){r.repeat='daily';});
  each(rx('\\b<(?:moi|hang|cac) tuan\\b>'),pl,function(){r.repeat='weekly';weeklyHint=true;});
  each(rx('\\b<(?:moi|hang|cac) thang\\b>'),pl,function(){r.repeat='monthly';});
  each(rx('\\b<(?:moi|hang|cac) nam\\b>'),pl,function(){r.repeat='yearly';});
  each(rx('\\b<moi (?=(?:sang|trua|chieu|toi|dem)\\b>)'),pl,function(){r.repeat='daily';});
  each(rx('\\b<(?:moi|cac|vao cac) (?=(?:thu|t[2-7]|cn|chu nhat)\\b>)'),pl,function(){weeklyHint=true;});

  // dates helpers
  function fixYear(d,m,y,repeating){
    var yy=y?(+y<100?2000+(+y):+y):+today.slice(0,4);
    var ds=yy+'-'+pad(+m)+'-'+pad(+d);
    if(!y&&ds<today&&!repeating)ds=(yy+1)+'-'+pad(+m)+'-'+pad(+d);
    return ds;
  }
  function validDM(d,m){return +d>=1&&+d<=31&&+m>=1&&+m<=12;}
  var dateFromLunar=null;
  // date range dd/mm - dd/mm
  each(rx('(?:\\b<tu (?:ngay )?)?\\b<(\\d{1,2})[/.](\\d{1,2})(?:[/.](\\d{2,4}))?\\s*(?:-|–|den|toi|→)\\s*(?:ngay )?(\\d{1,2})[/.](\\d{1,2})(?:[/.](\\d{2,4}))?\\b>'),pl,function(m){
    if(!validDM(m[1],m[2])||!validDM(m[4],m[5]))return false;r.date=fixYear(m[1],m[2],m[3]);r.endDate=fixYear(m[4],m[5],m[6]||m[3]);if(r.endDate<r.date)r.endDate=fixYear(m[4],m[5],String(+r.date.slice(0,4)+1));});
  if(!r.date)each(rx('(?:\\b<tu (?:ngay )?)?\\b<(\\d{1,2})\\s*(?:-|–|den|toi)\\s*(?:ngay )?(\\d{1,2})[/.](\\d{1,2})(?:[/.](\\d{2,4}))?\\b>'),pl,function(m){
    if(!validDM(m[1],m[3])||!validDM(m[2],m[3]))return false;r.date=fixYear(m[1],m[3],m[4]);r.endDate=fixYear(m[2],m[3],m[4]||r.date.slice(0,4));});
  // single dd/mm
  if(!r.date)each(rx('(?:\\b<ngay )?\\b<(\\d{1,2})[/.](\\d{1,2})(?:[/.](\\d{2,4}))?\\b>'),pl,function(m){
    if(!validDM(m[1],m[2]))return false;
    if(r.lunar){dateFromLunar=[+m[1],+m[2]];return;}
    r.date=fixYear(m[1],m[2],m[3],r.repeat!=='none');});
  // ngày 20 tháng 9
  if(!r.date&&!dateFromLunar)each(rx('(?:\\b<ngay )?\\b<(\\d{1,2}) (?:thang|thg) (\\d{1,2})(?: (?:nam )?(\\d{4}))?\\b>'),pl,function(m){
    if(!validDM(m[1],m[2]))return false;
    if(r.lunar){dateFromLunar=[+m[1],+m[2]];return;}
    r.date=fixYear(m[1],m[2],m[3],r.repeat!=='none');});
  // ngày 20 (this or next month)
  if(!r.date&&!dateFromLunar)each(rx('\\b<ngay (\\d{1,2})\\b>(?! ?(?:thang|thg|[/.]))'),pl,function(m){
    var d=+m[1];if(d<1||d>31)return false;var t=parse(today),c=new Date(t.getFullYear(),t.getMonth(),d);
    if(ymd(c)<today&&r.repeat==='none')c=new Date(t.getFullYear(),t.getMonth()+1,d);r.date=ymd(c);if(r.repeat==='none'&&/hang thang|moi thang/.test(pl))r.repeat='monthly';});
  if(dateFromLunar&&ctx.lunarToSolar){r.date=ctx.lunarToSolar(dateFromLunar[0],dateFromLunar[1],today);if(r.repeat==='none'||r.repeat==='yearly')r.repeat=/sinh nhat|gio|ky niem/.test(pl)||r.repeat==='yearly'?'lunar':'none';}
  // relative days (with period words)
  var period='';
  each(rx('\\b<(sang|trua|chieu|toi|dem) (nay|mai)\\b>'),pl,function(m){period=m[1];r.date=m[2]==='nay'?today:addDays(today,1);m.index+=m[1].length+1;m[0]=m[2];});
  each(rx('\\b<(?:hom nay|bay gio)\\b>'),pl,function(){if(!r.date)r.date=today;});
  each(rx('\\b<(?:ngay mai|mai)\\b>'),pl,function(){if(!r.date)r.date=addDays(today,1);});
  each(rx('\\b<(?:ngày mốt|ngày kia|mốt|hôm kia)\\b>'),low,function(m){if(m[0]==='hôm kia')return false;if(!r.date)r.date=addDays(today,2);});
  each(rx('\\b<(\\d+) (?:ngay|hom) (?:nua|toi)\\b>'),pl,function(m){if(!r.date)r.date=addDays(today,+m[1]);});
  each(rx('\\b<nay\\b>'),pl,function(){if(!r.date)r.date=today;});
  var nextWeek=false;
  each(rx('\\b<tuan (?:sau|toi)\\b>'),pl,function(){nextWeek=true;});
  each(rx('\\b<cuoi tuan( nay| sau)?\\b>'),pl,function(m){var base=today,off=(6-dow(today)+7)%7;r.date=addDays(base,off+(m[1]===' sau'||nextWeek?7:0));});
  // weekdays
  var wds=[];
  each(rx('\\b<(?:thứ|thu|t)\\s?([2-7])\\b>'),low,function(m){wds.push(WD_NAME[m[1]]);});
  each(rx('\\b<thứ (hai|ba|tư|năm|sáu|bảy|bẩy)\\b>'),low,function(m){wds.push(WD_NAME[m[1]]);});
  each(rx('\\b<(?:chủ nhật|chu nhat|cn)\\b>'),low,function(){wds.push(0);});
  if(wds.length){
    wds=wds.filter(function(v,i){return wds.indexOf(v)===i;});
    if(wds.length>1||weeklyHint||r.repeat==='weekly'){r.repeat='weekly';r.days=wds.slice().sort();
      if(!r.date){var d0=today;for(var i=0;i<7;i++){if(r.days.indexOf(dow(d0))>=0)break;d0=addDays(d0,1);}r.date=d0;}}
    else if(!r.date){var w=wds[0],off=(w-dow(today)+7)%7;var mon=addDays(today,-((dow(today)+6)%7));
      if(nextWeek)r.date=addDays(mon,7+((w+6)%7));else r.date=addDays(today,off);}
  }else if(nextWeek&&!r.date){r.date=addDays(today,7);}

  // times
  function hm(hh,mm,per){
    var h=+hh,m=mm==='ruoi'?30:(mm?+mm:0);if(h>24||m>59)return '';
    per=per||period;
    if((per==='chieu'||per==='toi'||per==='pm')&&h<12)h+=12;
    else if(per==='dem'&&h>=6&&h<12)h+=12;
    else if(per==='trua'&&h<6)h+=12;
    else if((per==='sang'||per==='am')&&h===12)h=0;
    if(h===24)h=0;
    return pad(h)+':'+pad(m);
  }
  var T='(\\d{1,2})\\s*(?:h|g|gio|:)\\s*(\\d{2}|ruoi)?(?:\\s*(sang|trua|chieu|toi|dem|am|pm))?';
  each(rx('(?:\\b<(?:tu|luc|vao luc) )?\\b<'+T+'\\s*(?:-|–|den|toi|~)\\s*'+T+'\\b>'),pl,function(m){
    var p2=m[6]||'',p1=m[3]||p2;r.time=hm(m[1],m[2],p1);r.end=hm(m[4],m[5],p2||p1);if(!r.time||!r.end)return false;if(r.end<=r.time&&+m[4]<12)r.end=hm(+m[4]+12,m[5],'');});
  each(rx('\\b<'+T+'\\b>'),pl,function(m){var t=hm(m[1],m[2],m[3]);if(!t)return false;r.times.push(t);});
  each(rx('\\b<(\\d{1,2})\\s*(sang|trua|chieu|toi|dem)\\b>'),pl,function(m){var t=hm(m[1],'',m[2]);if(!t)return false;r.times.push(t);});
  if(!r.time&&r.times.length)r.time=r.times[0];
  if(r.time)r.allDay=false;
  each(rx('\\b<trong (\\d+(?:[.,]5)?)\\s*(tieng|gio|phut|p)\\b>'),pl,function(m){
    if(!r.time)return false;var mins=parseFloat(m[1].replace(',','.'))*(m[2]==='phut'||m[2]==='p'?1:60);
    var t=r.time.split(':'),tot=(+t[0])*60+(+t[1])+mins;r.end=pad(Math.floor(tot/60)%24)+':'+pad(tot%60);});
  // filler connectors/periods left over around consumed bits
  each(rx('\\b<(?:luc|vao luc|vao|ngay|tu|den|va|voi|nhac|nhac toi|nhac minh|sang|trua|chieu|toi|dem)\\b>'),pl,function(m){
    // only drop if next to a consumed span (keeps words that belong to the title, e.g. "đi chơi với Linh")
    var a=m.index-1,b=m.index+m[0].length;while(a>=0&&/[\s,]/.test(raw[a]))a--;while(b<raw.length&&/[\s,]/.test(raw[b]))b++;
    return (a>=0&&used[a])||(b<raw.length&&used[b])||(a<0&&b<raw.length&&used[b]);});

  // title
  var t='';for(var i=0;i<raw.length;i++)t+=used[i]?' ':raw[i];
  t=t.replace(/\s*[,;]\s*(?=[,;\s]*$)/g,' ').replace(/[\s,;:\-–]+$/,'').replace(/^[\s,;:\-–]+/,'').replace(/\s{2,}/g,' ').replace(/\s+,/g,',').trim();
  // strip dangling connectors repeatedly
  var DANG=/^(?:nhắc tôi|nhắc mình|nhắc|nhớ|lúc|vào|ngày|từ|đến|và|với|các|mỗi|hàng|hằng|thì|là)\s+|\s+(?:lúc|vào|ngày|từ|đến|và|với|nhắc|các|mỗi|hàng|hằng|thì|là|nha|nhé|nhe|nhá)$/i;
  for(var k2=0;k2<4;k2++)t=t.replace(DANG,'').trim();
  r.title=t?t.charAt(0).toUpperCase()+t.slice(1):'';
  var tl=r.title.toLowerCase();

  // type
  var habitLike=HABIT_WORDS.test(tl)||HABIT_WORDS.test(low);
  if(forced)r.type=forced;
  else if(r.repeat==='daily'||(habitLike&&(r.repeat==='weekly'||r.times.length>1||(!r.date&&r.times.length))))r.type='habit';
  else if(r.time||r.endDate||r.repeat!=='none'||/sinh nhật|sinh nhat/.test(low))r.type='event';
  else if(r.date&&EVENT_WORDS.test(tl))r.type='event';
  else r.type='todo';
  if(r.type==='habit'){if(!r.times.length&&r.time)r.times=[r.time];if(r.repeat!=='weekly')r.days=[0,1,2,3,4,5,6];r.repeat='daily';}
  if(r.type==='event'){
    if(/sinh nhật|sinh nhat/.test(low)&&r.repeat==='none')r.repeat=r.lunar?'lunar':'yearly';
    if(!r.date)r.date=today;
    if(r.remind===null)r.remind=r.allDay?(/sinh nhật|giỗ/.test(low)?1440:null):15;
  }
  if(r.remind===-1)r.remind=null;
  // label
  var labels=ctx.labels||[],lab='';
  labels.forEach(function(l){if(lab)return;var n=plainOf((l.name||'').toLowerCase()).trim();if(n&&n.length>1&&pl.indexOf(n)>=0)lab=l.id;});
  if(!lab){var kw=[[/tennis/,/tennis/],[/thuoc|kham|benh vien/,/thuốc|sức khoẻ|khám/],[/meo|xu\b/,/mèo|xu/],[/sinh nhat/,/sinh nhật/],[/di choi|du lich|chuyen di|bay /,/đi chơi|du lịch/],[/hop|cong viec|cong ty|deadline/,/công việc|làm/],[/mua|cho |sieu thi/,/mua sắm|mua/]];
    kw.forEach(function(p){if(lab||!p[0].test(pl))return;var hit=labels.filter(function(l){return p[1].test((l.name||'').toLowerCase())||(p[0].test(plainOf(l.id)));})[0];if(hit)lab=hit.id;});}
  r.label=lab;
  r.wantBday=/sinh nhật|sinh nhat/.test(low)&&!lab;
  // chips for preview
  var TY={event:'Sự kiện',todo:'Việc cần làm',habit:'Thói quen',note:'Ghi chú'};
  r.chips.push(TY[r.type]);
  if(r.type==='habit'){r.chips.push(r.days.length===7?'Mỗi ngày':r.days.map(function(d){return WD_S[d];}).join(', '));if(r.times.length)r.chips.push(r.times.join(' · '));}
  else{
    if(r.date)r.chips.push(r.endDate?fmt(r.date)+' → '+fmt(r.endDate):relName(r.date,today));
    if(r.repeat==='weekly')r.chips.push('Hằng tuần: '+r.days.map(function(d){return WD_S[d];}).join(', '));
    else if(r.repeat==='monthly')r.chips.push('Hằng tháng');
    else if(r.repeat==='yearly')r.chips.push('Hằng năm');
    else if(r.repeat==='lunar')r.chips.push('Hằng năm (âm lịch)');
    if(r.time)r.chips.push(r.time+(r.end?'–'+r.end:''));else if(r.type==='event')r.chips.push('Cả ngày');
    if(r.remind)r.chips.push('Nhắc trước '+(r.remind>=1440?(r.remind/1440)+' ngày':r.remind>=60?(r.remind/60)+' giờ':r.remind+' phút'));
  }
  return r;
}
function fmt(ds){var d=parse(ds);return d.getDate()+'/'+(d.getMonth()+1);}
function relName(ds,today){var n=Math.round((parse(ds)-parse(today))/864e5);if(n===0)return 'Hôm nay';if(n===1)return 'Ngày mai';if(n===2)return 'Ngày mốt';return WD_S[dow(ds)]+', '+fmt(ds);}
g.parseVi=parseVi;g.plainOf=plainOf;
})(typeof window!=='undefined'?window:globalThis);
