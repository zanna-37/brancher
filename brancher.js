/**
* CSS
*/
const css_content =`
#brancher-view-placeholder {
    position: fixed;
    background-color: whitesmoke;
    top: 0;
    left: 0;
    right: 0;
    width: auto;
    height: auto;
    padding: 10px;
}
`;

/**
* Extract the text in a html string removing all the tags and the excessive blanks.
*/
const extractOnelineText = function(html_content) {
    // trim spaces
    html_content.trim();
    // deletes html tags
    html_content = html_content.replace(/<\/*.+\/*>/g, '')
    // removes excessive blanks
    html_content = html_content.replace(/\s\s+/g, ' ');
    // removes tabs
    html_content = html_content.replace(/\t+/g, ' ');

    return html_content;
}

/**
* On DOM ready do Business logic
*/
document.addEventListener('DOMContentLoaded', function() {

    /**
    * Add CSS
    */
    let css = document.createElement('style');
    css.innerHTML=css_content;
    document.body.appendChild(css);

    /**
    * Fixed navbar
    */
    let brancherView = document.createElement('nav');
    brancherView.id = "brancher-view-placeholder";
    document.body.appendChild(brancherView);

    // link the offsetHeight of the nav bar to the paddingTop of the body
    const resizeObserver = new ResizeObserver(entries => {
            document.body.style.paddingTop = entries[0].target.offsetHeight + "px";
        }
    )
    resizeObserver.observe(brancherView);


    /**
    * Container for all the <h*> of the page
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
        * Coordinate of the first pixel under the navbar (brancherView)
        */
        let cur_pos = window.scrollY + brancherView.offsetHeight;

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

        // create id as anchors if not already present
        for(i=0; i<6; i++) {
            if(h_obj_selected[i] === undefined) {
                break; //reached the leaf
            }

            if(h_obj_selected[i].id == ""){
                let random_string = "autogen-id-" + (Math.random() + 1).toString(36).substring(2);
                h_obj_selected[i].id = random_string;
            }
        }

        let result = '';
        for(i=0; i<6; i++) {
            if(h_obj_selected[i] === undefined) {
                break; //reached the leaf
            }

            // Add delimiter
            if (i>0) {
                result += '<span> » </span>'; // otherwise use ▶
            }

            // Add label
            let label_content = extractOnelineText(h_obj_selected[i].innerHTML);
            console.assert(h_obj_selected[i].id !== "", "Found undefined id! This should never happen!")
            result += '<a href="#' + h_obj_selected[i].id + '">' + label_content + '</a>';
        }

        brancherView.innerHTML = '<b>' + result; + '</b>'
    });
});
