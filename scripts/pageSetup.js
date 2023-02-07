'use strict';


// if pages have been defined in the html
if(typeof pages !== 'undefined'){
    // set up navigation
    let navTabs = document.querySelector('#tabs');

    for(let k of Object.keys(pages)){
        let bNode = document.createElement('button');
        bNode.setAttribute('class', 'nav-link');
        bNode.setAttribute('id', k);
        bNode.setAttribute('data-bs-toggle', 'pill');
        bNode.setAttribute('data-bs-target', pages[k]['page']);
        bNode.setAttribute('type', 'button');
        bNode.setAttribute('role', 'tab');
        bNode.setAttribute('aria-controls', 'md-content');
        bNode.setAttribute('aria-selected', 'false');
        bNode.innerHTML = pages[k]['title'];
        navTabs.append(bNode);
    }


    // navigation events
    let md_container = document.querySelector('div#md-content');
    let resources_container = document.querySelector('div#resources')

    let triggerTabList = [].slice.call(document.querySelectorAll('#tabs button'))
    triggerTabList.forEach(function (triggerEl) {
        var tabTrigger = new bootstrap.Tab(triggerEl)

        triggerEl.addEventListener('click', e=>{
            e.preventDefault()
            let target = './pages/'+tabTrigger._config.target
            fetch(target)
                .then(res=>res.text())
                .then(content=>{
                    md_container.innerHTML = marked.parse(content);
                    resources_container.innerHTML = '';
                    hljs.highlightAll();
                    md_container.querySelectorAll('a').forEach(a=>{
                        a.setAttribute('target', '_blank');
                    })
                    if(pages[triggerEl.getAttribute('id')]['resources'].length > 0){
                        pages[triggerEl.getAttribute('id')]['resources'].forEach(r=>{
                            let link = document.createElement('a');
                            link.setAttribute('class', 'btn btn-primary btn-lg m-2 px-5 py-3');
                            link.setAttribute('href', r[1]);
                            link.setAttribute('target', '_blank');
                            link.innerHTML = r[0];
                            resources_container.append(link)
                        })
                    }
                    window.scrollTo(0,0);
                })
            window.location.hash = triggerEl.getAttribute('id')
        })
    })

    // Lookup hash to render correct page
    let hash = window.location.hash;
    if(hash == '') hash = `#${Object.keys(pages)[0]}`;
    document.querySelector(`${hash}`).click();
}

// Include HTML call for headers and footers
function includeHTML() {
    // Loop through a collection of all HTML elements
    let z = document.getElementsByTagName("*");
    for (let el of z) {
      // search for elements with include-html attribute
      let file = el.getAttribute("include-html");
      if (file) {
        fetch(file)
            .then(res=>res.text())
            .then(content=>{
                el.innerHTML = content;
                el.removeAttribute("include-html");
                includeHTML();
            })
        return;
      }
    }
}
includeHTML();