import { STORAGE_KEY } from '../core/constants.js';

export function confirmReset() {
  const overlay = document.createElement('div');
  overlay.style =
    'position:fixed; inset:0; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; z-index:2000;';

  overlay.innerHTML = `
    <div style="background:white; padding:30px; border-radius:12px; text-align:center; max-width:350px;">
      <h3 style="margin-bottom:10px; color:#1e293b">تأكيد المسح؟</h3>
      <p style="color:#64748b; margin-bottom:25px;">سيتم حذف كافة البيانات المدخلة نهائياً من المتصفح.</p>
      <div style="display:flex; gap:10px; justify-content:center">
        <button type="button" data-role="cancel" class="btn-secondary">إلغاء</button>
        <button type="button" data-role="final-reset" class="btn-danger">نعم، امسح الكل</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector('[data-role="cancel"]').onclick = () => {
    overlay.remove();
  };

  overlay.querySelector('[data-role="final-reset"]').onclick = () => {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  };
}
