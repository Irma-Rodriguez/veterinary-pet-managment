"use client";

import { useMemo, useState } from "react";

type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  petsCount: number;
};

const DEMO_CLIENTS: Client[] = [
  {
    id: "1",
    name: "Maria Lopez",
    email: "maria@example.com",
    phone: "(208) 555-0101",
    petsCount: 2,
  },
  {
    id: "2",
    name: "Carlos Perez",
    email: "carlos@example.com",
    phone: "(208) 555-0102",
    petsCount: 1,
  },
  {
    id: "3",
    name: "Ana Torres",
    email: "ana@example.com",
    phone: "(208) 555-0103",
    petsCount: 3,
  },
  {
    id: "4",
    name: "Sofia Ramirez",
    email: "sofia@example.com",
    phone: "(208) 555-0104",
    petsCount: 0,
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ClientsView() {
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return DEMO_CLIENTS;

    return DEMO_CLIENTS.filter(
      (client) =>
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query),
    );
  }, [search]);

  const totalPets = DEMO_CLIENTS.reduce(
    (total, client) => total + client.petsCount,
    0,
  );

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
            {DEMO_CLIENTS.length}
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
          <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-slate-100">
            Registered clients
          </h2>

          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Search and access client information.
          </p>

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
                    {client.phone}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-primary-100 px-3 py-1 font-semibold text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                      {client.petsCount}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => setSelectedClient(client)}
                      className="font-semibold text-primary-700 hover:underline dark:text-primary-300"
                    >
                      View details
                    </button>
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
                    {client.phone}
                  </p>

                  <p className="mt-2 text-sm font-semibold text-primary-700 dark:text-primary-300">
                    {client.petsCount} pets
                  </p>

                  <button
                    type="button"
                    onClick={() => setSelectedClient(client)}
                    className="mt-3 text-sm font-semibold text-primary-700 hover:underline dark:text-primary-300"
                  >
                    View details
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty search state */}
        {filteredClients.length === 0 && (
          <div className="p-10 text-center">
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              No clients found
            </p>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Try searching with another name or email.
            </p>
          </div>
        )}

        {/* Results count */}
        <div className="border-t border-slate-200 px-5 py-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
          Showing {filteredClients.length} of {DEMO_CLIENTS.length} clients
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
                ×
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
                  {selectedClient.phone}
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
    </main>
  );
}
