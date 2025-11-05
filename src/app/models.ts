export interface User { id: number; name: string; details?: string; }
export interface Order { id: number; userId: number; total: number; }