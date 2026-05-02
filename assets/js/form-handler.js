// ─── Static form handler ─────────────────────────────────
// Handles all [data-form] forms — POST to data-webhook, show status

document.querySelectorAll('form[data-form]').forEach((form) => {
  const statusEl  = form.querySelector('.form-status');
  const submitBtn = form.querySelector('[type="submit"]');

  const setStatus = (type, msg) => {
    if (!statusEl) return;
    statusEl.className = 'form-status form-status--' + type;
    statusEl.textContent = msg;
    statusEl.hidden = false;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic client-side required validation
    const requiredFields = form.querySelectorAll('[required]');
    let hasError = false;
    requiredFields.forEach((el) => {
      el.classList.remove('form-input--error');
      if (!el.value.trim()) {
        el.classList.add('form-input--error');
        hasError = true;
      }
    });
    if (hasError) {
      setStatus('error', 'Please fill in all required fields.');
      form.querySelector('.form-input--error')?.focus();
      return;
    }

    const webhook = form.dataset.webhook;
    if (!webhook) {
      setStatus('error', 'Form is not configured yet. Please call us at (858) 459-7374.');
      return;
    }

    // Build FormData — preserves multi-value checkboxes
    const formData = new FormData(form);

    // Append source URL for reference
    formData.append('_source', window.location.href);

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      const res  = await fetch(webhook, { method: 'POST', body: formData });
      const json = await res.json();

      if (json.success) {
        form.reset();
        form.classList.add('form--sent');
        const successMsg = form.dataset.success || 'Thank you — we\'ll be in touch within one business day.';
        setStatus('success', successMsg);
        statusEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        throw new Error(json.message || 'Submission failed');
      }
    } catch (err) {
      setStatus('error', 'Something went wrong. Please try again or call us at (858) 459-7374.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = submitBtn.dataset.label || 'Submit';
    }
  });
});
