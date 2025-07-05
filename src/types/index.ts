export interface User {
  id: string;
  email: string;
  role: 'admin' | 'student';
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  profile_id: string;
  student_number: string;
  birth_date: string;
  phone: string;
  address: string;
  specialty_id: string;
  year: number;
  status: 'active' | 'inactive' | 'graduated';
  created_at: string;
  updated_at: string;
  profile?: User;
  specialty?: Specialty;
}

export interface Specialty {
  id: string;
  name: string;
  code: string;
  description: string;
  duration_years: number;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalSpecialties: number;
  newStudentsThisMonth: number;
  studentsBySpecialty: { name: string; count: number }[];
  studentsByYear: { year: number; count: number }[];
  studentsByStatus: { status: string; count: number }[];
}