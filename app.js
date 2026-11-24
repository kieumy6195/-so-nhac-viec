(function(){
'use strict';
/* ========== utils ========== */
function pad(n){return (n<10?'0':'')+n;}
function ymd(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());}
function parse(s){var p=s.split('-');return new Date(+p[0],+p[1]-1,+p[2]);}
function addDays(s,n){var d=parse(s);d.setDate(d.getDate()+n);return ymd(d);}
function addMonths(s,n){var d=parse(s),day=d.getDate();d.setDate(1);d.setMonth(d.getMonth()+n);var dim=new Date(d.getFullYear(),d.getMonth()+1,0).getDate();d.setDate(Math.min(day,dim));return ymd(d);}
function diffDays(a,b){return Math.round((parse(b)-parse(a))/864e5);}
function dowOf(s){return parse(s).getDay();}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7);}
function clone(o){return JSON.parse(JSON.stringify(o));}
function toMin(t){var p=String(t).split(':');return (+p[0])*60+(+p[1]||0);}
var today=ymd(new Date());
var WD_S=['CN','T2','T3','T4','T5','T6','T7'],WD_L=['Chủ nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'],WEEK=[1,2,3,4,5,6,0];
function dLong(s){var d=parse(s);return WD_L[d.getDay()]+', '+d.getDate()+' tháng '+(d.getMonth()+1);}
function dShort(s){var d=parse(s);return d.getDate()+'/'+(d.getMonth()+1);}
function rel(s){var n=diffDays(today,s);if(n===0)return 'Hôm nay';if(n===1)return 'Ngày mai';if(n===-1)return 'Hôm qua';if(n>1&&n<7)return WD_L[dowOf(s)];return WD_S[dowOf(s)]+', '+dShort(s);}
function svg(p,s,w){s=s||22;return '<svg width="'+s+'" height="'+s+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="'+(w||2)+'" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>';}
var IC={
  today:'<rect x="3.5" y="4.5" width="17" height="16" rx="3.5"/><path d="M3.5 9h17M8 2.5v4M16 2.5v4"/><path d="M8.5 14.5l2.3 2.3 4.7-4.6"/>',
  cal:'<rect x="3.5" y="4.5" width="17" height="16" rx="3.5"/><path d="M3.5 9h17M8 2.5v4M16 2.5v4"/><circle cx="8.5" cy="13.5" r=".6" fill="currentColor"/><circle cx="12" cy="13.5" r=".6" fill="currentColor"/><circle cx="15.5" cy="13.5" r=".6" fill="currentColor"/><circle cx="8.5" cy="17" r=".6" fill="currentColor"/><circle cx="12" cy="17" r=".6" fill="currentColor"/>',
  list:'<circle cx="5" cy="6.5" r="1.6"/><circle cx="5" cy="12" r="1.6"/><circle cx="5" cy="17.5" r="1.6"/><path d="M10 6.5h10M10 12h10M10 17.5h10"/>',
  note:'<path d="M6 3.5h9l4 4v13H6z"/><path d="M15 3.5v4h4M9 12h7M9 15.5h7"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  l:'<path d="M15 5l-7 7 7 7"/>',r:'<path d="M9 5l7 7-7 7"/>',chev:'<path d="M9 6l6 6-6 6"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',plus:'<path d="M12 5v14M5 12h14"/>',rep:'<path d="M17 2l3 3-3 3"/><path d="M4 11V9a4 4 0 0 1 4-4h12"/><path d="M7 22l-3-3 3-3"/><path d="M20 13v2a4 4 0 0 1-4 4H4"/>',
  bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>'
};

/* ========== lunar (Hồ Ngọc Đức, UTC+7) ========== */
function INT(d){return Math.floor(d);}
function jdFromDate(dd,mm,yy){var a=INT((14-mm)/12),y=yy+4800-a,m=mm+12*a-3;var jd=dd+INT((153*m+2)/5)+365*y+INT(y/4)-INT(y/100)+INT(y/400)-32045;if(jd<2299161)jd=dd+INT((153*m+2)/5)+365*y+INT(y/4)-32083;return jd;}
function newMoon(k){var T=k/1236.85,T2=T*T,T3=T2*T,dr=Math.PI/180;var Jd1=2415020.75933+29.53058868*k+0.0001178*T2-0.000000155*T3;Jd1+=0.00033*Math.sin((166.56+132.87*T-0.009173*T2)*dr);var M=359.2242+29.10535608*k-0.0000333*T2-0.00000347*T3;var Mpr=306.0253+385.81691806*k+0.0107306*T2+0.00001236*T3;var F=21.2964+390.67050646*k-0.0016528*T2-0.00000239*T3;var C1=(0.1734-0.000393*T)*Math.sin(M*dr)+0.0021*Math.sin(2*dr*M);C1=C1-0.4068*Math.sin(Mpr*dr)+0.0161*Math.sin(dr*2*Mpr);C1=C1-0.0004*Math.sin(dr*3*Mpr);C1=C1+0.0104*Math.sin(dr*2*F)-0.0051*Math.sin(dr*(M+Mpr));C1=C1-0.0074*Math.sin(dr*(M-Mpr))+0.0004*Math.sin(dr*(2*F+M));C1=C1-0.0004*Math.sin(dr*(2*F-M))-0.0006*Math.sin(dr*(2*F+Mpr));C1=C1+0.0010*Math.sin(dr*(2*F-Mpr))+0.0005*Math.sin(dr*(2*Mpr+M));var dt=T<-11?0.001+0.000839*T+0.0002261*T2-0.00000845*T3-0.000000081*T*T3:-0.000278+0.000265*T+0.000262*T2;return Jd1+C1-dt;}
function nmDay(k,tz){return INT(newMoon(k)+0.5+tz/24);}
function sunLong(jdn){var T=(jdn-2451545.0)/36525,T2=T*T,dr=Math.PI/180;var M=357.52910+35999.05030*T-0.0001559*T2-0.00000048*T*T2;var L0=280.46645+36000.76983*T+0.0003032*T2;var DL=(1.914600-0.004817*T-0.000014*T2)*Math.sin(dr*M);DL=DL+(0.019993-0.000101*T)*Math.sin(dr*2*M)+0.000290*Math.sin(dr*3*M);var L=(L0+DL)*dr;return L-Math.PI*2*INT(L/(Math.PI*2));}
function sunLon(day,tz){return INT(sunLong(day-0.5-tz/24)/Math.PI*6);}
function lunarM11(yy,tz){var off=jdFromDate(31,12,yy)-2415021;var k=INT(off/29.530588853);var nm=nmDay(k,tz);if(sunLon(nm,tz)>=9)nm=nmDay(k-1,tz);return nm;}
function leapOff(a11,tz){var k=INT((a11-2415021.076998695)/29.530588853+0.5),last,i=1,arc=sunLon(nmDay(k+i,tz),tz);do{last=arc;i++;arc=sunLon(nmDay(k+i,tz),tz);}while(arc!==last&&i<14);return i-1;}
function solar2lunar(dd,mm,yy,tz){var dn=jdFromDate(dd,mm,yy);var k=INT((dn-2415021.076998695)/29.530588853);var ms=nmDay(k+1,tz);if(ms>dn)ms=nmDay(k,tz);var a11=lunarM11(yy,tz),b11=a11,ly;if(a11>=ms){ly=yy;a11=lunarM11(yy-1,tz);}else{ly=yy+1;b11=lunarM11(yy+1,tz);}var ld=dn-ms+1;var diff=INT((ms-a11)/29);var leap=0;var lm=diff+11;if(b11-a11>365){var lo=leapOff(a11,tz);if(diff>=lo){lm=diff+10;if(diff===lo)leap=1;}}if(lm>12)lm-=12;if(lm>=11&&diff<4)ly-=1;return [ld,lm,ly,leap];}
var lunCache={};
function lunarOf(s){if(!lunCache[s]){var d=parse(s);lunCache[s]=solar2lunar(d.getDate(),d.getMonth()+1,d.getFullYear(),7);}return lunCache[s];}
var CAN=['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'],CHI=['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
function canChi(y){return CAN[(y+6)%10]+' '+CHI[(y+8)%12];}
function lunarToSolar(d,m,from){for(var i=0;i<420;i++){var ds=addDays(from,i),l=lunarOf(ds);if(!l[3]&&l[0]===d&&l[1]===m)return ds;}return from;}

/* ========== state ========== */
var LS='so-nhac-viec-v2',LS_UI='snv-ios-ui';
var SECS=['settings','events','todos','habits','diary','notes','books'];
var COLORS=['rose','coral','amber','lime','teal','sky','violet','slate'];
var EMOJIS=['🎾','🏸','⚽','🏃‍♀️','🧘‍♀️','🏋️‍♀️','🚴‍♀️','🏊‍♀️','💊','🩺','🦷','💉','🐱','🐾','🐶','✈️','🏖️','🧳','🚗','🗺️','🎂','🎁','🎉','💐','☕','🍜','🍰','🛒','💼','💻','📚','✏️','🎨','🎮','🎬','🎵','🏠','🧹','🪴','💰','💖','⭐','🌙','🔔','💧','☀️','📌','🙏'];
function defaultLabels(){return [{id:'tennis',name:'Tennis',color:'lime',emoji:'🎾'},{id:'thuoc',name:'Thuốc của tôi',color:'coral',emoji:'💊'},{id:'meo',name:'Mèo',color:'violet',emoji:'🐱'},{id:'khac',name:'Khác',color:'sky',emoji:'⭐'}];}
function guessEmoji(n){n=(n||'').toLowerCase();if(/tennis/.test(n))return '🎾';if(/cầu lông/.test(n))return '🏸';if(/uống nước/.test(n))return '💧';if(/thuốc|vitamin/.test(n))return '💊';if(/khám|bệnh|răng/.test(n))return '🩺';if(/mèo|xu/.test(n))return '🐱';if(/chó/.test(n))return '🐶';if(/đi chơi|du lịch|chuyến|đà lạt|bay/.test(n))return '✈️';if(/sinh nhật/.test(n))return '🎂';if(/cà phê|cafe|hẹn/.test(n))return '☕';if(/mua|chợ/.test(n))return '🛒';if(/họp|công ty|làm|báo cáo/.test(n))return '💼';if(/gym|tập/.test(n))return '🏋️‍♀️';if(/chạy/.test(n))return '🏃‍♀️';if(/yoga|thiền/.test(n))return '🧘‍♀️';if(/ăn|nấu|lẩu/.test(n))return '🍜';if(/học|sách|đọc/.test(n))return '📚';if(/nhà|dọn/.test(n))return '🏠';if(/tiền|thuế|trả/.test(n))return '💰';if(/phim/.test(n))return '🎬';return '⭐';}
function emptyState(){return {settings:{theme:'pink',lunar:true,labels:defaultLabels()},events:[],todos:[],habits:[],diary:{},notes:[],books:[]};}
function normalize(s){var e=emptyState();SECS.forEach(function(k){if(s[k]==null)s[k]=e[k];});if(!s.settings.labels||!s.settings.labels.length)s.settings.labels=defaultLabels();return s;}
var S=null;
try{var raw=localStorage.getItem(LS);if(raw)S=normalize(JSON.parse(raw));}catch(e){S=null;}
if(!S)S=emptyState();
function save(){try{localStorage.setItem(LS,JSON.stringify(S));}catch(e){toast('Chưa lưu được','Bộ nhớ của trình duyệt đang bị chặn.');}}
var ui={tab:'today',y:0,m:0,sel:today,ntab:'notes',book:'',showDone:false};
(function(){var n=parse(today);ui.y=n.getFullYear();ui.m=n.getMonth();try{var u=JSON.parse(localStorage.getItem(LS_UI)||'{}');if(u.tab)ui.tab=u.tab;if(u.ntab)ui.ntab=u.ntab;}catch(e){}})();
function saveUi(){try{localStorage.setItem(LS_UI,JSON.stringify({tab:ui.tab,ntab:ui.ntab}));}catch(e){}}
function labels(){return S.settings.labels;}
var NOLAB={id:'',name:'',color:'slate',emoji:''};
function getLabel(id){return (id&&labels().filter(function(l){return l.id===id;})[0])||NOLAB;}
function lEmoji(l){if(!l||!l.id)return '';return l.emoji||guessEmoji(l.name);}
function ensureBday(){var l=labels().filter(function(x){return /sinh nhật/i.test(x.name);})[0];if(l)return l.id;l={id:'bday',name:'Sinh nhật',color:'rose',emoji:'🎂'};labels().push(l);return l.id;}

/* ========== domain ========== */
function movedTo(ev,ds){if(!ev.moves)return null;for(var k in ev.moves){if(ev.moves[k]&&ev.moves[k].d===ds&&!(ev.skip&&ev.skip.indexOf(k)>=0))return k;}return null;}
function evEnd(e){return e.repeat==='none'&&e.endDate&&e.endDate>e.start?e.endDate:e.start;}
function isMulti(e){return evEnd(e)!==e.start;}
function evOn(ev,ds){
  if(!ev.start)return false;
  if(movedTo(ev,ds))return true;
  if(ds<ev.start)return false;
  if(ev.moves&&ev.moves[ds])return false;
  if(ev.skip&&ev.skip.indexOf(ds)>=0)return false;
  if(ev.repeat!=='none'&&ev.until&&ds>ev.until)return false;
  switch(ev.repeat){
    case 'none':return ds<=evEnd(ev);
    case 'daily':return true;
    case 'weekly':return (ev.days&&ev.days.length?ev.days:[dowOf(ev.start)]).indexOf(dowOf(ds))>=0;
    case 'monthly':return parse(ds).getDate()===parse(ev.start).getDate();
    case 'yearly':return ds.slice(5)===ev.start.slice(5);
    case 'lunar':var la=lunarOf(ds),lb=lunarOf(ev.start);return !la[3]&&la[0]===lb[0]&&la[1]===lb[1];
  }
  return false;
}
function getEv(id){return S.events.filter(function(x){return x.id===id;})[0];}
function eventsOn(ds){
  return S.events.filter(function(e){return evOn(e,ds);}).map(function(e){var k=movedTo(e,ds);if(!k)return e;var c=Object.assign({},e);c._from=k;if(e.moves[k].t)c.time=e.moves[k].t;return c;}).sort(function(a,b){
    if(a.allDay!==b.allDay)return a.allDay?-1:1;return (a.time||'').localeCompare(b.time||'')||a.title.localeCompare(b.title,'vi');});
}
var HOL_SOLAR={'01-01':['🎆','Tết Dương lịch',1],'02-14':['💝','Lễ Tình nhân',0],'03-08':['🌸','Quốc tế Phụ nữ',0],'04-30':['🇻🇳','Giải phóng miền Nam',1],'05-01':['🛠️','Quốc tế Lao động',1],'06-01':['🎈','Quốc tế Thiếu nhi',0],'07-27':['🕯️','Thương binh Liệt sĩ',0],'09-02':['🇻🇳','Quốc khánh',1],'10-20':['💐','Phụ nữ Việt Nam',0],'11-20':['📚','Nhà giáo Việt Nam',0],'12-22':['🎖️','Quân đội Nhân dân',0],'12-24':['🎄','Đêm Giáng sinh',0],'12-25':['🎄','Giáng sinh',0]};
var HOL_LUNAR={'1-1':['🧧','Mùng 1 Tết',1],'1-2':['🧧','Mùng 2 Tết',1],'1-3':['🧧','Mùng 3 Tết',1],'1-15':['🏮','Rằm tháng Giêng',0],'3-10':['👑','Giỗ Tổ Hùng Vương',1],'4-15':['🪷','Lễ Phật Đản',0],'5-5':['🍑','Tết Đoan Ngọ',0],'7-15':['🙏','Lễ Vu Lan',0],'8-15':['🏮','Tết Trung Thu',0],'12-23':['🐟','Ông Công Ông Táo',0]};
var holCache={};
function holidayOf(ds){
  if(S.settings.holidays===false)return null;
  if(holCache[ds]!==undefined)return holCache[ds];
  var r=null,h=HOL_SOLAR[ds.slice(5)];if(h)r={e:h[0],n:h[1],off:!!h[2]};
  var l=lunarOf(ds);if(!l[3]){var hl=HOL_LUNAR[l[1]+'-'+l[0]];if(hl)r={e:hl[0],n:hl[1],off:!!hl[2]};}
  if(!r){var nx=lunarOf(addDays(ds,1));if(nx[0]===1&&nx[1]===1&&!nx[3])r={e:'🎊',n:'Giao thừa',off:1};}
  holCache[ds]=r;return r;
}
function repName(e){
  if(e.repeat==='weekly'){var d=e.days&&e.days.length?e.days:[dowOf(e.start)];return d.length===7?'Mỗi ngày':'Mỗi '+WEEK.filter(function(w){return d.indexOf(w)>=0;}).map(function(w){return WD_S[w];}).join(', ');}
  return {daily:'Mỗi ngày',monthly:'Mỗi tháng',yearly:'Mỗi năm',lunar:'Mỗi năm (âm lịch)'}[e.repeat]||'';
}
function nextDue(due,rep){var d=due||today;do{d=rep==='daily'?addDays(d,1):rep==='weekly'?addDays(d,7):addMonths(d,1);}while(d<=today);return d;}
function hTarget(h){return Math.max(1,(h.times||[]).length);}
function hSched(h,ds){return ds>=h.start&&(h.days||[]).indexOf(dowOf(ds))>=0;}
function hCount(h,ds){return (h.log&&h.log[ds])||0;}
function streak(h){var d=today,n=0,g=0;if(hSched(h,d)&&hCount(h,d)<hTarget(h))d=addDays(d,-1);while(d>=h.start&&g<400){if(hSched(h,d)){if(hCount(h,d)>=hTarget(h))n++;else break;}d=addDays(d,-1);g++;}return n;}
function hEmoji(h){return h.emoji||{pill:'💊',paw:'🐱',drop:'💧',ball:'🎾',heart:'💖',star:'⭐',book:'📚',sun:'☀️'}[h.icon]||guessEmoji(h.name);}
var COLOR_OF={pill:'coral',paw:'violet',drop:'sky'};

/* ========== quick add ========== */
function ctx(){return {today:today,labels:labels(),lunarToSolar:lunarToSolar};}
function createFrom(r){
  var lab=r.label||(r.wantBday?ensureBday():'')||'';
  if(r.type==='note'){var n={id:uid(),title:r.title||'Ghi chú',body:r.body||'',color:'amber',pinned:false,updated:Date.now()};S.notes.push(n);return {kind:'note',id:n.id,title:n.title};}
  if(r.type==='diary'){S.diary[r.date||today]={mood:(S.diary[today]&&S.diary[today].mood)||3,text:((S.diary[today]&&S.diary[today].text)?S.diary[today].text+'\n':'')+(r.body||r.title)};return {kind:'diary',id:today,title:'Nhật ký hôm nay'};}
  if(r.type==='habit'){var h={id:uid(),name:r.title||'Thói quen',emoji:guessEmoji(r.title),color:/mèo|xu/i.test(r.title)?'violet':/nước/i.test(r.title)?'sky':'coral',days:r.days&&r.days.length?r.days:[0,1,2,3,4,5,6],times:r.times.slice().sort(),start:today,log:{}};S.habits.push(h);return {kind:'habit',id:h.id,title:h.name};}
  if(r.type==='todo'){var t={id:uid(),title:r.title||'Việc mới',label:lab,due:r.date||'',time:r.time||'',repeat:'none',pinned:false,done:false,hist:[],subs:[],note:''};S.todos.push(t);return {kind:'todo',id:t.id,title:t.title};}
  var ev={id:uid(),title:r.title||'Sự kiện',label:lab,allDay:!r.time,start:r.date||today,time:r.time||'',end:r.end||'',repeat:r.repeat||'none',days:r.repeat==='weekly'?r.days:[],until:'',remind:r.remind,note:'',endDate:r.endDate||'',skip:[]};
  S.events.push(ev);return {kind:'event',id:ev.id,title:ev.title,date:ev.start};
}
function quickAdd(text){
  var lines=String(text).split(/\n+/).map(function(s){return s.trim();}).filter(Boolean);
  if(/^(ghi chú|ghi chu|note|nhật ký|nhat ky)\s*[:：-]/i.test(text.trim()))lines=[text.trim()];
  if(!lines.length)return;
  var snap=clone(S),made=[];
  lines.forEach(function(l){
    var forced=ui.tab==='notes'&&!/^[^:]{0,12}[:：]/.test(l)?(ui.ntab==='diary'?'nhật ký: ':ui.ntab==='notes'?'ghi chú: ':''):'';
    var r=parseVi(forced+l,ctx());made.push(createFrom(r));
  });
  save();
  var m=made[0];
  if(m.kind==='event'&&ui.tab==='cal'&&m.date){ui.sel=m.date;var d=parse(m.date);ui.y=d.getFullYear();ui.m=d.getMonth();}
  render();
  var sub=made.length>1?'Đã thêm '+made.length+' mục':({event:'Đã thêm vào Lịch',todo:'Đã thêm vào Việc cần làm',habit:'Đã thêm thói quen',note:'Đã thêm ghi chú',diary:'Đã ghi vào nhật ký'})[m.kind];
  toast(m.title,sub,[['Hoàn tác',function(){S=snap;save();render();}]].concat(made.length===1&&m.kind!=='diary'?[['Sửa',function(){openEdit(m.kind,m.id);}]]:[]));
}
function previewHtml(text){
  var lines=String(text).split(/\n+/).map(function(s){return s.trim();}).filter(Boolean);if(!lines.length)return '';
  var forced=ui.tab==='notes'&&!/^[^:]{0,12}[:：]/.test(lines[0])?(ui.ntab==='diary'?'nhật ký: ':ui.ntab==='notes'?'ghi chú: ':''):'';
  var r=parseVi(forced+(forced?text:lines[0]),ctx());
  if(r.type==='note'||r.type==='diary')return '<div class="pv"><div class="pv-t"><span class="em">'+(r.type==='note'?'📝':'📔')+'</span>'+esc(r.title||'…')+'</div><div class="chips"><span class="chip k">'+(r.type==='note'?'Ghi chú':'Nhật ký')+'</span></div></div>';
  var l=r.label?getLabel(r.label):null,em=r.type==='habit'?guessEmoji(r.title):(l&&r.label?lEmoji(l):r.wantBday?'🎂':guessEmoji(r.title));
  var chips=r.chips.map(function(c,i){return '<span class="chip'+(i===0?' k':'')+'">'+esc(c)+'</span>';}).join('');
  if(l&&l.id&&r.type!=='habit')chips+='<span class="chip">'+esc(lEmoji(l)+' '+l.name)+'</span>';
  return '<div class="pv"><div class="pv-t"><span class="em">'+em+'</span>'+(esc(r.title)||'<span style="color:var(--label3)">Chưa có tên</span>')+'</div><div class="chips">'+chips+'</div>'+(lines.length>1?'<div class="pv-more">+ '+(lines.length-1)+' dòng nữa, mỗi dòng thành một mục</div>':'')+'</div>';
}
var HINTS=['mai 8h khám răng','tennis 18h T4 và CN hằng tuần','uống thuốc mỗi ngày 8h và 20h','sinh nhật mẹ 20/9 âm lịch','đi Đà Lạt 20/12 đến 23/12','mua pate cho Xu','ghi chú: '];

/* ========== render ========== */
function applyTheme(){var r=document.documentElement,m=S.settings.mode||'auto';r.setAttribute('data-tint',S.settings.theme||'pink');if(m==='light'||m==='dark')r.setAttribute('data-theme',m);else r.removeAttribute('data-theme');
  var dark=m==='dark'||(m==='auto'&&matchMedia('(prefers-color-scheme: dark)').matches);var tc=document.querySelector('meta[name="theme-color"]');if(tc)tc.setAttribute('content',dark?'#000000':'#F2F2F7');}
function render(){applyTheme();renderNav();renderTabs();document.getElementById('main').innerHTML=({today:vToday,cal:vCal,todo:vTodo,notes:vNotes}[ui.tab]||vToday)();updateQaPh();}
function renderNav(){document.getElementById('nav').innerHTML=(ui.tab==='cal'?'<button class="navbtn" data-act="goto-today">Hôm nay</button>':'')+'<button class="navbtn" data-act="settings" aria-label="Cài đặt">'+svg(IC.gear,22,1.8)+'</button>';}
function renderTabs(){var t=[['today','Hôm nay',IC.today],['cal','Lịch',IC.cal],['todo','Việc',IC.list],['notes','Ghi chú',IC.note]];
  document.getElementById('tabs').innerHTML=t.map(function(x){return '<button class="tab" data-act="tab" data-v="'+x[0]+'"'+(ui.tab===x[0]?' aria-current="page"':'')+'>'+svg(x[2],25,1.7)+'<span>'+x[1]+'</span></button>';}).join('');}
function updateQaPh(){var ph={today:'Gõ để thêm: mai 8h khám răng',cal:'Gõ để thêm: tennis 18h T4 và CN',todo:'Gõ để thêm: mua pate cho Xu',notes:ui.ntab==='diary'?'Hôm nay của bạn thế nào?':ui.ntab==='books'?'Gõ để thêm: mai 8h khám răng':'Gõ để thêm ghi chú'}[ui.tab];document.getElementById('qa').placeholder=ph;}

function lunarLine(ds){var l=lunarOf(ds);return l[0]+'/'+l[1]+(l[3]?' nhuận':'')+' âm lịch';}
function sub(ds){var h=holidayOf(ds);return '<p class="sub">'+esc(dLong(ds))+(S.settings.lunar!==false?' · '+lunarLine(ds):'')+(h?' · <span class="hol"><span class="em">'+h.e+'</span> '+esc(h.n)+'</span>':'')+'</p>';}

function ring(frac){var r=13,c=2*Math.PI*r;return '<svg viewBox="0 0 32 32" width="32" height="32"><circle cx="16" cy="16" r="'+r+'" fill="none" stroke="var(--fill2)" stroke-width="3"/>'+(frac>0?'<circle cx="16" cy="16" r="'+r+'" fill="none" stroke="var(--c)" stroke-width="3" stroke-linecap="round" stroke-dasharray="'+(c*Math.min(1,frac)).toFixed(1)+' '+c.toFixed(1)+'" transform="rotate(-90 16 16)"/>':'')+(frac>=1?'<circle cx="16" cy="16" r="11" fill="var(--c)"/><path d="M11 16.5l3.2 3.2 6.6-6.7" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>':'')+'</svg>';}
function habitRow(h,ds){
  var c=hCount(h,ds),tg=hTarget(h),st=streak(h),nx=(h.times||[])[c];
  var sub=c>=tg?'Xong'+(st>1?' · chuỗi '+st+' ngày':''):(nx?'Tiếp theo '+nx:'Chưa xong')+' · '+c+'/'+tg;
  return '<div class="swr" data-swipe="habit" data-id="'+esc(h.id)+'"><div class="sbg">Xoá</div><div class="row c-'+(h.color||COLOR_OF[h.icon]||'coral')+'" style="--inset:60px"><button class="ring'+(c>=tg?' full':'')+'" data-act="hit" data-id="'+esc(h.id)+'" data-d="'+ds+'" aria-label="Đánh dấu '+esc(h.name)+'">'+ring(c/tg)+'<span class="em">'+hEmoji(h)+'</span></button><button class="rb" data-act="edit" data-k="habit" data-id="'+esc(h.id)+'"><span class="rt">'+esc(h.name)+'</span><span class="rs">'+esc(sub)+'</span></button></div></div>';
}
function evRow(e,ds,showDate){
  var l=getLabel(e.label),tm;
  if(isMulti(e))tm='Cả ngày<small>'+(diffDays(e.start,ds)+1)+'/'+(diffDays(e.start,evEnd(e))+1)+'</small>';
  else tm=e.allDay?'Cả ngày':esc(e.time)+(e.end?'<small>'+esc(e.end)+'</small>':'');
  var meta=[];if(showDate)meta.push(esc(rel(ds)));
  if(l.id)meta.push('<span class="lab">'+lEmoji(l)+'</span> '+esc(l.name));
  if(e.repeat!=='none')meta.push(esc(repName(e)));
  if(e._from)meta.push('dời từ '+esc(dShort(e._from)));
  if(e.byear){var age=+ds.slice(0,4)-(+e.byear);if(age>0)meta.push('tròn '+age+' tuổi');}
  return '<div class="swr" data-swipe="event" data-id="'+esc(e.id)+'" data-d="'+ds+'"><div class="sbg">'+(e.repeat!=='none'?'Bỏ buổi này':'Xoá')+'</div><button class="row ev c-'+l.color+'" data-act="edit" data-k="event" data-id="'+esc(e.id)+'" data-d="'+ds+'"><span class="tm">'+tm+'</span><span class="bar"></span><span class="rb"><span class="rt">'+esc(e.title)+'</span><span class="rs">'+meta.join(' · ')+'</span></span></button></div>';
}
function todoRow(t){
  var l=getLabel(t.label),late=!t.done&&t.due&&t.due<today,meta=[];
  if(t.due)meta.push('<span class="'+(late?'late':'')+'">'+esc(rel(t.due))+(t.time?' '+esc(t.time):'')+'</span>');
  if(l.id)meta.push('<span class="lab em">'+lEmoji(l)+'</span>'+esc(l.name));
  if(t.subs&&t.subs.length)meta.push(t.subs.filter(function(s){return s.d;}).length+'/'+t.subs.length);
  return '<div class="swr" data-swipe="todo" data-id="'+esc(t.id)+'"><div class="sbg">Xoá</div><div class="row'+(t.done?' done':'')+'" style="--inset:52px"><button class="ck'+(t.done?' on':'')+'" data-act="toggle-todo" data-id="'+esc(t.id)+'" aria-label="Xong: '+esc(t.title)+'">'+(t.done?svg(IC.check,14,3):'')+'</button><button class="rb" data-act="edit" data-k="todo" data-id="'+esc(t.id)+'"><span class="rt">'+esc(t.title)+'</span><span class="rs">'+meta.join(' · ')+'</span></button></div></div>';
}
function group(head,rows,foot,big){return '<section class="sec">'+(head?'<div class="sh'+(big?' big':'')+'">'+head+'</div>':'')+'<div class="group">'+(rows||'<div class="empty">Trống</div>')+'</div>'+(foot?'<div class="foot">'+foot+'</div>':'')+'</section>';}

function vToday(){
  var h='<h1 class="lt">Hôm nay</h1>'+sub(today);
  var hb=S.habits.filter(function(x){return hSched(x,today);});
  var evs=eventsOn(today);
  var tds=S.todos.filter(function(t){return !t.done&&t.due&&t.due<=today;}).sort(function(a,b){return a.due.localeCompare(b.due)||(a.time||'').localeCompare(b.time||'');});
  if(!hb.length&&!evs.length&&!tds.length&&!S.events.length&&!S.todos.length&&!S.habits.length){
    return h+group('',  '<div class="empty" style="padding:18px 16px;line-height:1.5"><b style="color:var(--label)">Gõ một câu ở ô bên dưới là xong.</b><br>Ví dụ:<br>• tennis 18h T4 và CN hằng tuần<br>• uống thuốc mỗi ngày 8h và 20h<br>• mai 9h đưa Xu đi khám<br>• sinh nhật mẹ 20/9 âm lịch<br>• mua cát cho Xu</div>');
  }
  if(hb.length)h+=group('Thói quen',hb.map(function(x){return habitRow(x,today);}).join(''));
  h+=group('Lịch hôm nay',evs.map(function(e){return evRow(e,today);}).join('')||'<div class="empty">Không có sự kiện</div>');
  h+=group('Việc cần làm',tds.map(todoRow).join('')||'<div class="empty">Không có việc nào hạn hôm nay</div>');
  var up=[];for(var i=1;i<=7;i++){var ds=addDays(today,i);eventsOn(ds).forEach(function(e){if(isMulti(e)&&ds!==e.start&&e._from===undefined)return;up.push(evRow(e,ds,true));});}
  var ut=S.todos.filter(function(t){return !t.done&&t.due>today&&t.due<=addDays(today,7);}).sort(function(a,b){return a.due.localeCompare(b.due);});
  if(up.length||ut.length)h+=group('7 ngày tới',up.slice(0,12).join('')+ut.map(todoRow).join(''));
  return h;
}
function vCal(){
  var first=new Date(ui.y,ui.m,1),lead=(first.getDay()+6)%7,dim=new Date(ui.y,ui.m+1,0).getDate(),total=Math.ceil((lead+dim)/7)*7;
  var h='<h1 class="lt">Lịch</h1><div class="mhead"><h2><span>Tháng '+(ui.m+1)+'</span> '+ui.y+'</h2><div class="mnav"><button data-act="m-prev" aria-label="Tháng trước">'+svg(IC.l,20,2.4)+'</button><button data-act="m-next" aria-label="Tháng sau">'+svg(IC.r,20,2.4)+'</button></div></div>';
  h+='<div class="cal" id="cal"><div class="wd">'+WEEK.map(function(w){return '<span>'+WD_S[w]+'</span>';}).join('')+'</div><div class="grid">';
  for(var i=0;i<total;i++){
    var dt=new Date(ui.y,ui.m,1-lead+i),ds=ymd(dt),evs=eventsOn(ds),hol=holidayOf(ds);
    var cols=[];evs.forEach(function(e){var c=getLabel(e.label).color;if(cols.indexOf(c)<0)cols.push(c);});
    if(S.todos.some(function(t){return !t.done&&t.due===ds;})&&cols.indexOf('slate')<0)cols.push('slate');
    var l=S.settings.lunar!==false?lunarOf(ds):null;
    h+='<button class="day'+(dt.getMonth()!==ui.m?' out':'')+(ds===today?' today':'')+(ds===ui.sel?' sel':'')+(hol&&hol.off||dt.getDay()===0?' off':'')+'" data-act="pick" data-d="'+ds+'" aria-label="'+esc(dLong(ds))+(evs.length?', '+evs.length+' sự kiện':'')+'"><span class="n">'+dt.getDate()+'</span>'+(l?'<span class="lu'+(l[0]===1?' m1':'')+'">'+(l[0]===1?l[0]+'/'+l[1]:l[0])+'</span>':'')+'<span class="dots">'+cols.slice(0,3).map(function(c){return '<i class="c-'+c+'"></i>';}).join('')+'</span></button>';
  }
  h+='</div></div>';
  var ds2=ui.sel,evs2=eventsOn(ds2),hol2=holidayOf(ds2),tds=S.todos.filter(function(t){return t.due===ds2;});
  var head=esc(dLong(ds2))+(S.settings.lunar!==false?' · '+lunarLine(ds2):'');
  var rows=(hol2?'<div class="row"><span class="em" style="font-size:20px">'+hol2.e+'</span><span class="rb"><span class="rt">'+esc(hol2.n)+'</span>'+(hol2.off?'<span class="rs" style="color:var(--red)">Nghỉ lễ</span>':'')+'</span></div>':'')+evs2.map(function(e){return evRow(e,ds2);}).join('')+tds.map(todoRow).join('');
  h+=group(head,rows||'<div class="empty">Không có gì. Gõ ở ô bên dưới để thêm.</div>');
  return h;
}
function vTodo(){
  var open=S.todos.filter(function(t){return !t.done;}),done=S.todos.filter(function(t){return t.done;});
  function by(a,b){return (a.due||'9').localeCompare(b.due||'9')||(a.time||'').localeCompare(b.time||'');}
  var h='<h1 class="lt">Việc cần làm</h1><p class="sub">'+open.length+' việc chưa xong</p>';
  var gs=[['Quá hạn',open.filter(function(t){return t.due&&t.due<today;})],['Hôm nay',open.filter(function(t){return t.due===today;})],['Sắp tới',open.filter(function(t){return t.due>today;})],['Chưa có hạn',open.filter(function(t){return !t.due;})]];
  var any=false;gs.forEach(function(g){if(!g[1].length)return;any=true;h+=group(g[0]+' · '+g[1].length,g[1].sort(by).map(todoRow).join(''));});
  if(!any)h+=group('','<div class="empty">Không còn việc nào. Gõ ở ô bên dưới để thêm, ví dụ “mai mua pate cho Xu”.</div>');
  if(done.length){h+='<section class="sec"><div class="sh"><span>Đã xong · '+done.length+'</span><button data-act="show-done">'+(ui.showDone?'Ẩn':'Hiện')+'</button></div>'+(ui.showDone?'<div class="group">'+done.slice(-30).reverse().map(todoRow).join('')+'</div>':'')+'</section>';}
  h+='<div class="foot" style="padding-bottom:8px">Vuốt trái một dòng để xoá.</div>';
  return h;
}
var MOODS=[[5,'😄','Rất vui'],[4,'🙂','Vui'],[3,'😐','Bình thường'],[2,'😔','Buồn'],[1,'😫','Mệt']];
function moodEm(m){var x=MOODS.filter(function(y){return y[0]===+m;})[0];return x?x[1]:'😐';}
function vNotes(){
  var h='<h1 class="lt">Ghi chú</h1><div class="seg" role="group">'+[['notes','Ghi chú'],['diary','Nhật ký'],['books','Sổ theo dõi']].map(function(x){return '<button data-act="ntab" data-v="'+x[0]+'" aria-pressed="'+(ui.ntab===x[0])+'">'+x[1]+'</button>';}).join('')+'</div>';
  if(ui.ntab==='notes'){
    var ns=S.notes.slice().sort(function(a,b){return (b.pinned?1:0)-(a.pinned?1:0)||b.updated-a.updated;});
    h+=group(ns.length+' ghi chú',ns.map(function(n){var d=new Date(n.updated);var first=(n.body||'').split('\n')[0];return '<div class="swr" data-swipe="note" data-id="'+esc(n.id)+'"><div class="sbg">Xoá</div><button class="row nt" data-act="edit" data-k="note" data-id="'+esc(n.id)+'"><span class="rb"><span class="rt">'+(n.pinned?'📌 ':'')+esc(n.title||'Không tiêu đề')+'</span><span class="rs">'+esc(d.getDate()+'/'+(d.getMonth()+1)+'  '+(first||'Không có nội dung'))+'</span></span><span class="chev">'+svg(IC.chev,14,2.6)+'</span></button></div>';}).join('')||'<div class="empty">Chưa có ghi chú. Gõ ở ô bên dưới để thêm.</div>');
  }else if(ui.ntab==='diary'){
    var ks=Object.keys(S.diary).sort().reverse();
    h+=group(ks.length+' trang',ks.map(function(k){var e=S.diary[k];return '<div class="swr" data-swipe="diary" data-d="'+k+'"><div class="sbg">Xoá</div><button class="row dm" data-act="edit" data-k="diary" data-d="'+k+'" style="--inset:58px"><span class="em">'+moodEm(e.mood)+'</span><span class="rb"><span class="rt">'+esc(dLong(k))+'</span><span class="rs">'+esc((e.text||'').split('\n')[0]||'Không có ghi chép')+'</span></span><span class="chev">'+svg(IC.chev,14,2.6)+'</span></button></div>';}).join('')||'<div class="empty">Chưa có trang nhật ký. Gõ ở ô bên dưới để viết về hôm nay.</div>');
  }else{
    if(ui.book){var b=(S.books||[]).filter(function(x){return x.id===ui.book;})[0];if(b)return h+vBook(b);ui.book='';}
    h+=group('Sổ',(S.books||[]).map(function(b){return '<button class="row bk c-'+(b.color||'sky')+'" data-act="open-book" data-v="'+esc(b.id)+'" style="--inset:58px"><span class="bi">'+guessEmoji(b.name)+'</span><span class="rb"><span class="rt">'+esc(b.name)+'</span><span class="rs">'+(b.entries||[]).length+' trang</span></span><span class="chev">'+svg(IC.chev,14,2.6)+'</span></button>';}).join('')+'<button class="row" data-act="new-book" style="color:var(--tint)">'+svg(IC.plus,20,2.2)+'<span class="rb">Sổ mới</span></button>','Sổ theo dõi ghi lại từng lần, ví dụ buổi tập tennis hay lần tiêm cho Xu.');
  }
  return h;
}
function fmtMin(m){m=+m||0;var hh=Math.floor(m/60),r=m%60;return hh?(hh+' giờ'+(r?' '+r+' phút':'')):r+' phút';}
function entrySum(b,e){var out=[];(b.fields||[]).forEach(function(f){var v=e.v&&e.v[f.id];if(v==null||v===''||(Array.isArray(v)&&!v.length))return;
  if(f.type==='duration')out.push(fmtMin(v));else if(f.type==='number')out.push(v+(f.unit?' '+f.unit:''));else if(f.type==='rating')out.push(moodEm(v));else if(f.type==='choice')out.push((Array.isArray(v)?v:[v]).join(', '));else if(f.type==='nextdate')out.push('hẹn '+dShort(v));else out.push(String(v));});return out.join(' · ')||'Trang trống';}
function vBook(b){
  var es=(b.entries||[]).slice().sort(function(x,y){return y.date.localeCompare(x.date);}),mo=today.slice(0,7),thisM=es.filter(function(e){return e.date.slice(0,7)===mo;});
  var h='<button class="navbtn" data-act="close-book" style="padding-left:0;margin:-8px 0 8px">'+svg(IC.l,20,2.4)+' Sổ</button><div class="sh big" style="padding:0 0 10px">'+esc(b.name)+'</div>';
  var st='<div class="stat"><small>Tháng này</small><b>'+thisM.length+' lần</b></div>';
  var df=(b.fields||[]).filter(function(f){return f.type==='duration';})[0];if(df){var sum=0;thisM.forEach(function(e){sum+=+(e.v&&e.v[df.id])||0;});st+='<div class="stat"><small>'+esc(df.name)+' tháng này</small><b>'+fmtMin(sum)+'</b></div>';}
  var nf=(b.fields||[]).filter(function(f){return f.type==='nextdate';})[0];if(nf){var up=es.map(function(e){return e.v&&e.v[nf.id];}).filter(function(v){return v&&v>=today;}).sort()[0];if(up)st+='<div class="stat"><small>'+esc(nf.name)+'</small><b>'+dShort(up)+'</b></div>';}
  h+='<div class="stats">'+st+'</div>';
  h+=group('',es.map(function(e){return '<div class="swr" data-swipe="entry" data-id="'+esc(b.id)+'" data-pid="'+esc(e.id)+'"><div class="sbg">Xoá</div><button class="row" data-act="edit-entry" data-id="'+esc(b.id)+'" data-pid="'+esc(e.id)+'"><span class="rb"><span class="rt">'+esc(dLong(e.date))+'</span><span class="rs">'+esc(entrySum(b,e))+'</span></span><span class="chev">'+svg(IC.chev,14,2.6)+'</span></button></div>';}).join('')+'<button class="row" data-act="new-entry" data-id="'+esc(b.id)+'" style="color:var(--tint)">'+svg(IC.plus,20,2.2)+'<span class="rb">Ghi trang mới</span></button>');
  return h;
}

/* ========== sheets (forms) ========== */
var cur=null;
function openSheet(type,d){cur={type:type,d:d};renderSheet();document.getElementById('sheet').hidden=false;}
function closeSheet(){cur=null;document.getElementById('sheet').hidden=true;document.getElementById('panel').innerHTML='';}
function ph(title,right,rightAct){return '<div class="ph"><button class="l" data-act="close">Huỷ</button><h2>'+title+'</h2>'+(right?'<button class="r" data-act="'+rightAct+'">'+right+'</button>':'<span></span>')+'</div>';}
function fRow(label,ctrl){return '<div class="f"><span>'+label+'</span>'+ctrl+'</div>';}
function swRow(label,k,on){return '<div class="f"><span>'+label+'</span><button class="sw" role="switch" data-act="sw" data-k="'+k+'" aria-checked="'+!!on+'"></button></div>';}
function labPick(sel){return '<div class="labs"><button class="lb c-slate" data-act="set" data-k="label" data-v="" aria-pressed="'+(!sel)+'">Không nhãn</button>'+labels().map(function(l){return '<button class="lb c-'+l.color+'" data-act="set" data-k="label" data-v="'+esc(l.id)+'" aria-pressed="'+(sel===l.id)+'"><span class="em">'+lEmoji(l)+'</span>'+esc(l.name)+'</button>';}).join('')+'</div>';}
function wdPick(days){return '<div class="wdp">'+WEEK.map(function(w){return '<button data-act="wd" data-v="'+w+'" aria-pressed="'+(days.indexOf(w)>=0)+'">'+WD_S[w]+'</button>';}).join('')+'</div>';}
function sel(k,opts,v){return '<select data-f="'+k+'">'+opts.map(function(o){return '<option value="'+o[0]+'"'+(String(v)===String(o[0])?' selected':'')+'>'+o[1]+'</option>';}).join('')+'</select>';}
var REP=[['none','Không'],['daily','Mỗi ngày'],['weekly','Mỗi tuần'],['monthly','Mỗi tháng'],['yearly','Mỗi năm'],['lunar','Mỗi năm (âm lịch)']];
var REM=[['','Không'],['0','Đúng giờ'],['5','Trước 5 phút'],['15','Trước 15 phút'],['30','Trước 30 phút'],['60','Trước 1 giờ'],['1440','Trước 1 ngày']];

function openEdit(kind,id,ds){
  if(kind==='event'){var e=getEv(id);if(!e)return;var d=clone(e);d.remind=e.remind==null?'':String(e.remind);d.days=d.days&&d.days.length?d.days:[dowOf(e.start)];d.multi=isMulti(e);d.endDate=d.multi?evEnd(e):'';d.occ=ds||'';openSheet('event',d);}
  else if(kind==='todo'){var t=S.todos.filter(function(x){return x.id===id;})[0];if(t)openSheet('todo',clone(t));}
  else if(kind==='habit'){var h=S.habits.filter(function(x){return x.id===id;})[0];if(h){var hd=clone(h);hd.emoji=hEmoji(h);openSheet('habit',hd);}}
  else if(kind==='note'){var n=S.notes.filter(function(x){return x.id===id;})[0];if(n)openSheet('note',clone(n));}
  else if(kind==='diary'){var dd=S.diary[ds]||{mood:3,text:''};openSheet('diary',{date:ds,orig:S.diary[ds]?ds:'',mood:dd.mood,text:dd.text});}
}
function renderSheet(){
  if(!cur)return;var d=cur.d,h='';
  switch(cur.type){
  case 'event':
    h=ph(d.id?'Sự kiện':'Sự kiện mới','Xong','save-event')+
      '<section class="sec"><div class="group"><div class="f"><input class="big-in" data-f="title" value="'+esc(d.title)+'" placeholder="Tiêu đề" aria-label="Tiêu đề"></div></div></section>'+
      '<section class="sec"><div class="group">'+swRow('Cả ngày','allDay',d.allDay)+swRow('Nhiều ngày','multi',d.multi)+
      fRow(d.multi?'Từ ngày':'Ngày','<input type="date" data-f="start" value="'+esc(d.start)+'">')+
      (d.multi?fRow('Đến ngày','<input type="date" data-f="endDate" value="'+esc(d.endDate||addDays(d.start,1))+'">'):'')+
      (d.allDay?'':fRow('Bắt đầu','<input type="time" data-f="time" value="'+esc(d.time)+'">')+fRow('Kết thúc','<input type="time" data-f="end" value="'+esc(d.end)+'">'))+
      '</div></section>'+
      (d.multi?'':'<section class="sec"><div class="group">'+fRow('Lặp lại',sel('repeat',REP,d.repeat))+(d.repeat==='weekly'?wdPick(d.days):'')+(d.repeat!=='none'?fRow('Kết thúc lặp','<input type="date" data-f="until" value="'+esc(d.until||'')+'">'):'')+'</div>'+(d.repeat==='lunar'?'<div class="foot">Lặp vào ngày '+lunarOf(d.start)[0]+'/'+lunarOf(d.start)[1]+' âm lịch mỗi năm.</div>':'')+'</section>')+
      '<section class="sec"><div class="group">'+fRow('Nhắc',sel('remind',REM,d.remind))+'</div><div class="foot">Nhắc hiện ra khi app đang mở.</div></section>'+
      '<section class="sec"><div class="sh">Nhãn</div><div class="group">'+labPick(d.label)+'</div></section>'+
      '<section class="sec"><div class="group"><div class="f"><textarea data-f="note" placeholder="Ghi chú" aria-label="Ghi chú">'+esc(d.note||'')+'</textarea></div></div></section>'+
      (d.err?'<p class="err">'+esc(d.err)+'</p>':'')+
      (d.id?'<div class="btnrow">'+(d.repeat!=='none'&&d.occ?'<button class="bt" data-act="move-open">Dời riêng buổi '+esc(dShort(d.occ))+'</button><button class="bt del" data-act="skip-occ">Bỏ riêng buổi '+esc(dShort(d.occ))+'</button>':'')+'<button class="bt del" data-act="del-event">'+(d.repeat!=='none'?'Xoá cả chuỗi':'Xoá sự kiện')+'</button></div>':'');
    break;
  case 'move':
    var me=getEv(d.id);
    h=ph('Dời buổi','Dời','save-move')+'<section class="sec"><div class="group">'+fRow('Buổi gốc','<span class="rv">'+esc(dLong(d.from))+'</span>')+fRow('Dời sang','<input type="date" data-f="to" value="'+esc(d.to)+'">')+(me&&!me.allDay?fRow('Giờ','<input type="time" data-f="time" value="'+esc(d.time)+'">'):'')+'</div><div class="foot">Chỉ dời buổi này, các buổi khác của '+esc(me?me.title:'')+' giữ nguyên.</div></section>';
    break;
  case 'todo':
    h=ph(d.id?'Việc cần làm':'Việc mới','Xong','save-todo')+
      '<section class="sec"><div class="group"><div class="f"><input class="big-in" data-f="title" value="'+esc(d.title)+'" placeholder="Tên việc" aria-label="Tên việc"></div></div></section>'+
      '<section class="sec"><div class="group">'+swRow('Có hạn','hasDue',!!d.due)+(d.due?fRow('Ngày','<input type="date" data-f="due" value="'+esc(d.due)+'">')+fRow('Giờ','<input type="time" data-f="time" value="'+esc(d.time||'')+'">')+fRow('Lặp lại',sel('repeat',REP.slice(0,4),d.repeat||'none')):'')+'</div></section>'+
      '<section class="sec"><div class="sh">Nhãn</div><div class="group">'+labPick(d.label)+'</div></section>'+
      '<section class="sec"><div class="group"><div class="f"><textarea data-f="note" placeholder="Ghi chú" aria-label="Ghi chú">'+esc(d.note||'')+'</textarea></div></div></section>'+
      (d.id?'<div class="btnrow"><button class="bt del" data-act="del-todo">Xoá việc</button></div>':'');
    break;
  case 'habit':
    h=ph('Thói quen','Xong','save-habit')+
      '<section class="sec"><div class="group"><div class="f"><input class="big-in" data-f="name" value="'+esc(d.name)+'" placeholder="Tên thói quen" aria-label="Tên"></div></div></section>'+
      '<section class="sec"><div class="sh">Giờ nhắc · mỗi giờ là một lần tick</div><div class="group">'+(d.times||[]).map(function(t,i){return '<div class="f"><input type="time" data-ti="'+i+'" value="'+esc(t)+'" aria-label="Giờ '+(i+1)+'"><span></span><button style="color:var(--red)" data-act="time-rm" data-i="'+i+'">Bỏ</button></div>';}).join('')+'<button class="f" data-act="time-add" style="color:var(--tint);width:100%">Thêm giờ</button></div></section>'+
      '<section class="sec"><div class="sh">Những ngày cần làm</div><div class="group">'+wdPick(d.days)+'</div></section>'+
      '<section class="sec"><div class="sh">Biểu tượng</div><div class="group"><div class="emojis">'+EMOJIS.slice(0,24).map(function(em){return '<button data-act="set" data-k="emoji" data-v="'+em+'" aria-pressed="'+(d.emoji===em)+'">'+em+'</button>';}).join('')+'</div></div></section>'+
      '<div class="btnrow"><button class="bt del" data-act="del-habit">Xoá thói quen</button></div>';
    break;
  case 'note':
    h=ph('Ghi chú','Xong','save-note')+'<section class="sec"><div class="group"><div class="f"><input class="big-in" data-f="title" value="'+esc(d.title)+'" placeholder="Tiêu đề"></div><div class="f"><textarea data-f="body" style="min-height:240px" placeholder="Nội dung">'+esc(d.body||'')+'</textarea></div></div></section>'+
      '<section class="sec"><div class="group">'+swRow('Ghim lên đầu','pinned',d.pinned)+'</div></section><div class="btnrow"><button class="bt del" data-act="del-note">Xoá ghi chú</button></div>';
    break;
  case 'diary':
    h=ph('Nhật ký','Xong','save-diary')+'<section class="sec"><div class="group">'+fRow('Ngày','<input type="date" data-f="date" max="'+today+'" value="'+esc(d.date)+'">')+'</div></section>'+
      '<section class="sec"><div class="sh">Tâm trạng</div><div class="group"><div class="moods">'+MOODS.map(function(m){return '<button data-act="set" data-k="mood" data-v="'+m[0]+'" aria-pressed="'+(+d.mood===m[0])+'"><span class="em">'+m[1]+'</span>'+m[2]+'</button>';}).join('')+'</div></div></section>'+
      '<section class="sec"><div class="group"><div class="f"><textarea data-f="text" style="min-height:200px" placeholder="Hôm nay thế nào?">'+esc(d.text||'')+'</textarea></div></div></section>'+(d.orig?'<div class="btnrow"><button class="bt del" data-act="del-diary">Xoá trang này</button></div>':'');
    break;
  case 'entry':
    var bk=(S.books||[]).filter(function(x){return x.id===d.bookId;})[0];if(!bk)break;
    h=ph(esc(bk.name),'Lưu','save-entry')+'<section class="sec"><div class="group">'+fRow('Ngày','<input type="date" data-f="date" value="'+esc(d.date)+'">')+(bk.fields||[]).map(function(f){var v=d.v[f.id];
      if(f.type==='duration')return fRow(esc(f.name)+' (phút)','<input type="number" inputmode="numeric" data-fv="'+f.id+'" value="'+esc(v==null?'':v)+'" style="width:90px">');
      if(f.type==='number')return fRow(esc(f.name)+(f.unit?' ('+esc(f.unit)+')':''),'<input type="number" inputmode="decimal" step="0.1" data-fv="'+f.id+'" value="'+esc(v==null?'':v)+'" style="width:90px">');
      if(f.type==='rating')return '<div class="f"><span>'+esc(f.name)+'</span></div><div class="moods">'+MOODS.map(function(m){return '<button data-act="fv" data-k="'+f.id+'" data-v="'+m[0]+'" aria-pressed="'+(+v===m[0])+'"><span class="em">'+m[1]+'</span></button>';}).join('')+'</div>';
      if(f.type==='choice')return fRow(esc(f.name),sel('fv:'+f.id,[['','Chọn']].concat((f.opts||[]).map(function(o){return [o,o];})),Array.isArray(v)?v[0]:v||''));
      if(f.type==='nextdate')return fRow(esc(f.name),'<input type="date" data-fv="'+f.id+'" value="'+esc(v||'')+'">');
      return '<div class="f"><textarea data-fv="'+f.id+'" placeholder="'+esc(f.name)+'" style="min-height:60px">'+esc(v||'')+'</textarea></div>';}).join('')+'</div>'+((bk.fields||[]).some(function(f){return f.type==='nextdate';})?'<div class="foot">Chọn ngày hẹn thì app tự tạo nhắc trên Lịch.</div>':'')+'</section>'+(d.id?'<div class="btnrow"><button class="bt del" data-act="del-entry">Xoá trang</button></div>':'');
    break;
  case 'bookNew':
    h=ph('Sổ mới','Tạo','save-book')+'<section class="sec"><div class="group"><div class="f"><input class="big-in" data-f="name" value="'+esc(d.name)+'" placeholder="Tên sổ, ví dụ: Sổ Tennis"></div></div></section>'+
      '<section class="sec"><div class="sh">Mẫu</div><div class="group">'+[['tennis','🎾 Tập luyện','Thời lượng, cảm nhận, ghi chú'],['health','💉 Sức khoẻ / tiêm phòng','Loại, cân nặng, hẹn lần tới'],['simple','📝 Đơn giản','Chỉ ghi chú']].map(function(x){return '<button class="row" data-act="set" data-k="tpl" data-v="'+x[0]+'"><span class="rb"><span class="rt">'+x[1]+'</span><span class="rs">'+x[2]+'</span></span>'+(d.tpl===x[0]?'<span style="color:var(--tint)">'+svg(IC.check,18,2.6)+'</span>':'')+'</button>';}).join('')+'</div></section>';
    break;
  case 'labels':
    h=ph('Nhãn','','')+'<section class="sec"><div class="group">'+labels().map(function(l){return '<button class="row" data-act="label-edit" data-id="'+esc(l.id)+'" style="--inset:52px"><span class="em" style="font-size:22px">'+lEmoji(l)+'</span><span class="rb"><span class="rt">'+esc(l.name)+'</span></span><span class="c-'+l.color+'" style="width:12px;height:12px;border-radius:50%;background:var(--c)"></span><span class="chev">'+svg(IC.chev,14,2.6)+'</span></button>';}).join('')+'<button class="row" data-act="label-new" style="color:var(--tint)">'+svg(IC.plus,20,2.2)+'<span class="rb">Nhãn mới</span></button></div></section>';
    break;
  case 'label':
    h=ph(d.id?'Sửa nhãn':'Nhãn mới','Xong','save-label')+'<section class="sec"><div class="group"><div class="f"><span class="em" style="font-size:28px">'+esc(d.emoji)+'</span><input class="big-in" data-f="name" value="'+esc(d.name)+'" placeholder="Tên nhãn"></div><div class="f"><span>Emoji khác</span><input data-f="emoji" value="'+esc(d.emoji)+'" style="max-width:80px;text-align:center;font-size:22px" maxlength="12" aria-label="Gõ emoji"></div></div></section>'+
      '<section class="sec"><div class="sh">Màu</div><div class="group"><div class="colors">'+COLORS.map(function(c){return '<button class="c-'+c+'" data-act="set" data-k="color" data-v="'+c+'" aria-pressed="'+(d.color===c)+'" aria-label="'+c+'"></button>';}).join('')+'</div></div></section>'+
      '<section class="sec"><div class="sh">Emoji</div><div class="group"><div class="emojis">'+EMOJIS.map(function(em){return '<button data-act="set" data-k="emoji" data-v="'+em+'" aria-pressed="'+(d.emoji===em)+'">'+em+'</button>';}).join('')+'</div></div></section>'+
      (d.id?'<div class="btnrow"><button class="bt del" data-act="del-label">Xoá nhãn</button></div>':'');
    break;
  case 'settings':
    var THM=[['pink','Hồng','rose'],['sky','Xanh dương','sky'],['lavender','Tím','violet'],['peach','Cam','amber'],['mint','Xanh lá','lime'],['teal','Ngọc','teal']];
    h=ph('Cài đặt','','')+
      '<section class="sec"><div class="sh">Màu nhấn</div><div class="group"><div class="colors">'+THM.map(function(x){return '<button class="c-'+x[2]+'" data-act="theme" data-v="'+x[0]+'" aria-pressed="'+((S.settings.theme||'pink')===x[0])+'" aria-label="'+x[1]+'"></button>';}).join('')+'</div></div></section>'+
      '<section class="sec"><div class="sh">Giao diện</div><div class="seg" style="margin:0">'+[['auto','Tự động'],['light','Sáng'],['dark','Tối']].map(function(x){return '<button data-act="mode" data-v="'+x[0]+'" aria-pressed="'+((S.settings.mode||'auto')===x[0])+'">'+x[1]+'</button>';}).join('')+'</div></section>'+
      '<section class="sec"><div class="group">'+swRow('Hiện âm lịch','lunar',S.settings.lunar!==false)+swRow('Hiện ngày lễ Việt Nam','holidays',S.settings.holidays!==false)+'<button class="row" data-act="labels"><span class="rb">Nhãn</span><span class="rv">'+labels().length+'</span><span class="chev">'+svg(IC.chev,14,2.6)+'</span></button></div></section>'+
      '<section class="sec"><div class="sh">Sao lưu</div><div class="group"><button class="row" data-act="export" style="color:var(--tint)">Xuất bản sao lưu</button><label class="row" for="f-import" style="color:var(--tint);cursor:pointer">Khôi phục từ file</label><input id="f-import" type="file" accept="application/json,.json" hidden></div><div class="foot">Dữ liệu chỉ nằm trên máy này. Thỉnh thoảng xuất một bản để phòng khi đổi máy.</div></section>'+
      '<section class="sec"><div class="group"><a class="row" href="v3/" style="color:var(--tint);text-decoration:none">Mở giao diện cũ (sổ tay có Xu)</a></div><div class="foot">Cùng dữ liệu với giao diện mới. Phiên bản 4.0</div></section>';
    break;
  }
  document.getElementById('panel').innerHTML=h;
}
function fail(m){cur.d.err=m;renderSheet();}

/* ========== actions ========== */
var undoSnap=null;
function withUndo(msg,fn){var snap=clone(S);fn();save();render();toast(msg,'',[['Hoàn tác',function(){S=snap;save();render();}]]);}
function removeItem(kind,id,ds,pid){
  if(kind==='event'){var e=getEv(id);if(!e)return;
    if(e.repeat!=='none'&&ds){var k=movedTo(e,ds)||ds;return withUndo('Đã bỏ buổi '+dShort(ds),function(){e.skip=(e.skip||[]).concat([k]);if(e.moves&&e.moves[k])delete e.moves[k];});}
    return withUndo('Đã xoá “'+e.title+'”',function(){S.events=S.events.filter(function(x){return x.id!==id;});});}
  if(kind==='eventAll'){var e2=getEv(id);return withUndo('Đã xoá “'+(e2?e2.title:'')+'”',function(){S.events=S.events.filter(function(x){return x.id!==id;});});}
  if(kind==='todo')return withUndo('Đã xoá việc',function(){S.todos=S.todos.filter(function(x){return x.id!==id;});});
  if(kind==='habit')return withUndo('Đã xoá thói quen',function(){S.habits=S.habits.filter(function(x){return x.id!==id;});});
  if(kind==='note')return withUndo('Đã xoá ghi chú',function(){S.notes=S.notes.filter(function(x){return x.id!==id;});});
  if(kind==='diary')return withUndo('Đã xoá nhật ký '+dShort(ds),function(){delete S.diary[ds];});
  if(kind==='entry')return withUndo('Đã xoá trang',function(){var b=(S.books||[]).filter(function(x){return x.id===id;})[0];if(b)b.entries=(b.entries||[]).filter(function(x){return x.id!==pid;});S.events=S.events.filter(function(x){return x.src!==id+':'+pid;});});
}
function hit(id,ds){var h=S.habits.filter(function(x){return x.id===id;})[0];if(!h||ds>today)return;h.log=h.log||{};var c=hCount(h,ds);if(c>=hTarget(h))delete h.log[ds];else h.log[ds]=c+1;save();render();
  if(c+1===hTarget(h)){var st=streak(h);toast(h.name+' ✓',st>1?'Chuỗi '+st+' ngày liên tiếp':'Xong hôm nay');}}
function toggleTodo(id){var t=S.todos.filter(function(x){return x.id===id;})[0];if(!t)return;t.hist=t.hist||[];
  if(t.repeat&&t.repeat!=='none'&&!t.done){t.hist.push(today);t.due=nextDue(t.due,t.repeat);}else if(!t.done){t.done=true;t.hist.push(today);}else{t.done=false;}
  save();render();}

document.addEventListener('click',function(ev){
  if(suppress){suppress=false;ev.preventDefault();return;}
  var b=ev.target.closest('[data-act]');if(!b)return;
  var a=b.getAttribute('data-act'),v=b.getAttribute('data-v'),id=b.getAttribute('data-id'),ds=b.getAttribute('data-d'),d=cur&&cur.d;
  switch(a){
  case 'tab':ui.tab=v;ui.book='';saveUi();render();window.scrollTo(0,0);break;
  case 'goto-today':today=ymd(new Date());ui.sel=today;var n=parse(today);ui.y=n.getFullYear();ui.m=n.getMonth();render();break;
  case 'm-prev':ui.m--;if(ui.m<0){ui.m=11;ui.y--;}render();break;
  case 'm-next':ui.m++;if(ui.m>11){ui.m=0;ui.y++;}render();break;
  case 'pick':ui.sel=ds;var pd=parse(ds);if(pd.getMonth()!==ui.m){ui.m=pd.getMonth();ui.y=pd.getFullYear();}render();break;
  case 'hit':hit(id,ds);break;
  case 'toggle-todo':toggleTodo(id);break;
  case 'show-done':ui.showDone=!ui.showDone;render();break;
  case 'ntab':ui.ntab=v;ui.book='';saveUi();render();break;
  case 'open-book':ui.book=v;render();window.scrollTo(0,0);break;
  case 'close-book':ui.book='';render();break;
  case 'edit':openEdit(b.getAttribute('data-k'),id,ds);break;
  case 'settings':openSheet('settings',{});break;
  case 'close':closeSheet();break;
  case 'set':d[b.getAttribute('data-k')]=isNaN(+v)||v===''||b.getAttribute('data-k')==='label'||b.getAttribute('data-k')==='emoji'||b.getAttribute('data-k')==='color'||b.getAttribute('data-k')==='tpl'?v:+v;renderSheet();break;
  case 'sw':var k=b.getAttribute('data-k');
    if(cur.type==='settings'){S.settings[k]=!(S.settings[k]!==false);holCache={};save();render();renderSheet();break;}
    if(k==='hasDue'){d.due=d.due?'':(ui.sel||today);}else{d[k]=!d[k];if(k==='multi'&&d.multi){d.repeat='none';d.allDay=true;if(!d.endDate)d.endDate=addDays(d.start,1);}}
    renderSheet();break;
  case 'wd':var w=+v,i=d.days.indexOf(w);if(i>=0)d.days.splice(i,1);else d.days.push(w);renderSheet();break;
  case 'time-add':d.times=d.times||[];d.times.push(d.times.length?'20:00':'08:00');renderSheet();break;
  case 'time-rm':d.times.splice(+b.getAttribute('data-i'),1);renderSheet();break;
  case 'save-event':saveEvent();break;
  case 'save-todo':var tt=(d.title||'').trim();if(!tt)return fail('Nhập tên việc.');var t={id:d.id||uid(),title:tt,label:d.label,due:d.due||'',time:d.due?(d.time||''):'',repeat:d.due?(d.repeat||'none'):'none',pinned:!!d.pinned,done:!!d.done,hist:d.hist||[],subs:d.subs||[],note:(d.note||'').trim()};upsert(S.todos,t);save();closeSheet();render();break;
  case 'save-habit':var nm=(d.name||'').trim();if(!nm)return fail('Nhập tên thói quen.');if(!d.days.length)return fail('Chọn ít nhất một ngày.');var tms=[];(d.times||[]).forEach(function(x){if(x&&tms.indexOf(x)<0)tms.push(x);});d.name=nm;d.times=tms.sort();upsert(S.habits,d);save();closeSheet();render();break;
  case 'save-note':if(!(d.title||'').trim()&&!(d.body||'').trim()){closeSheet();break;}d.updated=Date.now();upsert(S.notes,d);save();closeSheet();render();break;
  case 'save-diary':if(d.orig&&d.orig!==d.date)delete S.diary[d.orig];S.diary[d.date]={mood:+d.mood||3,text:(d.text||'').trim()};save();closeSheet();render();break;
  case 'del-event':var de=d.id;closeSheet();removeItem('eventAll',de);break;
  case 'skip-occ':var se=d.id,so=d.occ;closeSheet();removeItem('event',se,so);break;
  case 'move-open':var me=getEv(d.id),from=movedTo(me,d.occ)||d.occ,cm=me.moves&&me.moves[from];openSheet('move',{id:d.id,from:from,to:cm?cm.d:d.occ,time:(cm&&cm.t)||me.time||''});break;
  case 'save-move':var mv=getEv(d.id);if(!mv||!d.to)return closeSheet();var dd=d;closeSheet();withUndo('Đã dời sang '+rel(dd.to),function(){mv.moves=mv.moves||{};if(dd.to===dd.from&&(!dd.time||dd.time===mv.time))delete mv.moves[dd.from];else mv.moves[dd.from]={d:dd.to,t:dd.time&&dd.time!==mv.time?dd.time:''};});break;
  case 'del-todo':var dt=d.id;closeSheet();removeItem('todo',dt);break;
  case 'del-habit':var dh=d.id;closeSheet();removeItem('habit',dh);break;
  case 'del-note':var dn=d.id;closeSheet();if(dn)removeItem('note',dn);break;
  case 'del-diary':var dy=d.orig;closeSheet();removeItem('diary',null,dy);break;
  case 'theme':S.settings.theme=v;save();render();renderSheet();break;
  case 'mode':S.settings.mode=v;save();render();renderSheet();break;
  case 'labels':openSheet('labels',{});break;
  case 'label-edit':var L=getLabel(id);openSheet('label',{id:L.id,name:L.name,color:L.color,emoji:lEmoji(L)});break;
  case 'label-new':openSheet('label',{id:'',name:'',color:'sky',emoji:'⭐'});break;
  case 'save-label':var ln=(d.name||'').trim();if(!ln)return fail('Nhập tên nhãn.');if(d.id){var LL=getLabel(d.id);LL.name=ln;LL.color=d.color;LL.emoji=d.emoji;}else labels().push({id:'l'+uid(),name:ln,color:d.color,emoji:d.emoji||guessEmoji(ln)});save();render();openSheet('labels',{});break;
  case 'del-label':var lid=d.id;S.events.forEach(function(x){if(x.label===lid)x.label='';});S.todos.forEach(function(x){if(x.label===lid)x.label='';});S.settings.labels=labels().filter(function(l){return l.id!==lid;});save();render();openSheet('labels',{});break;
  case 'export':doExport();break;
  case 'new-book':openSheet('bookNew',{name:'',tpl:'tennis'});break;
  case 'save-book':var bn=(d.name||'').trim();if(!bn)return fail('Đặt tên cho sổ.');var F={tennis:[{id:'f1',type:'duration',name:'Thời lượng'},{id:'f2',type:'rating',name:'Cảm nhận'},{id:'f3',type:'text',name:'Ghi chú'}],health:[{id:'f1',type:'choice',name:'Loại',opts:['Tiêm vaccine','Tẩy giun','Đi khám']},{id:'f2',type:'number',name:'Cân nặng',unit:'kg'},{id:'f3',type:'nextdate',name:'Hẹn lần tới'},{id:'f4',type:'text',name:'Ghi chú'}],simple:[{id:'f1',type:'text',name:'Ghi chú'}]}[d.tpl||'simple'];
    var nb={id:'b'+uid(),tpl:d.tpl,name:bn,color:'sky',icon:'star',label:'',fields:F,entries:[]};S.books.push(nb);save();closeSheet();ui.book=nb.id;render();break;
  case 'new-entry':openSheet('entry',{bookId:id,date:today,v:{}});break;
  case 'edit-entry':var bb=(S.books||[]).filter(function(x){return x.id===id;})[0],en=bb&&(bb.entries||[]).filter(function(x){return x.id===b.getAttribute('data-pid');})[0];if(en)openSheet('entry',{bookId:id,id:en.id,date:en.date,v:clone(en.v||{})});break;
  case 'fv':d.v[b.getAttribute('data-k')]=+v;renderSheet();break;
  case 'save-entry':saveEntry();break;
  case 'del-entry':var eb=d.bookId,ei=d.id;closeSheet();removeItem('entry',eb,null,ei);break;
  case 'hint':var qa=document.getElementById('qa');qa.value=v;qa.focus();onQa();break;
  }
});
function upsert(arr,o){for(var i=0;i<arr.length;i++){if(arr[i].id===o.id){arr[i]=o;return;}}arr.push(o);}
function saveEvent(){var d=cur.d,title=(d.title||'').trim();if(!title)return fail('Nhập tiêu đề.');if(!d.start)return fail('Chọn ngày.');
  if(d.multi&&d.endDate&&d.endDate<d.start)return fail('Ngày kết thúc phải sau ngày bắt đầu.');
  if(d.repeat==='weekly'&&!d.days.length)return fail('Chọn ít nhất một thứ trong tuần.');
  var old=d.id?getEv(d.id):null;
  var e={id:d.id||uid(),title:title,label:d.label,allDay:!!d.allDay,start:d.start,time:d.allDay?'':(d.time||''),end:d.allDay?'':(d.end||''),repeat:d.multi?'none':d.repeat,days:d.repeat==='weekly'&&!d.multi?d.days.slice().sort():[],until:d.repeat!=='none'?(d.until||''):'',remind:d.remind===''||d.remind==null?null:+d.remind,note:(d.note||'').trim(),endDate:d.multi&&d.endDate>d.start?d.endDate:'',skip:old&&old.skip||[],moves:old&&old.moves||undefined,byear:old&&old.byear||'',bday:old&&old.bday};
  if(!e.allDay&&!e.time)e.allDay=true;
  upsert(S.events,e);save();closeSheet();render();}
function saveEntry(){var d=cur.d,b=(S.books||[]).filter(function(x){return x.id===d.bookId;})[0];if(!b)return closeSheet();
  var e={id:d.id||'e'+uid(),date:d.date||today,v:d.v};b.entries=b.entries||[];upsert(b.entries,e);
  var nf=(b.fields||[]).filter(function(f){return f.type==='nextdate';})[0],src=b.id+':'+e.id;S.events=S.events.filter(function(x){return x.src!==src;});
  if(nf&&d.v[nf.id])S.events.push({id:uid(),src:src,title:b.name,label:(getLabel('meo')||labels()[0]).id,allDay:false,start:d.v[nf.id],time:'09:00',end:'',repeat:'none',days:[],until:'',remind:1440,note:'Tạo từ '+b.name,endDate:'',skip:[]});
  save();closeSheet();render();}

/* inputs */
function onField(e){var el=e.target;if(!cur)return;var d=cur.d;
  if(el.hasAttribute('data-f')){var k=el.getAttribute('data-f');
    if(k.indexOf('fv:')===0){d.v[k.slice(3)]=el.value;return;}
    d[k]=el.value;
    if(k==='emoji'&&cur.type==='label'){var g=Array.from(el.value.trim())[0];if(g&&e.type==='change'){d.emoji=el.value.trim();renderSheet();}return;}
    if(e.type==='change'&&(k==='repeat'||k==='start'))renderSheet();}
  else if(el.hasAttribute('data-ti'))d.times[+el.getAttribute('data-ti')]=el.value;
  else if(el.hasAttribute('data-fv'))d.v[el.getAttribute('data-fv')]=el.value;
}
document.getElementById('panel').addEventListener('input',onField);
document.getElementById('panel').addEventListener('change',function(e){onField(e);if(e.target.id==='f-import')doImport(e.target.files&&e.target.files[0]);});
document.getElementById('sheet').addEventListener('click',function(e){if(e.target.id==='sheet')closeSheet();});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&cur)closeSheet();});

/* quick-add box */
var qa=document.getElementById('qa'),qaGo=document.getElementById('qa-go'),qaPv=document.getElementById('qa-pv');
function onQa(){qa.style.height='auto';qa.style.height=Math.min(qa.scrollHeight,110)+'px';var v=qa.value.trim();qaGo.disabled=!v;
  if(v)qaPv.innerHTML=previewHtml(qa.value);
  else qaPv.innerHTML=document.activeElement===qa?'<div class="hints">'+HINTS.map(function(h){return '<button type="button" data-act="hint" data-v="'+esc(h)+'">'+esc(h)+'</button>';}).join('')+'</div>':'';}
qa.addEventListener('input',onQa);
qa.addEventListener('focus',onQa);
qa.addEventListener('blur',function(){setTimeout(function(){if(document.activeElement!==qa&&!qa.value.trim())qaPv.innerHTML='';},200);});
qa.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();submitQa();}});
document.getElementById('qa-form').addEventListener('submit',function(e){e.preventDefault();submitQa();});
function submitQa(){var v=qa.value.trim();if(!v)return;quickAdd(v);qa.value='';qaPv.innerHTML='';onQa();qa.blur();}

/* swipe to delete */
var suppress=false,sw=null;
document.addEventListener('touchstart',function(e){var r=e.target.closest('[data-swipe]');if(!r){sw=null;return;}var t=e.touches[0];sw={el:r,fg:r.querySelector('.row'),x:t.clientX,y:t.clientY,dx:0,on:false};},{passive:true});
document.addEventListener('touchmove',function(e){if(!sw||!sw.fg)return;var t=e.touches[0],dx=t.clientX-sw.x,dy=t.clientY-sw.y;
  if(!sw.on){if(dx<-12&&Math.abs(dx)>Math.abs(dy)*1.4){sw.on=true;sw.fg.classList.add('drag');sw.el.classList.add('on');}else if(Math.abs(dy)>10||dx>10){sw=null;return;}else return;}
  sw.dx=Math.min(0,dx);sw.fg.style.transform='translateX('+sw.dx+'px)';},{passive:true});
document.addEventListener('touchend',function(){if(!sw)return;var s=sw;sw=null;if(!s.on)return;suppress=true;setTimeout(function(){suppress=false;},350);s.fg.classList.remove('drag');
  if(s.dx<-90){s.fg.style.transform='translateX(-100%)';setTimeout(function(){removeItem(s.el.getAttribute('data-swipe'),s.el.getAttribute('data-id'),s.el.getAttribute('data-d'),s.el.getAttribute('data-pid'));},180);}else{s.fg.style.transform='';setTimeout(function(){s.el.classList.remove('on');},230);}});
/* swipe months */
var mx=null;
document.getElementById('main').addEventListener('touchstart',function(e){mx=ui.tab==='cal'&&e.target.closest('#cal')?e.touches[0].clientX:null;},{passive:true});
document.getElementById('main').addEventListener('touchend',function(e){if(mx==null)return;var dx=e.changedTouches[0].clientX-mx;mx=null;if(Math.abs(dx)<60)return;ui.m+=dx<0?1:-1;if(ui.m<0){ui.m=11;ui.y--;}if(ui.m>11){ui.m=0;ui.y++;}render();},{passive:true});

/* toast */
var toastT=null;
function toast(title,sub2,acts){var host=document.getElementById('toast-host');host.innerHTML='';clearTimeout(toastT);
  var el=document.createElement('div');el.className='toast';el.setAttribute('role','status');
  el.innerHTML='<div class="tb"><b>'+esc(title)+'</b>'+(sub2?'<span>'+esc(sub2)+'</span>':'')+'</div>';
  (acts||[]).forEach(function(a){var bt=document.createElement('button');bt.type='button';bt.textContent=a[0];bt.addEventListener('click',function(ev){ev.stopPropagation();host.innerHTML='';a[1]();});el.appendChild(bt);});
  host.appendChild(el);toastT=setTimeout(function(){host.innerHTML='';},(acts&&acts.length)?6000:3000);}

/* backup */
function doExport(){var name='so-nhac-viec-'+today+'.json',blob=new Blob([JSON.stringify({app:'so-nhac-viec',version:4,exported:new Date().toISOString(),data:S},null,1)],{type:'application/json'});
  try{var f=new File([blob],name,{type:'application/json'});if(navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:name}).catch(function(){});return;}}catch(e){}
  var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},1500);}
function doImport(f){if(!f)return;var rd=new FileReader();rd.onload=function(){try{var j=JSON.parse(rd.result),data=j&&j.data?j.data:j;if(!data||!Array.isArray(data.events))throw 0;S=normalize(data);save();closeSheet();render();toast('Đã khôi phục dữ liệu',f.name);}catch(x){toast('Không đọc được file','File này không phải bản sao lưu của Sổ Nhắc Việc.');}};rd.readAsText(f);}

/* in-app reminders */
var fired={};try{fired=JSON.parse(sessionStorage.getItem('snv-fired')||'{}');}catch(e){}
function tick(){var now=new Date(),nd=ymd(now);if(nd!==today){today=nd;render();}var ms=now.getTime();
  [today,addDays(today,1)].forEach(function(ds){eventsOn(ds).forEach(function(e){if(e.remind==null)return;var at=parse(ds);at.setHours(0,toMin(e.allDay?'08:00':e.time||'08:00'),0,0);var tr=at.getTime()-e.remind*60000,key='e'+e.id+ds;
    if(ms>=tr&&ms<tr+180000&&!fired[key]){fired[key]=1;toast('🔔 '+e.title,(ds===today?'Hôm nay':'Ngày mai')+(e.allDay?'':' lúc '+e.time));}});});
  S.habits.forEach(function(h){if(!hSched(h,today))return;(h.times||[]).forEach(function(tm,i){var at=parse(today);at.setHours(0,toMin(tm),0,0);var key='h'+h.id+today+tm;
    if(ms>=at.getTime()&&ms<at.getTime()+180000&&!fired[key]&&hCount(h,today)<=i){fired[key]=1;toast('🔔 Đến giờ: '+h.name,'Lúc '+tm,[['Đã xong',function(){hit(h.id,today);}]]);}});});
  try{sessionStorage.setItem('snv-fired',JSON.stringify(fired));}catch(e){}}

try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',applyTheme);}catch(e){}
try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist();}catch(e){}
if('serviceWorker' in navigator)window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js',{updateViaCache:'none'}).then(function(r){r.update();}).catch(function(){});});
render();tick();setInterval(tick,20000);
window.__snv={quickAdd:quickAdd,get S(){return S;}};
})();
