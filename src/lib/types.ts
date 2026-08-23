export interface ServiceRecord {
  id: string | number;
  slug: string;
  title: string;
  short_description?: string | null;
  description?: string | null;
  icon?: string | null;
  image_url?: string | null;
  active?: boolean;
  sort_order?: number | null;
}

export interface ProductRecord {
  id: string | number;
  slug: string;
  title: string;
  description?: string | null;
  price?: number | null;
  cover_image?: string | null;
  active?: boolean;
  sort_order?: number | null;
}

export interface CourseRecord {
  id: string | number;
  slug: string;
  title: string;
  short_description?: string | null;
  full_description?: string | null;
  instructor?: string | null;
  thumbnail?: string | null;
  banner?: string | null;
  regular_price?: number | null;
  discounted_price?: number | null;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | null;
  duration?: string | null;
  num_lessons?: number | null;
  features?: string[] | null;
  requirements?: string[] | null;
  what_youll_learn?: string[] | null;
  featured?: boolean;
  popular?: boolean;
  new_course?: boolean;
  published?: boolean;
  enrollment_status?: 'open' | 'closed' | 'coming_soon' | null;
}

export interface ProjectRecord {
  id: string | number;
  slug: string;
  title: string;
  short_description?: string | null;
  description?: string | null;
  cover_image?: string | null;
  tags?: string[] | null;
}
