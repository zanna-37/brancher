/**
* Apply navbar style
*/
const applyNavStyleTo = function(element) {
	element.style.position = 'fixed';
	element.style.backgroundColor = 'whitesmoke';
	element.style.top = 0;
	element.style.left = 0;
	element.style.right = 0;
	element.style.width = 'auto';
	element.style.height = 'auto';
	element.style.padding = '10px';
}

/**
* On DOM ready do Business logic
*/
document.addEventListener('DOMContentLoaded', function() {
  /**
  * Fixed navbar
  */
  let hTreeView = document.getElementById('h-tree-view');

  applyNavStyleTo(hTreeView);

  /**
  * Container for all the h* of the page
  */
  let h_objs = [
    document.getElementsByTagName('h1'),
    document.getElementsByTagName('h2'),
    document.getElementsByTagName('h3'),
    document.getElementsByTagName('h4'),
    document.getElementsByTagName('h5'),
    document.getElementsByTagName('h6')
  ];

  window.addEventListener('scroll', function() {
    /**
    * Coordinate of the first pixel under the navbar (hTreeView)
    */
    let cur_pos = window.scrollY + hTreeView.offsetHeight;

    /**
    * Container for the specific h* choosen to be shown so far
    */
    let h_obj_selected = [undefined,undefined,undefined,undefined,undefined,undefined];

    let i;
    for(i=0; i<6; i++) {
      for (const element of h_objs[i]) {
        /**
        * Top of the current h*
        */
        let top = element.offsetTop;
        /**
        * Bottom of the current h*
        */
        let bottom = top + element.offsetHeight;
        // If we pass the current h* with the navbar AND the current h* is underneath the previous h* (i.e. h^(*-1))
        if (cur_pos >= top && (h_obj_selected[i-1]===undefined || top > h_obj_selected[i-1].offsetTop)) {
          h_obj_selected[i] = element;
        }
      }
    }

    let result = '';
    for(i=0; i<6; i++) {
      if(h_obj_selected[i] === undefined) {
        break; //reached the leaf
      } else if (i>0) {
        result += ' ▶ ';
      }
      // The first 'replace' deletes p and br html tags, the second removes blanks
      result += '<b>' + h_obj_selected[i].innerHTML.trim().replace(/<\/*(p|br)>/g, '').replace(/\s\s+/g, ' ') + '</b>';
    }

    hTreeView.innerHTML = result;
  });
});