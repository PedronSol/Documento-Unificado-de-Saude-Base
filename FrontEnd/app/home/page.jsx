"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { ThemeProvider } from "@/components/health-passport/theme-provider";
import { Header } from "@/components/health-passport/header";
import { MedicalAlerts } from "@/components/health-passport/medical-alerts";
import { DigitalDocuments } from "@/components/health-passport/digital-documents";

export default function HealthPassportPage() {
  const [userData, setUserData] = useState(null);
  const [vaccineData, setVaccineData] = useState([]);
  const [alertsData, setAlertsData] = useState([]);
  const [documentsData, setDocumentsData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVaccine, setEditingVaccine] = useState(null);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  const [idVacina, setIdVacina] = useState("");
  const [nomeVacina, setNomeVacina] = useState("");
  const [dose, setDose] = useState("");
  const [dataAplicacao, setDataAplicacao] = useState("");
  const [statusVacina, setStatusVacina] = useState("applied");

  const [isMarkerModalOpen, setIsMarkerModalOpen] = useState(false);
  const [editingMarker, setEditingMarker] = useState(null);
  const [markerTipo, setMarkerTipo] = useState("condition");
  const [markerNome, setMarkerNome] = useState("");
  const [markerDosagem, setMarkerDosagem] = useState("");
  const [markerFrequencia, setMarkerFrequencia] = useState("");
  const [markerDescricao, setMarkerDescricao] = useState("");
  const [markerSeveridade, setMarkerSeveridade] = useState("medium");
  const [markerError, setMarkerError] = useState("");
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [markerSuccessMsg, setMarkerSuccessMsg] = useState("");

  const [deletingMarker, setDeletingMarker] = useState(null);

  const formatarCPF = (cpf) => {
    if (!cpf) return "";
    const cpfLimpo = cpf.replace(/\D/g, "");
    if (cpfLimpo.length !== 11) return cpf;
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem("patient_data");
    const storedVaccines = sessionStorage.getItem("vaccines");
    const storedAlerts = sessionStorage.getItem("alerts");
    const storedDocuments = sessionStorage.getItem("documents");

    if (!storedUser) {
      window.location.href = "/";
      return;
    }

    setUserData(JSON.parse(storedUser));
    setVaccineData(storedVaccines ? JSON.parse(storedVaccines) : []);
    setAlertsData(storedAlerts ? JSON.parse(storedAlerts) : []);
    setDocumentsData(storedDocuments ? JSON.parse(storedDocuments) : []);
  }, []);

  const handleOpenAddModal = () => {
    setEditingVaccine(null);
    setIdVacina(Math.floor(Math.random() * 10000).toString());
    setNomeVacina("");
    setDose("");
    setDataAplicacao("");
    setStatusVacina("applied");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (vaccine) => {
    setEditingVaccine(vaccine);
    setIdVacina(vaccine.id_vacina);
    setNomeVacina(vaccine.nome_vacina);
    setDose(vaccine.dose);
    setDataAplicacao(vaccine.data_aplicacao || "");
    setStatusVacina(vaccine.status_vacina);
    setIsModalOpen(true);
  };

  const handleSaveVaccine = async (e) => {
    e.preventDefault();
    setIsLoadingAction(true);

    const payload = {
      nome_vacina: nomeVacina,
      dose: dose,
      data_aplicacao: dataAplicacao || null,
      status_vacina: statusVacina,
    };

    const isEditing = editingVaccine !== null;
    const url = isEditing
      ? `http://localhost:8000/patients/${userData.cpf_paciente}/vaccines/${idVacina}`
      : `http://localhost:8000/patients/${userData.cpf_paciente}/vaccines`;
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erro ao salvar dados da vacina.");

      const refreshRes = await fetch(
        `http://localhost:8000/patients/${userData.cpf_paciente}/vaccines`,
      );
      const freshVaccines = await refreshRes.json();

      setVaccineData(freshVaccines);
      sessionStorage.setItem("vaccines", JSON.stringify(freshVaccines));
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleDeleteVaccine = async (id_vacina) => {
    if (!confirm("Tem certeza que deseja remover esta vacina do prontuário?"))
      return;

    try {
      const response = await fetch(
        `http://localhost:8000/patients/${userData.cpf_paciente}/vaccines/${id_vacina}`,
        { method: "DELETE" },
      );

      if (!response.ok) throw new Error("Erro ao deletar vacina.");

      const updatedVaccines = vaccineData.filter(
        (v) => v.id_vacina !== id_vacina,
      );
      setVaccineData(updatedVaccines);
      sessionStorage.setItem("vaccines", JSON.stringify(updatedVaccines));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleOpenAddMarkerModal = () => {
    setEditingMarker(null);
    setMarkerTipo("medication");
    setMarkerNome("");
    setMarkerDosagem("");
    setMarkerFrequencia("");
    setMarkerDescricao("");
    setMarkerSeveridade("medium");
    setMarkerError("");
    setDuplicateWarning(null);
    setIsMarkerModalOpen(true);
  };

  const handleOpenEditMarkerModal = (marker) => {
    setEditingMarker(marker);
    setMarkerTipo(marker.tipo_alerta);
    setMarkerNome(marker.titulo_alerta);
    setMarkerDosagem("");
    setMarkerFrequencia("");
    setMarkerDescricao(marker.descricao_alerta || "");
    setMarkerSeveridade(marker.severidade_alerta || "medium");
    setMarkerError("");
    setDuplicateWarning(null);
    setIsMarkerModalOpen(true);
  };

  const handleSaveMarker = async (e) => {
    e.preventDefault();
    setMarkerError("");
    setDuplicateWarning(null);

    if (!markerNome.trim()) {
      setMarkerError("O nome do marcador é obrigatório.");
      return;
    }

    setIsLoadingAction(true);

    let finalDescricao = markerDescricao.trim();
    if (markerTipo === "medication" && (markerDosagem.trim() || markerFrequencia.trim())) {
      const partes = [];
      if (markerDosagem.trim()) partes.push(`Dosagem: ${markerDosagem.trim()}`);
      if (markerFrequencia.trim()) partes.push(`Frequência: ${markerFrequencia.trim()}`);
      if (finalDescricao) partes.push(finalDescricao);
      finalDescricao = partes.join(" - ");
    }

    let finalTitulo = markerNome.trim();
    if (markerTipo === "medication" && markerDosagem.trim() && !finalTitulo.toLowerCase().includes(markerDosagem.trim().toLowerCase())) {
      finalTitulo = `${finalTitulo} ${markerDosagem.trim()}`;
    }

    const payload = {
      tipo_alerta: markerTipo,
      titulo_alerta: finalTitulo,
      descricao_alerta: finalDescricao,
      severidade_alerta: markerSeveridade,
    };

    const isEditing = editingMarker !== null;
    const url = isEditing
      ? `http://localhost:8000/patients/${userData.cpf_paciente}/markers/${editingMarker.id_alerta}`
      : `http://localhost:8000/patients/${userData.cpf_paciente}/markers`;
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resJson = await response.json();

      if (response.status === 409) {
        const existingId = resJson?.detail?.existing_marker_id;
        const msg = resJson?.detail?.message || "Esta condição ou medicação já está cadastrada.";
        setDuplicateWarning({
          message: msg,
          existingId: existingId,
        });
        return;
      }

      if (!response.ok) {
        const errorDetail = typeof resJson.detail === "string" ? resJson.detail : "Erro ao salvar marcador de saúde.";
        throw new Error(errorDetail);
      }

      const refreshRes = await fetch(
        `http://localhost:8000/patients/${userData.cpf_paciente}/markers`,
      );
      const freshMarkers = await refreshRes.json();

      setAlertsData(freshMarkers);
      sessionStorage.setItem("alerts", JSON.stringify(freshMarkers));
      setIsMarkerModalOpen(false);

      setMarkerSuccessMsg(isEditing ? "Marcador atualizado com sucesso!" : "Marcador salvo com sucesso!");
      setTimeout(() => setMarkerSuccessMsg(""), 4000);
    } catch (err) {
      setMarkerError(err.message);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleOpenDeleteMarkerModal = (marker) => {
    setDeletingMarker(marker);
  };

  const handleConfirmDeleteMarker = async () => {
    if (!deletingMarker) return;
    setIsLoadingAction(true);

    try {
      const response = await fetch(
        `http://localhost:8000/patients/${userData.cpf_paciente}/markers/${deletingMarker.id_alerta}`,
        { method: "DELETE" },
      );

      if (!response.ok) throw new Error("Erro ao remover marcador de saúde.");

      const updated = alertsData.filter(
        (m) => m.id_alerta !== deletingMarker.id_alerta,
      );
      setAlertsData(updated);
      sessionStorage.setItem("alerts", JSON.stringify(updated));
      setDeletingMarker(null);

      setMarkerSuccessMsg("Marcador removido com sucesso!");
      setTimeout(() => setMarkerSuccessMsg(""), 4000);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleEditDuplicateMarker = () => {
    if (!duplicateWarning?.existingId) return;
    const existing = alertsData.find((m) => m.id_alerta === duplicateWarning.existingId);
    if (existing) {
      handleOpenEditMarkerModal(existing);
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">
          Carregando prontuário digital...
        </p>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background relative">
        <Header
          userName={userData.nome_paciente}
          userAvatar={userData.avatar}
          healthStatus={userData.status_saude}
        />

        <main className="pb-16 lg:pb-8">
          <div className="container max-w-7xl mx-auto px-4 py-6 lg:px-8 lg:py-8">
            <div className="mb-6 bg-card border border-border/50 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <p>
                  <strong>Nome Completo:</strong> {userData.nome_completo}
                </p>
                <p>
                  <strong>CPF:</strong> {formatarCPF(userData.cpf_paciente)}
                </p>
                <p>
                  <strong>Idade:</strong> {userData.idade} anos
                </p>
                <p>
                  <strong>Tipo Sanguíneo:</strong> {userData.tipo_sanguineo}
                </p>
              </div>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-lg ${userData.maior_de_idade ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}
              >
                {userData.maior_de_idade
                  ? "Acesso Completo (Adulto)"
                  : "Acesso Restrito (Menor de Idade)"}
              </span>
            </div>

            {markerSuccessMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{markerSuccessMsg}</span>
                </div>
                <button
                  onClick={() => setMarkerSuccessMsg("")}
                  className="text-emerald-400 hover:text-emerald-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="space-y-6 lg:space-y-8 w-full">
              <MedicalAlerts
                alerts={alertsData}
                onAdd={handleOpenAddMarkerModal}
                onEdit={handleOpenEditMarkerModal}
                onDelete={handleOpenDeleteMarkerModal}
                canManage={userData.maior_de_idade}
              />
              <DigitalDocuments documents={documentsData} />

              <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">
                      Histórico de Vacinação
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Gerencie o registro de vacinas aplicadas ou pendentes
                    </p>
                  </div>
                  {userData.maior_de_idade && (
                    <button
                      onClick={handleOpenAddModal}
                      className="flex items-center gap-1 text-xs font-medium bg-primary text-primary-foreground px-3 h-9 rounded-xl hover:bg-primary/90 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar Vacina
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vaccineData.map((vaccine) => (
                    <div
                      key={vaccine.id_vacina}
                      className="bg-secondary/20 border border-border/40 rounded-xl p-4 flex flex-col justify-between relative group"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-sm text-foreground">
                            {vaccine.nome_vacina}
                          </h3>

                          {userData.maior_de_idade && (
                            <div className="flex items-center gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleOpenEditModal(vaccine)}
                                className="p-1.5 text-muted-foreground hover:text-primary hover:bg-secondary rounded-lg transition-colors"
                                title="Editar vacina"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteVaccine(vaccine.id_vacina)
                                }
                                className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                title="Excluir vacina"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {vaccine.dose}
                        </p>
                        {vaccine.data_aplicacao && (
                          <p className="text-[11px] text-muted-foreground/80">
                            Aplicada em: {vaccine.data_aplicacao}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
                            vaccine.status_vacina === "applied"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : vaccine.status_vacina === "pending"
                                ? "bg-amber-500/10 text-amber-500"
                                : "bg-rose-500/10 text-rose-500"
                          }`}
                        >
                          {vaccine.status_vacina === "applied" ? (
                            <Check className="w-3 h-3" />
                          ) : vaccine.status_vacina === "pending" ? (
                            <Clock className="w-3 h-3" />
                          ) : (
                            <AlertTriangle className="w-3 h-3" />
                          )}
                          {vaccine.status_vacina === "applied"
                            ? "Aplicada"
                            : vaccine.status_vacina === "pending"
                              ? "Pendente"
                              : "Atrasada"}
                        </span>
                        <span className="text-[10px] text-muted-foreground/50">
                          ID: #{vaccine.id_vacina}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl relative z-10"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-foreground">
                    {editingVaccine
                      ? "Editar Registro de Vacina"
                      : "Registrar Nova Vacina"}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveVaccine} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1">
                      Nome da Vacina
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: COVID-19 (Pfizer), Influenza"
                      value={nomeVacina}
                      onChange={(e) => setNomeVacina(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1">
                      Dose / Categoria
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: 1ª Dose, Dose Anual, Reforço"
                      value={dose}
                      onChange={(e) => setDose(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-foreground block mb-1">
                        Status
                      </label>
                      <select
                        value={statusVacina}
                        onChange={(e) => setStatusVacina(e.target.value)}
                        className="w-full h-10 px-2 rounded-xl bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      >
                        <option value="applied">Aplicada</option>
                        <option value="pending">Pendente</option>
                        <option value="overdue">Atrasada</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-foreground block mb-1">
                        Data de Aplicação
                      </label>
                      <input
                        type="date" // Transforma em um seletor de calendário nativo
                        required={statusVacina === "applied"}
                        value={dataAplicacao}
                        disabled={statusVacina !== "applied"}
                        onChange={(e) => setDataAplicacao(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="h-10 px-4 rounded-xl text-xs font-medium text-muted-foreground hover:bg-secondary transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isLoadingAction}
                      className="h-10 px-4 bg-primary text-primary-foreground rounded-xl text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {isLoadingAction ? "Salvando..." : "Salvar Registro"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isMarkerModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMarkerModalOpen(false)}
                className="absolute inset-0"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-card border border-border rounded-2xl w-full max-w-lg p-6 shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      {editingMarker ? "Editar Marcador de Saúde" : "Adicionar Marcador de Saúde"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Medicação em uso, condição crônica, diagnóstico ou alergia
                    </p>
                  </div>
                  <button
                    onClick={() => setIsMarkerModalOpen(false)}
                    className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {markerError && (
                  <div className="mb-4 p-3 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{markerError}</span>
                  </div>
                )}

                {duplicateWarning && (
                  <div className="mb-4 p-3.5 rounded-xl bg-warning/15 border border-warning/30 text-warning text-xs space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">{duplicateWarning.message}</p>
                        <p className="text-muted-foreground mt-0.5">
                          Você já possui este marcador ativo na sua lista.
                        </p>
                      </div>
                    </div>
                    {duplicateWarning.existingId && (
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={handleEditDuplicateMarker}
                          className="px-3 py-1.5 rounded-lg bg-warning/20 hover:bg-warning/30 text-warning font-medium transition-colors text-xs flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          Editar marcador existente
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <form onSubmit={handleSaveMarker} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1">
                      Tipo de Marcador *
                    </label>
                    <select
                      value={markerTipo}
                      onChange={(e) => setMarkerTipo(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    >
                      <option value="medication">Medicação em Uso</option>
                      <option value="condition">Condição Crônica / Diagnóstico</option>
                      <option value="allergy">Alergia</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1">
                      {markerTipo === "medication" ? "Nome da Medicação *" : "Nome da Condição / Alergia *"}
                    </label>
                    <input
                      type="text"
                      placeholder={markerTipo === "medication" ? "Ex: Losartana, Aspirina" : "Ex: Hipertensão, Diabetes Tipo 2, Penicilina"}
                      value={markerNome}
                      onChange={(e) => setMarkerNome(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    />
                  </div>

                  {markerTipo === "medication" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-foreground block mb-1">
                          Dosagem
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: 50mg, 100mg"
                          value={markerDosagem}
                          onChange={(e) => setMarkerDosagem(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-foreground block mb-1">
                          Frequência
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: 1x ao dia, de 8 em 8 horas"
                          value={markerFrequencia}
                          onChange={(e) => setMarkerFrequencia(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1">
                      Observações / Detalhes Adicionais
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ex: Diagnosticada em 2021, Tomar pela manhã, Reações adversas..."
                      value={markerDescricao}
                      onChange={(e) => setMarkerDescricao(e.target.value)}
                      className="w-full p-3 rounded-xl bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1">
                      Nível de Atenção / Severidade
                    </label>
                    <select
                      value={markerSeveridade}
                      onChange={(e) => setMarkerSeveridade(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    >
                      <option value="low">Baixa</option>
                      <option value="medium">Média</option>
                      <option value="high">Alta</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsMarkerModalOpen(false)}
                      className="h-10 px-4 rounded-xl text-xs font-medium text-muted-foreground hover:bg-secondary transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isLoadingAction}
                      className="h-10 px-4 bg-primary text-primary-foreground rounded-xl text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {isLoadingAction ? "Salvando..." : "Confirmar Cadastro"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {deletingMarker && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDeletingMarker(null)}
                className="absolute inset-0"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-card border border-destructive/30 rounded-2xl w-full max-w-md p-6 shadow-2xl relative z-10"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-destructive/15 flex items-center justify-center text-destructive shrink-0">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      Remover Marcador de Saúde
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Confirmação de exclusão
                    </p>
                  </div>
                </div>

                <p className="text-sm text-foreground/90 mb-3">
                  Deseja remover o marcador <strong>"{deletingMarker.titulo_alerta}"</strong>?
                </p>
                <p className="text-xs text-muted-foreground mb-6 bg-secondary/30 p-3 rounded-xl border border-border/40">
                  ⚠️ Este marcador será desativado do seu perfil atual e deixará de ser exibido na sua listagem ativa.
                </p>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setDeletingMarker(null)}
                    className="h-10 px-4 rounded-xl text-xs font-medium text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDeleteMarker}
                    disabled={isLoadingAction}
                    className="h-10 px-4 bg-destructive text-destructive-foreground rounded-xl text-xs font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50"
                  >
                    {isLoadingAction ? "Removendo..." : "Sim, Remover Marcador"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </ThemeProvider>
  );
}
