'use client';

import { createClientSupabase } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';

type Course = {
  id: number;
  title: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  instructor: string | null;
  thumbnail: string | null;
  banner: string | null;
  regular_price: number | null;
  discounted_price: number | null;
  difficulty_level: string | null;
  duration: string | null;
  num_lessons: number;
  features: string[] | null;
  requirements: string[] | null;
  what_youll_learn: string[] | null;
  featured: boolean;
  popular: boolean;
  new_course: boolean;
  published: boolean;
  enrollment_status: string | null;
  seo_title: string | null;
  seo_description: string | null;
};

type Module = {
  id: number;
  course_id: number;
  title: string;
  description: string | null;
  sort_order: number;
};

type Lesson = {
  id: number;
  module_id: number;
  title: string;
  description: string | null;
  video_url: string | null;
  resources: string[] | null;
  sort_order: number;
  is_preview: boolean;
};

export default function AdminCourses() {
  const supabase = createClientSupabase();
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  
  // Course form state
  const [courseForm, setCourseForm] = useState({
    id: null as number | null,
    title: '',
    slug: '',
    short_description: '',
    full_description: '',
    instructor: '',
    thumbnail: '',
    banner: '',
    regular_price: '',
    discounted_price: '',
    difficulty_level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    duration: '',
    num_lessons: 0,
    features: '[]',
    requirements: '[]',
    what_youll_learn: '[]',
    featured: false,
    popular: false,
    new_course: false,
    published: false,
    enrollment_status: 'closed' as 'open' | 'closed' | 'coming_soon',
    seo_title: '',
    seo_description: '',
    loading: false
  });
  
  // Module form state
  const [moduleForm, setModuleForm] = useState({
    id: null as number | null,
    course_id: null as number | null,
    title: '',
    description: '',
    sort_order: 0,
    loading: false
  });
  
  // Lesson form state
  const [lessonForm, setLessonForm] = useState({
    id: null as number | null,
    module_id: null as number | null,
    title: '',
    description: '',
    video_url: '',
    resources: '[]',
    sort_order: 0,
    is_preview: false,
    loading: false
  });
  
  // UI state
  const [activeTab, setActiveTab] = useState<'courses' | 'modules' | 'lessons'>('courses');
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);

  // Load data
  const loadCourses = async () => {
    const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    setCourses(data ?? []);
  };

  const loadModules = async (courseId?: number | null) => {
    let query = supabase.from('course_modules').select('*').order('sort_order');
    if (courseId) {
      query = query.eq('course_id', courseId);
    }
    const { data } = await query;
    setModules(data ?? []);
  };

  const loadLessons = async (moduleId?: number | null) => {
    let query = supabase.from('course_lessons').select('*').order('sort_order');
    if (moduleId) {
      query = query.eq('module_id', moduleId);
    }
    const { data } = await query;
    setLessons(data ?? []);
  };

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId !== null) {
      loadModules(selectedCourseId);
    } else {
      loadModules();
    }
  }, [selectedCourseId]);

  useEffect(() => {
    if (selectedModuleId !== null) {
      loadLessons(selectedModuleId);
    } else {
      loadLessons();
    }
  }, [selectedModuleId]);

  // Course handlers
  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCourseForm(prev => ({ ...prev, loading: true }));
    
    try {
      const courseData = {
        title: courseForm.title,
        slug: courseForm.slug,
        short_description: courseForm.short_description,
        full_description: courseForm.full_description,
        instructor: courseForm.instructor,
        thumbnail: courseForm.thumbnail,
        banner: courseForm.banner,
        regular_price: courseForm.regular_price ? parseFloat(courseForm.regular_price) : null,
        discounted_price: courseForm.discounted_price ? parseFloat(courseForm.discounted_price) : null,
        difficulty_level: courseForm.difficulty_level,
        duration: courseForm.duration,
        num_lessons: courseForm.num_lessons,
        features: JSON.parse(courseForm.features),
        requirements: JSON.parse(courseForm.requirements),
        what_youll_learn: JSON.parse(courseForm.what_youll_learn),
        featured: courseForm.featured,
        popular: courseForm.popular,
        new_course: courseForm.new_course,
        published: courseForm.published,
        enrollment_status: courseForm.enrollment_status,
        seo_title: courseForm.seo_title,
        seo_description: courseForm.seo_description
      };

      if (courseForm.id) {
        await supabase.from('courses').update(courseData).eq('id', courseForm.id);
      } else {
        await supabase.from('courses').insert(courseData);
      }
      
      // Reset form
      setCourseForm(prev => ({
        ...prev,
        id: null,
        title: '',
        slug: '',
        short_description: '',
        full_description: '',
        instructor: '',
        thumbnail: '',
        banner: '',
        regular_price: '',
        discounted_price: '',
        difficulty_level: 'beginner',
        duration: '',
        num_lessons: 0,
        features: '[]',
        requirements: '[]',
        what_youll_learn: '[]',
        featured: false,
        popular: false,
        new_course: false,
        published: false,
        enrollment_status: 'closed',
        seo_title: '',
        seo_description: '',
        loading: false
      }));
      
      await loadCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Error saving course. Please check the console for details.');
      setCourseForm(prev => ({ ...prev, loading: false }));
    }
  };

  const handleCourseDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this course? This will delete all modules and lessons.')) {
      await supabase.from('courses').delete().eq('id', id);
      await loadCourses();
    }
  };

  const handleCourseEdit = (course: Course) => {
    setCourseForm({
      id: course.id,
      title: course.title,
      slug: course.slug,
      short_description: course.short_description || '',
      full_description: course.full_description || '',
      instructor: course.instructor || '',
      thumbnail: course.thumbnail || '',
      banner: course.banner || '',
      regular_price: course.regular_price ? course.regular_price.toString() : '',
      discounted_price: course.discounted_price ? course.discounted_price.toString() : '',
      difficulty_level: (course.difficulty_level as 'beginner' | 'intermediate' | 'advanced') || 'beginner',
      duration: course.duration || '',
      num_lessons: course.num_lessons,
      features: JSON.stringify(course.features || []),
      requirements: JSON.stringify(course.requirements || []),
      what_youll_learn: JSON.stringify(course.what_youll_learn || []),
      featured: course.featured,
      popular: course.popular,
      new_course: course.new_course,
      published: course.published,
      enrollment_status: (course.enrollment_status as 'open' | 'closed' | 'coming_soon') || 'closed',
      seo_title: course.seo_title || '',
      seo_description: course.seo_description || '',
      loading: false
    });
    
    setSelectedCourseId(course.id);
    setActiveTab('courses');
  };

  // Module handlers
  const handleModuleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModuleForm(prev => ({ ...prev, loading: true }));
    
    try {
      const moduleData = {
        course_id: moduleForm.course_id,
        title: moduleForm.title,
        description: moduleForm.description,
        sort_order: moduleForm.sort_order
      };

      if (moduleForm.id) {
        await supabase.from('course_modules').update(moduleData).eq('id', moduleForm.id);
      } else {
        await supabase.from('course_modules').insert(moduleData);
      }
      
      // Reset form
      setModuleForm(prev => ({
        ...prev,
        id: null,
        course_id: null,
        title: '',
        description: '',
        sort_order: 0,
        loading: false
      }));
      
      await loadModules(selectedCourseId);
    } catch (error) {
      console.error('Error saving module:', error);
      alert('Error saving module. Please check the console for details.');
      setModuleForm(prev => ({ ...prev, loading: false }));
    }
  };

  const handleModuleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this module? This will delete all lessons.')) {
      await supabase.from('course_modules').delete().eq('id', id);
      await loadModules(selectedCourseId);
    }
  };

  const handleModuleEdit = (module: Module) => {
    setModuleForm({
      id: module.id,
      course_id: module.course_id,
      title: module.title,
      description: module.description || '',
      sort_order: module.sort_order,
      loading: false
    });
    
    setSelectedModuleId(module.id);
    setActiveTab('modules');
  };

  // Lesson handlers
  const handleLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLessonForm(prev => ({ ...prev, loading: true }));
    
    try {
      const lessonData = {
        module_id: lessonForm.module_id,
        title: lessonForm.title,
        description: lessonForm.description,
        video_url: lessonForm.video_url,
        resources: JSON.parse(lessonForm.resources),
        sort_order: lessonForm.sort_order,
        is_preview: lessonForm.is_preview
      };

      if (lessonForm.id) {
        await supabase.from('course_lessons').update(lessonData).eq('id', lessonForm.id);
      } else {
        await supabase.from('course_lessons').insert(lessonData);
      }
      
      // Reset form
      setLessonForm(prev => ({
        ...prev,
        id: null,
        module_id: null,
        title: '',
        description: '',
        video_url: '',
        resources: '[]',
        sort_order: 0,
        is_preview: false,
        loading: false
      }));
      
      await loadLessons(selectedModuleId);
    } catch (error) {
      console.error('Error saving lesson:', error);
      alert('Error saving lesson. Please check the console for details.');
      setLessonForm(prev => ({ ...prev, loading: false }));
    }
  };

  const handleLessonDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      await supabase.from('course_lessons').delete().eq('id', id);
      await loadLessons(selectedModuleId);
    }
  };

  const handleLessonEdit = (lesson: Lesson) => {
    setLessonForm({
      id: lesson.id,
      module_id: lesson.module_id,
      title: lesson.title,
      description: lesson.description || '',
      video_url: lesson.video_url || '',
      resources: JSON.stringify(lesson.resources || []),
      sort_order: lesson.sort_order,
      is_preview: lesson.is_preview,
      loading: false
    });
    
    setActiveTab('lessons');
  };

  return (
    <div className="space-y-6">
      <div className="border-border bg-bgCard rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Course Management</h1>
        
        <nav className="mb-6 flex gap-4 border-b">
          <button
            onClick={() => setActiveTab('courses')}
            className={`pb-2 ${activeTab === 'courses' ? 'border-b-2 border-primary font-semibold' : 'text-textMuted'}`}
          >
            Courses
          </button>
          <button
            onClick={() => setActiveTab('modules')}
            className={`pb-2 ${activeTab === 'modules' ? 'border-b-2 border-primary font-semibold' : 'text-textMuted'}`}
            disabled={!selectedCourseId}
          >
            Modules
          </button>
          <button
            onClick={() => setActiveTab('lessons')}
            className={`pb-2 ${activeTab === 'lessons' ? 'border-b-2 border-primary font-semibold' : 'text-textMuted'}`}
            disabled={!selectedModuleId}
          >
            Lessons
          </button>
        </nav>
        
        {activeTab === 'courses' && (
          <>
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Add/Edit Course</h2>
              <form onSubmit={handleCourseSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                      type="text"
                      value={courseForm.title}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Slug</label>
                    <input
                      type="text"
                      value={courseForm.slug}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Short Description</label>
                  <textarea
                    value={courseForm.short_description}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, short_description: e.target.value }))}
                    className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Full Description</label>
                  <textarea
                    value={courseForm.full_description}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, full_description: e.target.value }))}
                    className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                    rows={6}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Instructor</label>
                    <input
                      type="text"
                      value={courseForm.instructor}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, instructor: e.target.value }))}
                      className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Duration</label>
                    <input
                      type="text"
                      value={courseForm.duration}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Regular Price</label>
                    <input
                      type="number"
                      value={courseForm.regular_price}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, regular_price: e.target.value }))}
                      className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Discounted Price</label>
                    <input
                      type="number"
                      value={courseForm.discounted_price}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, discounted_price: e.target.value }))}
                      className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Difficulty Level</label>
                    <select
                      value={courseForm.difficulty_level}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, difficulty_level: e.target.value as 'beginner' | 'intermediate' | 'advanced' }))}
                      className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Number of Lessons</label>
                    <input
                      type="number"
                      value={courseForm.num_lessons}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, num_lessons: Number(e.target.value) }))}
                      className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Features (JSON array)</label>
                    <textarea
                      value={courseForm.features}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, features: e.target.value }))}
                      className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                      rows={3}
                      placeholder='["Feature 1", "Feature 2"]'
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Requirements (JSON array)</label>
                    <textarea
                      value={courseForm.requirements}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, requirements: e.target.value }))}
                      className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                      rows={3}
                      placeholder='["Requirement 1", "Requirement 2"]'
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">What You&apos;ll Learn (JSON array)</label>
                    <textarea
                      value={courseForm.what_youll_learn}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, what_youll_learn: e.target.value }))}
                      className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                      rows={3}
                      placeholder='["Learn 1", "Learn 2"]'
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">SEO Title</label>
                    <input
                      type="text"
                      value={courseForm.seo_title}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, seo_title: e.target.value }))}
                      className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">SEO Description</label>
                    <input
                      type="text"
                      value={courseForm.seo_description}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, seo_description: e.target.value }))}
                      className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="block text-sm font-medium mb-1 mr-2">
                      <input
                        type="checkbox"
                        checked={courseForm.featured}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, featured: e.target.checked }))}
                        className="h-4 w-4"
                      />
                      Featured
                    </label>
                    <label className="block text-sm font-medium mb-1 ml-4">
                      <input
                        type="checkbox"
                        checked={courseForm.popular}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, popular: e.target.checked }))}
                        className="h-4 w-4"
                      />
                      Popular
                    </label>
                    <label className="block text-sm font-medium mb-1 ml-4">
                      <input
                        type="checkbox"
                        checked={courseForm.new_course}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, new_course: e.target.checked }))}
                        className="h-4 w-4"
                      />
                      New Course
                    </label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Published</label>
                    <input
                      type="checkbox"
                      checked={courseForm.published}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, published: e.target.checked }))}
                      className="h-4 w-4"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Enrollment Status</label>
                    <select
                      value={courseForm.enrollment_status}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, enrollment_status: e.target.value as 'open' | 'closed' | 'coming_soon' }))}
                      className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                    >
                      <option value="open">Open</option>
                      <option value="closed">Closed</option>
                      <option value="coming_soon">Coming Soon</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={courseForm.loading}
                    className={`bg-primary text-textMain px-4 py-2 rounded ${
                      courseForm.loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primaryDark/80'
                    }`}
                  >
                    {courseForm.loading ? 'Saving...' : 'Save Course'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCourseForm(prev => ({
                        ...prev,
                        id: null,
                        title: '',
                        slug: '',
                        short_description: '',
                        full_description: '',
                        instructor: '',
                        thumbnail: '',
                        banner: '',
                        regular_price: '',
                        discounted_price: '',
                        difficulty_level: 'beginner',
                        duration: '',
                        num_lessons: 0,
                        features: '[]',
                        requirements: '[]',
                        what_youll_learn: '[]',
                        featured: false,
                        popular: false,
                        new_course: false,
                        published: false,
                        enrollment_status: 'closed',
                        seo_title: '',
                        seo_description: '',
                        loading: false
                      }));
                      setSelectedCourseId(null);
                    }}
                    className="ml-4 border border-border bg-bgCard text-textMuted px-4 py-2 rounded hover:border-primary hover:text-textMain"
                  >
                    Clear Form
                  </button>
                </div>
              </form>
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Courses List</h2>
              {courses.length === 0 ? (
                <p className="text-center py-8 text-textMuted">No courses found. Add a course above.</p>
              ) : (
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div key={course.id} className="border-border bg-bgCard rounded-lg p-4 flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{course.title}</h3>
                        <p className="text-sm text-textMuted">{course.slug}</p>
                        <p className="text-sm text-textMuted mt-1">
                          {course.instructor} • {course.difficulty_level} • {course.duration}
                        </p>
                        {course.short_description && (
                          <p className="text-sm text-textMuted mt-2">{course.short_description}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleCourseEdit(course)}
                          className="bg-primary text-textMain px-3 py-1 rounded text-sm hover:bg-primaryDark/80"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleCourseDelete(course.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
        
        {activeTab === 'modules' && selectedCourseId !== null && (
          <>
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Add/Edit Module</h2>
              <form onSubmit={handleModuleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Course</label>
                  <select
                    value={moduleForm.course_id || ''}
                    onChange={(e) => setModuleForm(prev => ({ ...prev, course_id: e.target.value ? Number(e.target.value) : null }))}
                    className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                    required
                  >
                    <option value="">Select a course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={moduleForm.title}
                    onChange={(e) => setModuleForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={moduleForm.description}
                    onChange={(e) => setModuleForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                    rows={4}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={moduleForm.sort_order}
                    onChange={(e) => setModuleForm(prev => ({ ...prev, sort_order: Number(e.target.value) }))}
                    className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={moduleForm.loading}
                    className={`bg-primary text-textMain px-4 py-2 rounded ${
                      moduleForm.loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primaryDark/80'
                    }`}
                  >
                    {moduleForm.loading ? 'Saving...' : 'Save Module'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setModuleForm(prev => ({
                        ...prev,
                        id: null,
                        course_id: null,
                        title: '',
                        description: '',
                        sort_order: 0,
                        loading: false
                      }));
                      setSelectedModuleId(null);
                    }}
                    className="ml-4 border border-border bg-bgCard text-textMuted px-4 py-2 rounded hover:border-primary hover:text-textMain"
                  >
                    Clear Form
                  </button>
                </div>
              </form>
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Modules List</h2>
              {modules.length === 0 ? (
                <p className="text-center py-8 text-textMuted">No modules found for this course. Add a module above.</p>
              ) : (
                <div className="space-y-4">
                  {modules.map((module) => (
                    <div key={module.id} className="border-border bg-bgCard rounded-lg p-4 flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{module.title}</h3>
                        <p className="text-sm text-textMuted">Sort Order: {module.sort_order}</p>
                        {module.description && (
                          <p className="text-sm text-textMuted mt-1">{module.description}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleModuleEdit(module)}
                          className="bg-primary text-textMain px-3 py-1 rounded text-sm hover:bg-primaryDark/80"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleModuleDelete(module.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
        
        {activeTab === 'lessons' && selectedModuleId !== null && (
          <>
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Add/Edit Lesson</h2>
              <form onSubmit={handleLessonSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Module</label>
                  <select
                    value={lessonForm.module_id || ''}
                    onChange={(e) => setLessonForm(prev => ({ ...prev, module_id: e.target.value ? Number(e.target.value) : null }))}
                    className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                    required
                  >
                    <option value="">Select a module</option>
                    {modules.map(module => (
                      <option key={module.id} value={module.id}>
                        {module.title}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={lessonForm.description}
                    onChange={(e) => setLessonForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                    rows={4}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Video URL</label>
                  <input
                    type="text"
                    value={lessonForm.video_url}
                    onChange={(e) => setLessonForm(prev => ({ ...prev, video_url: e.target.value }))}
                    className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Resources (JSON array)</label>
                  <textarea
                    value={lessonForm.resources}
                    onChange={(e) => setLessonForm(prev => ({ ...prev, resources: e.target.value }))}
                    className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                    rows={3}
                    placeholder='["Resource 1.pdf", "Resource 2.zip"]'
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Sort Order</label>
                    <input
                      type="number"
                      value={lessonForm.sort_order}
                      onChange={(e) => setLessonForm(prev => ({ ...prev, sort_order: Number(e.target.value) }))}
                      className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Is Preview</label>
                    <input
                      type="checkbox"
                      checked={lessonForm.is_preview}
                      onChange={(e) => setLessonForm(prev => ({ ...prev, is_preview: e.target.checked }))}
                      className="h-4 w-4"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={lessonForm.loading}
                    className={`bg-primary text-textMain px-4 py-2 rounded ${
                      lessonForm.loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primaryDark/80'
                    }`}
                  >
                    {lessonForm.loading ? 'Saving...' : 'Save Lesson'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLessonForm(prev => ({
                        ...prev,
                        id: null,
                        module_id: null,
                        title: '',
                        description: '',
                        video_url: '',
                        resources: '[]',
                        sort_order: 0,
                        is_preview: false,
                        loading: false
                      }));
                    }}
                    className="ml-4 border border-border bg-bgCard text-textMuted px-4 py-2 rounded hover:border-primary hover:text-textMain"
                  >
                    Clear Form
                  </button>
                </div>
              </form>
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Lessons List</h2>
              {lessons.length === 0 ? (
                <p className="text-center py-8 text-textMuted">No lessons found for this module. Add a lesson above.</p>
              ) : (
                <div className="space-y-4">
                  {lessons.map((lesson) => (
                    <div key={lesson.id} className="border-border bg-bgCard rounded-lg p-4 flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{lesson.title}</h3>
                        <p className="text-sm text-textMuted">Sort Order: {lesson.sort_order}</p>
                        {lesson.description && (
                          <p className="text-sm text-textMuted mt-1">{lesson.description}</p>
                        )}
                        {lesson.video_url && (
                          <p className="text-sm text-textMuted mt-1">
                            <a href={lesson.video_url} target="_blank" rel="noreferrer" className="text-primary underline">
                              Video Link
                            </a>
                          </p>
                        )}
                        {lesson.resources && lesson.resources.length > 0 && (
                          <p className="text-sm text-textMuted mt-1">
                            {lesson.resources.length} resource(s)
                          </p>
                        )}
                        <span className={`
                          px-2 py-1 rounded text-sm 
                          ${lesson.is_preview ? 'bg-primary/20 text-primary' : 'bg-bgCard text-textMuted'}
                        `}>
                          {lesson.is_preview ? 'Preview' : 'Full'}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleLessonEdit(lesson)}
                          className="bg-primary text-textMain px-3 py-1 rounded text-sm hover:bg-primaryDark/80"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleLessonDelete(lesson.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}