import { createApp } from 'vue';
import Toast from './Toast.vue';

let toastContainer: HTMLElement | null = null;

const defaultIcons: Record<string, string> = {
  info: 'info',
  success: 'check_circle',
  warning: 'warning',
  error: 'error',
};

function createToastContainer(): void {
  if (!toastContainer) {
    const existingContainer = document.getElementById('toast-container');
    if (existingContainer) {
      toastContainer = existingContainer;
      return;
    }

    const container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
    toastContainer = container;
    injectToastStyles();
  }
}

function injectToastStyles(): void {
  const styleId = 'toast-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      #toast-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 10px;
      }
    `;
    document.head.appendChild(style);
  }
}

function removeToastContainerIfEmpty(): void {
  if (toastContainer && toastContainer.children.length === 0) {
    toastContainer.remove();
    toastContainer = null;
  }
}

export function showToast(
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  icon?: string,
  duration: number = 5000
): void {
  const finalIcon = icon || defaultIcons[type];
  createToastContainer();

  const toastInstance = createApp(Toast, {
    message,
    type,
    icon: finalIcon,
    duration,
  });

  const toastElement = document.createElement('div');
  toastInstance.mount(toastElement);
  toastContainer?.appendChild(toastElement);

  const toastComponent = toastInstance._instance?.proxy as InstanceType<
    typeof Toast
  >;
  toastComponent.show();

  setTimeout(() => {
    toastInstance.unmount();
    toastElement.remove();
    toastComponent.hide();
    removeToastContainerIfEmpty();
  }, duration + 100);
}
