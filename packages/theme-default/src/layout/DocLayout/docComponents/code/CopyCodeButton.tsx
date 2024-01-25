import { useRef, type MutableRefObject } from 'react';
import copy from 'copy-to-clipboard';
import IconCopy from '../../../../assets/copy.svg';
import IconSuccess from '../../../../assets/success.svg';
import styles from './index.module.scss';

const timeoutIdMap: Map<HTMLElement, NodeJS.Timeout> = new Map();

function copyCode(
  codeBlockElement: HTMLDivElement,
  copyButtonElement: HTMLButtonElement,
) {
  let text = '';
  const walk = document.createTreeWalker(
    codeBlockElement,
    NodeFilter.SHOW_TEXT,
    null,
  );
  let node = walk.nextNode();
  while (node) {
    if (!node.parentElement.classList.contains('linenumber')) {
      text += node.nodeValue;
    }
    node = walk.nextNode();
  }

  const isCopied = copy(text);

  if (isCopied && copyButtonElement) {
    copyButtonElement.classList.add(styles.codeCopied);
    clearTimeout(timeoutIdMap.get(copyButtonElement));
    const timeoutId = setTimeout(() => {
      copyButtonElement.classList.remove(styles.codeCopied);
      copyButtonElement.blur();
      timeoutIdMap.delete(copyButtonElement);
    }, 2000);
    timeoutIdMap.set(copyButtonElement, timeoutId);
  }
}

export function CopyCodeButton({
  codeBlockRef,
}: {
  codeBlockRef: MutableRefObject<HTMLDivElement>;
}) {
  const copyButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <button
      className={styles.codeCopyButton}
      onClick={() => copyCode(codeBlockRef.current, copyButtonRef.current)}
      ref={copyButtonRef}
    >
      <IconCopy className={styles.iconCopy} />
      <IconSuccess className={styles.iconSuccess} />
    </button>
  );
}