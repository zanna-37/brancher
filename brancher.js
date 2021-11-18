/**
* CSS
*/
const css_content =`
body {
    margin: 0 !important; /* override user-agent default */
    display: flex !important;
    flex-direction: column !important;
    height: 100vh !important;
}

#brancher-navbar-placeholder {
    display: block !important;
    background-color: whitesmoke;
    width: auto;
    height: auto;
    padding: 8px;
}

#div_body {
    flex-grow: 1;
    padding: 8px; /* restore user-agent default */
    overflow-y: auto;
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
    // Place body content inside div_body
    let div_body = document.createElement('div');
    div_body.id = "div_body";
    div_body.innerHTML = document.body.innerHTML;
    document.body.innerHTML="";

    // Add fixed navbar
    let brancher_navbar = document.createElement('nav');
    brancher_navbar.id = "brancher-navbar-placeholder";
    document.body.appendChild(brancher_navbar);

    // Restore body content
    document.body.appendChild(div_body);

    // Add CSS
    let css = document.createElement('style');
    css.innerHTML=css_content;
    document.body.appendChild(css);


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

    div_body.addEventListener('scroll', function() {
        /**
        * Container for the specific h* choosen to be shown so far
        */
        let h_obj_selected = [undefined,undefined,undefined,undefined,undefined,undefined];

        let i;
        for(i=0; i<6; i++) {
            for (const element of h_objs[i]) {

                let nav_height = brancher_navbar.getBoundingClientRect().height;

                /**
                * Distance between the bottom of brancher_navbar and the top of the current h*
                */
                let top = element.getBoundingClientRect().top - nav_height;

                /**
                * Distance between the bottom of brancher_navbar and the top of the current h(*-1)
                */
                let top_previous;
                if(h_obj_selected[i-1]!==undefined) {
                    top_previous = h_obj_selected[i-1].getBoundingClientRect().top - nav_height;
                }

                // If we pass the current h* with the navbar AND the current h* is underneath the previous h* (i.e. h(*-1))
                if ( top<=0 && (h_obj_selected[i-1]===undefined || top > top_previous )) {
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

        brancher_navbar.innerHTML = '<b>' + result; + '</b>'
    });
});
