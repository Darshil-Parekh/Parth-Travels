document.addEventListener('DOMContentLoaded', function(){

  var yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  if(navToggle && navLinks){
    navToggle.addEventListener('click', function(){ navLinks.classList.toggle('open'); });
    navLinks.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ navLinks.classList.remove('open'); });
    });
  }

  var heroLines = document.querySelectorAll('#heroRotator h1');
  if(heroLines.length){
    var heroIdx = 0;
    setInterval(function(){
      heroLines[heroIdx].classList.remove('active');
      heroIdx = (heroIdx + 1) % heroLines.length;
      heroLines[heroIdx].classList.add('active');
    }, 3200);
  }

  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && revealEls.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  var counters = document.querySelectorAll('.counter');
  if('IntersectionObserver' in window && counters.length){
    var counterIO = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var el = entry.target;
          var target = parseInt(el.dataset.target, 10);
          var duration = 1400;
          var start = performance.now();
          function tick(now){
            var progress = Math.min((now - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target).toLocaleString('en-IN');
            if(progress < 1) requestAnimationFrame(tick);
            else el.textContent = target.toLocaleString('en-IN');
          }
          requestAnimationFrame(tick);
          counterIO.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function(el){ counterIO.observe(el); });
  }

  var ownerNumber = getComputedStyle(document.documentElement).getPropertyValue('--owner-whatsapp').trim().replace(/"/g,'');

  var floatWa = document.getElementById('floatWa');
  if(floatWa){
    floatWa.href = 'https://wa.me/' + ownerNumber + '?text=' + encodeURIComponent("Hi, I'd like to enquire about bus/vehicle hire.");
  }

  var toast = document.getElementById('toast');
  function showToast(msg){
    if(!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function(){ toast.classList.remove('show'); }, 3500);
  }

  function formatDateNice(isoDate){
    if(!isoDate) return '';
    var d = new Date(isoDate + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });
  }

  var form = document.getElementById('quoteForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();

      var name = document.getElementById('q_name').value.trim();
      var mobile = document.getElementById('q_mobile').value.trim();
      var vehicle = document.getElementById('q_vehicle').value;
      var members = document.getElementById('q_members').value.trim();
      var destination = document.getElementById('q_destination').value.trim();
      var date = document.getElementById('q_date').value;
      var notesEl = document.getElementById('q_notes');
      var notes = notesEl ? notesEl.value.trim() : '';

      if(!name || !mobile || !vehicle || !destination || !date){
        showToast('Please fill in every required field before sending.');
        return;
      }

      var message =
        'New trip inquiry — Parth Tours & Travels\n\n' +
        'Name: ' + name + '\n' +
        'Vehicle needed: ' + vehicle + '\n' +
        'Number of members: ' + (members || 'Not specified') + '\n' +
        'Destination: ' + destination + '\n' +
        'Travel date: ' + formatDateNice(date) + '\n' +
        'Client mobile: ' + mobile +
        (notes ? ('\nAdditional notes: ' + notes) : '') +
        '\n\n(Sent from the website quote form)';

      var url = 'https://wa.me/' + ownerNumber + '?text=' + encodeURIComponent(message);
      window.open(url, '_blank');
      showToast('Opening WhatsApp with your trip details…');
    });
  }

});
