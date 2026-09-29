import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import {
  createDocument,
  uploadDocument,
  getDocuments,
  updateDocument,
  updateUploadedDocument,
  deleteDocument,
} from "../api/documentApi";

const API_BASE_URL = "http://localhost:5000";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [name, setName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("");
  const [category, setCategory] = useState("general");
  const [selectedFile, setSelectedFile] = useState(null);
  const [sourceType, setSourceType] = useState("url");
  const [editingDocument, setEditingDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data.data || []);
    } catch (error) {
      console.error("Documents error:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const resetForm = () => {
    setName("");
    setFileUrl("");
    setFileType("");
    setCategory("general");
    setSelectedFile(null);
    setSourceType("url");
    setEditingDocument(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);

    if (!fileType) {
      setFileType(file.type);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a document name.");
      return;
    }

    if (sourceType === "url" && !fileUrl.trim()) {
      alert("Please enter a document URL.");
      return;
    }

    if (sourceType === "upload" && !selectedFile && !editingDocument) {
      alert("Please choose a file.");
      return;
    }

    try {
      setLoading(true);

      const documentData = {
        name: name.trim(),
        category,
      };

      if (sourceType === "url") {
        documentData.fileUrl = fileUrl.trim();
        documentData.fileType = fileType.trim();
      }

      if (editingDocument) {
        if (sourceType === "upload" && selectedFile) {
          const formData = new FormData();

          formData.append("name", name.trim());
          formData.append("category", category);
          formData.append("file", selectedFile);

          await updateUploadedDocument(
            editingDocument._id,
            formData
          );
        } else {
          await updateDocument(
            editingDocument._id,
            documentData
          );
        }
      } else if (sourceType === "upload") {
        const formData = new FormData();

        formData.append("name", name.trim());
        formData.append("category", category);
        formData.append("file", selectedFile);

        await uploadDocument(formData);
      } else {
        await createDocument(documentData);
      }

      resetForm();
      await fetchDocuments();
    } catch (error) {
      console.error("Document save error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to save document. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (document) => {
    setEditingDocument(document);
    setName(document.name || "");
    setCategory(document.category || "general");

    setFileUrl(
      document.sourceType === "url"
        ? document.fileUrl || ""
        : ""
    );

    setFileType(document.fileType || "");
    setSelectedFile(null);
    setSourceType(document.sourceType || "url");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deleteDocument(id);
      await fetchDocuments();
    } catch (error) {
      console.error("Delete document error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to delete document."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const getDocumentUrl = (document) => {
    if (!document.fileUrl) return null;

    if (
      document.fileUrl.startsWith("http://") ||
      document.fileUrl.startsWith("https://")
    ) {
      return document.fileUrl;
    }

    return `${API_BASE_URL}${document.fileUrl}`;
  };

  const totalDocuments = documents.length;

  const uploadedDocuments = documents.filter(
    (document) => document.sourceType === "upload"
  ).length;

  const urlDocuments = documents.filter(
    (document) => document.sourceType === "url"
  ).length;

  const categoryCount = new Set(
    documents.map(
      (document) => document.category || "general"
    )
  ).size;

  const latestCount = documents.filter((document) => {
    if (!document.createdAt) return false;

    const created = new Date(document.createdAt);
    const now = new Date();

    return (
      created.getMonth() === now.getMonth() &&
      created.getFullYear() === now.getFullYear()
    );
  }).length;

  const getDocumentIcon = (document) => {
    const type = document.fileType?.toLowerCase() || "";

    if (type.includes("pdf")) return "📕";
    if (type.includes("image")) return "🖼";
    if (type.includes("word") || type.includes("doc")) return "📘";
    if (document.sourceType === "upload") return "📎";

    return "🔗";
  };

  return (
    <MainLayout>
      <div className="min-h-full bg-[#f8f7ff] px-5 py-8 dark:bg-[#100d18] sm:px-8 lg:px-10">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-violet-400/10 blur-3xl dark:bg-violet-600/10" />
          <div className="absolute right-0 top-10 h-80 w-80 rounded-full bg-pink-400/10 blur-3xl dark:bg-pink-600/10" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          {/* HEADER */}
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-violet-600 shadow-sm dark:border-violet-500/20 dark:bg-[#17121f] dark:text-violet-300">
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-500" />
                Personal Library
              </div>

              <h1 className="text-3xl font-black tracking-tight text-[#172033] dark:text-white sm:text-4xl">
                Your Documents
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                Store your important files, notes and online resources
                in one organized workspace.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="rounded-2xl border border-violet-100 bg-white px-5 py-3 shadow-sm dark:border-violet-500/20 dark:bg-[#17121f]">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Documents
                </p>

                <p className="mt-1 text-lg font-black text-violet-600 dark:text-violet-300">
                  {totalDocuments}
                </p>
              </div>

              <div className="rounded-2xl border border-pink-100 bg-white px-5 py-3 shadow-sm dark:border-pink-500/20 dark:bg-[#17121f]">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  This Month
                </p>

                <p className="mt-1 text-lg font-black text-pink-600 dark:text-pink-300">
                  {latestCount}
                </p>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="relative overflow-hidden rounded-2xl border border-violet-100 bg-white p-5 shadow-sm dark:border-violet-500/20 dark:bg-[#17121f]">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-400/10 blur-2xl" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Total Documents
                  </p>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-lg dark:bg-violet-500/10">
                    📚
                  </div>
                </div>

                <p className="mt-4 text-3xl font-black text-[#172033] dark:text-white">
                  {totalDocuments}
                </p>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
                  <div className="h-full w-full rounded-full bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500" />
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-pink-100 bg-white p-5 shadow-sm dark:border-pink-500/20 dark:bg-[#17121f]">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-pink-400/10 blur-2xl" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Uploaded Files
                  </p>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-lg dark:bg-pink-500/10">
                    📎
                  </div>
                </div>

                <p className="mt-4 text-3xl font-black text-pink-600 dark:text-pink-300">
                  {uploadedDocuments}
                </p>

                <p className="mt-2 text-xs font-medium text-slate-400">
                  Files from your device
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-violet-100 bg-white p-5 shadow-sm dark:border-violet-500/20 dark:bg-[#17121f]">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-400/10 blur-2xl" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Online Resources
                  </p>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-lg dark:bg-violet-500/10">
                    🔗
                  </div>
                </div>

                <p className="mt-4 text-3xl font-black text-violet-600 dark:text-violet-300">
                  {urlDocuments}
                </p>

                <p className="mt-2 text-xs font-medium text-slate-400">
                  Saved external resources
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-pink-100 bg-white p-5 shadow-sm dark:border-pink-500/20 dark:bg-[#17121f]">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-pink-400/10 blur-2xl" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Categories
                  </p>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-lg dark:bg-pink-500/10">
                    ◈
                  </div>
                </div>

                <p className="mt-4 text-3xl font-black text-pink-600 dark:text-pink-300">
                  {categoryCount}
                </p>

                <p className="mt-2 text-xs font-medium text-slate-400">
                  Organized groups
                </p>
              </div>
            </div>
          </div>

          {/* MAIN WORKSPACE */}
          <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
            {/* CREATE / EDIT */}
            <div className="h-fit overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-sm dark:border-violet-500/20 dark:bg-[#17121f]">
              <div className="border-b border-violet-100 bg-gradient-to-r from-violet-50 via-white to-pink-50 px-6 py-6 dark:border-violet-500/10 dark:from-violet-500/10 dark:via-[#17121f] dark:to-pink-500/10">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl text-white shadow-lg ${
                      editingDocument
                        ? "bg-gradient-to-br from-pink-500 to-fuchsia-500 shadow-pink-500/20"
                        : "bg-gradient-to-br from-violet-600 to-pink-500 shadow-violet-500/20"
                    }`}
                  >
                    {editingDocument ? "✎" : "+"}
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                      {editingDocument ? "Update" : "New Document"}
                    </p>

                    <h2 className="mt-1 text-xl font-black text-[#172033] dark:text-white">
                      {editingDocument
                        ? "Edit Document"
                        : "Add a Document"}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* NAME */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                      Document name
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. DBMS Notes"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-violet-400 dark:focus:bg-white/10 dark:focus:ring-violet-500/10"
                    />
                  </div>

                  {/* SOURCE */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                      Add from
                    </label>

                    <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1 dark:bg-white/5">
                      <button
                        type="button"
                        onClick={() => setSourceType("url")}
                        className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                          sourceType === "url"
                            ? "bg-white text-violet-600 shadow-sm dark:bg-[#241a30] dark:text-violet-300"
                            : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
                        }`}
                      >
                        🔗 URL
                      </button>

                      <button
                        type="button"
                        onClick={() => setSourceType("upload")}
                        className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                          sourceType === "upload"
                            ? "bg-white text-violet-600 shadow-sm dark:bg-[#241a30] dark:text-violet-300"
                            : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
                        }`}
                      >
                        📁 Upload
                      </button>
                    </div>
                  </div>

                  {/* URL */}
                  {sourceType === "url" && (
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                        Document URL
                      </label>

                      <input
                        type="url"
                        placeholder="https://example.com/file.pdf"
                        value={fileUrl}
                        onChange={(e) => setFileUrl(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-violet-400 dark:focus:bg-white/10 dark:focus:ring-violet-500/10"
                      />
                    </div>
                  )}

                  {/* UPLOAD */}
                  {sourceType === "upload" && (
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                        Choose file
                      </label>

                      <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center transition hover:border-violet-300 hover:bg-violet-50/40 dark:border-white/10 dark:bg-white/5 dark:hover:border-violet-400/50 dark:hover:bg-violet-500/10">
                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm transition group-hover:scale-105 dark:bg-white/10">
                          📎
                        </div>

                        <span className="max-w-full truncate text-sm font-bold text-slate-700 dark:text-slate-200">
                          {selectedFile
                            ? selectedFile.name
                            : "Choose a file"}
                        </span>

                        <span className="mt-1 text-xs text-slate-400">
                          PDF, JPG, PNG, WEBP, DOC, DOCX
                        </span>

                        <span className="mt-1 text-[11px] text-slate-400">
                          Maximum size 10MB
                        </span>

                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>

                      {editingDocument &&
                        !selectedFile &&
                        editingDocument.fileName && (
                          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                            Current file:{" "}
                            <span className="font-medium">
                              {editingDocument.fileName}
                            </span>
                          </p>
                        )}
                    </div>
                  )}

                  {/* TYPE + CATEGORY */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                        File type
                      </label>

                      <input
                        type="text"
                        placeholder="PDF"
                        value={fileType}
                        onChange={(e) => setFileType(e.target.value)}
                        disabled={
                          sourceType === "upload" && !!selectedFile
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3.5 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:focus:border-violet-400 dark:focus:bg-white/10 dark:focus:ring-violet-500/10"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                        Category
                      </label>

                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3.5 text-sm font-medium text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:focus:border-violet-400 dark:focus:bg-white/10 dark:focus:ring-violet-500/10"
                      >
                        <option value="general">General</option>
                        <option value="study">Study</option>
                        <option value="work">Work</option>
                        <option value="personal">Personal</option>
                        <option value="important">Important</option>
                      </select>
                    </div>
                  </div>

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-violet-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/25 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading
                      ? "Saving..."
                      : editingDocument
                      ? "Save Changes"
                      : "Add Document"}
                  </button>

                  {editingDocument && (
                    <button
                      type="button"
                      onClick={resetForm}
                      disabled={loading}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                    >
                      Cancel Editing
                    </button>
                  )}
                </form>
              </div>
            </div>

            {/* DOCUMENT LIBRARY */}
            <div className="min-w-0">
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-500 dark:text-violet-300">
                    Document Workspace
                  </p>

                  <h2 className="mt-1 text-2xl font-black tracking-tight text-[#172033] dark:text-white">
                    Your Library
                  </h2>
                </div>

                <p className="text-sm font-semibold text-slate-400">
                  {documents.length} document
                  {documents.length !== 1 ? "s" : ""} saved
                </p>
              </div>

              {documents.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-violet-200 bg-white px-6 py-20 text-center shadow-sm dark:border-violet-500/20 dark:bg-[#17121f]">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-50 to-pink-50 text-2xl dark:from-violet-500/10 dark:to-pink-500/10">
                    📚
                  </div>

                  <h3 className="mt-5 text-lg font-black text-[#172033] dark:text-white">
                    No documents yet
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Add your first file or online resource and
                    start building your personal library.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {documents.map((document) => {
                    const documentUrl = getDocumentUrl(document);

                    return (
                      <article
                        key={document._id}
                        className="group relative overflow-hidden rounded-3xl border border-violet-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-violet-500/15 dark:bg-[#17121f]"
                      >
                        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-violet-500 via-purple-500 to-pink-500" />

                        <div className="flex gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-50 to-pink-50 text-2xl dark:from-violet-500/10 dark:to-pink-500/10">
                            {getDocumentIcon(document)}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div className="min-w-0">
                                <h3
                                  className="truncate text-base font-black text-[#172033] dark:text-white sm:text-lg"
                                  title={document.name}
                                >
                                  {document.name}
                                </h3>

                                {document.fileName && (
                                  <p
                                    className="mt-1 truncate text-xs text-slate-400"
                                    title={document.fileName}
                                  >
                                    {document.fileName}
                                  </p>
                                )}
                              </div>

                              <div className="flex shrink-0 items-center gap-2">
                                <button
                                  onClick={() => handleEdit(document)}
                                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-violet-400/30 dark:hover:bg-violet-500/10 dark:hover:text-violet-300"
                                >
                                  Edit
                                </button>

                                <button
                                  onClick={() =>
                                    handleDelete(document._id)
                                  }
                                  disabled={
                                    deletingId === document._id
                                  }
                                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-pink-500 transition hover:border-pink-200 hover:bg-pink-50 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:hover:border-pink-400/30 dark:hover:bg-pink-500/10"
                                >
                                  {deletingId === document._id
                                    ? "..."
                                    : "Delete"}
                                </button>
                              </div>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-2">
                              <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-bold capitalize text-violet-600 dark:border-violet-400/20 dark:bg-violet-500/10 dark:text-violet-300">
                                {document.category || "general"}
                              </span>

                              <span className="rounded-full border border-pink-200 bg-pink-50 px-3 py-1.5 text-xs font-bold text-pink-600 dark:border-pink-400/20 dark:bg-pink-500/10 dark:text-pink-300">
                                {document.sourceType === "upload"
                                  ? "Uploaded"
                                  : "URL"}
                              </span>

                              {document.fileType && (
                                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold uppercase text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                                  {document.fileType
                                    .split("/")
                                    .pop()}
                                </span>
                              )}
                            </div>

                            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-white/10">
                              <p className="text-xs font-semibold text-slate-400">
                                {document.createdAt
                                  ? `Added ${new Date(
                                      document.createdAt
                                    ).toLocaleDateString()}`
                                  : "Saved document"}
                              </p>

                              {documentUrl && (
                                <a
                                  href={documentUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs font-extrabold text-violet-600 transition hover:text-pink-600 dark:text-violet-300 dark:hover:text-pink-300"
                                >
                                  Open document →
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Documents;