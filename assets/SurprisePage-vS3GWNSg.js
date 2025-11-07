import{r,a as p,j as e}from"./index-BwPJ5yJz.js";const f="_page_1r6al_1",m="_title_1r6al_15",_="_card_1r6al_22",b="_header_1r6al_35",j="_table_1r6al_46",w="_diagnoseButton_1r6al_70",N="_ecg_1r6al_92",B="_ecgLine_1r6al_106",k="_progressTrack_1r6al_122",R="_progressBar_1r6al_131",v="_exportButton_1r6al_140",T="_result_1r6al_171",s={page:f,title:m,card:_,header:b,table:j,diagnoseButton:w,ecg:N,ecgLine:B,progressTrack:k,progressBar:R,exportButton:v,result:T},S="#ffd1dc",E=2600,I=({onAccentChange:i,copy:t})=>{const[n,u]=r.useState(!1),[l,h]=r.useState(!1),o=r.useRef(null),c=r.useRef(null),d=r.useRef(null);r.useEffect(()=>(i(S),()=>{i(null),o.current&&clearTimeout(o.current)}),[i]),r.useEffect(()=>{if(!c.current)return;const a=p(c.current,{opacity:[0,1],translateY:[18,0],duration:580,easing:"easeOutQuad"});return()=>{a.pause()}},[]),r.useEffect(()=>{if(!l||!d.current)return;const a=p(d.current,{opacity:[0,1],scale:[.95,1],translateY:[10,0],duration:520,easing:"easeOutBack"});return()=>{a.pause()}},[l]);const g=()=>{n||(u(!0),h(!1),o.current&&clearTimeout(o.current),o.current=setTimeout(()=>{h(!0),u(!1)},E))},x=()=>{const a=window.open("","_blank","width=600,height=800");a&&(a.document.write(`<!doctype html>
<html lang="uk">
<head>
  <meta charset="utf-8" />
  <title>Медична картка любові</title>
  <style>
    body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background:#fff0f6; margin:0; padding:32px; color:#5a2d3a;}
    h1 { text-align:center; }
    .card { background:white; border-radius:24px; padding:24px; box-shadow:0 20px 40px rgba(0,0,0,.08); }
    table { width:100%; border-collapse:collapse; margin-top:16px; }
    th, td { padding:12px 16px; border-bottom:1px solid #f4cfe1; text-align:left; }
    th { width:35%; color:#b13c6b; }
    footer { margin-top:24px; text-align:center; font-weight:600; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Медична картка любові</h1>
    <p><strong>Пацієнт:</strong> ${t.headerName}</p>
    <p><strong>Діагноз:</strong> Хронічна закоханість у ${t.headerBeloved}</p>
    <table>
      <tr><th>Симптоми</th><td>${t.symptoms}</td></tr>
      <tr><th>Лікування</th><td>${t.treatment}</td></tr>
      <tr><th>Прогноз</th><td>${t.prognosis}</td></tr>
      <tr><th>Висновок</th><td>${t.diagnosis}</td></tr>
    </table>
    <footer>Підпис лікаря: ❤️</footer>
  </div>
  <script>
    window.onload = () => { window.focus(); window.print(); };
  <\/script>
</body>
</html>`),a.document.close())};return e.jsxs("div",{className:s.page,children:[e.jsx("h2",{className:s.title,children:"Медична картка любові"}),e.jsxs("div",{ref:c,className:s.card,children:[e.jsxs("header",{className:s.header,children:[e.jsxs("h3",{children:["Медична карта пацієнта: ",t.headerName]}),e.jsxs("p",{children:["Діагноз: Хронічна закоханість у ",t.headerBeloved," 💘"]})]}),e.jsx("table",{className:s.table,children:e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("th",{scope:"row",children:"Симптоми"}),e.jsx("td",{children:t.symptoms})]}),e.jsxs("tr",{children:[e.jsx("th",{scope:"row",children:"Лікування"}),e.jsx("td",{children:t.treatment})]}),e.jsxs("tr",{children:[e.jsx("th",{scope:"row",children:"Прогноз"}),e.jsx("td",{children:t.prognosis})]})]})}),e.jsx("button",{type:"button",className:s.diagnoseButton,onClick:g,disabled:n,children:n?"Діагностика...":"🧠 Провести діагностику"}),e.jsx("button",{type:"button",className:s.exportButton,onClick:x,children:"📝 Виписати рецепт"}),n&&e.jsx("div",{className:s.ecg,"aria-live":"polite",children:e.jsx("span",{className:s.ecgLine})}),n&&e.jsx("div",{className:s.progressTrack,"aria-hidden":"true",children:e.jsx("span",{className:s.progressBar})}),l&&e.jsx("p",{ref:d,className:s.result,"aria-live":"polite",children:t.diagnosis})]})]})};export{I as default};
