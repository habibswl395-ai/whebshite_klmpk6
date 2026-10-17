const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
let cur='auth';
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('on'),1800)}
function go(id){
  $$('.screen').forEach(s=>s.classList.remove('on'));$('#'+id).classList.add('on');$('#'+id).scrollTop=0;cur=id;
  const showNav=id!=='auth';$('#nav').classList.toggle('on',showNav);
  const map={home:'home',camp:'camp',tektok:'camp',store:'home',explore:'explore',track:'explore',profil:'profil'};
  $$('#nav button[data-s]').forEach(b=>b.classList.toggle('on',b.dataset.s===map[id]));
  if(id==='track'){compass();myLocation()}
  initMap(id);
}
/* AUTH */
function authTab(t){const i=t==='in';$('#f-in').style.display=i?'block':'none';$('#f-up').style.display=i?'none':'block';
  $('#t-in').classList.toggle('on',i);$('#t-up').classList.toggle('on',!i);
  $('#swt').textContent=i?"Don't have an account?":"Already have an account?";$('#swb').textContent=i?'Sign up':'Sign in';$('#swb').onclick=()=>authTab(i?'up':'in')}
const ok=e=>/^\S+@\S+\.\S+$/.test(e);
function login(){const e=$('#e1').value.trim(),p=$('#p1').value;
  if(!ok(e))return $('#err1').textContent='Masukkan email yang valid.';
  if(p.length<6)return $('#err1').textContent='Password minimal 6 karakter.';
  const u=JSON.parse(localStorage.getItem('lw_user')||'null');
  if(u&&u.e===e&&u.p!==p)return $('#err1').textContent='Password salah.';
  $('#err1').textContent='';enter()}
function signup(){const n=$('#n2').value.trim(),e=$('#e2').value.trim(),p=$('#p2').value;
  if(!n)return $('#err2').textContent='Isi nama lengkap.';
  if(!ok(e))return $('#err2').textContent='Masukkan email yang valid.';
  if(p.length<6)return $('#err2').textContent='Password minimal 6 karakter.';
  try{localStorage.setItem('lw_user',JSON.stringify({n,e,p}))}catch(x){}
  $('#err2').textContent='';toast('Akun berhasil dibuat');enter()}
function enter(){go('home')}
function logout(){go('auth')}

/* GOOGLE MAPS (embed tanpa API key) */
const gmEmbed=(q,z=13)=>`https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=${z}&output=embed`;
const gmLink=q=>`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const DEFAULT_PLACE='Dataran Tinggi Dieng, Wonosobo';
const loaded={};
function showMap(frame,link,q,z){$(frame).src=gmEmbed(q,z);$(link).href=gmLink(q)}
function expSearch(q){
  q=q||$('#expQ').value.trim()||'jalur pendakian Indonesia';
  if(q!==$('#expQ').value)$('#expQ').value=q;
  showMap('#expMap','#expLink',q,12);
}
function myLocation(){
  const fb=()=>showMap('#trkMap','#trkLink',DEFAULT_PLACE,14);
  if(!navigator.geolocation)return fb();
  navigator.geolocation.getCurrentPosition(
    p=>showMap('#trkMap','#trkLink',p.coords.latitude+','+p.coords.longitude,16),
    ()=>{fb();toast('Izin lokasi ditolak / butuh HTTPS atau localhost')},
    {enableHighAccuracy:true,timeout:8000});
}
function initMap(id){
  if(loaded[id])return;
  if(id==='home'){showMap('#homeMap','#homeLink',DEFAULT_PLACE,12);loaded[id]=1}
  if(id==='explore'){expSearch('jalur hiking gunung');loaded[id]=1}
}
/* KOMPAS */
function compass(){const a=178,r=$('#rose');r.style.transform=`rotate(${(180-a)}deg)`;r.style.transform='rotate(0)'}
/* TRACKING */
let tm=null,sec=0,km=0;
const pad=n=>String(n).padStart(2,'0');
function trk(){const b=$('#goBtn');
  if(tm){clearInterval(tm);tm=null;b.textContent='Mulai Pelacakan';b.classList.remove('stop');$('#rdy').textContent='Pelacakan selesai';$('#rdy2').textContent=km.toFixed(2)+' km dalam '+$('#dur').textContent;return}
  sec=0;km=0;b.textContent='Hentikan Pelacakan';b.classList.add('stop');$('#rdy').textContent='Sedang Melacak';$('#rdy2').textContent='Rekaman perjalanan berjalan';
  tm=setInterval(()=>{sec++;km+=0.0014+Math.random()*0.0006;
    $('#dur').textContent=pad(Math.floor(sec/3600))+':'+pad(Math.floor(sec%3600/60))+':'+pad(sec%60);
    $('#dist').textContent=km.toFixed(2);$('#spd').textContent=(km/(sec/3600)).toFixed(1)+' km/j';
    const p=(sec/60)/km;$('#pace').textContent=isFinite(p)?p.toFixed(2).replace('.',','):'0,00';
    const h=Math.round((9+sec*3)%360);$('#hd').textContent=h},1000)}
function seg(b){$$('.seg button').forEach(x=>x.classList.remove('on'));b.classList.add('on')}
/* TRIP */
const trips=[['Open Trip Gunung Rinjani','Pulau Lombok','Rp 2.000.000','4.8','2H1M','/lelewengan-adv/images/gambar15.png'],['Open Trip Gunung Gede','Jawa Barat','Rp 500.000','4.8','2H1M','/lelewengan-adv/images/gambar16.png'],['Open Trip Gunung Papandayan','Jawa Barat','Rp 450.000','4.7','1H2M','/lelewengan-adv/images/gambar17.png'],['Open Trip Gunung Prau','Jawa Tengah','Rp 400.000','4.9','2H0M','/lelewengan-adv/images/gambar18.png']];
const card=t=>`<div class="tcard"><div class="timg"><img src="${t[5]}" alt="${t[0]}" onerror="this.style.display='none'"></div><div class="tinfo"><b>${t[0]}</b><small>📍 ${t[1]}</small><div><i>${t[2]}</i><span>⭐ ${t[3]} &nbsp;◷ ${t[4]}</span></div></div></div>`;
$$('.list').forEach(l=>l.innerHTML=trips.map(card).join(''));
function flt(i){const q=i.value.toLowerCase(),l=i.closest('.screen').querySelector('.list');l.innerHTML=trips.filter(t=>t[0].toLowerCase().includes(q)||t[1].toLowerCase().includes(q)).map(card).join('')||'<p style="padding:20px;color:#888">Destinasi tidak ditemukan.</p>'}
$$('.tcard').forEach(c=>c.onclick=()=>toast('Detail trip segera hadir'));
/* STORE */
    const P=[['#7b1f1f','OVERSIZED','No Void Minds MARVEL Edition The Comic...','Rp145.112','Rp220.000','-34%','4.9 | 879 sold'],['#e9dcc4','THE FOREST','Kaos Tshirt Atasan Distro Pria Wanita Terbaru ...','Rp48.000','Rp100.000','-52%','4.8 | 2.7K sold'],['#a62323','T-SHIRT','No Void Minds CARS Edition Jackson Stor...','Rp136.312','Rp210.000','-35%','4.8 | 1.2K sold'],['#2c9ac4','T-SHIRT','No Void Minds TOY STORY Edition Woody...','Rp130.900','Rp185.000','-29%','4.7 | 640 sold']];
    $('#prods').innerHTML=P.map((p,i)=>`<div class="pr"><div class="pi" style="background:${p[0]}"><i>${p[5]}</i><img src="/lelewengan-adv/images/gambar${i+11}.png" alt="" onerror="this.style.display='none'"></div><p>${p[12]}</p><div class="pc">${p[13]} <s>${p[14]}</s></div><div class="sd">⭐ ${p[6]}<br><u>🚚 Free shipping</u></div></div>`).join('');
