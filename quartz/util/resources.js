import { jsx as _jsx } from "preact/jsx-runtime";
import { randomUUID } from "crypto";
export function JSResourceToScriptElement(resource, preserve) {
    const scriptType = resource.moduleType ?? "application/javascript";
    const spaPreserve = preserve ?? resource.spaPreserve;
    if (resource.contentType === "external") {
        return (_jsx("script", { src: resource.src, type: scriptType }, resource.src));
    }
    else {
        const content = resource.script;
        return (_jsx("script", { type: scriptType, "spa-preserve": spaPreserve, dangerouslySetInnerHTML: { __html: content } }, randomUUID()));
    }
}
