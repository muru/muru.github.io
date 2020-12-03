(
 function(m) {
   var currentButton = 'en';
   var swapClass = function (classList, del, add) {
   }
   m.SwitchTo = function (id) {
    if (id == currentButton) {
      return;
    }
    var next_el = document.getElementById(id);
    var curr_el = document.getElementById(currentButton);
    next_el.className = 'active';
    curr_el.className = 'inactive';
    to_hide = document.getElementsByClassName(currentButton);
    to_show = document.getElementsByClassName(id);
      Array.prototype.forEach.call(to_hide, function(elem){
      elem.classList.remove('active');
      elem.classList.add('inactive');
    });
    Array.prototype.forEach.call(to_show, function(elem){
      elem.classList.remove('inactive');
      elem.classList.add('active');
    });

    currentButton = id;
   };
   window.onload = function () {
    document.getElementById('i18n').childNodes.forEach(
      function(elem) {
        if (elem.tagName == "LI") {
          console.log(elem.id);
          elem.onclick = function() {
            m.SwitchTo(elem.id);
          };
        }
      }
     );
   };
 }(window.M = window.M || {})
);
