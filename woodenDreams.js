//to open and close the header navbar menu list
function displayNavbar(){
        document.getElementById("headerNavbar").classList.toggle("visible");   
}


//to close the header navbar menu list when clicked outside the button and navbar
document.addEventListener("click", function(event) {
  const headerNavbar = document.getElementById("headerNavbar");
  const navbarShortIcon = document.getElementById("navbarShortIcon");

  if ( !headerNavbar.contains(event.target) && !navbarShortIcon.contains(event.target) ) {
    headerNavbar.classList.remove("visible");
  }
});


//to get the category data list
async function getCategoryData(){
    let response = await fetch("woodenDreamsCategory.json");
    let categoryData = await response.json();
    return categoryData;
} 


function setImageSize() {
    const image = document.getElementById("indesPagedisplayPoster");
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (width > height) {
        image.style.height = "80vh";
    } else {
        image.style.height = "40vh";
    }
}