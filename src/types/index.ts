// Common TypeScript interfaces used across the application

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'donor' | 'receiver';
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  created_at: string;
}

export interface Donation {
  id: number;
  title: string;
  description: string;
  food_type: string;
  quantity: string;
  expiry_date: string;
  pickup_location: string;
  contact_info: string;
  status: 'available' | 'reserved' | 'completed';
  image_url?: string;
  donor_id: number;
  donor_name?: string;
  created_at: string;
}

export interface Request {
  id: number;
  donation_id: number;
  receiver_id: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  message: string;
  requested_at: string;
  title: string;
  food_type: string;
  quantity: string;
  receiver_name: string;
  receiver_phone: string;
  receiver_email: string;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'request' | 'approval' | 'completion' | 'system';
  is_read: boolean;
  created_at: string;
}

export interface AdminStats {
  users: {
    total: number;
    admin: number;
    donor: number;
    receiver: number;
  };
  donations: {
    total: number;
    available: number;
    reserved: number;
    completed: number;
  };
  requests: {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
    completed: number;
  };
  recentActivity: {
    donations: number;
  };
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'donor' | 'receiver';
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T = unknown> {
  message: string;
  data?: T;
}

export interface DonationFormData {
  title: string;
  description: string;
  foodType: string;
  quantity: string;
  expiryDate: string;
  pickupLocation: string;
  contactInfo: string;
  imageUrl?: string;
}