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


//to get the category data list
async function getProductData(){
  let response = await fetch("woodenDreamsProducts.json");
  let productsData = await response.json();
  return productsData;
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
    window.location.reload();
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




async function displayproducts(category, element, division){
  
  element.innerHTML = ""
  let products = {}
    if(category === ""){
      productlist = await getProductData();
      products = productlist.filter(product=> product.division === division)
    }else if(category){
      let productlist = await getProductData();
      products = productlist.filter(product=> product.category === category || product.division === division)
    }
    
    products.forEach(singleproduct => {
        const productElement = createSingleProductElement(singleproduct);
        element.appendChild(productElement);
        
    });
}





function createSingleProductElement(singleproduct) {
  // Create main container
  const container = document.createElement('div');
  container.className = 'displaysingleproduct';
  container.id = `singleproduct${singleproduct.productid}`;

  container.addEventListener("mouseenter",()=>{
    let AddToCartArea = createAddToCartArea(singleproduct);
    container.prepend(AddToCartArea);
  })

  container.addEventListener("mouseleave", () => {
  const existing = container.querySelector('.addtocartarea');
  if (existing) {
    existing.remove();
  }
});

  // Product image wrapper
  const imageDiv = document.createElement('div');
  imageDiv.className = 'productimage';

  const img = document.createElement('img');
  img.src = singleproduct.imagepath;
  img.alt = `${singleproduct.name} image`;

  imageDiv.appendChild(img);
  container.appendChild(imageDiv);

  // Product details wrapper
  const detailsDiv = document.createElement('div');
  detailsDiv.className = 'productdetails';

  // Name
  const nameDiv = document.createElement('div');
  nameDiv.className = 'productname';
  const nameSpan = document.createElement('span');
  nameSpan.textContent = singleproduct.name;
  nameDiv.appendChild(nameSpan);
  detailsDiv.appendChild(nameDiv);

  // Description
  const descDiv = document.createElement('div');
  descDiv.className = 'productdesc';
  const descSpan = document.createElement('span');
  descSpan.textContent = singleproduct.shortdesc;
  descDiv.appendChild(descSpan);
  detailsDiv.appendChild(descDiv);

  // Price area
  const priceArea = document.createElement('div');
  priceArea.className = 'productpricearea';

  const priceSpan = document.createElement('span');
  priceSpan.className = 'productprice';
  priceSpan.textContent = `Rs ${singleproduct.price}`;

  const highPriceSpan = document.createElement('span');
  highPriceSpan.className = 'producthighprice';
  if(singleproduct.highprice === ""){
    highPriceSpan.textContent = "14000"
    highPriceSpan.style.visibility= "hidden";
  }else{
    highPriceSpan.textContent = `Rs ${singleproduct.highprice}`;
  }
  

  priceArea.appendChild(priceSpan);
  priceArea.appendChild(highPriceSpan);
  detailsDiv.appendChild(priceArea);

  container.appendChild(detailsDiv);

  return container;
}


function createAddToCartArea(singleproduct) {
  // Outer container
  const addToCartArea = document.createElement('div');
  addToCartArea.className = 'addtocartarea';

  // Add to cart button container
  const cartButtonWrapper = document.createElement('div');

  const cartButton = document.createElement('button');
  cartButton.className = 'addtocartbtn';
  cartButton.id = 'addtocartbtn';
  cartButton.textContent = 'Add to cart';

  cartButton.onclick = () => toggleaddtocart(cartButton,singleproduct);

  cartButtonWrapper.appendChild(cartButton);
  addToCartArea.appendChild(cartButtonWrapper);

   let productsincart = JSON.parse(localStorage.getItem("wdcartitems")) || [];
    productsincart.forEach(cartitem => {
        if(singleproduct.productid === cartitem.productid){
            cartButton.classList.toggle("active");
            cartButton.textContent = 'Product Added';
        }
    });

  // Function button area
  const functionBtnArea = document.createElement('div');
  functionBtnArea.className = 'addtocartareafunctionbtn';

  // Share button
  const shareBtn = document.createElement('div');
  shareBtn.className = 'sharebtnarea';
  shareBtn.id = 'sharebtnarea';

  const shareImg = document.createElement('img');
  shareImg.src = 'image/share_icon.png';
  shareImg.alt = '';

  const shareText = document.createElement('span');
  shareText.textContent = 'Share';

  shareBtn.appendChild(shareImg);
  shareBtn.appendChild(shareText);
  functionBtnArea.appendChild(shareBtn);

  // Quick View button
  const quickViewBtn = document.createElement('div');
  quickViewBtn.className = 'quickviewbtnarea';

  const quickViewImg = document.createElement('img');
  quickViewImg.src = 'image/quickview_icon.png';
  quickViewImg.alt = '';

  const quickViewText = document.createElement('span');
  quickViewText.textContent = 'Quick View';

  quickViewBtn.onclick = () => displayproductdetails(singleproduct);

  quickViewBtn.appendChild(quickViewImg);
  quickViewBtn.appendChild(quickViewText);
  functionBtnArea.appendChild(quickViewBtn);


  // Wishlist button
  const wishlistBtn = document.createElement('div');
  wishlistBtn.className = 'wishlistbtnarea';

  const wishlistImg = document.createElement('img');
  wishlistImg.src = 'image/emptyheart_icon.png';
  wishlistImg.alt = '';

  wishlistBtn.onclick = () => toggleWishlist(wishlistImg,singleproduct);

 

  const wishlistText = document.createElement('span');
  wishlistText.textContent = 'Like';

  wishlistBtn.appendChild(wishlistImg);
  wishlistBtn.appendChild(wishlistText);
  functionBtnArea.appendChild(wishlistBtn);

   let wdwishlistitem = JSON.parse(localStorage.getItem("wdwishlistitems")) || [];
  wdwishlistitem.forEach(wishitem => {
      if(singleproduct.productid === wishitem.productid){
          wishlistImg.classList.toggle("active");
          wishlistImg.src = 'image/redheart_icon.png';
      }
  });

  // Append function buttons to main area
  addToCartArea.appendChild(functionBtnArea);

  return addToCartArea;
}



function toggleWishlist(element,item) {

  signinstatus = sessionStorage.getItem("wdissignin") || ""
  if(signinstatus === "signin"){
    element.classList.toggle("active");
    if(element.classList.contains("active")){
        element.src = 'image/redheart_icon.png';
        addtowishlist(item);

    }else{
        element.src = 'image/emptyheart_icon.png';
        let wishlistItems = JSON.parse(localStorage.getItem("wdwishlistitems"));
        wishlistItems.forEach((items,index) =>{
            if(items.productid === item.productid){
                wishlistItems.splice(index,1);
                localStorage.setItem("wdwishlistitems",JSON.stringify(wishlistItems));
                updatewishlistcount();
            }
        })
    }
  }else if(signinstatus === ""){
    alert("Sign In to add products to wishlist")
    window.location.href = "signin.html"
  }

    

}


function addtowishlist(item){
  let productsinwishlist = JSON.parse(localStorage.getItem("wdwishlistitems")) || [];
      if(!productsinwishlist.find(items => items.productid === item.productid)){
              productsinwishlist.push(item);
            localStorage.setItem("wdwishlistitems",JSON.stringify(productsinwishlist));
          updatewishlistcount();
      }
}


function displayproductdetails(singleproduct){
  window.location.href = "productdetails.html"
  console.log(singleproduct);
  
}


function toggleaddtocart(element,item) {

  signinstatus = sessionStorage.getItem("wdissignin") || ""
  if(signinstatus === "signin"){
    element.classList.toggle("active");
    if(element.classList.contains("active")){
        element.textContent = 'Product Added';
        addtocart(item);

    }else{
        element.textContent = 'Add to cart';
        let productsincart = JSON.parse(localStorage.getItem("wdcartitems"));
        productsincart.forEach((items,index) =>{
            if(items.productid === item.productid){
                productsincart.splice(index,1);
                localStorage.setItem("wdcartitems",JSON.stringify(productsincart));
                updatecartcount();
            }
        })
    }
  }else if(signinstatus === ""){
    alert("Sign In to add products to cart")
    window.location.href = "signin.html"
  }

}

function addtocart(item){
  let productsincart = JSON.parse(localStorage.getItem("wdcartitems")) || [];
              
      item.purchasecount = 1;
      productsincart.push(item);
      localStorage.setItem("wdcartitems",JSON.stringify(productsincart));
      updatecartcount();
      // window.location.reload();
}


function updatecartcount(){
  signinstatus = sessionStorage.getItem("wdissignin") || ""
  if(signinstatus === "signin"){
      let productsincart = JSON.parse(localStorage.getItem("wdcartitems")) || [];
      const cartitemcount = document.getElementById("cartitemcount");  
      let totalcartcount = 0;
      productsincart.forEach(item =>{
          totalcartcount += item.purchasecount;
      })
      cartitemcount.innerText = `(${totalcartcount})` ;
  }
}


function updatewishlistcount(){
  signinstatus = sessionStorage.getItem("wdissignin") || ""
  if(signinstatus === "signin"){
    let productsinwishlist = JSON.parse(localStorage.getItem("wdwishlistitems")) || [];
    const wishitemcount = document.getElementById("wishitemcount");  
    wishitemcount.innerText =  `(${productsinwishlist.length})`;
  }
}










