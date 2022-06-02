const loadingDialogId = 'loading-dialog';

// <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 5">
//   <div class="toast fade" id="liveToast" role="alert" aria-live="assertive" aria-atomic="true">
//     <div class="toast-header bg-primary text-white">
//       <strong class="me-auto">Bootstrap</strong>
//        <small>11 mins ago</small>
//         <button class="btn-close btn-close-white" type="button" data-bs-dismiss="toast" aria-label="Close"></button>
//      </div>
//     <div class="toast-body">Hello, world! This is a toast message.</div>
//   </div>
// </div>

function getMessageBox(): HTMLElement {
  const boxId = 'message-dialog';
  const existBox = document.getElementById(boxId);
  if (existBox) {
    return existBox;
  }
  const newBox = document.createElement('div');
  newBox.id = boxId;
  newBox.className = 'position-fixed top-0 end-0 p-3 toast-container';
  newBox.style.zIndex = '1060';
  document.body.appendChild(newBox);
  return newBox;
}

export function showWarning(errMsg: any): void {
  console.warn(errMsg)
  let message = '';
  if (typeof errMsg === 'string') {
    message = errMsg;
  } else if (errMsg.message) {
    message = errMsg.message;
  } else {
    message = JSON.stringify(errMsg);
  }
  const toast = document.createElement('div');
  toast.className = 'toast fade mb-3 show';
  toast.innerHTML = `
        <div class="toast-header bg-warning text-white">
            <strong class="me-auto">警告</strong><small></small>
            <button class="btn-close btn-close-white" type="button" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">${message}</div>
    `;
  const box = getMessageBox();
  box.appendChild(toast);
  setTimeout(() => {
    box.removeChild(toast);
  }, 3000);
}

function removeDialog(id: string): void {
  const dialog = document.getElementById(id);
  if (dialog) {
    document.body.removeChild(dialog);
  }
}

export function showSuccess(msg = '操作成功'): void {
  const toast = document.createElement('div');
  toast.className = 'toast fade mb-3 show';
  toast.innerHTML = `
        <div class="toast-header bg-success text-white">
            <strong class="me-auto">成功提示</strong><small></small>
            <button class="btn-close btn-close-white" type="button" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">${msg}</div>
    `;
  const box = getMessageBox();
  box.appendChild(toast);
  setTimeout(() => {
    box.removeChild(toast);
  }, 3000);
}

export function showLoading(): void {
  hideLoading();
  const dialog = document.createElement('div');
  dialog.id = loadingDialogId;
  dialog.className = 'position-fixed top-0 bottom-0 start-0 end-0 d-flex ' +
    'justify-content-center align-items-center bg-white bg-opacity-75';
  dialog.style.zIndex = '2000';
  dialog.style.cursor = 'wait';
  dialog.innerHTML = `<div class="spinner-border"><span class="visually-hidden"></span></div>`;
  document.body.appendChild(dialog);
}

export function hideLoading(): void {
  removeDialog(loadingDialogId);
}
