// ─────────────────────────────────────────────────────────────
// GUÍA DE INTEGRACIÓN FRONTEND — React / Next.js
// Archivo: src/lib/api.ts (en tu proyecto frontend)
// ─────────────────────────────────────────────────────────────

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// ─── Tipos ───────────────────────────────────────────────────

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface User {
  id: string;
  email: string;
  nombre: string;
  role: 'ADMIN' | 'VENDEDOR';
}

interface AuthResponse extends AuthTokens {
  user: User;
}

interface Producto {
  id: string;
  modelo: string;
  categoria: 'iPhone' | 'iPad' | 'Mac' | 'Watch' | 'AirPods' | 'Accesorios';
  memoria: string;
  color: string;
  precio: string; // Decimal viene como string de Prisma
  bateria: number | null;
  usado: boolean;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedProducts {
  items: Producto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// ─── Token storage ────────────────────────────────────────────

const getAccessToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

const getRefreshToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;

const saveTokens = (tokens: AuthTokens) => {
  localStorage.setItem('accessToken', tokens.accessToken);
  localStorage.setItem('refreshToken', tokens.refreshToken);
};

const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// ─── Fetch con auto-refresh ───────────────────────────────────

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const accessToken = getAccessToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    },
  });

  // Si el token expiró, intentar refresh
  if (response.status === 401) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      // Reintentar con el nuevo token
      const newToken = getAccessToken();
      const retryResponse = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newToken}`,
          ...options.headers,
        },
      });
      if (!retryResponse.ok) throw new Error('Error en la solicitud');
      const retryData: ApiResponse<T> = await retryResponse.json();
      return retryData.data;
    } else {
      clearTokens();
      window.location.href = '/login';
      throw new Error('Sesión expirada');
    }
  }

  const data: ApiResponse<T> = await response.json();

  if (!response.ok) {
    throw new Error((data as any).message || 'Error en la solicitud');
  }

  return data.data;
}

async function tryRefreshToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) return false;

    const data: ApiResponse<AuthTokens> = await response.json();
    saveTokens(data.data);
    return true;
  } catch {
    return false;
  }
}

// ─── Auth API ─────────────────────────────────────────────────

export const authApi = {
  register: async (email: string, nombre: string, password: string) => {
    const data = await apiFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, nombre, password }),
    });
    saveTokens(data);
    return data;
  },

  login: async (email: string, password: string) => {
    const data = await apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    saveTokens(data);
    return data;
  },

  logout: async () => {
    await apiFetch('/auth/logout', { method: 'POST' });
    clearTokens();
  },
};

// ─── Products API ─────────────────────────────────────────────

export interface ProductFilters {
  categoria?: string;
  modelo?: string;
  memoria?: string;
  color?: string;
  usado?: boolean;
  minPrice?: number;
  maxPrice?: number;
  stockDisponible?: boolean;
  page?: number;
  limit?: number;
}

export const productsApi = {
  getAll: (filters: ProductFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiFetch<PaginatedProducts>(`/products${query}`);
  },

  getOne: (id: string) => apiFetch<Producto>(`/products/${id}`),

  create: (data: Partial<Producto>) =>
    apiFetch<Producto>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Producto>) =>
    apiFetch<Producto>(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<{ message: string }>(`/products/${id}`, {
      method: 'DELETE',
    }),
};

// ─────────────────────────────────────────────────────────────
// EJEMPLO DE USO EN COMPONENTE NEXT.JS (App Router)
// ─────────────────────────────────────────────────────────────
/*
// app/products/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { productsApi, ProductFilters } from '@/lib/api';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilters>({ page: 1, limit: 10 });

  useEffect(() => {
    productsApi.getAll(filters)
      .then(res => setProducts(res.items))
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        products.map(p => (
          <div key={p.id}>
            <h3>{p.modelo}</h3>
            <p>{p.categoria} — {p.memoria} — {p.color}</p>
            <p>Precio: ${p.precio} | Stock: {p.stock}</p>
          </div>
        ))
      )}
    </div>
  );
}
*/

// ─────────────────────────────────────────────────────────────
// EJEMPLO CON REACT QUERY (recomendado para producción)
// pnpm add @tanstack/react-query
// ─────────────────────────────────────────────────────────────
/*
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api';

export function useProducts(filters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.getAll(filters),
    staleTime: 1000 * 60, // 1 minuto de caché
  });
}
*/
