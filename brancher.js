/**
* Apply navbar style
*/
const applyNavStyleTo = function(element) {
	element.css('position', 'fixed');
	element.css('background-color', 'whitesmoke');
	element.css('top', 0);
	element.css('left', 0);
	element.css('right', 0);
	element.css('width', 'auto');
	element.css('height', 'auto');
	element.css('padding', '10px');
}

/**
* How many resources has been loaded so far
*/
var resourcesLoadedCounter = 0;
const TOTAL_RESOURCES = 2;
/**
* Function to be called when a resource has been loaded
*/
var resourceLoaded = function(){
  resourcesLoadedCounter++;
  if(resourcesLoadedCounter===TOTAL_RESOURCES)
  // all resources loaded, proceed with business logic
    core();
};

/**
* Dinamically try to load a script src
* Will call a specific function depending on the success of the loading
*/
function loadScript(src) {
  return new Promise(function(resolve, reject) {
    let script = document.createElement('script');
    script.src = src;

    script.onload = () => resolve();
    script.onerror = () => reject();

    document.head.append(script);
  });
}

// Try to load jquery from local storage, if it's not available then try online
loadScript('./jquery.min.js').then(
  () => resourceLoaded(),
  () => loadScript('https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js').then(
    () => resourceLoaded(),
    () => console.log('Cannot load jquery')
  )
);

// Notify the resource is loaded
document.addEventListener("DOMContentLoaded", function(event) {
  resourceLoaded();
});


/**
* Business logic
*/
var core = function() {
  /**
  * Fixed navbar
  */
  var hTreeView = $('#h-tree-view');
  
  applyNavStyleTo(hTreeView);

  /**
  * Container for all the h* of the page
  */
  var h_objs = $.makeArray([
    $('h1'),
    $('h2'),
    $('h3'),
    $('h4'),
    $('h5'),
    $('h6')
  ]);

  /**
  * Container for the specific h* choosen to be shown
  */
  var h_obj_selected = [undefined,undefined,undefined,undefined,undefined,undefined];

  $(window).on('scroll', function () {
    /**
    * Coordinate of the first pixel under the navbar (hTreeView)
    */
    let cur_pos = $(this).scrollTop() + hTreeView.outerHeight();

    let i;
    for(i=0; i<6; i++) {
      h_objs[i].each(function() {
        /**
        * Top of the current h*
        */
        var top = $(this).offset().top;
        /**
        * Bottom of the current h*
        */
        var bottom = top + $(this).outerHeight();
        // If we pass the current h* with the navbar AND the current h* is underneath the previous h* (i.e. h^(*-1))
        if (cur_pos >= top && (h_obj_selected[i-1]===undefined || top > h_obj_selected[i-1].offset().top)) {
          // If h^x has changed, invalidate every h^(x+1), h^(x+2), ...
          if(h_obj_selected[i] !== $(this).html()) {
            h_obj_selected[i] = $(this);
            let c;
            for(c=i+1; c<6; c++) {
              h_obj_selected[c] = undefined;
            }
          }
        }
      });
    }

    let result = '';
    for(i=0; i<6; i++) {
      if(h_obj_selected[i] === undefined) {
        break; //reached the leaf
      } else if (i>0) {
        result += ' ▶ ';
      }
      // The first 'replace' deletes html tags, the second removes blanks
      result += '<b>' + h_obj_selected[i].html().trim().replace(/<\/*[a-z]*>/g, '').replace(/\s\s+/g, ' ') + '</b>';
    }

    hTreeView.html(result);
  });
};