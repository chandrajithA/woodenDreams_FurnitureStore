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


//signin/signout btn fuctionality 
function signinSignout(){
  signinstatus = sessionStorage.getItem("wdissignin") || ""
  if(signinstatus === "signin"){
    signout();
  }else if(signinstatus === ""){
    window.location.href = "signin.html"
  }
}

function signin(username){
  sessionStorage.setItem("wdissignin","signin");
  sessionStorage.setItem("wduserid",username);
  alert("Signed In Successful");
  previouspage()
}

function signout(){
  let signoutconfirm = confirm("Are you Sure you want to Sign out")
  if(signoutconfirm){
    sessionStorage.removeItem("wdissignin");
    sessionStorage.removeItem("wduserid");
    updateloginstatus();
    alert("Signed Out successfully");
  }
}

function previouspage(){
  window.history.back();
}


function updateloginstatus(){
  let signinstatus = sessionStorage.getItem("wdissignin") || "";
  if(signinstatus === "signin"){
      document.getElementById("signInorSignUpbtn").textContent = "Sign Out";
  }else if(signinstatus === ""){
      document.getElementById("signInorSignUpbtn").textContent = "Sign In";
  }
}



async function displaycategories(){
  let displaycategoryarea = document.getElementById("displaycategoryarea");
  displaycategoryarea.innerHTML = ""

  let categories = await getCategoryData();
  
  categories.forEach(singlecategory => {
      displaycategoryarea.innerHTML += 
      `
      <div class="displaysinglecategory" id="${singlecategory.category}">
          <div class="categoryimage">
              <img src="${singlecategory.imagepath}" alt="${singlecategory.category} image">
          </div>
          <div class="categoryname">
              <span>${singlecategory.category}</span>
          </div>
      </div>
      `
  });
}












