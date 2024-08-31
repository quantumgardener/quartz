import { jsx as _jsx, Fragment as _Fragment } from "preact/jsx-runtime";
export default ((component) => {
    if (component) {
        const Component = component;
        const DesktopOnly = (props) => {
            return _jsx(Component, { displayClass: "desktop-only", ...props });
        };
        DesktopOnly.displayName = component.displayName;
        DesktopOnly.afterDOMLoaded = component?.afterDOMLoaded;
        DesktopOnly.beforeDOMLoaded = component?.beforeDOMLoaded;
        DesktopOnly.css = component?.css;
        return DesktopOnly;
    }
    else {
        return () => _jsx(_Fragment, {});
    }
});
