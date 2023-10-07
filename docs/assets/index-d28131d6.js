(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const d of n.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&r(d)}).observe(document,{childList:!0,subtree:!0});function t(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(s){if(s.ep)return;s.ep=!0;const n=t(s);fetch(s.href,n)}})();class l{constructor(e){this.el=e,this.children=[],this.___destroyed=!1}replaceChild(e,t){if(t.getParent())throw new Error("The module you want to insert already has a parent module");const r=this.children[e];return r?(this.insertChild(e,t),this.removeChild(r),!0):!1}insertChild(e,t){const r=c(t);if(r.___destroyed)throw console.error("The module to be inserted has been destroyed",r),new Error("The module to be inserted has been destroyed");if(r.getParent())throw new Error("The module you want to insert already has a parent module");if(e===this.children.length)return this.addChild(r),r.parent=this,!0;const s=this.children[e];return s?(this.el.insertBefore(r.el,s.el),this.children.splice(e,0,r),r.parent=this,!0):!1}moveChild(e,t){const r=this.getChild(e),s=this.getChild(t);if(!r||!s)return!1;if(this.children.splice(e,1),this.children.splice(t,0,r),e>t)this.el.insertBefore(r.el,s.el);else{const n=this.getChild(t+1);n?this.el.insertBefore(r.el,n.el):(this.el.removeChild(r.el),this.el.appendChild(r.el))}return!0}destroy(){if(this.parent){const e=this.parent.children.indexOf(this);e!==-1&&this.parent.children.splice(e,1),this.parent=void 0}this.empty(),this.el.remove(),this.___destroyed=!0}empty(){[...this.children].forEach(e=>e.destroy())}getParent(){return this.parent}replaceBy(e){if(!this.parent)return!1;const t=this.getIndex();return this.parent.replaceChild(t,e),!0}find(e){const t=[];for(const r of this.children)e(r)&&t.push(r),t.push(...r.find(e));return t}findFirst(e){for(const t of this.children){if(e(t))return t;const r=t.findFirst(e);if(r)return r}}addChild(...e){e.filter(t=>t!==void 0).forEach(t=>this.addSingleChild(t))}addSingleChild(e){const t=c(e);if(t.___destroyed)throw console.error("The module to be added has been destroyed",e),new Error("The module to be added has been destroyed");if(t.getParent())throw new Error("The module you want to add already has a parent module");t.mount(this.el),this.children.push(t),t.parent=this}removeChild(e){let t,r=-1;return typeof e=="number"?(r=e,t=this.children[e]):(t=e,r=this.children.findIndex(s=>s===e)),!t||r===-1?!1:(t.parent=void 0,t.destroy(),this.children.splice(r,1),!0)}getChildren(){return this.children}getChild(e){return this.children[e]}mount(e){if(this.parent)throw new Error("The current module has already been added to a parent module and cannot be mounted");e.appendChild(this.el)}scrollIntoView(){this.el.scrollIntoView(!0)}getIndex(){return this.parent?this.parent.getChildren().findIndex(e=>e===this):-1}scrollIntoViewIfInvisible(){const e=this.el,t=e.getBoundingClientRect();let r=!1;t.top+t.height<0&&(r=!0),t.top+t.height>window.innerHeight&&(r=!0),t.left+t.width<0&&(r=!0),t.left>window.innerWidth&&(r=!0),r&&e.scrollIntoView(!0)}}class h extends l{constructor(e,t){super(e),t&&t.forEach(r=>this.addChild(r))}}class p extends l{constructor(...e){const t=document.createElement("div");super(t),t.classList.add(...e)}}function c(i){if(typeof i=="string"||typeof i=="number"){const e=document.createElement("span");return e.innerText=`${i}`,new h(e)}return i instanceof HTMLElement?new h(i):i instanceof l?i:i()}const u=window.getComputedStyle(document.body).fontSize;let o=u.endsWith("px")?parseInt(u):16;(isNaN(o)||o<14||o>20)&&(o=16);const a={text:o,textSm:o-2,textLg:o+2,textXl:o+4,borderRadius:Math.round(o*.375)};Object.freeze(a);function y(i){const{style:e}=document.body;e.setProperty("--size-text",`${i.text}px`),e.setProperty("--size-text-sm",`${i.textSm}px`),e.setProperty("--size-text-lg",`${i.textLg}px`),e.setProperty("--size-text-xl",`${i.textXl}px`),e.setProperty("--size-border-radius",`${i.borderRadius}px`),document.documentElement.style.fontSize=`${i.text}px`}y(a);const f={primary:"#1677ff",danger:"#ff4d4f",success:"#198754",warning:"#ffc107",border:"#dee2e6",text:"#303133",textSecondary:"#909399",outline:"#b1d2ff"};Object.freeze(f);function m(i){const{style:e}=document.body;e.setProperty("--color-primary",i.primary),e.setProperty("--color-danger",i.danger),e.setProperty("--color-success",i.success),e.setProperty("--color-warning",i.warning),e.setProperty("--color-border",i.border),e.setProperty("--color-text",i.text),e.setProperty("--color-text-secondary",i.textSecondary),e.setProperty("--color-outline",i.outline),document.body.style.color=i.text}m(f);class g extends l{constructor(e){const t=typeof e=="string"?{text:e}:e,r=t.tag||"span";super(document.createElement(r)),this.el.className="wok-ui-text",this.el.innerText=t.text,t.size&&this.setSize(t.size),t.bold&&(this.el.style.fontWeight="bold"),t.color&&(this.el.style.color=t.color),t.onClick&&this.onClick(t.onClick)}setText(e){return this.el.innerText=e,this}setColor(e){return this.el.style.color=e,this}setSize(e){return e==="sm"?this.el.style.fontSize="0.8rem":e==="default"?this.el.style.fontSize="1rem":e==="large"?this.el.style.fontSize="1.2rem":e==="xl"?this.el.style.fontSize="1.4rem":this.el.style.fontSize=`${e}px`,this}setBold(e){return e?this.el.style.fontWeight="bold":this.el.style.fontWeight="normal",this}onClick(e){return this.el.style.cursor="pointer",this.el.addEventListener("click",e),this}}class x extends p{constructor(){super(),this.addChild(new g("Hello world !"))}}new x().mount(document.body);
