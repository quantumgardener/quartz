import { jsx as _jsx, Fragment as _Fragment } from "preact/jsx-runtime";
export default ((component) => {
    if (component) {
        const Component = component;
        const MobileOnly = (props) => {
            return _jsx(Component, { displayClass: "mobile-only", ...props });
        };
        MobileOnly.displayName = component.displayName;
        MobileOnly.afterDOMLoaded = component?.afterDOMLoaded;
        MobileOnly.beforeDOMLoaded = component?.beforeDOMLoaded;
        MobileOnly.css = component?.css;
        return MobileOnly;
    }
    else {
        return () => _jsx(_Fragment, {});
    }
});
