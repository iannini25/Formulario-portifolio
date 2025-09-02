document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".login-form");
  const statusDiv = document.getElementById("form-status");
  const whatsappInput = document.getElementById("whatsapp");
  const submitBtn = form.querySelector('button[type="submit"]');
  const servicosHidden = document.getElementById("servicos-hidden"); // <input type="hidden" name="servicos" id="servicos-hidden">

  // Máscara fixa: (00) 0000-0000 (10 dígitos)
  whatsappInput.addEventListener("input", function (e) {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 10) v = v.slice(0, 10);

    if (v.length > 6) {
      v = v.replace(/(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (v.length > 2) {
      v = v.replace(/(\d{2})(\d{0,4})/, "($1) $2");
    } else {
      v = v.replace(/(\d{0,2})/, "($1");
    }
    e.target.value = v;
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Coleta campos
    const nome = form.querySelector('input[name="nome"]').value.trim();
    const whatsapp = whatsappInput.value.trim();

    // Coleta os checkboxes marcados (validação do "clique")
    const servicosSelecionados = Array.from(
      form.querySelectorAll('input[name="servicos[]"]:checked')
    ).map(el => el.value);

    // Validações
    const regex = /^\(\d{2}\) \d{4}-\d{4}$/;
    if (!regex.test(whatsapp)) {
      statusDiv.textContent = "⚠️ Insira um número válido no formato (00) 0000-0000.";
      statusDiv.className = "error";
      return;
    }
    if (servicosSelecionados.length === 0) {
      statusDiv.textContent = "⚠️ Selecione pelo menos um serviço (Figma e/ou Código).";
      statusDiv.className = "error";
      return;
    }

    // Preenche o hidden com a string final (o Apps Script lê este campo)
    servicosHidden.value = servicosSelecionados.join(" + ");

    // Monta o payload diretamente do form (inclui nome, whatsapp, servicos[] e servicos)
    const fd = new FormData(form);

    const scriptURL = "https://script.google.com/macros/s/AKfycbzb5aeYa87uGGVB6d-m_gGAtAi_Nu6slKGUOZ5QA94SB051vEqLjjZI2hgmkkPZM-E/exec";

    statusDiv.textContent = "Enviando…";
    statusDiv.className = "";
    submitBtn.disabled = true;

    fetch(scriptURL, { method: "POST", mode: "no-cors", body: fd })
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
