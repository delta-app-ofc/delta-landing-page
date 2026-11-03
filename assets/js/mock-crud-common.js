/* Funções compartilhadas pelas telas administrativas CRUD. */
(function () {
  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatValue(value, index, types) {
    if (types[index] === "date" && value) {
      const parts = value.split("-");
      return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : value;
    }
    return value;
  }

  window.DeltaCrud = {
    escape: escapeHtml,
    format: formatValue,
    getRequiredFormValues(event, fieldCount) {
      event.preventDefault();
      const values = Array.from(
        { length: fieldCount },
        (_, index) => document.getElementById(`f${index}`).value
      );
      if (values.some((value) => !String(value).trim())) {
        window.alert("Preencha todos os campos.");
        return null;
      }
      return values;
    },
    saveRecord(id, values) {
      const isEdit = id !== 0;
      const nextRecords = records.map((record) => ({ ...record, values: [...record.values] }));
      if (isEdit) {
        const record = nextRecords.find((item) => item.id === id);
        if (record) record.values = values;
      } else {
        const nextId = nextRecords.length
          ? Math.max(...nextRecords.map((record) => record.id)) + 1
          : 1;
        nextRecords.push({ id: nextId, values });
      }

      const result = DeltaDB.writeCollection(KEY, nextRecords);
      if (result?.ok === false) {
        window.alert(result.message || "Não foi possível salvar o registro.");
        return null;
      }
      records = nextRecords;
      editingId = null;
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return isEdit;
    }
  };

  window.startCreate = function () {
    editingId = 0;
    render();
  };

  window.editRecord = function (id) {
    editingId = Number(id);
    render();
  };

  window.cancelForm = function () {
    editingId = null;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.deleteRecord = function (id) {
    window.recordToDelete = id;
    window.showPopup("delete", { id });
    document.getElementById("confirmDeleteBtn").onclick = function () {
      if (window.recordToDelete === null) return;
      const nextRecords = records.filter((record) => record.id !== window.recordToDelete);
      const result = DeltaDB.writeCollection(KEY, nextRecords);
      if (result?.ok === false) {
        window.alert(result.message || "Não foi possível excluir o registro.");
        return;
      }
      records = nextRecords;
      window.closePopup();
      render();
      window.showToast(
        "Registro excluído com sucesso da base de dados.",
        "REGISTRO EXCLUÍDO",
        "delete"
      );
    };
  };

  window.showPopup = function (type, data = {}) {
    const overlay = document.getElementById("popupOverlay");
    const successContent = document.getElementById("popupSuccess");
    const deleteContent = document.getElementById("popupDelete");

    successContent.classList.remove("active");
    deleteContent.classList.remove("active");

    if (type === "success") {
      document.getElementById("popupSuccessTitle").innerText = data.title || "Cadastro concluído!";
      document.getElementById("popupSuccessDesc").innerText = data.desc || "Ação realizada com sucesso no sistema Delta.";
      if (data.tag) document.getElementById("popupSuccessTag").innerText = data.tag;
      successContent.classList.add("active");
    } else if (type === "delete") {
      document.getElementById("deleteRecordLabel").innerText = `ID #${data.id}`;
      deleteContent.classList.add("active");
    }

    document.body.classList.add("locked");
    overlay.classList.add("show");
  };

  window.closePopup = function () {
    document.getElementById("popupOverlay").classList.remove("show");
    document.body.classList.remove("locked");
    if ("recordToDelete" in window) window.recordToDelete = null;
  };

  window.showToast = function (message, title = "Sucesso", type = "success") {
    const toast = document.getElementById("globalToast");
    toast.className = "global-toast show";
    if (type === "edit") toast.classList.add("toast-edit");
    if (type === "delete") toast.classList.add("toast-delete");

    document.getElementById("toastTitle").innerText = title;
    document.getElementById("toastMessage").innerText = message;
    document.getElementById("toastSymbol").innerText = type === "delete" ? "!" : "✓";
    setTimeout(window.hideToast, 4000);
  };

  window.hideToast = function () {
    document.getElementById("globalToast").classList.remove("show");
  };
})();
