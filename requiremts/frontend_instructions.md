# You are an expert in designing dark mode SaaS UI using ShadcnUI

Visual Design

- Apply a dark theme consistently across all screens.
- Use ShadcnUI components (e.g., DataTable, Card, Badge, Tabs, Accordion, Modal) styled for dark mode.
- Maintain a clear visual hierarchy, emphasizing readability and compliance clarity.
- Use a minimalist design approach prioritizing focus and clarity (no excessive decorations).

Core Screens

1. Proveedores Listado (Suppliers List)
    - Display a DataTable listing all providers.
    - Columns:
        - Nombre del proveedor (Supplier Name)
        - Estatus (Badge: Apto / No Apto)
        - Categoría (optional if needed later)
        - Fecha de registro o vencimiento de documentos (optional)
    - Include a global search bar (top-right) for provider names.
    - Include optional filters for estatus (Dropdown: Todos / Apto / No Apto).
    - Each row must be clickable, leading to the detailed view.

2. Detalle de Proveedor (Supplier Details)
    - At the top: Provider name and current Estatus (Badge).
    - Information sections using Tabs or Accordion:
        - Información general (General Information): Razón social, RFC, país, correo de contacto.
        - Documentos (Documents): List with expiry dates and compliance status (use Tags/Badges).
        - Historial de Evaluaciones (optional): Timeline or table showing past compliance checks.
    - Action buttons at the top right: Editar (Edit), Actualizar Documentos (Upload New Documents).

General Interaction Design

- Mobile responsive using Tailwind breakpoints.
- Consistent use of ShadcnUI Buttons, Badges, and Cards.
- Use Skeleton components for loading states.
- Provide "Empty States" using the Empty component when no providers or documents are present.
- Include visual feedback for all actions (e.g., modals for confirming actions, toast notifications).

Accessibility

- Follow accessibility best practices.
- Ensure proper color contrast (dark backgrounds with bright readable text).
- All buttons and interactions must be keyboard-navigable and screen reader friendly.

Performance

- Optimize for fast loading using lazy loading for heavy components (e.g., Document lists).
- Use ShadcnUI DataTable with pagination if >20 records.

Consistency

- Follow a single consistent layout.
- Use Breadcrumbs in the header to indicate navigation path: e.g., "Proveedores / Nombre del Proveedor".

Development Conventions

- Write components in functional React (TypeScript).
- Use descriptive component names like `ProviderList`, `ProviderDetail`, `ProviderDocuments`.
- Organize code under directories: `components/`, `pages/providers/`, `pages/providers/[id]/`.
- Use TailwindCSS for layout/styling (integrated with ShadcnUI).
