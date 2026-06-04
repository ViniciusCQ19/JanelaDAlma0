const createA11ySdk = ({ a11yProperty }) => (api) => {
  const { props, setProps } = api;
  return {
    accessibility: {
      get ariaLabel() {
        var _a;
        return (_a = props[a11yProperty]) == null ? void 0 : _a.ariaLabel;
      },
      set ariaLabel(value) {
        const existingA11y = props[a11yProperty] ?? {};
        setProps({ [a11yProperty]: { ...existingA11y, ariaLabel: value } });
      }
    }
  };
};
function composeSDKFactories(sources) {
  return (api) => {
    const target = {};
    for (let sourceIdx = 0; sourceIdx < sources.length; sourceIdx++) {
      const source = sources[sourceIdx](api);
      const sourceKeys = Object.keys(source);
      for (let sourceKeyIdx = 0; sourceKeyIdx < sourceKeys.length; sourceKeyIdx++) {
        const sourceKey = sourceKeys[sourceKeyIdx];
        const sourceProp = Object.getOwnPropertyDescriptor(
          source,
          sourceKey
        );
        Object.defineProperty(target, sourceKey, sourceProp);
      }
    }
    return target;
  };
}
const createBaseSdk = (type) => (_api) => {
  return {
    get type() {
      return type;
    },
    get parent() {
      return null;
    }
  };
};
const createVisibilitySdk = (api) => {
  const { props, setProps } = api;
  return {
    get hidden() {
      return (props == null ? void 0 : props.isHidden) || (props == null ? void 0 : props.hidden) || false;
    },
    show() {
      setProps({ hidden: false });
    },
    hide() {
      setProps({ hidden: true });
    }
  };
};
const elementSdkFactory = (type) => composeSDKFactories([createBaseSdk(type), createVisibilitySdk]);
const TEXT_MARQUEE_SDK_TYPE = "$w.TextMarquee";
const DEFAULT_SPEED = 9;
const createTextMarqueeSdk = (api) => {
  const { props, setProps } = api;
  return {
    get type() {
      return TEXT_MARQUEE_SDK_TYPE;
    },
    get text() {
      return props.text || "";
    },
    set text(value) {
      setProps({ text: value || "" });
    },
    get speed() {
      return props.speed ?? DEFAULT_SPEED;
    },
    set speed(value) {
      setProps({ speed: value });
    },
    get movementDirection() {
      return props.movementDirection || "ltr";
    },
    set movementDirection(value) {
      setProps({ movementDirection: value || "ltr" });
    },
    get textDirection() {
      return props.textDirection || "ltr";
    },
    set textDirection(value) {
      setProps({ textDirection: value || "ltr" });
    },
    get pauseOnHover() {
      return props.pauseOnHover ?? false;
    },
    set pauseOnHover(value) {
      setProps({ pauseOnHover: value });
    },
    get link() {
      return props.link;
    },
    set link(value) {
      setProps({ link: value });
    },
    get svg() {
      return props.svg;
    },
    set svg(value) {
      setProps({ svg: value });
    },
    onClick(callback) {
      setProps({ onClick: callback });
    },
    onDblClick(callback) {
      setProps({ onDblClick: callback });
    },
    onMouseEnter(callback) {
      setProps({ onMouseEnter: callback });
    },
    onMouseLeave(callback) {
      setProps({ onMouseLeave: callback });
    },
    toJSON() {
      return {
        type: TEXT_MARQUEE_SDK_TYPE,
        text: props.text || "",
        speed: props.speed ?? DEFAULT_SPEED,
        movementDirection: props.movementDirection || "ltr",
        textDirection: props.textDirection || "ltr",
        pauseOnHover: props.pauseOnHover ?? false
      };
    }
  };
};
const sdk = composeSDKFactories([
  elementSdkFactory(TEXT_MARQUEE_SDK_TYPE),
  createTextMarqueeSdk,
  createA11ySdk({ a11yProperty: "a11y" })
]);
export {
  sdk as default
};
//# sourceMappingURL=script-asset-64d7d13f-8f09-47e3-9eea-9c02e3f602c2-sdk.ch.Cv-0TMlS.js.map
