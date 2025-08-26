document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".login-form");
  const statusDiv = document.getElementById("form-status");
  const whatsappInput = document.getElementById("whatsapp");
  const submitBtn = form.querySelector('button[type="submit"]');

  // Máscara: (00) 00000-0000 — 11 dígitos
  whatsappInput.addEventListener("input", function (e) {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);

    if (v.length > 7) {
      v = v.replace(/(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
    } else if (v.length > 2) {
      v = v.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    } else {
      v = v.replace(/(\d{0,2})/, "($1");
    }
    e.target.value = v;
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = form.querySelector('input[name="nome"]').value.trim();
    const whatsapp = whatsappInput.value.trim();

    // valida formato exato
    const regex = /^\(\d{2}\) \d{5}-\d{4}$/;
    if (!regex.test(whatsapp)) {
      statusDiv.textContent = "⚠️ Insira um número válido no formato (00) 00000-0000.";
      statusDiv.className = "error";
      return;
    }

    // URL do seu Web App (termina em /exec)
    const scriptURL = "https://script.google.com/macros/s/AKfycbz7cZxZr0mkQ6omdezYXW1PbqU0Id27-7wKRh_NtvcRiY1IMQNenpzv_JpNx646eLc/exec";

    // Enviar como FormData (Apps Script lê em e.parameter)
    const fd = new FormData();
    fd.append("nome", nome);
    fd.append("whatsapp", whatsapp);

    statusDiv.textContent = "Enviando…";
    statusDiv.className = "";
    submitBtn.disabled = true;

    fetch(scriptURL, {
      method: "POST",
      mode: "no-cors",
      body: fd,
    })
      .then(() => {
        statusDiv.textContent = "✅ Dados enviados com sucesso!";
        statusDiv.className = "success";
        form.reset();
      })
      .catch((error) => {
        statusDiv.textContent = "❌ Erro ao enviar os dados. Tente novamente.";
        statusDiv.className = "error";
        console.error("Erro:", error);
      })
      .finally(() => {
        submitBtn.disabled = false;
      });
  });
});
