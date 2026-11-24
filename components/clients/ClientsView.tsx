"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { Client } from "@/lib/data/clients";

type ClientsViewProps = {
  clients: Client[];
  totalClients: number;
  totalPets: number;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ClientsView({
  clients,
  totalClients,
  totalPets,
}: ClientsViewProps) {
  const [clientList, setClientList] = useState(clients);
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return clientList;

    return clientList.filter(
      (client) =>
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query),
    );
  }, [search, clientList]);

  // Open edit modal
  function handleEdit(client: Client) {
    setEditingClient(client);
    setEditName(client.name);
    setEditPhone(client.phone || "");
    setError("");
  }

  // Close edit modal
  function closeEditModal() {
    if (saving) return;
    setEditingClient(null);
    setError("");
  }

  // Save changes
  async function handleUpdateClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingClient) return;

    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/clients/${editingClient.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editName.trim(),
          phone: editPhone.trim() || null,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || "Could not update client information.",
        );
      }

      const updatedClient: Client = {
        ...editingClient,
        ...data.client,
      };

      setClientList((previousClients) =>
        previousClients.map((client) =>
          client.id === updatedClient.id ? updatedClient : client,
        ),
      );

      setSelectedClient((previous) =>
        previous?.id === updatedClient.id ? updatedClient : previous,
      );

      setEditingClient(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 lg:py-12">
      {/* Page heading */}
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300">
          Clinic Management
        </p>

        <h1 className="font-heading text-3xl font-extrabold text-primary-900 dark:text-primary-100 md:text-4xl">
          Clients
        </h1>

        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Manage registered pet owners and their information.
        </p>
      </div>

      {/* Summary cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Total clients
          </p>
          <p className="mt-2 font-heading text-3xl font-extrabold text-primary-700 dark:text-primary-300">
            {totalClients}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Total pets
          </p>
          <p className="mt-2 font-heading text-3xl font-extrabold text-accent-700 dark:text-accent-300">
            {totalPets}
          </p>
        </div>
      </div>

      {/* Clients section */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 p-5 dark:border-slate-800">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-slate-100">
                Registered clients
              </h2>

              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Search and access client information.
              </p>
            </div>

            <a
              href="/register"
              className="inline-flex items-center justify-center rounded-lg bg-primary-700 px-5 py-3 font-semibold text-white transition hover:bg-primary-900"
            >
              + New Client
            </a>
          </div>

          {/* Search */}
          <div className="mt-5">
            <label
              htmlFor="client-search"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Search clients
            </label>

            <input
              id="client-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-400">
              <tr>
                <th className="px-5 py-4 font-semibold">Client</th>
                <th className="px-5 py-4 font-semibold">Email</th>
                <th className="px-5 py-4 font-semibold">Phone</th>
                <th className="px-5 py-4 font-semibold">Pets</th>
                <th className="px-5 py-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredClients.map((client) => (
                <tr
                  key={client.id}
                  className="transition hover:bg-primary-50/50 dark:hover:bg-slate-800/50"
                >
                  <td className="px-5 py-4 font-semibold text-slate-900 dark:text-slate-100">
                    {client.name}
                  </td>

                  <td className="px-5 py-4 text-slate-600 dark:text-slate-400">
                    {client.email}
                  </td>

                  <td className="px-5 py-4 text-slate-600 dark:text-slate-400">
                    {client.phone || "Not provided"}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-primary-100 px-3 py-1 font-semibold text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                      {client.petsCount}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setSelectedClient(client)}
                        className="font-semibold text-primary-700 hover:underline dark:text-primary-300"
                      >
                        View details
                      </button>

                      <button
                        type="button"
                        onClick={() => handleEdit(client)}
                        className="font-semibold text-accent-700 hover:underline dark:text-accent-300"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="divide-y divide-slate-200 md:hidden dark:divide-slate-800">
          {filteredClients.map((client) => (
            <article key={client.id} className="p-5">
              <div className="flex items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                  {getInitials(client.name)}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    {client.name}
                  </h3>

                  <p className="mt-1 break-all text-sm text-slate-600 dark:text-slate-400">
                    {client.email}
                  </p>

                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {client.phone || "Not provided"}
                  </p>

                  <p className="mt-2 text-sm font-semibold text-primary-700 dark:text-primary-300">
                    {client.petsCount} pets
                  </p>

                  <div className="mt-3 flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedClient(client)}
                      className="text-sm font-semibold text-primary-700 hover:underline dark:text-primary-300"
                    >
                      View details
                    </button>

                    <button
                      type="button"
                      onClick={() => handleEdit(client)}
                      className="text-sm font-semibold text-accent-700 hover:underline dark:text-accent-300"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty state */}
        {filteredClients.length === 0 && (
          <div className="p-10 text-center">
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {search.trim() ? "No clients found" : "No registered clients yet"}
            </p>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {search.trim()
                ? "Try searching with another name or email."
                : "Registered pet owners will appear here."}
            </p>
          </div>
        )}

        {/* Results count */}
        <div className="border-t border-slate-200 px-5 py-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
          Showing {filteredClients.length} of {totalClients} clients
        </div>
      </section>

      {/* Client details modal */}
      {selectedClient && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          onClick={() => setSelectedClient(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="client-details-title"
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2
                id="client-details-title"
                className="font-heading text-xl font-bold text-primary-900 dark:text-primary-100"
              >
                Client details
              </h2>

              <button
                type="button"
                onClick={() => setSelectedClient(null)}
                aria-label="Close details"
                className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                &times;
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Full name
                </p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {selectedClient.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Email
                </p>
                <p className="break-all font-semibold text-slate-900 dark:text-slate-100">
                  {selectedClient.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Phone
                </p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {selectedClient.phone || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Associated pets
                </p>
                <p className="font-semibold text-primary-700 dark:text-primary-300">
                  {selectedClient.petsCount} pets
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedClient(null)}
              className="mt-8 w-full rounded-lg bg-primary-700 px-4 py-3 font-semibold text-white transition hover:bg-primary-900"
            >
              Close
            </button>
          </section>
        </div>
      )}

      {/* Edit client modal */}
      {editingClient && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          onClick={closeEditModal}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-client-title"
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2
                id="edit-client-title"
                className="font-heading text-xl font-bold text-primary-900 dark:text-primary-100"
              >
                Edit client
              </h2>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={saving}
                aria-label="Close edit form"
                className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-slate-800"
              >
                &times;
              </button>
            </div>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Update the client&apos;s information below.
            </p>

            <form onSubmit={handleUpdateClient} className="mt-6 space-y-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="edit-client-name"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Full name
                </label>

                <input
                  id="edit-client-name"
                  type="text"
                  required
                  minLength={2}
                  maxLength={100}
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="edit-client-email"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Email
                </label>

                <input
                  id="edit-client-email"
                  type="email"
                  value={editingClient.email}
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                />

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Email cannot be changed.
                </p>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="edit-client-phone"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Phone
                </label>

                <input
                  id="edit-client-phone"
                  type="tel"
                  maxLength={30}
                  value={editPhone}
                  onChange={(event) => setEditPhone(event.target.value)}
                  placeholder="Enter phone number"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>

              {/* Error */}
              {error && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
                >
                  {error}
                </p>
              )}

              {/* Buttons */}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={saving}
                  className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || editName.trim().length < 2}
                  className="rounded-lg bg-primary-700 px-5 py-3 font-semibold text-white transition hover:bg-primary-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
