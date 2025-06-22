function processTitleElement(element) {
    const elementClone = element.cloneNode(true);
    const anchorElement = elementClone.querySelector('.header-anchor');
    if (anchorElement) elementClone.removeChild(anchorElement);
    const excludeElements = elementClone.querySelectorAll('.rspress-toc-exclude');
    excludeElements.forEach((excludeElement)=>{
        const parentElement = excludeElement.parentElement;
        if (parentElement) parentElement.removeChild(excludeElement);
    });
    const anchorElements = elementClone.querySelectorAll('a');
    anchorElements.forEach((anchor)=>{
        const tempContainer = document.createDocumentFragment();
        while(anchor.firstChild)tempContainer.appendChild(anchor.firstChild);
        anchor.replaceWith(tempContainer);
    });
    return elementClone;
}
export { processTitleElement };
