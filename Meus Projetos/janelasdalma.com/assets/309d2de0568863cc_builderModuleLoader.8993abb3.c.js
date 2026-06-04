"use strict";(self.webpackJsonp__wix_thunderbolt_app=self.webpackJsonp__wix_thunderbolt_app||[]).push([["2242"],{87618(e,t,r){r.r(t),r.d(t,{ImportMapSymbol:()=>a.eV,site:()=>M,ESMLoaderSymbol:()=>a.VL});var a=r(84470),o=r(8716);let s=e=>`const react = ${e};

// Polyfill for useSyncExternalStore (React 18+)
const useSyncExternalStorePolyfill = react.useSyncExternalStore || function(subscribe, getSnapshot, getServerSnapshot) {
	const [state, setState] = react.useState(getSnapshot);

	react.useEffect(() => {
		const handleStoreChange = () => {
			setState(getSnapshot());
		};
		const unsubscribe = subscribe(handleStoreChange);
		handleStoreChange(); // Check for changes since last render
		return unsubscribe;
	}, [subscribe, getSnapshot]);

	return state;
};

export default react;
export const {
	Component,
	PureComponent,
	Fragment,
	StrictMode,
	Suspense,
	Profiler,
	createElement,
	cloneElement,
	createFactory,
	createRef,
	forwardRef,
	isValidElement,
	createContext,
	memo,
	lazy,
	Children,
	useCallback,
	useContext,
	useDebugValue,
	useEffect,
	useImperativeHandle,
	useLayoutEffect,
	useMemo,
	useReducer,
	useRef,
	useState,
	act,
	unstable_act,
	version
} = react;

export const useSyncExternalStore = useSyncExternalStorePolyfill;`,n=e=>`
const ReactDOM = ${e};

export default ReactDOM;
export const findDOMNode = ReactDOM.findDOMNode;
export const {
	createPortal,
	flushSync,
} = ReactDOM;
`,i=()=>`
import React from 'react';

function assignKey(props, key) {
  if (key === undefined || key === null) return props;
  return Object.assign({}, props, { key });
}

export function jsx(type, props, key) {
  const finalProps = assignKey(props, key);
  return React.createElement(type, finalProps);
}

export function jsxs(type, props, key) {
  return jsx(type, props, key);
}

export const Fragment = React.Fragment;
export default { jsx, jsxs, Fragment };
`,c=()=>`
import React from 'react';
import { jsx } from 'react/jsx-runtime';

export function jsxDEV(type, props, key, _source, _self) {
  return jsx(type, props, key);
}

export const Fragment = React.Fragment;
export default { jsxDEV, Fragment };
`,l=(0,o.Og)([],()=>({getReactModuleCode:s,getReactDOMModuleCode:n,getReactJsxRuntimeCode:i,getReactJsxDevRuntimeCode:c}));var u=r(40766),d=r(27089);let p=(0,o.Og)([a.Gs,u.RV,a.eV,u.Ht,d.n],(e,t,r,a,o)=>{let s={};return{prefetchScript:e=>{},loadModule:async n=>{let i=s[n];return i||e.runWithCache(n,async()=>{let e=r.bootstrap();e&&await e;let i=t?.importShim??(e=>import(e));if(o["specs.thunderbolt.fixBuilderHierarchyLoadingRace"]){a.interactionStarted("esm-module-load");try{let e=await i(n);return s[n]=e,e}finally{a.interactionEnded("esm-module-load")}}{a.interactionStarted("esm-module-load");let e=await i(n);return a.interactionEnded("esm-module-load"),s[n]=e,e}})}}}),m=(0,o.Og)([],()=>{let e=new Map;return{runWithCache:(t,r)=>{let a=e.get(t);if(a)return a;let o=r().catch(r=>{throw e.delete(t),r});return e.set(t,o),o}}});var f=r(66294),x=r(5250);let h="https://static.parastorage.com/services/thunderbolt-shims-static/1.0.0/es-module-shims.js";var S=r(40211),b=r.n(S);function g(e){let t=new Blob([e],{type:"text/javascript"});return URL.createObjectURL?.(t)||""}let y=(0,o.Og)([a.Es,u.RV,(0,o.KT)(f.YG,a.UU),u.Ht],(e,t,{publicPackagesUrls:r,isBuilderComponentModel:a},o)=>{let s,n="true"===new URLSearchParams(t?.location?.search).get("forceUseShimForLocalTests"),i=!!t&&!!a&&(n||!((e,t)=>{if(!t){let t=(0,x.O)(e);return!t||t>16}if((0,x.lT)(e)||(0,x.gm)(e))return!1;if((0,x.nr)(e)){let t=(0,x.PV)(e);return -1!==t&&t>=18.4}return(0,x.UP)(e)?(0,x.Jp)(e,"edge")>=133:(0,x.H8)(e)?(0,x.Jp)(e,"chrome")>=133:!!(0,x.GQ)(e)&&(0,x.Jp)(e,"opera")>=118})(t,!1)),c=!1,l=r.esm,u=!i,d=b().once(async()=>{await new Promise((e,r)=>{t.esmsInitOptions={shimMode:!0};let a=t.document.createElement("script");a.src=h,a.async=!0,o.interactionStarted("esm-shim-load"),a.onload=()=>{o.interactionEnded("esm-shim-load"),e()},a.onerror=()=>{let e=Error(`ESM shim script failed to load from ${h}`);o.captureError(e,{tags:{feature:"builder-module-loader"},extra:{url:h}}),r(e)},t.document.head.appendChild(a)}),await v(),u=!0}),p=i?d():void 0,m={react:g(e.getReactModuleCode("window.React")),"react-dom":g(e.getReactDOMModuleCode("window.ReactDOM")),"react/jsx-runtime":g(e.getReactJsxRuntimeCode()),"react/jsx-dev-runtime":g(e.getReactJsxDevRuntimeCode()),"use-sync-external-store/shim/index.js":"https://static.parastorage.com/services/thunderbolt-shims-static/1.0.0/use-sync-external-store-shim.js","@wix/builder-interactions":l["builder-interactions"],"@wix/builder-state":l["builder-state"],"@wix/builder-state-react":l["builder-state-react"],"@wix/builder-velo":l["builder-velo"],"@wix/builder-velo-react":l["builder-velo-react"],"@wix/services-manager-react":g((s=l["services-manager-react"],`
  const s = window.servicesManagerReact || await import('${s}');

  const WixServices = s.WixServices;
  const useServices = s.useServices;
  const useService = s.useService;
  const useGetService = s.useGetService;
  const ServicesManagerProvider = s.ServicesManagerProvider;
  
  export { WixServices, useServices, useService, useGetService, ServicesManagerProvider };
`)),"@wix/builder-element-removal":l["builder-element-removal"],"@wix/builder-utils":l["builder-utils"]},f=new Set(Object.keys(m)),S=0,y=e=>{Object.entries(e).forEach(([e,t])=>{f.has(e)||(m[e]=t)})},v=async()=>{if(!t?.document)return;let e=t.document.createElement("script");e.id=`builder-module-loader-importmap-${S}`,e.type=i?"importmap-shim":"importmap",e.textContent=JSON.stringify({imports:m}),t.document.head.appendChild(e),Object.keys(m).forEach(e=>f.add(e)),m={},S++};return{updateImportMap:y,commitImportMapUpdates:v,updateAndCommit:e=>{if(0!==Object.keys(e).length){if(c&&1)return void o.captureError(Error("Import maps can only be committed once on public sites. To extend the import map, register dependencies via ImportMapProviderSymbol."),{tags:{feature:"builder-module-loader",methodName:"commitImportMapUpdates"}});c=!0,y(e),v()}},bootstrap:()=>{if(!u)return p}}});var v=r(90009);let R=(0,o.Og)([a.eV,(0,o.m3)(v.R)],(e,t)=>({appWillMount:()=>{let r=t.map(e=>e.provideImportMap()).reduce((e,t)=>({...e,...t}),{});e.updateAndCommit(r)}}));var w=r(83121);let M=e=>{e(a.Es).to(l),e(a.Gs).to(m),e(a.eV).to(y),e(a.VL).to(p),e(w.$.AppWillMountHandler).to(R)}}}]);
//# sourceMappingURL=builderModuleLoader.8993abb3.chunk.min.js.map