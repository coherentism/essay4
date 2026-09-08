/* =====================================================================
   THE LIVING ARCHIVE — ENGINE
   You never need to edit this file. It finds features by their CSS
   class and wires them up automatically. Copy a block in index.html,
   fill it in, and it just works.
===================================================================== */

/* ---------- theme ---------- */
function toggleTheme(){
  var h=document.documentElement;
  h.setAttribute('data-theme', h.getAttribute('data-theme')==='dark'?'light':'dark');
}

/* ---------- altitude (Skim / Read / Study) ---------- */
function positionThumb(){
  var seg=document.getElementById('altitude'); if(!seg)return;
  var on=seg.querySelector('button.on'), thumb=document.getElementById('thumb');
  if(!on||!thumb)return;
  thumb.style.left=on.offsetLeft+'px'; thumb.style.width=on.offsetWidth+'px';
}
function setAltitude(a){
  var app=document.getElementById('app'); if(app)app.setAttribute('data-altitude',a);
  document.querySelectorAll('#altitude button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-alt')===a)});
  positionThumb();
}

/* ---------- tabbed content blocks ---------- */
function initTabs(){
  document.querySelectorAll('.tabblock').forEach(function(block){
    var btns=block.querySelectorAll('.tabbtn');
    var panes=block.querySelectorAll('.tabpane');
    btns.forEach(function(btn,i){
      btn.addEventListener('click',function(){
        btns.forEach(function(b,j){b.classList.toggle('on',j===i)});
        panes.forEach(function(p,j){p.classList.toggle('on',j===i)});
      });
    });
  });
}

/* ---------- claim inspector ---------- */
function initClaims(){
  document.querySelectorAll('.claim').forEach(function(el){
    var id=el.getAttribute('data-claim');
    var detail=document.querySelector('.claim-detail[data-for="'+id+'"]');
    if(!detail) return;                 /* no detail → leaves text as-is */
    el.setAttribute('data-echo', el.textContent.trim());
    var mk=document.createElement('span'); mk.className='mk'; mk.textContent='+';
    el.appendChild(mk);
    el.addEventListener('click',function(){ openClaim(id); });
  });
}
function openClaim(id){
  var detail=document.querySelector('.claim-detail[data-for="'+id+'"]'); if(!detail)return;
  var claimEl=document.querySelector('.claim[data-claim="'+id+'"]');
  document.querySelectorAll('.claim').forEach(function(c){c.classList.toggle('active',c.getAttribute('data-claim')===id)});
  document.getElementById('claimEcho').textContent='“'+(claimEl?claimEl.getAttribute('data-echo'):'')+'”';

  var axes=document.getElementById('claimAxes'), body=document.getElementById('claimPanes');
  axes.innerHTML=''; body.innerHTML='';
  var blocks=detail.querySelectorAll('.axis-block');
  blocks.forEach(function(b,i){
    var name=b.getAttribute('data-axis')||('Detail '+(i+1));
    var tab=document.createElement('button');
    tab.className='axis'+(i===0?' on':''); tab.textContent=name;
    tab.addEventListener('click',function(){
      axes.querySelectorAll('.axis').forEach(function(a,j){a.classList.toggle('on',j===i)});
      body.querySelectorAll('.claim-pane').forEach(function(p,j){p.classList.toggle('on',j===i)});
    });
    axes.appendChild(tab);
    var pane=document.createElement('div');
    pane.className='claim-pane'+(i===0?' on':''); pane.innerHTML=b.innerHTML;
    body.appendChild(pane);
  });
  document.getElementById('inspector').classList.add('on');
  document.getElementById('inspector').setAttribute('aria-hidden','false');
  document.getElementById('scrim').classList.add('on');
  history.replaceState(null,'','#claim-'+id);
}
function closeInspector(){
  document.getElementById('inspector').classList.remove('on');
  document.getElementById('inspector').setAttribute('aria-hidden','true');
  document.getElementById('scrim').classList.remove('on');
  document.querySelectorAll('.claim').forEach(function(c){c.classList.remove('active')});
  history.replaceState(null,'',location.pathname);
}
function copyLink(){ toast('Link copied'); }

/* ---------- image gallery lightbox ---------- */
var _gal=[], _idx=0;
function initGalleries(){
  document.querySelectorAll('.gallery').forEach(function(g){
    g.querySelectorAll('figure').forEach(function(fig,i){
      var img=fig.querySelector('img'); if(!img)return;
      img.addEventListener('click',function(){ openLightbox(g,i); });
    });
  });
}
function openLightbox(g,i){
  _gal=[].slice.call(g.querySelectorAll('figure')).map(function(f){
    var img=f.querySelector('img'), cap=f.querySelector('figcaption');
    return {src:img.getAttribute('src'), cap:cap?cap.textContent:''};
  });
  _idx=i; showLb(); document.getElementById('lightbox').classList.add('on');
}
function showLb(){
  var it=_gal[_idx];
  document.getElementById('lbImg').src=it.src;
  document.getElementById('lbCap').textContent=it.cap;
  document.getElementById('lbCount').textContent=(_idx+1)+' / '+_gal.length;
}
function lbNext(){ _idx=(_idx+1)%_gal.length; showLb(); }
function lbPrev(){ _idx=(_idx-1+_gal.length)%_gal.length; showLb(); }
function closeLb(){ document.getElementById('lightbox').classList.remove('on'); }

/* ---------- pdf modal ---------- */
function initPdf(){
  document.querySelectorAll('.pdf-enlarge').forEach(function(btn){
    btn.addEventListener('click',function(){
      var src=btn.getAttribute('data-src');
      document.getElementById('pdfFrame').src=src;
      document.getElementById('pdfDownload').href=src;
      document.getElementById('pdfModal').classList.add('on');
    });
  });
}
function closePdf(){
  document.getElementById('pdfModal').classList.remove('on');
  document.getElementById('pdfFrame').src='';
}

/* ---------- toast ---------- */
var _t;
function toast(msg){
  var el=document.getElementById('toast'); el.textContent=msg; el.classList.add('on');
  clearTimeout(_t); _t=setTimeout(function(){el.classList.remove('on')},1600);
}

/* ---------- keyboard + swipe ---------- */
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){ closeLb(); closePdf(); closeInspector(); }
  if(document.getElementById('lightbox').classList.contains('on')){
    if(e.key==='ArrowRight')lbNext(); if(e.key==='ArrowLeft')lbPrev();
  }
});
(function(){
  var sx=0;
  var lb=document.getElementById('lightbox');
  if(!lb)return;
  lb.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
  lb.addEventListener('touchend',function(e){
    var dx=e.changedTouches[0].clientX-sx;
    if(Math.abs(dx)>50){ dx<0?lbNext():lbPrev(); }
  },{passive:true});
})();

/* ---------- init ---------- */
initTabs(); initClaims(); initGalleries(); initPdf(); positionThumb();
window.addEventListener('resize',positionThumb);
