// Вбудовані товари. Нові товари адмін додає через сайт (вони зберігаються в базі).
export const ITEMS=[
{id:"hoodie-gbu",img:"img/hoodie-gbu.jpg",cat:"Одяг",e:"🧥",n:"Худі «God Bless Ukraine»",p:"4 700 ₴",u:"https://www.non.com.ua/product/god-bless-ukraine-hoodie/"},
{id:"hoodie-hope",img:"img/hoodie-hope.jpg",cat:"Одяг",e:"🧥",n:"Худі Hope, boiled gray",p:"4 700 ₴",u:"https://www.non.com.ua/product/hope-hoodie-boiled-gray/"},
{id:"longsleeve",img:"img/longsleeve.jpg",cat:"Одяг",e:"👕",n:"Лонг",p:"1 000 ₴",u:"https://www.instagram.com/reel/DAyvE_UOTUg/"},
{id:"longsleeve-whales",img:"img/longsleeve-whales.jpg",cat:"Одяг",e:"🐳",n:"Синій лонг з китами",m:"розмір S/M",p:"1 600 ₴",u:"https://www.instagram.com/p/DdTpgHajQkq/"},
{id:"skirt",img:"img/skirt.jpg",cat:"Одяг",e:"👗",n:"Спідничка",p:"1 400 ₴",u:"https://www.instagram.com/p/DYwfvxrgP0y/"},
{id:"fleece",img:"img/fleece.jpg",cat:"Одяг",e:"🧶",n:"Фліска",m:"червона або оливкова",p:"1 000 ₴",u:"https://www.instagram.com/p/DeCfO66DBB5/"},
{id:"sweater",img:"img/sweater.jpg",cat:"Одяг",e:"🧣",n:"Светрик",m:"коричневий або бордовий",p:"1 500 ₴",u:"https://www.instagram.com/p/DdJwZxujA3_/"},
{id:"fur-bomber",img:"img/fur-bomber.jpg",cat:"Одяг",e:"🧥",n:"Шубка (бомбер двосторонній з хутром)",m:"чорно-шоколадний",p:"6 750 ₴",u:"https://papaya.ua/zhinochij-odjag/verhnij-odyag/kurtki-ua/bomber-dvostoronniy-z-hutrom-995-chorno-shokoladniy"},
{id:"flares",img:"img/flares.jpg",cat:"Одяг",e:"👖",n:"Ласінки кльош",p:"750 ₴",u:"https://www.instagram.com/reel/DdWlDPTMwWM/"},
{id:"lip-pencil",img:"img/lip-pencil.jpg",cat:"Косметика",e:"💄",n:"Олівець для губ Say Yeah",m:"відтінок Macaron",p:"≈ 500 ₴",u:"https://shop.gbar.ua/sayeah-beauty-09-macaron"},
{id:"skin-pads",img:"img/skin-pads.jpg",cat:"Косметика",e:"🧴",n:"Пади SKIN1004",p:"760 ₴",u:"https://makeup.com.ua/ua/product/1120205/"},
{id:"skin-stick",img:"img/skin-stick.jpg",cat:"Косметика",e:"🧴",n:"Стік-маска для обличчя SKIN1004",p:"725 ₴",u:"https://makeup.com.ua/ua/product/1291264/"},
{id:"skin-toner",img:"img/skin-toner.jpg",cat:"Косметика",e:"🧴",n:"Тонер SKIN1004 Centella Probio-Cica",p:"900 ₴",u:"https://makoko.shop/product/skin1004-madagascar-centella-probio-cica-essense-toner/"},
{id:"hand-cream",img:"img/hand-cream.jpg",cat:"Косметика",e:"🤍",n:"Крем для рук Sue",p:"400 ₴",u:"https://www.instagram.com/p/DfuhYxRCDLc/"},
{id:"balm",img:"img/balm.jpg",cat:"Косметика",e:"💋",n:"Бальзамчик",p:"670 ₴",u:"https://www.instagram.com/p/Dfjb4NVCIKv/"},
{id:"powder",img:"img/powder.jpg",cat:"Косметика",e:"✨",n:"Пудра Zola Magic Mattifying",m:"відтінок beige",p:"500 ₴",u:"https://zola.ua/zola-pudra-magic-mattifying-powder-beige"},
{id:"g-notclose",cat:"Настільні ігри",img:"img/g-notclose.jpg",e:"🎲",n:"Не наближайся!",p:"680 ₴",u:"https://bi.ua/rus/product/nastolnaya-igra-pendragon-ne-priblizhaysya-im1004u.html"},
{id:"g-catan",cat:"Настільні ігри",img:"img/g-catan.jpg",e:"🎲",n:"Catan (Катан)",p:"1 900 ₴",u:"https://rozetka.com.ua/ua/565220090/p565220090/"},
{id:"g-bang",cat:"Настільні ігри",img:"img/g-bang.jpg",e:"🎲",n:"Бенг!",p:"950 ₴",u:"https://rozetka.com.ua/ua/453275831/p453275831/"},
{id:"j-blackwhite",img:"img/j-blackwhite.png",cat:"Прикраси",e:"💍",n:"Blackwhite Jewelry",m:"тільки срібло",u:"https://www.instagram.com/blackwhite.jewelry",shop:1},
{id:"j-palko",img:"img/j-palko.png",cat:"Прикраси",e:"💍",n:"Palko Jewelry",m:"тільки срібло",u:"https://www.instagram.com/palko.jewelry",shop:1},
{id:"j-moe",img:"img/j-moe.png",cat:"Прикраси",e:"💍",n:"Moe Moe",m:"тільки срібло",u:"https://www.instagram.com/moe.moe.ua",shop:1},
{id:"j-yolo",img:"img/j-yolo.png",cat:"Прикраси",e:"💍",n:"Yolo Rings",m:"тільки срібло",u:"https://www.instagram.com/yolo.rings",shop:1},
{id:"l-candles",img:"img/l-candles.jpg",cat:"Те, що я люблю",e:"🕯️",n:"Свічки",m:"ароматичні, затишні"},
{id:"l-books",img:"img/l-books.jpg",cat:"Те, що я люблю",e:"📚",n:"Книжки",list:1},
{id:"l-coffee",img:"img/l-coffee.jpg",cat:"Те, що я люблю",e:"☕",n:"Кава (або дріпи, або кава для заварки під V60)"},
{id:"l-tea",img:"img/l-tea.jpg",cat:"Те, що я люблю",e:"🍵",n:"Чаї",m:"дуже люблю різні трав’яні та молочні улуни"},
{id:"l-socks",cat:"Те, що я люблю",img:"img/l-socks.jpg",e:"🧦",n:"Прикольні шкарпетки"},
{id:"c-photo",img:"img/c-photo.jpg",cat:"Сертифікати",e:"📸",n:"Фотосесія"},
{id:"c-massage",img:"img/c-massage.jpg",cat:"Сертифікати",e:"💆",n:"Масаж"},
{id:"c-cosmetics",img:"img/c-cosmetics.png",cat:"Сертифікати",e:"💄",n:"Магазин косметики"},
{id:"c-books",img:"img/c-books.png",cat:"Сертифікати",e:"📖",n:"Книгарня"},
{id:"c-clay",img:"img/c-clay.jpg",cat:"Сертифікати",e:"🏺",n:"Ліпка з глини"},
{id:"c-sport",img:"img/c-sport.png",cat:"Сертифікати",e:"🧘",n:"Спорт",m:"заняття або абонемент"}
];

export const CATS=[
 {name:"Те, що я люблю",slug:"love",note:"Тут немає конкретних посилань: це просто те, що я люблю. Можна обрати щось на свій смак 🤍"},
 {name:"Косметика",slug:"cosmetics"},
 {name:"Сертифікати",slug:"certificates",note:"Можна подарувати сертифікат на будь-що з цього. Конкретне місце обирай на свій смак 🤍"},
 {name:"Настільні ігри",slug:"games"},
 {name:"Прикраси",slug:"jewelry",note:"Це не конкретні речі, а магазини, де мені дуже подобаються різні прикраси. Можна замовити звідти що завгодно, але обов’язково в срібному кольорі 🤍"},
 {name:"Одяг",slug:"clothes"}
];

export const BOOKS=[
{t:"За Перекопом є земля",a:"Анастасія Левкова",p:"500 ₴",u:"https://ksd.ua/product/za-perekopom-ie-zemlya"},
{t:"З країни рижу та опію",a:"Софія Яблонська",p:"300 ₴",u:"https://ksd.ua/product/z-krayiny-ryzu-ta-opiiu"},
{t:"Історія церкви простою мовою",a:"Брюс Л. Шеллі",p:"900 ₴",u:"https://store.tci.edu.ua/product/church-history/"},
{t:"Як читати Біблію. Книга за книгою: екскурсія з гідом",a:"Гордон Д. Фі, Дуглас Стюарт",p:"600 ₴",u:"https://store.tci.edu.ua/product/book-by-book-a-guided-tour/"}
];
