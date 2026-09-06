const products=[
 {id:1,name:"Noor Lawn Set",category:"Casual",price:4290,desc:"A soft everyday two-piece with an effortless silhouette."},
 {id:2,name:"Mehfil Embroidered",category:"Fancy",price:8990,desc:"Delicate detailing designed for evenings and celebrations."},
 {id:3,name:"Rang-e-Bahar",category:"Traditional",price:7490,desc:"A graceful Pakistani-inspired ensemble with timeless charm."},
 {id:4,name:"Rosé Co-ord",category:"Casual",price:5190,desc:"Minimal, polished and easy to style throughout the day."},
 {id:5,name:"Zarqa Festive",category:"Fancy",price:10990,desc:"Statement festive wear with elegant traditional details."},
 {id:6,name:"Ivory Kurta",category:"Traditional",price:3990,desc:"A classic ivory kurta made for simple, beautiful days."},
 {id:7,name:"Sahar Set",category:"Casual",price:4590,desc:"Relaxed tailoring with a refined feminine finish."},
 {id:8,name:"Gulabo Luxe",category:"Fancy",price:9490,desc:"A romantic festive look for your special moments."}
];
let cart=[];
try {
  const saved=JSON.parse(localStorage.getItem("aneezaysCart")||"[]");
  cart=Array.isArray(saved)?saved:[];
} catch(e) { cart=[]; }
let currentFilter="All";

const productsEl=document.getElementById("products");
const cartCount=document.getElementById("cartCount");

function money(n){return "Rs. "+n.toLocaleString("en-PK")}
function renderProducts(){
 const list=currentFilter==="All"?products:products.filter(p=>p.category===currentFilter);
 productsEl.innerHTML=list.map(p=>`
 <article class="product" onclick="openProduct(${p.id})">
  <div class="product-img">
   <button class="heart" onclick="event.stopPropagation();toggleWish(this)">♡</button>
   ${p.id<4?'<span class="tag">NEW</span>':''}
  </div>
  <div class="product-info"><h3>${p.name}</h3><p>${p.category}</p><span class="price">${money(p.price)}</span></div>
 </article>`).join("");
}
function saveCart(){
 localStorage.setItem("aneezaysCart",JSON.stringify(cart));
}
function renderCart(){
 const count=cart.reduce((sum,item)=>sum+(Number(item.qty)||0),0);
 cartCount.textContent=count;
 const box=document.getElementById("cartItems");
 if(!cart.length){
   box.innerHTML='<p style="color:#766c66;font-size:13px;padding:25px 0">Your bag is waiting for something beautiful. ♡</p>';
 } else {
   box.innerHTML=cart.map(x=>`<div class="cart-row">
    <div class="mini-img" ${x.image?`style="background-image:url('${x.image}');background-size:cover;background-position:center;"`:''}></div>
    <div><h4>${x.name}</h4><small>${money(x.price)} · Qty ${x.qty}</small><br><button type="button" class="remove" onclick="removeCart(${x.id})">Remove</button></div>
    <b>${money(x.price*x.qty)}</b>
   </div>`).join("");
 }
 document.getElementById("cartTotal").textContent=money(cart.reduce((sum,x)=>sum+(Number(x.price)||0)*(Number(x.qty)||0),0));
 saveCart();
}
function addCart(id){
 const p=products.find(x=>Number(x.id)===Number(id));
 if(!p) return;
 const old=cart.find(x=>Number(x.id)===Number(id));
 if(old){ old.qty=(Number(old.qty)||0)+1; }
 else { cart.push({...p,qty:1}); }
 renderCart();
 openCart();
}
function removeCart(id){
 cart=cart.filter(x=>Number(x.id)!==Number(id));
 renderCart();
}
function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("overlay").classList.add("show")}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("overlay").classList.remove("show")}
function openProduct(id){
 const p=products.find(x=>x.id===id);
 document.getElementById("modalContent").innerHTML=`<div class="modal-grid"><div class="modal-img"></div><div class="modal-copy"><p class="eyebrow">${p.category}</p><h2>${p.name}</h2><h3 style="margin-top:15px">${money(p.price)}</h3><p>${p.desc}</p><p style="font-size:11px;color:#766c66">Choose size</p><div class="size-list"><button class="size selected">S</button><button class="size">M</button><button class="size">L</button><button class="size">XL</button></div><button type="button" class="primary-btn full" onclick="addCart(${p.id});closeModal()">Add to bag</button></div></div>`;
 document.getElementById("productModal").classList.add("show");document.getElementById("overlay").classList.add("show");
}
function closeModal(){document.getElementById("productModal").classList.remove("show");document.getElementById("overlay").classList.remove("show")}
function toggleWish(btn){btn.textContent=btn.textContent==="♡"?"♥":"♡"}

document.querySelectorAll("[data-filter]").forEach(btn=>btn.addEventListener("click",()=>{
 currentFilter=btn.dataset.filter;
 document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x.dataset.filter===currentFilter));
 document.getElementById("shop").scrollIntoView({behavior:"smooth"});
 renderProducts();
}));
document.getElementById("cartBtn").onclick=openCart;
document.getElementById("closeCart").onclick=closeCart;
document.getElementById("closeModal").onclick=closeModal;
document.getElementById("overlay").onclick=()=>{closeCart();closeModal()};
document.getElementById("checkoutBtn").onclick=()=>{
 if(!cart.length){alert("Your bag is empty.");return;}
 document.getElementById("checkoutTotal").textContent=money(cart.reduce((s,x)=>s+x.price*x.qty,0));
 document.getElementById("checkoutModal").classList.add("show");
};
document.getElementById("closeCheckout").onclick=()=>document.getElementById("checkoutModal").classList.remove("show");
document.getElementById("checkoutForm").addEventListener("submit",e=>{
 e.preventDefault();
 const orderId="ANZ-"+Math.floor(100000+Math.random()*900000);
 const name=document.getElementById("customerName").value;
 const total=money(cart.reduce((s,x)=>s+x.price*x.qty,0));
 document.querySelector(".checkout-card").innerHTML=`<div class="checkout-success"><p class="eyebrow">ORDER CONFIRMED</p><h2>Thank you, ${name} ♡</h2><p>Your order has been received.</p><p class="order-id">Order #${orderId}</p><p>Total: <strong>${total}</strong></p><button class="primary-btn full" onclick="finishOrder()">Done</button></div>`;
 cart=[];renderCart();
});
function finishOrder(){document.getElementById("checkoutModal").classList.remove("show");closeCart();location.reload();}
document.getElementById("searchBtn").onclick=()=>{const q=prompt("Search Aneezay's collection");if(!q)return;const found=products.filter(p=>(p.name+" "+p.category).toLowerCase().includes(q.toLowerCase()));alert(found.length?found.map(p=>p.name+" — "+money(p.price)).join("\n"):"No pieces found.");};
console.log("CART SYSTEM LOADED");
renderProducts();renderCart();
