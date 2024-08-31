export function capitalize(s) {
    return s.substring(0, 1).toUpperCase() + s.substring(1);
}
export function classNames(displayClass, ...classes) {
    if (displayClass) {
        classes.push(displayClass);
    }
    return classes.join(" ");
}
