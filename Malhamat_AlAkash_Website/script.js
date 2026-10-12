// تنبيه: الأسعار والمنتجات أدناه أمثلة تجريبية، عدّلها بعد التأكد من الملحمة.
const WHATSAPP_NUMBER="972599094315"; // الرقم الدولي دون + أو مسافات
const products=[
{id:1,name:"لحمة عجل",cat:"لحوم",emoji:"🥩",desc:"قطع عجل — الوزن حسب الطلب",price:45,unit:"للكيلو",tag:"اختيار شائع"},
{id:2,name:"لحمة خروف",cat:"لحوم",emoji:"🍖",desc:"قطع خروف — الوزن حسب الطلب",price:65,unit:"للكيلو",tag:""},
{id:3,name:"لحمة مفرومة",cat:"لحوم",emoji:"🥩",desc:"مناسبة للطبخ والكفتة",price:48,unit:"للكيلو",tag:""},
{id:4,name:"كفتة",cat:"جاهز للشوي",emoji:"🍢",desc:"جاهزة للشوي — حسب التوفر",price:50,unit:"للكيلو",tag:"جاهز للشوي"},
{id:5,name:"كباب",cat:"جاهز للشوي",emoji:"🍢",desc:"تجهيز حسب الطلب",price:55,unit:"للكيلو",tag:""},
{id:6,name:"دجاج كامل",cat:"دجاج",emoji:"🍗",desc:"يرجى تأكيد الوزن والتوفر",price:18,unit:"للحبة",tag:""},
{id:7,name:"صدور دجاج",cat:"دجاج",emoji:"🍗",desc:"مناسبة للطبخ والشوي",price:28,unit:"للكيلو",tag:""},
{id:8,name:"ريش خروف",cat:"لحوم",emoji:"🍖",desc:"مناسبة للشوي والمناسبات",price:75,unit:"للكيلو",tag:""}
];let cart=[],category="الكل";const grid=document.getElementById('grid'),drawer=document.getElementById('drawer'),shade=document.getElementById('shade'),toast=document.getElementById('toast');const money=n=>'₪'+Math.round(n);
function renderProducts(){let list=category==='الكل'?products:products.filter(p=>p.cat===category);grid.innerHTML=list.map(p=>`<article class="card"><div class="visual"><span class="tag">${p.tag||'من الملحمة'}</span><span class="emoji">${p.emoji}</span></div><div class="info"><h3>${p.name}</h3><p>${p.desc}</p><div class="bottom"><span class="price">${money(p.price)} <small>${p.unit}</small></span><button class="add" data-add="${p.id}" aria-label="أضف ${p.name}">+</button></div></div></article>`).join('')}
function notify(s){toast.textContent=s;toast.classList.add('show');clearTimeout(notify.t);notify.t=setTimeout(()=>toast.classList.remove('show'),2200)}function openCart(){drawer.classList.add('open');shade.classList.add('show')}function closeCart(){drawer.classList.remove('open');shade.classList.remove('show')}
function add(id){let i=cart.find(x=>x.id===id);if(i)i.qty++;else cart.push({id,qty:1});renderCart();notify('تمت إضافة المنتج إلى السلة')}function quantity(id,d){let i=cart.find(x=>x.id===id);if(!i)return;i.qty+=d;if(i.qty<1)cart=cart.filter(x=>x.id!==id);renderCart()}
function renderCart(){document.getElementById('count').textContent=cart.reduce((s,i)=>s+i.qty,0);document.getElementById('items').innerHTML=cart.length?cart.map(i=>{let p=products.find(x=>x.id===i.id);return `<div class="cart-item"><div><b>${p.name}</b><small>${money(p.price)} ${p.unit}</small></div><div class="qty"><button data-q="${p.id}" data-d="-1">−</button><b>${i.qty}</b><button data-q="${p.id}" data-d="1">+</button></div></div>`}).join(''):'<div class="empty">السلة فارغة حالياً. أضف المنتجات التي تريدها.</div>';document.getElementById('total').textContent=money(cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0))}
function orderMessage(){let f=new FormData(document.getElementById('orderForm')),name=String(f.get('name')||'').trim(),phone=String(f.get('phone')||'').trim(),notes=String(f.get('notes')||'').trim();if(!cart.length){notify('أضف منتجاً واحداً على الأقل');return null}if(!name||!phone){notify('اكتب اسمك ورقم هاتفك أولاً');return null}let lines=cart.map(i=>{let p=products.find(x=>x.id===i.id);return `• ${p.name}: ${i.qty} ${p.unit} — ${money(p.price*i.qty)}`});return `السلام عليكم، بدي أطلب من ملحمة العكش:

${lines.join('
')}

المجموع التقديري: ${money(cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0))}
الاسم: ${name}
رقم الهاتف: ${phone}
${notes?'ملاحظات / عنوان التوصيل: '+notes+'
':''}
أرجو تأكيد الأسعار والأوزان والتوفر وطريقة الاستلام أو التوصيل.`}
grid.addEventListener('click',e=>{let b=e.target.closest('[data-add]');if(b)add(Number(b.dataset.add))});document.getElementById('filters').addEventListener('click',e=>{let b=e.target.closest('[data-cat]');if(!b)return;category=b.dataset.cat;document.querySelectorAll('[data-cat]').forEach(x=>x.classList.toggle('active',x===b));renderProducts()});document.getElementById('cartOpen').onclick=openCart;document.getElementById('close').onclick=closeCart;shade.onclick=closeCart;document.addEventListener('click',e=>{let b=e.target.closest('[data-q]');if(b)quantity(Number(b.dataset.q),Number(b.dataset.d))});document.getElementById('orderForm').addEventListener('submit',e=>{e.preventDefault();let msg=orderMessage();if(msg)window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,'_blank','noopener,noreferrer')});document.getElementById('copy').onclick=async()=>{let msg=orderMessage();if(!msg)return;try{await navigator.clipboard.writeText(msg);notify('تم نسخ تفاصيل الطلب')}catch{notify('تعذر النسخ؛ جرّب زر واتساب')}};document.getElementById('waLink').href=`https://wa.me/${WHATSAPP_NUMBER}`;document.getElementById('year').textContent=new Date().getFullYear();renderProducts();renderCart();
