/*Menu Btn */
const menuBtn = document.getElementById("menu-btn");
const menu = document.querySelector(".menu");
const menuBars = document.querySelector(".menu-btn i");

menuBtn.addEventListener("click", () => {
  menu.classList.toggle("active");
});


// const searchBtn = document.getElementById("search-btn");
// const inputUrl = document.getElementById("input-url");

// searchBtn.addEventListener("click", async () => {
//   const validateUrl = (url) => {
//     const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#()?&//=]*)/;
//     if (urlRegex.test(url)) return true;
//     return false;
//   };

//   if (!validateUrl(inputUrl.value)) {
//     Swal.fire({
//       title: "Error!",
//       icon: "error",
//       text: "You must enter a valid URL",
//       backdrop: true,
//       allowEscapeKey: false,
//       allowEnterKey: false,
//     });
//   }
// });
   
new ClipboardJS(".fa-copy");
const copyUrlButton = document.getElementById("copy-url-button");
copyUrlButton.addEventListener("click", () => {
  const tooltip = document.querySelector(".tooltip");
  tooltip.classList.add("show");
  setTimeout(() => {
      tooltip.classList.remove("show");
  }, 2000);
});

 

$(document).ready(function(){
  $(window).scroll(function(){
      if(this.scrollY > 20){
          $('.navbar').addClass("sticky");
      }else{
          $('.navbar').removeClass("sticky");
      }
      
  });
})

    
