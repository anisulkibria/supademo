"use client";

const dropdownButton = document.querySelector(".sup-dropdown-button");
const dropdownMenu = document.querySelector(".sup-dropdown-menu");
const dropdownOverlay = document.querySelector(".sup-dropdown-overlay");

const tagsDropdown = document.querySelector("#pages");


dropdownButton.addEventListener("click", () => {
  if (dropdownMenu.dataset.open === "false") {
    dropdownMenu.dataset.open = "true";
  } else if (dropdownMenu.dataset.open === "true") {
    dropdownMenu.dataset.open = "false";
  }
});

dropdownOverlay.addEventListener("click", () => {
  dropdownMenu.dataset.open = "false";
});

dropdownMenu.addEventListener("click", () => {
  dropdownMenu.dataset.open = "false";
});

const openMobileNav = document.querySelector(".sup-mobile-menu-btn");
const mobileNav = document.querySelector(".sup-mobile-nav");
const mobileNavLinks = document.querySelectorAll(".sup-mobile-nav-link");
const closeMobileNav = document.querySelector(".sup-close-mobile-nav");

openMobileNav.addEventListener("click", () => {
  mobileNav.dataset.open = "true";
});

closeMobileNav.addEventListener("click", () => {
  mobileNav.dataset.open = "false";
});

mobileNavLinks.forEach((mobileNavLink) => {
  mobileNavLink.addEventListener("click", () => {
    mobileNav.dataset.open = "false";
  });
});

const mobileDropdownButton = document.querySelector(
  ".sup-mobile-dropdown-button"
);
const mobileDropdownMenu = document.querySelector(".sup-mobile-dropdown-menu");

mobileDropdownMenu.addEventListener("click", () => {
  mobileDropdownMenu.dataset.open = "false";
});

window.addEventListener("click", (e) => {
  if ([...e.target.classList].includes("sup-mobile-dropdown-button-overlay")) {
    if (mobileDropdownMenu.dataset.open === "false") {
      mobileDropdownMenu.dataset.open = "true";
    } else if (mobileDropdownMenu.dataset.open === "true") {
      mobileDropdownMenu.dataset.open = "false";
    }
  } else if (mobileDropdownMenu.dataset.open === "true") {
    mobileDropdownMenu.dataset.open = "false";
  }
});

tagsDropdown.addEventListener('change', function() {
  window.location.href = this.value;
});

document.addEventListener('DOMContentLoaded', function() {
  //loadMorePosts();
  /** Show the title taline only on homepage */
  const titleTagline = document.getElementById("#title-tagline");
  var blogHome = ['/','https://supademo.com/blog/', 'https://supademo.com/blog','https://www.supademo.com/blog/', 'https://www.supademo.com/blog']; 
  if (blogHome.indexOf(window.location.href) >= 0) {
    titleTagline.style.display = "block";
  }

  var isVal = false;
  for (i = 0; i < tagsDropdown.length; ++i){
    if (tagsDropdown.options[i].value == window.location.pathname){
      isVal = true;
    }
}
  if(isVal){
    tagsDropdown.value = window.location.pathname;
  } else {
    tagsDropdown.value = "/blog/";
  }
}, false);

/** 
* Handle Load More
*/
const handleLoadMore = () => {
  // init
  const loadMoreBtn = document.querySelector('.js-load-posts');
  // show articles number in pagination
  var currPage = GLOBAL.CURRENT_PAGE + 1;
  var postsPerPage = GLOBAL.POSTS_PER_PAGE;
  var totalPages = GLOBAL.MAX_PAGES;
  var totalPosts = GLOBAL.TOTAL_POSTS;
  var showingArticles = currPage * postsPerPage;

  if (loadMoreBtn && GLOBAL.LAST_PAGE) {
    loadMoreBtn.disabled = true;
    loadMoreBtn.classList.add('btn-disabled');
    loadMoreBtn.innerHTML = 'No More Posts';
    showingArticles = totalPosts;
    var currArticles = document.getElementById('currArticles');
        currArticles.innerHTML = showingArticles
  }

  // event
  if (loadMoreBtn) {
    loadMoreBtn.onclick = (event) => {
      loadMorePosts(event.srcElement);
      currPage = GLOBAL.CURRENT_PAGE + 1;
      showingArticles = currPage * postsPerPage;

      if(currPage === totalPages || totalPages < 2){
        showingArticles = totalPosts;
      }
      setTimeout(function() {
        var currArticles = document.getElementById('currArticles');
        currArticles.innerHTML = showingArticles
    }, 1000);
      
    }
  }


}
/** 
* Load more posts
* @param: button
*/ 
const loadMorePosts = (button) => {
  // next link
  const nextPage = document.querySelector('link[rel=next]');
  GLOBAL.NEXT_PAGE_LINK = nextPage && !GLOBAL.NEXT_PAGE_LINK ? nextPage.getAttribute('href') : GLOBAL.NEXT_PAGE_LINK;

  // Update current page value
  if (GLOBAL.NEXT_PAGE_LINK && !GLOBAL.LAST_PAGE) {
    button ? button.classList.add('is-loading') : '';

    // Fetch next page content
    fetch(GLOBAL.NEXT_PAGE_LINK).then(res => res.text())
    .then(text => new DOMParser().parseFromString(text, 'text/html'))
    .then(doc => {
      // Get posts
      const posts = doc.querySelectorAll('.js-post-card');
      const postContainer = document.querySelector('.js-post-list');
      const nextPage = doc.querySelector('link[rel=next]');

      // Add each post to the page
      posts.forEach(post => {
        postContainer.appendChild(post);
      });

      // Update GLOBALS
      GLOBAL.CURRENT_PAGE = GLOBAL.CURRENT_PAGE + 1;
      GLOBAL.NEXT_PAGE_LINK =  nextPage ? nextPage.getAttribute('href') : '';
      GLOBAL.NEXT_PAGE = GLOBAL.NEXT_PAGE_LINK ? GLOBAL.NEXT_PAGE + 1 : NaN;
      GLOBAL.LAST_PAGE = GLOBAL.CURRENT_PAGE === GLOBAL.MAX_PAGES ? true : false;

      // Disable button on last page
      if (button && GLOBAL.LAST_PAGE) {
        button.disabled = true;
        button.classList.add('btn-disabled');
        button.innerHTML = 'No More Posts';
      }

      button ? button.classList.remove('is-loading') : '';
    }).catch(function (err) {
      // There was an error
      console.warn('Something went wrong.', err);
    });
  }
}

/**
 * DOM Loaded event
 */
function handler() {
  //handleLoadMore();
};

// Call the handler on DOM loaded
if (
  document.readyState === 'complete' ||
  (document.readyState !== 'loading' && !document.documentElement.doScroll)
) {
  handler();
} else {
  document.addEventListener('DOMContentLoaded', handler);
}