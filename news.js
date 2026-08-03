/*=========================================
        UNIVERSITY UPDATES JS
=========================================*/

document.addEventListener("DOMContentLoaded", () => {

const filterButtons = document.querySelectorAll(".filters button");
const cards = document.querySelectorAll(".update-card");
const searchInput = document.querySelector(".search-box input");

/*=========================================
        FILTER BUTTONS
=========================================*/

filterButtons.forEach(button=>{

button.addEventListener("click",()=>{

filterButtons.forEach(btn=>btn.classList.remove("active"));

button.classList.add("active");

const value = button.innerText.toLowerCase();

cards.forEach(card=>{

const category =
card.querySelector(".content span")
.innerText
.toLowerCase();

if(value==="all"){

card.style.display="flex";

}
else{

if(category.includes(value)){

card.style.display="flex";

}else{

card.style.display="none";

}

}

});

});

});

/*=========================================
        LIVE SEARCH
=========================================*/

searchInput.addEventListener("keyup",()=>{

const search = searchInput.value.toLowerCase();

cards.forEach(card=>{

const title =
card.querySelector("h3")
.innerText
.toLowerCase();

const desc =
card.querySelector("p")
.innerText
.toLowerCase();

if(

title.includes(search) ||
desc.includes(search)

){

card.style.display="flex";

}else{

card.style.display="none";

}

});

});

/*=========================================
        ACTIVE CARD
=========================================*/

cards.forEach(card=>{

card.addEventListener("mouseenter",()=>{

cards.forEach(c=>c.classList.remove("active"));

card.classList.add("active");

});

});

/*=========================================
        ARROW CLICK EFFECT
=========================================*/

document.querySelectorAll(".arrow").forEach(arrow=>{

arrow.addEventListener("click",()=>{

arrow.style.transform="scale(.90)";

setTimeout(()=>{

arrow.style.transform="scale(1)";

},150);

});

});

/*=========================================
        SCROLL REVEAL
=========================================*/

const observer=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.style.opacity="1";
entry.target.style.transform="translateY(0)";

}

});

},{
threshold:.15
});

cards.forEach(card=>{

card.style.opacity="0";
card.style.transform="translateY(50px)";
card.style.transition=".7s";

observer.observe(card);

});

/*=========================================
        BUTTON RIPPLE
=========================================*/

document.querySelectorAll(".filters button,.notify-btn")
.forEach(btn=>{

btn.addEventListener("click",function(e){

const circle=document.createElement("span");

const size=Math.max(
this.clientWidth,
this.clientHeight
);

circle.style.width=size+"px";
circle.style.height=size+"px";

circle.style.position="absolute";
circle.style.borderRadius="50%";
circle.style.background="rgba(255,255,255,.25)";
circle.style.pointerEvents="none";
circle.style.transform="translate(-50%,-50%)";
circle.style.left=e.offsetX+"px";
circle.style.top=e.offsetY+"px";
circle.style.animation="ripple .6s linear";

this.appendChild(circle);

setTimeout(()=>{

circle.remove();

},600);

});

});

/*=========================================
        SEARCH ENTER
=========================================*/

searchInput.addEventListener("keypress",(e)=>{

if(e.key==="Enter"){

searchInput.blur();

}

});

/*=========================================
        AUTO ACTIVE FIRST CARD
=========================================*/

if(cards.length){

cards[0].classList.add("active");

}

});

/*=========================================
        RIPPLE STYLE
=========================================*/

const style=document.createElement("style");

style.innerHTML=`

@keyframes ripple{

0%{

opacity:.6;
transform:translate(-50%,-50%) scale(0);

}

100%{

opacity:0;
transform:translate(-50%,-50%) scale(3);

}

}

`;

document.head.appendChild(style);
