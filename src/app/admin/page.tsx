 'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import shippedContent from '../../../content.json';

const AdminPage: React.FC = () => {
  const { language } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [rawJson, setRawJson] = useState('');
  const [showRawEditor, setShowRawEditor] = useState(false);
  const [profileImageDataUrl, setProfileImageDataUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [fullContent, setFullContent] = useState<any>(null);
  const [sectionKeys, setSectionKeys] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [profileImageFileName, setProfileImageFileName] = useState<string>('');

  // canonical public profile image in Supabase (admin uploads overwrite this)
  const DEFAULT_PROFILE_IMAGE = 'https://mnymihqaxdddxokphire.supabase.co/storage/v1/object/public/images/Profile_image.png';

  // Admin password (plain for local dev): 0560509030mM
  const PLAIN_ADMIN_PASSWORD = '0560509030mM';

  // content sections definition was previously here; omitted because the admin UI builds sections from the loaded content
  // defaultContentSections intentionally omitted — admin builds UI from loaded content

  // Check authentication status on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem('mohcareer_admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // Load profile image if saved
  // NOTE: profile image is loaded from content (Supabase) rather than localStorage

  // Load full content.json (shipped) or admin-saved copy from localStorage
  useEffect(() => {
    if (!isAuthenticated) return;

    try {
      const saved = localStorage.getItem('mohcareer_original_content');
      let parsed: any = null;
      if (saved) {
        parsed = JSON.parse(saved);
      } else {
        parsed = shippedContent;
      }

  // Ensure about image fields exist and default to the public Supabase image when missing
  const DEFAULT_PROFILE_IMAGE = 'https://mnymihqaxdddxokphire.supabase.co/storage/v1/object/public/images/Profile_image.png';
  if (!parsed.about) parsed.about = {};
  if (!parsed.about.ar) parsed.about.ar = {};
  if (!parsed.about.en) parsed.about.en = {};
  if (!parsed.about.ar.image) parsed.about.ar.image = DEFAULT_PROFILE_IMAGE;
  if (!parsed.about.en.image) parsed.about.en.image = DEFAULT_PROFILE_IMAGE;

  setFullContent(parsed);
      // use the content-managed image (no localStorage)
      try {
        const managed = parsed.about?.[language]?.image || parsed.about?.ar?.image || parsed.about?.en?.image || DEFAULT_PROFILE_IMAGE;
        setProfileImageDataUrl(managed);
      } catch {}
      setRawJson(JSON.stringify(parsed, null, 2));
      const keys = Object.keys(parsed || {});
      setSectionKeys(keys);
      setActiveSection(keys[0] ?? null);
    } catch (error) {
      console.error('Error loading content for admin:', error);
      setFullContent(shippedContent);
      setRawJson(JSON.stringify(shippedContent, null, 2));
      const keys = Object.keys(shippedContent || {});
      setSectionKeys(keys);
      setActiveSection(keys[0] ?? null);
    }
  }, [isAuthenticated, language]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // simple SHA-256 compare using Web Crypto
    (async () => {
      try {
        const enc = new TextEncoder();
        const data = enc.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // compute expected hash from provided plain for robustness
        const expectedBuf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(PLAIN_ADMIN_PASSWORD));
        const expectedHex = Array.from(new Uint8Array(expectedBuf)).map(b => b.toString(16).padStart(2, '0')).join('');

        if (hashHex === expectedHex) {
          setIsAuthenticated(true);
          localStorage.setItem('mohcareer_admin_auth', 'true');
          setPasswordError('');
        } else {
          setPasswordError(language === 'ar' ? 'كلمة مرور خاطئة' : 'Incorrect password');
        }
      } catch (err) {
        console.error('Login error', err);
        setPasswordError(language === 'ar' ? 'خطأ أثناء تسجيل الدخول' : 'Login error');
      }
    })();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('mohcareer_admin_auth');
    setPassword('');
  };

  // handleSectionJsonChange removed; admin edits use section-specific editors or the full JSON editor instead
 
  const saveContent = () => {
    setSaveStatus('saving');
    (async () => {
      try {
      // Save full content.json (preferred)
      if (fullContent) {
        localStorage.setItem('mohcareer_original_content', JSON.stringify(fullContent));
        // notify other parts of the app (same tab or other tabs) that content changed
        try { window.dispatchEvent(new Event('mohcareer_content_updated')); } catch {}
      } else if (rawJson) {
        // fallback: rawJson may contain the full structure
        try {
          const parsed = JSON.parse(rawJson);
          localStorage.setItem('mohcareer_original_content', JSON.stringify(parsed));
          try { window.dispatchEvent(new Event('mohcareer_content_updated')); } catch {}
        } catch (e) {
          console.warn('Raw JSON invalid on save fallback', e);
        }
      }

      // Also try to generate a backward-compatible `mohcareer_content` (section-based) for parts that match the simple ar/en schema
      try {
        const source = fullContent || (rawJson ? JSON.parse(rawJson) : null);
        if (source) {
          const sectionsOut: any[] = [];
          Object.keys(source).forEach((key) => {
            const val = source[key];
            if (val && typeof val === 'object' && val.ar && val.en && typeof val.ar === 'object' && typeof val.en === 'object') {
              const fields: any[] = [];
              Object.keys(val.ar).forEach((fieldKey) => {
                const a = val.ar[fieldKey];
                const b = val.en[fieldKey];
                if (typeof a === 'string' && typeof b === 'string') {
                  fields.push({ key: fieldKey, labelAr: fieldKey, labelEn: fieldKey, type: a.includes('\n') || b.includes('\n') ? 'textarea' : 'text', ar: a, en: b });
                }
              });
              if (fields.length) {
                sectionsOut.push({ id: key, nameAr: key, nameEn: key, fields });
              }
            }
          });

          if (sectionsOut.length) {
            localStorage.setItem('mohcareer_content', JSON.stringify(sectionsOut));
          }
        }
      } catch (e) {
        console.warn('Failed to generate backward-compatible sections', e);
      }
      // If raw editor was used, prefer its JSON (so admin can change any field structure)
      if (showRawEditor && rawJson) {
        try {
          const parsed = JSON.parse(rawJson);
          localStorage.setItem('mohcareer_original_content', JSON.stringify(parsed));
        } catch (e) {
          console.warn('Raw JSON invalid, skipped saving original_content from raw editor', e);
        }
      }

      // Save profile image if set
      if (profileImageDataUrl) {
        localStorage.setItem('mohcareer_profile_image', profileImageDataUrl);
      }

      // POST to server API which will push to Supabase/storage when configured
      try {
  const payload = fullContent || (rawJson ? JSON.parse(rawJson) : null) || {};
  // include admin key from public env (set NEXT_PUBLIC_ADMIN_API_KEY in your Vercel env)
  const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_API_KEY || '';
  const res = await fetch('/api/content', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-key': ADMIN_KEY }, body: JSON.stringify(payload) });
        const json = await res.json().catch(()=>({}));
        if (!res.ok) {
          console.warn('Failed to push content to server', json);
          // still consider saved locally but mark partial
          setSaveStatus('saved');
        } else {
          // remote saved
          setSaveStatus('saved');
        }
      } catch (err) {
        console.warn('Error posting content to /api/content', err);
        setSaveStatus('saved');
      }

      setHasChanges(false);

      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
      
    } catch (error) {
      console.error('Error saving content:', error);
      setSaveStatus('error');
    }
    })();
  };

  const resetToDefault = () => {
    if (window.confirm(language === 'ar' ? 'هل أنت متأكد من إعادة تعيين المحتوى؟' : 'Are you sure you want to reset content?')) {
      setFullContent(shippedContent);
      setRawJson(JSON.stringify(shippedContent, null, 2));
      setSectionKeys(Object.keys(shippedContent));
      setHasChanges(true);
    }
  };

  // Helpers to move service items and update state immutably so UI updates immediately
  const moveServiceUp = (index: number) => {
    setFullContent((prev: any) => {
      if (!prev || !prev.services) return prev;
      const copy = JSON.parse(JSON.stringify(prev));
      const a = copy.services.ar || [];
      const b = copy.services.en || [];
      const max = Math.max(a.length, b.length);
      while (a.length < max) a.push({});
      while (b.length < max) b.push({});
      if (index <= 0 || index >= max) return prev;
      [a[index - 1], a[index]] = [a[index], a[index - 1]];
      [b[index - 1], b[index]] = [b[index], b[index - 1]];
      copy.services.ar = a;
      copy.services.en = b;
      setHasChanges(true);
      return copy;
    });
  };

  const moveServiceDown = (index: number) => {
    setFullContent((prev: any) => {
      if (!prev || !prev.services) return prev;
      const copy = JSON.parse(JSON.stringify(prev));
      const a = copy.services.ar || [];
      const b = copy.services.en || [];
      const max = Math.max(a.length, b.length);
      while (a.length < max) a.push({});
      while (b.length < max) b.push({});
      if (index < 0 || index >= max - 1) return prev;
      [a[index + 1], a[index]] = [a[index], a[index + 1]];
      [b[index + 1], b[index]] = [b[index], b[index + 1]];
      copy.services.ar = a;
      copy.services.en = b;
      setHasChanges(true);
      return copy;
    });
  };

  const moveFaqUp = (index: number) => {
    setFullContent((prev: any) => {
      if (!prev || !prev.faq) return prev;
      const copy = JSON.parse(JSON.stringify(prev));
      const a = copy.faq.ar || [];
      const b = copy.faq.en || [];
      const max = Math.max(a.length, b.length);
      while (a.length < max) a.push({});
      while (b.length < max) b.push({});
      if (index <= 0 || index >= max) return prev;
      [a[index - 1], a[index]] = [a[index], a[index - 1]];
      [b[index - 1], b[index]] = [b[index], b[index - 1]];
      copy.faq.ar = a;
      copy.faq.en = b;
      setHasChanges(true);
      return copy;
    });
  };

  const moveFaqDown = (index: number) => {
    setFullContent((prev: any) => {
      if (!prev || !prev.faq) return prev;
      const copy = JSON.parse(JSON.stringify(prev));
      const a = copy.faq.ar || [];
      const b = copy.faq.en || [];
      const max = Math.max(a.length, b.length);
      while (a.length < max) a.push({});
      while (b.length < max) b.push({});
      if (index < 0 || index >= max - 1) return prev;
      [a[index + 1], a[index]] = [a[index], a[index + 1]];
      [b[index + 1], b[index]] = [b[index], b[index + 1]];
      copy.faq.ar = a;
      copy.faq.en = b;
      setHasChanges(true);
      return copy;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {language === 'ar' ? 'لوحة الإدارة' : 'Admin Panel'}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {language === 'ar' ? 'أدخل كلمة المرور للوصول' : 'Enter password to access'}
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={language === 'ar' ? 'كلمة المرور' : 'Password'}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal focus:border-transparent text-gray-900 dark:text-white"
                  required
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-2">{passwordError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal to-cyan text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                {language === 'ar' ? 'دخول' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {language === 'ar' ? 'لوحة إدارة المحتوى' : 'Content Management Panel'}
            </h1>
            <div className="flex items-center gap-4">
              {hasChanges && (
                <button
                  onClick={saveContent}
                  disabled={saveStatus === 'saving'}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                    saveStatus === 'saving'
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                      : 'bg-teal text-white hover:bg-teal-light transform hover:scale-105'
                  }`}
                >
                  {saveStatus === 'saving' 
                    ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...')
                    : (language === 'ar' ? 'حفظ التغييرات' : 'Save Changes')
                  }
                </button>
              )}
              
              {saveStatus === 'saved' && (
                <span className="text-green-600 font-medium">
                  {language === 'ar' ? 'تم الحفظ ✓' : 'Saved ✓'}
                </span>
              )}

              <button
                onClick={resetToDefault}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                {language === 'ar' ? 'إعادة تعيين' : 'Reset'}
              </button>

              {/* Import / Export controls */}
              <input id="admin-import-file" type="file" accept="application/json" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  try {
                    const parsed = JSON.parse(String(reader.result));
                    setFullContent(parsed);
                    setRawJson(JSON.stringify(parsed, null, 2));
                    setSectionKeys(Object.keys(parsed || {}));
                    setActiveSection(Object.keys(parsed || {})[0] ?? null);
                    setHasChanges(true);
                    // clear the input so same file can be re-imported later if needed
                    const input = document.getElementById('admin-import-file') as HTMLInputElement | null;
                    if (input) input.value = '';
                  } catch {
                    alert(language === 'ar' ? 'ملف JSON غير صالح' : 'Invalid JSON file');
                  }
                };
                reader.readAsText(file);
              }} />

              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={() => {
                const input = document.getElementById('admin-import-file') as HTMLInputElement | null;
                input?.click();
              }}>{language === 'ar' ? 'استيراد JSON' : 'Import JSON'}</button>

              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg" onClick={() => {
                try {
                  const data = fullContent || (rawJson ? JSON.parse(rawJson) : null) || {};
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'mohcareer_original_content.json';
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  URL.revokeObjectURL(url);
                } catch {
                  alert(language === 'ar' ? 'خطأ في التصدير' : 'Export error');
                }
              }}>{language === 'ar' ? 'تصدير JSON' : 'Export JSON'}</button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                {language === 'ar' ? 'تسجيل خروج' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                {language === 'ar' ? 'أقسام المحتوى' : 'Content Sections'}
              </h3>
              <nav className="space-y-2">
                {sectionKeys.map((sectionId) => (
                  <button
                    key={sectionId}
                    onClick={() => setActiveSection(sectionId)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                      activeSection === sectionId
                        ? 'bg-teal text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {sectionId}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Editor */}
          <div className="lg:col-span-3">
            {sectionKeys.map((sectionId) => (
              <div key={sectionId} className={`${activeSection === sectionId ? 'block' : 'hidden'}`}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{sectionId}</h2>
                  </div>

                  <div className="p-6 space-y-8">
                    <div>
                      {/* Special editors for specific sections */}
                      {sectionId === 'navbar' && fullContent?.navbar && Array.isArray(fullContent.navbar.items) ? (
                        <div className="space-y-3">
                          {(fullContent.navbar.items as any[]).map((item: any, idx: number) => (
                            <div key={idx} className="grid md:grid-cols-3 gap-3 items-center">
                              <input className="px-3 py-2 rounded text-white" value={item.id || ''} onChange={(e) => {
                                setFullContent((prev: any) => {
                                  const copy = { ...(prev || {}) };
                                  copy.navbar = { ...(copy.navbar || {}) };
                                  copy.navbar.items = [...(copy.navbar.items || [])];
                                  copy.navbar.items[idx] = { ...copy.navbar.items[idx], id: e.target.value };
                                  return copy;
                                }); setHasChanges(true);
                              }} placeholder="id" />
                              <input className="px-3 py-2 rounded text-white" value={item.label || item.labelAr || ''} onChange={(e) => {
                                const val = e.target.value;
                                setFullContent((prev: any) => {
                                  const copy = { ...(prev || {}) };
                                  copy.navbar = { ...(copy.navbar || {}) };
                                  copy.navbar.items = [...(copy.navbar.items || [])];
                                  // preserve label types if present
                                  if ('label' in copy.navbar.items[idx] || !('labelAr' in copy.navbar.items[idx])) {
                                    copy.navbar.items[idx] = { ...copy.navbar.items[idx], label: val };
                                  } else {
                                    copy.navbar.items[idx] = { ...copy.navbar.items[idx], labelAr: val };
                                  }
                                  return copy;
                                }); setHasChanges(true);
                              }} placeholder="label" />
                              <div className="flex gap-2">
                                <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => {
                                  setFullContent((prev: any) => {
                                    const copy = { ...(prev || {}) };
                                    copy.navbar = { ...(copy.navbar || {}) };
                                    copy.navbar.items = [...(copy.navbar.items || [])];
                                    copy.navbar.items.splice(idx, 1);
                                    return copy;
                                  }); setHasChanges(true);
                                }}>{language === 'ar' ? 'حذف' : 'Remove'}</button>
                              </div>
                            </div>
                          ))}
                          <button className="mt-2 px-4 py-2 bg-teal text-white rounded" onClick={() => {
                            setFullContent((prev: any) => ({ ...(prev || {}), navbar: { ...(prev?.navbar || {}), items: [...(prev?.navbar?.items || []), { id: `item-${Date.now()}`, label: '' }] } }));
                            setHasChanges(true);
                          }}>{language === 'ar' ? 'إضافة' : 'Add'}</button>
                        </div>
                      ) : sectionId === 'socials' && Array.isArray(fullContent?.socials) ? (
                        <div className="space-y-4">
                          {(fullContent.socials as any[]).map((item: any, idx: number) => (
                            <div key={idx} className="grid md:grid-cols-3 gap-3 items-center">
                              <input className="px-3 py-2 rounded text-white" value={item.name || ''} onChange={(e) => {
                                setFullContent((prev: any) => {
                                  const copy = { ...(prev || {}) };
                                  copy.socials = [...(copy.socials || [])];
                                  copy.socials[idx] = { ...copy.socials[idx], name: e.target.value };
                                  return copy;
                                }); setHasChanges(true);
                              }} placeholder="name" />
                              <input className="px-3 py-2 rounded text-white" value={item.url || ''} onChange={(e) => {
                                setFullContent((prev: any) => {
                                  const copy = { ...(prev || {}) };
                                  copy.socials = [...(copy.socials || [])];
                                  copy.socials[idx] = { ...copy.socials[idx], url: e.target.value };
                                  return copy;
                                }); setHasChanges(true);
                              }} placeholder="url" />
                              <div className="flex gap-2">
                                <input className="px-3 py-2 rounded text-white" value={item.icon || ''} onChange={(e) => {
                                  setFullContent((prev: any) => {
                                    const copy = { ...(prev || {}) };
                                    copy.socials = [...(copy.socials || [])];
                                    copy.socials[idx] = { ...copy.socials[idx], icon: e.target.value };
                                    return copy;
                                  }); setHasChanges(true);
                                }} placeholder="icon" />
                                <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => {
                                  setFullContent((prev: any) => {
                                    const copy = { ...(prev || {}) };
                                    copy.socials = [...(copy.socials || [])];
                                    copy.socials.splice(idx, 1);
                                    return copy;
                                  }); setHasChanges(true);
                                }}>{language === 'ar' ? 'حذف' : 'Remove'}</button>
                              </div>
                            </div>
                          ))}
                          <button className="mt-2 px-4 py-2 bg-teal text-white rounded" onClick={() => {
                            setFullContent((prev: any) => ({ ...(prev || {}), socials: [...(prev?.socials || []), { name: '', url: '', icon: '' }] }));
                            setHasChanges(true);
                          }}>{language === 'ar' ? 'إضافة' : 'Add'}</button>
                        </div>
                      ) : sectionId === 'trustedBy' && Array.isArray(fullContent?.trustedBy) ? (
                        <div className="space-y-3">
                          <div className="flex flex-col gap-3">
                            {(fullContent.trustedBy as string[]).map((item: string, idx: number) => (
                              <div key={idx} className="flex items-center gap-2">
                                <input className="flex-1 px-3 py-2 rounded text-white" value={item || ''} onChange={(e) => {
                                  setFullContent((prev: any) => {
                                    const copy = { ...(prev || {}) };
                                    copy.trustedBy = [...(copy.trustedBy || [])];
                                    copy.trustedBy[idx] = e.target.value;
                                    return copy;
                                  }); setHasChanges(true);
                                }} />
                                <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={async () => {
                                  // delete from Supabase via API then remove from list
                                  try {
                                    const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_API_KEY || '';
                                    await fetch('/api/trusted-by', { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'x-admin-key': ADMIN_KEY }, body: JSON.stringify({ key: item }) });
                                  } catch {}
                                  setFullContent((prev: any) => {
                                    const copy = { ...(prev || {}) };
                                    copy.trustedBy = [...(copy.trustedBy || [])];
                                    copy.trustedBy.splice(idx, 1);
                                    return copy;
                                  }); setHasChanges(true);
                                }}>{language === 'ar' ? 'حذف' : 'Remove'}</button>
                              </div>
                            ))}

                            <div className="flex items-center gap-3">
                              <input id="trusted-by-file" type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                const f = e.target.files?.[0];
                                if (!f) return;
                                try {
                                  const fd = new FormData();
                                  fd.append('file', f, f.name);
                                  const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_API_KEY || '';
                                  const res = await fetch('/api/trusted-by', { method: 'POST', headers: { 'x-admin-key': ADMIN_KEY }, body: fd as any });
                                  const json = await res.json().catch(()=>({}));
                                  if (res.ok && json?.name) {
                                    setFullContent((prev:any)=>({ ...(prev||{}), trustedBy: [...(prev?.trustedBy||[]), json.name] }));
                                    setHasChanges(true);
                                  } else {
                                    // still add filename locally so admin can edit path
                                    setFullContent((prev:any)=>({ ...(prev||{}), trustedBy: [...(prev?.trustedBy||[]), f.name] }));
                                    setHasChanges(true);
                                  }
                                } catch (err) {
                                  console.warn('Upload failed', err);
                                  setFullContent((prev:any)=>({ ...(prev||{}), trustedBy: [...(prev?.trustedBy||[]), f.name] }));
                                  setHasChanges(true);
                                } finally {
                                  const input = document.getElementById('trusted-by-file') as HTMLInputElement|null;
                                  if (input) input.value = '';
                                }
                              }} />

                              <button className="px-4 py-2 bg-teal text-white rounded" onClick={() => { const input = document.getElementById('trusted-by-file') as HTMLInputElement|null; input?.click(); }}>{language === 'ar' ? 'رفع شعار' : 'Upload Logo'}</button>
                              <p className="text-sm text-gray-500">Use Supabase bucket: https://mnymihqaxdddxokphire.supabase.co/storage/v1/object/public/trusted-by/</p>
                            </div>
                          </div>
                        </div>
                      ) : sectionId === 'whatsapp' && fullContent?.whatsapp && typeof fullContent.whatsapp === 'object' ? (
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm">{language === 'ar' ? 'الهاتف' : 'Phone'}</label>
                              <input className="w-full px-3 py-2 rounded text-white" value={fullContent.whatsapp.phone || ''} onChange={(e) => { setFullContent((prev:any) => ({ ...(prev||{}), whatsapp: { ...(prev.whatsapp||{}), phone: e.target.value } })); setHasChanges(true); }} />
                            </div>
                            <div>
                              <label className="block text-sm">URL Template</label>
                              <input className="w-full px-3 py-2 rounded text-white" value={fullContent.whatsapp.urlTemplate || ''} onChange={(e) => { setFullContent((prev:any) => ({ ...(prev||{}), whatsapp: { ...(prev.whatsapp||{}), urlTemplate: e.target.value } })); setHasChanges(true); }} />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm">{language === 'ar' ? 'رسالة (عربي)' : 'Message (AR)'}</label>
                            <textarea className="w-full px-3 py-2 rounded text-white" rows={3} value={fullContent.whatsapp.message_ar || ''} onChange={(e) => { setFullContent((prev:any) => ({ ...(prev||{}), whatsapp: { ...(prev.whatsapp||{}), message_ar: e.target.value } })); setHasChanges(true); }} />
                          </div>
                          <div>
                            <label className="block text-sm">Message (EN)</label>
                            <textarea className="w-full px-3 py-2 rounded text-white" rows={3} value={fullContent.whatsapp.message_en || ''} onChange={(e) => { setFullContent((prev:any) => ({ ...(prev||{}), whatsapp: { ...(prev.whatsapp||{}), message_en: e.target.value } })); setHasChanges(true); }} />
                          </div>
                        </div>
                      ) : sectionId === 'ui' && fullContent?.ui && typeof fullContent.ui === 'object' ? (
                        <div className="space-y-6">
                          {Object.keys(fullContent.ui).map((uiKey: string) => (
                            <div key={uiKey} className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
                              <h4 className="font-semibold mb-2">{uiKey}</h4>
                              {fullContent.ui[uiKey].ar && fullContent.ui[uiKey].en ? (
                                <div>
                                  {Object.keys(fullContent.ui[uiKey].ar).map((k: string) => (
                                    <div key={k} className="grid md:grid-cols-2 gap-3 mb-2">
                                      <input className="px-3 py-2 text-white" value={fullContent.ui[uiKey].ar[k] || ''} onChange={(e) => { setFullContent((prev:any) => { const copy = { ...(prev||{}) }; copy.ui = { ...(copy.ui||{}) }; copy.ui[uiKey] = { ...(copy.ui[uiKey]||{}), ar: { ...(copy.ui[uiKey].ar||{}), [k]: e.target.value } }; return copy; }); setHasChanges(true); }} />
                                      <input className="px-3 py-2 text-white" value={fullContent.ui[uiKey].en[k] || ''} onChange={(e) => { setFullContent((prev:any) => { const copy = { ...(prev||{}) }; copy.ui = { ...(copy.ui||{}) }; copy.ui[uiKey] = { ...(copy.ui[uiKey]||{}), en: { ...(copy.ui[uiKey].en||{}), [k]: e.target.value } }; return copy; }); setHasChanges(true); }} />
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <textarea className="w-full font-mono text-white" rows={6} value={JSON.stringify(fullContent.ui[uiKey], null, 2)} onChange={(e)=>{ try{ const parsed = JSON.parse(e.target.value); setFullContent((prev:any)=>{ const copy = {...(prev||{})}; copy.ui = {...(copy.ui||{})}; copy.ui[uiKey] = parsed; return copy; }); setHasChanges(true);}catch{} }} />
                              )}
                            </div>
                          ))}
                        </div>
                      ) : sectionId === 'footer' && fullContent?.footer && typeof fullContent.footer === 'object' ? (
                        <div className="space-y-4">
                          <h4 className="font-semibold">Brand</h4>
                          <div className="grid md:grid-cols-3 gap-3">
                            <input className="px-3 py-2 text-white" value={fullContent.footer.brand?.logoLight || ''} onChange={(e)=>{ setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.footer = {...(copy.footer||{})}; copy.footer.brand = {...(copy.footer.brand||{}), logoLight: e.target.value}; return copy; }); setHasChanges(true); }} placeholder="logoLight" />
                            <input className="px-3 py-2 text-white" value={fullContent.footer.brand?.logoDark || ''} onChange={(e)=>{ setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.footer = {...(copy.footer||{})}; copy.footer.brand = {...(copy.footer.brand||{}), logoDark: e.target.value}; return copy; }); setHasChanges(true); }} placeholder="logoDark" />
                            <input className="px-3 py-2 text-white" value={fullContent.footer.brand?.name || ''} onChange={(e)=>{ setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.footer = {...(copy.footer||{})}; copy.footer.brand = {...(copy.footer.brand||{}), name: e.target.value}; return copy; }); setHasChanges(true); }} placeholder="name" />
                          </div>

                          <h4 className="font-semibold">Contact (AR)</h4>
                          <div className="grid md:grid-cols-3 gap-3">
                            <input className="px-3 py-2 text-white" value={fullContent.footer?.ar?.contactInfo?.email || ''} onChange={(e)=>{ setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.footer = {...(copy.footer||{})}; copy.footer.ar = {...(copy.footer.ar||{})}; copy.footer.ar.contactInfo = {...(copy.footer.ar.contactInfo||{}), email: e.target.value}; return copy; }); setHasChanges(true); }} placeholder="email" />
                            <input className="px-3 py-2 text-white" value={fullContent.footer?.ar?.contactInfo?.phone || ''} onChange={(e)=>{ setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.footer = {...(copy.footer||{})}; copy.footer.ar = {...(copy.footer.ar||{})}; copy.footer.ar.contactInfo = {...(copy.footer.ar.contactInfo||{}), phone: e.target.value}; return copy; }); setHasChanges(true); }} placeholder="phone" />
                            <input className="px-3 py-2 text-white" value={fullContent.footer?.ar?.contactInfo?.address || ''} onChange={(e)=>{ setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.footer = {...(copy.footer||{})}; copy.footer.ar = {...(copy.footer.ar||{})}; copy.footer.ar.contactInfo = {...(copy.footer.ar.contactInfo||{}), address: e.target.value}; return copy; }); setHasChanges(true); }} placeholder="address" />
                          </div>

                          <h4 className="font-semibold">Contact (EN)</h4>
                          <div className="grid md:grid-cols-3 gap-3">
                            <input className="px-3 py-2 text-white" value={fullContent.footer?.en?.contactInfo?.email || ''} onChange={(e)=>{ setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.footer = {...(copy.footer||{})}; copy.footer.en = {...(copy.footer.en||{})}; copy.footer.en.contactInfo = {...(copy.footer.en.contactInfo||{}), email: e.target.value}; return copy; }); setHasChanges(true); }} placeholder="email" />
                            <input className="px-3 py-2 text-white" value={fullContent.footer?.en?.contactInfo?.phone || ''} onChange={(e)=>{ setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.footer = {...(copy.footer||{})}; copy.footer.en = {...(copy.footer.en||{})}; copy.footer.en.contactInfo = {...(copy.footer.en.contactInfo||{}), phone: e.target.value}; return copy; }); setHasChanges(true); }} placeholder="phone" />
                            <input className="px-3 py-2 text-white" value={fullContent.footer?.en?.contactInfo?.address || ''} onChange={(e)=>{ setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.footer = {...(copy.footer||{})}; copy.footer.en = {...(copy.footer.en||{})}; copy.footer.en.contactInfo = {...(copy.footer.en.contactInfo||{}), address: e.target.value}; return copy; }); setHasChanges(true); }} placeholder="address" />
                          </div>
                        </div>
                      ) : sectionId === 'services' && fullContent?.services && typeof fullContent.services === 'object' ? (
                        <div className="space-y-4">
                          <h4 className="font-semibold">Services (AR / EN)</h4>
                          {Array.from({ length: Math.max((fullContent.services.ar||[]).length, (fullContent.services.en||[]).length) }, (_, idx) => idx).map((idx) => (
                            <div key={idx} className="grid md:grid-cols-2 gap-4 p-3 border rounded">
                              <div>
                                <div className="font-medium mb-2">AR - Item #{idx + 1}</div>
                                <input className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg text-white mb-2" value={fullContent.services.ar?.[idx]?.title || ''} onChange={(e) => { const v = e.target.value; setFullContent((prev:any)=>{ const copy = { ...(prev||{}) }; copy.services = copy.services || { ar: [], en: [] }; copy.services.ar = [...(copy.services.ar||[])]; copy.services.ar[idx] = { ...(copy.services.ar[idx]||{}), title: v }; return copy; }); setHasChanges(true); }} placeholder="title" />
                                <textarea className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg text-white mb-2" rows={3} value={fullContent.services.ar?.[idx]?.description || ''} onChange={(e)=>{ const v = e.target.value; setFullContent((prev:any)=>{ const copy = { ...(prev||{}) }; copy.services = copy.services || { ar: [], en: [] }; copy.services.ar = [...(copy.services.ar||[])]; copy.services.ar[idx] = { ...(copy.services.ar[idx]||{}), description: v }; return copy; }); setHasChanges(true); }} placeholder="description" />
                                <input className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg text-white mb-2" value={fullContent.services.ar?.[idx]?.price || ''} onChange={(e)=>{ const v=e.target.value; setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.services = copy.services || { ar: [], en: [] }; copy.services.ar=[...(copy.services.ar||[])]; copy.services.ar[idx] = { ...(copy.services.ar[idx]||{}), price: v }; return copy; }); setHasChanges(true); }} placeholder="price" />
                                
                                {/* Sale Price Fields */}
                                <div className="mb-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                  <label className="flex items-center gap-2 mb-2">
                                    <input 
                                      type="checkbox" 
                                      checked={fullContent.services.ar?.[idx]?.saleEnabled || false} 
                                      onChange={(e)=>{ 
                                        const v=e.target.checked; 
                                        setFullContent((prev:any)=>{ 
                                          const copy={...(prev||{})}; 
                                          copy.services=copy.services||{ar:[],en:[]}; 
                                          copy.services.ar=[...(copy.services.ar||[])]; 
                                          copy.services.en=[...(copy.services.en||[])];
                                          copy.services.ar[idx] = { ...(copy.services.ar[idx]||{}), saleEnabled: v }; 
                                          copy.services.en[idx] = { ...(copy.services.en[idx]||{}), saleEnabled: v }; 
                                          return copy; 
                                        }); 
                                        setHasChanges(true); 
                                      }} 
                                    />
                                    <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">تفعيل السعر المخفض</span>
                                  </label>
                                  {fullContent.services.ar?.[idx]?.saleEnabled && (
                                    <input 
                                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-yellow-300 dark:border-yellow-600 rounded-lg text-gray-900 dark:text-white" 
                                      value={fullContent.services.ar?.[idx]?.salePrice || ''} 
                                      onChange={(e)=>{ const v=e.target.value; setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.services=copy.services||{ar:[],en:[]}; copy.services.ar=[...(copy.services.ar||[])]; copy.services.ar[idx] = { ...(copy.services.ar[idx]||{}), salePrice: v }; return copy; }); setHasChanges(true); }} 
                                      placeholder="السعر المخفض" 
                                    />
                                  )}
                                </div>
                                
                                {/* Sessions Fields */}
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                  <input className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg text-white" value={fullContent.services.ar?.[idx]?.sessionsValue !== undefined ? fullContent.services.ar[idx].sessionsValue : (fullContent.services.ar?.[idx]?.sessions !== undefined ? fullContent.services.ar[idx].sessions : 1)} onChange={(e)=>{ const v=Number(e.target.value||0); setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.services=copy.services||{ar:[],en:[]}; copy.services.ar=[...(copy.services.ar||[])]; copy.services.ar[idx] = { ...(copy.services.ar[idx]||{}), sessionsValue: v, sessions: v }; return copy; }); setHasChanges(true); }} placeholder="عدد الجلسات (0 = إخفاء)" />
                                  <input className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg text-white" value={fullContent.services.ar?.[idx]?.sessionsLabel || 'عدد الجلسات'} onChange={(e)=>{ const v=e.target.value; setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.services=copy.services||{ar:[],en:[]}; copy.services.ar=[...(copy.services.ar||[])]; copy.services.ar[idx] = { ...(copy.services.ar[idx]||{}), sessionsLabel: v }; return copy; }); setHasChanges(true); }} placeholder="تسمية الجلسات" />
                                </div>
                                
                                {/* Duration Fields */}
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                  <input className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg text-white" value={fullContent.services.ar?.[idx]?.durationValue !== undefined ? fullContent.services.ar[idx].durationValue : (fullContent.services.ar?.[idx]?.duration?.split(' ')[0] !== undefined ? parseFloat(fullContent.services.ar[idx].duration.split(' ')[0]) : 1)} onChange={(e)=>{ const v=parseFloat(e.target.value) || 0; setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.services=copy.services||{ar:[],en:[]}; copy.services.ar=[...(copy.services.ar||[])]; copy.services.ar[idx] = { ...(copy.services.ar[idx]||{}), durationValue: v, duration: v + ' ساعة' }; return copy; }); setHasChanges(true); }} placeholder="مدة الوقت (0 = إخفاء)" type="number" step="0.5" min="0" />
                                  <input className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg text-white" value={fullContent.services.ar?.[idx]?.durationLabel || 'المدة (بالساعات)'} onChange={(e)=>{ const v=e.target.value; setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.services=copy.services||{ar:[],en:[]}; copy.services.ar=[...(copy.services.ar||[])]; copy.services.ar[idx] = { ...(copy.services.ar[idx]||{}), durationLabel: v }; return copy; }); setHasChanges(true); }} placeholder="تسمية المدة" />
                                </div>

                                <input className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg text-white mb-2" value={fullContent.services.ar?.[idx]?.link || ''} onChange={(e)=>{ const v=e.target.value; setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.services = copy.services || { ar: [], en: [] }; copy.services.ar = [...(copy.services.ar||[])]; copy.services.ar[idx] = { ...(copy.services.ar[idx]||{}), link: v }; return copy; }); setHasChanges(true); }} placeholder="link" />
                                
                                {/* Notes Fields */}
                                <div className="mb-2">
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الملاحظات (سطر لكل ملاحظة)</label>
                                  <textarea className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-red-300 rounded-lg text-white whitespace-pre-wrap" rows={4} value={(fullContent.services.ar?.[idx]?.notes||[]).join('\n')} onChange={(e)=>{ const arr = e.target.value.split('\n'); const firstNonEmpty = arr.find(n=>n.trim()); setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.services = copy.services || { ar: [], en: [] }; copy.services.ar = [...(copy.services.ar||[])]; copy.services.ar[idx] = { ...(copy.services.ar[idx]||{}), notes: arr, note: firstNonEmpty ?? arr[0] ?? '' }; return copy; }); setHasChanges(true); }} placeholder="ملاحظة 1&#10;ملاحظة 2&#10;ملاحظة 3" />
                                </div>

                                <textarea className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg text-white" rows={2} value={(fullContent.services.ar?.[idx]?.features||[]).join('\n')} onChange={(e)=>{ const arr = e.target.value.split('\n'); setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.services=copy.services||{ar:[],en:[]}; copy.services.ar=[...(copy.services.ar||[])]; copy.services.ar[idx] = { ...(copy.services.ar[idx]||{}), features: arr }; return copy; }); setHasChanges(true); }} placeholder="features (one per line)" />
                              </div>
                              <div>
                                <div className="font-medium mb-2">EN - Item #{idx + 1}</div>
                                <input className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg text-white mb-2" value={fullContent.services.en?.[idx]?.title || ''} onChange={(e) => { const v = e.target.value; setFullContent((prev:any)=>{ const copy = { ...(prev||{}) }; copy.services = copy.services || { ar: [], en: [] }; copy.services.en = [...(copy.services.en||[])]; copy.services.en[idx] = { ...(copy.services.en[idx]||{}), title: v }; return copy; }); setHasChanges(true); }} placeholder="title" />
                                <textarea className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg text-white mb-2" rows={3} value={fullContent.services.en?.[idx]?.description || ''} onChange={(e)=>{ const v = e.target.value; setFullContent((prev:any)=>{ const copy = { ...(prev||{}) }; copy.services = copy.services || { ar: [], en: [] }; copy.services.en = [...(copy.services.en||[])]; copy.services.en[idx] = { ...(copy.services.en[idx]||{}), description: v }; return copy; }); setHasChanges(true); }} placeholder="description" />
                                <input className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg text-white mb-2" value={fullContent.services.en?.[idx]?.price || ''} onChange={(e)=>{ const v=e.target.value; setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.services=copy.services||{ar:[],en:[]}; copy.services.en=[...(copy.services.en||[])]; copy.services.en[idx] = { ...(copy.services.en[idx]||{}), price: v }; return copy; }); setHasChanges(true); }} placeholder="price" />
                                
                                {/* Sale Price Fields */}
                                <div className="mb-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                  <label className="flex items-center gap-2 mb-2">
                                    <input 
                                      type="checkbox" 
                                      checked={fullContent.services.en?.[idx]?.saleEnabled || false} 
                                      onChange={(e)=>{ 
                                        const v=e.target.checked; 
                                        setFullContent((prev:any)=>{ 
                                          const copy={...(prev||{})}; 
                                          copy.services=copy.services||{ar:[],en:[]}; 
                                          copy.services.ar=[...(copy.services.ar||[])]; 
                                          copy.services.en=[...(copy.services.en||[])];
                                          copy.services.ar[idx] = { ...(copy.services.ar[idx]||{}), saleEnabled: v }; 
                                          copy.services.en[idx] = { ...(copy.services.en[idx]||{}), saleEnabled: v }; 
                                          return copy; 
                                        }); 
                                        setHasChanges(true); 
                                      }} 
                                    />
                                    <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Enable Sale Price</span>
                                  </label>
                                  {fullContent.services.en?.[idx]?.saleEnabled && (
                                    <input 
                                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-yellow-300 dark:border-yellow-600 rounded-lg text-gray-900 dark:text-white" 
                                      value={fullContent.services.en?.[idx]?.salePrice || ''} 
                                      onChange={(e)=>{ const v=e.target.value; setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.services=copy.services||{ar:[],en:[]}; copy.services.en=[...(copy.services.en||[])]; copy.services.en[idx] = { ...(copy.services.en[idx]||{}), salePrice: v }; return copy; }); setHasChanges(true); }} 
                                      placeholder="Sale Price" 
                                    />
                                  )}
                                </div>
                                
                                {/* Sessions Fields */}
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                  <input className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg text-white" value={fullContent.services.en?.[idx]?.sessionsValue !== undefined ? fullContent.services.en[idx].sessionsValue : (fullContent.services.en?.[idx]?.sessions !== undefined ? fullContent.services.en[idx].sessions : 1)} onChange={(e)=>{ const v=Number(e.target.value||0); setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.services=copy.services||{ar:[],en:[]}; copy.services.en=[...(copy.services.en||[])]; copy.services.en[idx] = { ...(copy.services.en[idx]||{}), sessionsValue: v, sessions: v }; return copy; }); setHasChanges(true); }} placeholder="Sessions count (0 = hide)" />
                                  <input className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg text-white" value={fullContent.services.en?.[idx]?.sessionsLabel || 'Sessions'} onChange={(e)=>{ const v=e.target.value; setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.services=copy.services||{ar:[],en:[]}; copy.services.en=[...(copy.services.en||[])]; copy.services.en[idx] = { ...(copy.services.en[idx]||{}), sessionsLabel: v }; return copy; }); setHasChanges(true); }} placeholder="Sessions label" />
                                </div>
                                
                                {/* Duration Fields */}
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                  <input className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg text-white" value={fullContent.services.en?.[idx]?.durationValue !== undefined ? fullContent.services.en[idx].durationValue : (fullContent.services.en?.[idx]?.duration?.split(' ')[0] !== undefined ? parseFloat(fullContent.services.en[idx].duration.split(' ')[0]) : 1)} onChange={(e)=>{ const v=parseFloat(e.target.value) || 0; setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.services=copy.services||{ar:[],en:[]}; copy.services.en=[...(copy.services.en||[])]; copy.services.en[idx] = { ...(copy.services.en[idx]||{}), durationValue: v, duration: v + ' hr' }; return copy; }); setHasChanges(true); }} placeholder="Duration value (0 = hide)" type="number" step="0.5" min="0" />
                                  <input className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg text-white" value={fullContent.services.en?.[idx]?.durationLabel || 'Duration (hrs)'} onChange={(e)=>{ const v=e.target.value; setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.services=copy.services||{ar:[],en:[]}; copy.services.en=[...(copy.services.en||[])]; copy.services.en[idx] = { ...(copy.services.en[idx]||{}), durationLabel: v }; return copy; }); setHasChanges(true); }} placeholder="Duration label" />
                                </div>

                                <input className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg text-white mb-2" value={fullContent.services.en?.[idx]?.link || ''} onChange={(e)=>{ const v=e.target.value; setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.services = copy.services || { ar: [], en: [] }; copy.services.en = [...(copy.services.en||[])]; copy.services.en[idx] = { ...(copy.services.en[idx]||{}), link: v }; return copy; }); setHasChanges(true); }} placeholder="link" />
                                
                                {/* Notes Fields */}
                                <div className="mb-2">
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes (one per line)</label>
                                  <textarea className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-red-300 rounded-lg text-white whitespace-pre-wrap" rows={4} value={(fullContent.services.en?.[idx]?.notes||[]).join('\n')} onChange={(e)=>{ const arr = e.target.value.split('\n'); const firstNonEmpty = arr.find(n=>n.trim()); setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.services = copy.services || { ar: [], en: [] }; copy.services.en = [...(copy.services.en||[])]; copy.services.en[idx] = { ...(copy.services.en[idx]||{}), notes: arr, note: firstNonEmpty ?? arr[0] ?? '' }; return copy; }); setHasChanges(true); }} placeholder="Note 1&#10;Note 2&#10;Note 3" />
                                </div>

                                <textarea className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg text-white" rows={2} value={(fullContent.services.en?.[idx]?.features||[]).join('\n')} onChange={(e)=>{ const arr = e.target.value.split('\n'); setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.services=copy.services||{ar:[],en:[]}; copy.services.en=[...(copy.services.en||[])]; copy.services.en[idx] = { ...(copy.services.en[idx]||{}), features: arr }; return copy; }); setHasChanges(true); }} placeholder="features (one per line)" />
                                <div className="mt-2 flex gap-2">
                                  {/** compute current visible length to disable boundary moves */}
                                  {(() => {
                                    const total = Math.max((fullContent?.services?.ar||[]).length, (fullContent?.services?.en||[]).length);
                                    return (
                                      <>
                                        <button
                                          className={`px-3 py-1 rounded ${idx === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-800'}`}
                                          disabled={idx === 0}
                                          onClick={() => moveServiceUp(idx)}
                                        >{language==='ar'?'نقل للأعلى':'Move Up'}</button>

                                        <button
                                          className={`px-3 py-1 rounded ${idx >= total-1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-800'}`}
                                          disabled={idx >= total-1}
                                          onClick={() => moveServiceDown(idx)}
                                        >{language==='ar'?'نقل للأسفل':'Move Down'}</button>

                                        <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => { setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.services=copy.services||{ar:[],en:[]}; copy.services.ar=[...(copy.services.ar||[])]; copy.services.en=[...(copy.services.en||[])]; copy.services.ar.splice(idx,1); copy.services.en.splice(idx,1); return copy; }); setHasChanges(true); }}>{language==='ar'?'حذف':'Remove'}</button>
                                      </>
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>
                          ))}
                          <div>
                            <button className="px-4 py-2 bg-teal text-white rounded" onClick={() => { setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.services = copy.services || { ar: [], en: [] }; copy.services.ar = [...(copy.services.ar||[]), { title: '', description: '', features: [], price: '', sessions: 1, sessionsValue: 1, sessionsLabel: 'عدد الجلسات', duration: '1 ساعة', durationValue: 1, durationLabel: 'المدة (بالساعات)', link: '', note: '', notes: [] }]; copy.services.en = [...(copy.services.en||[]), { title: '', description: '', features: [], price: '', sessions: 1, sessionsValue: 1, sessionsLabel: 'Sessions', duration: '1 hr', durationValue: 1, durationLabel: 'Duration (hrs)', link: '', note: '', notes: [] }]; return copy; }); setHasChanges(true); }}>{language==='ar'?'إضافة خدمة':'Add Service'}</button>
                          </div>
                        </div>
                      ) : sectionId === 'faq' && fullContent?.faq && typeof fullContent.faq === 'object' ? (
                        <div className="space-y-4">
                          <h4 className="font-semibold">FAQ (AR / EN)</h4>
                          {Array.from({ length: Math.max((fullContent.faq.ar||[]).length, (fullContent.faq.en||[]).length) }, (_, idx) => idx).map((idx) => (
                            <div key={idx} className="grid md:grid-cols-2 gap-4 p-3 border rounded">
                              <div>
                                <div className="font-medium mb-2">AR #{idx+1}</div>
                                <input className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg dark:text-white text-gray-900 mb-2" value={fullContent.faq.ar?.[idx]?.question || ''} onChange={(e)=>{ const v=e.target.value; setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.faq = copy.faq || { ar: [], en: [] }; copy.faq.ar = [...(copy.faq.ar||[])]; copy.faq.ar[idx] = { ...(copy.faq.ar[idx]||{}), question: v }; return copy; }); setHasChanges(true); }} placeholder="question" />
                                <textarea className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg dark:text-white text-gray-900" rows={3} value={fullContent.faq.ar?.[idx]?.answer || ''} onChange={(e)=>{ const v=e.target.value; setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.faq = copy.faq || { ar: [], en: [] }; copy.faq.ar = [...(copy.faq.ar||[])]; copy.faq.ar[idx] = { ...(copy.faq.ar[idx]||{}), answer: v }; return copy; }); setHasChanges(true); }} placeholder="answer" />
                              </div>
                              <div>
                                <div className="font-medium mb-2">EN #{idx+1}</div>
                                <input className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg dark:text-white text-gray-900 mb-2" value={fullContent.faq.en?.[idx]?.question || ''} onChange={(e)=>{ const v=e.target.value; setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.faq = copy.faq || { ar: [], en: [] }; copy.faq.en = [...(copy.faq.en||[])]; copy.faq.en[idx] = { ...(copy.faq.en[idx]||{}), question: v }; return copy; }); setHasChanges(true); }} placeholder="question" />
                                <textarea className="w-full px-3 py-2 bg_gray-50 dark:bg-gray-700 border rounded-lg text-white" rows={3} value={fullContent.faq.en?.[idx]?.answer || ''} onChange={(e)=>{ const v=e.target.value; setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.faq = copy.faq || { ar: [], en: [] }; copy.faq.en = [...(copy.faq.en||[])]; copy.faq.en[idx] = { ...(copy.faq.en[idx]||{}), answer: v }; return copy; }); setHasChanges(true); }} placeholder="answer" />
                                <div className="mt-2 flex gap-2">
                                  <button className={`px-3 py-1 rounded ${idx === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-800'}`} disabled={idx===0} onClick={() => moveFaqUp(idx)}>{language==='ar'?'نقل للأعلى':'Move Up'}</button>
                                  <button className={`px-3 py-1 rounded ${idx >= Math.max((fullContent.faq?.ar||[]).length, (fullContent.faq?.en||[]).length)-1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-800'}`} disabled={idx >= Math.max((fullContent.faq?.ar||[]).length, (fullContent.faq?.en||[]).length)-1} onClick={() => moveFaqDown(idx)}>{language==='ar'?'نقل للأسفل':'Move Down'}</button>
                                  <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => { setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.faq = copy.faq || { ar: [], en: [] }; copy.faq.ar = [...(copy.faq.ar||[])]; copy.faq.en = [...(copy.faq.en||[])]; copy.faq.ar.splice(idx,1); copy.faq.en.splice(idx,1); return copy; }); setHasChanges(true); }}>{language==='ar'?'حذف':'Remove'}</button>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div>
                            <button className="px-4 py-2 bg-teal text-white rounded" onClick={()=>{ setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.faq = copy.faq || { ar: [], en: [] }; copy.faq.ar = [...(copy.faq.ar||[]), { question:'', answer:'' }]; copy.faq.en = [...(copy.faq.en||[]), { question:'', answer:'' }]; return copy; }); setHasChanges(true); }}>{language==='ar'?'إضافة سؤال':'Add FAQ'}</button>
                          </div>
                        </div>
                      ) : sectionId === 'testimonials' && fullContent?.testimonials && typeof fullContent.testimonials === 'object' ? (
                        <div className="space-y-4">
                          <h4 className="font-semibold">Testimonials (AR / EN)</h4>
                          {Array.from({ length: Math.max((fullContent.testimonials.ar||[]).length, (fullContent.testimonials.en||[]).length) }, (_, idx) => idx).map((idx) => (
                            <div key={idx} className="grid md:grid-cols-2 gap-4 p-3 border rounded">
                              <div>
                                <div className="font-medium mb-2">AR #{idx+1}</div>
                                <textarea className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg dark:text-white text-gray-900 mb-2" rows={3} value={fullContent.testimonials.ar?.[idx]?.text || ''} onChange={(e)=>{ const v=e.target.value; setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.testimonials = copy.testimonials || { ar: [], en: [] }; copy.testimonials.ar = [...(copy.testimonials.ar||[])]; copy.testimonials.ar[idx] = { ...(copy.testimonials.ar[idx]||{}), text: v }; return copy; }); setHasChanges(true); }} placeholder="text" />
                                <input className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg dark:text-white text-gray-900 mb-2" value={fullContent.testimonials.ar?.[idx]?.name || ''} onChange={(e)=>{ const v=e.target.value; setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.testimonials = copy.testimonials || { ar: [], en: [] }; copy.testimonials.ar = [...(copy.testimonials.ar||[])]; copy.testimonials.ar[idx] = { ...(copy.testimonials.ar[idx]||{}), name: v }; return copy; }); setHasChanges(true); }} placeholder="name" />
                                <input className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg dark:text-white text-gray-900 mb-2" value={fullContent.testimonials.ar?.[idx]?.title || ''} onChange={(e)=>{ const v=e.target.value; setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.testimonials = copy.testimonials || { ar: [], en: [] }; copy.testimonials.ar = [...(copy.testimonials.ar||[])]; copy.testimonials.ar[idx] = { ...(copy.testimonials.ar[idx]||{}), title: v }; return copy; }); setHasChanges(true); }} placeholder="title" />
                                <input className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg dark:text-white text-gray-900 mb-2" type="color" value={fullContent.testimonials.ar?.[idx]?.iconColor || '#2a8891'} onChange={(e)=>{ const v=e.target.value; setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.testimonials = copy.testimonials || { ar: [], en: [] }; copy.testimonials.ar = [...(copy.testimonials.ar||[])]; copy.testimonials.ar[idx] = { ...(copy.testimonials.ar[idx]||{}), iconColor: v }; return copy; }); setHasChanges(true); }} placeholder="Icon Color" />
                                <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg dark:text-white text-gray-900" value={fullContent.testimonials.ar?.[idx]?.gender || ''} onChange={(e)=>{ const v=e.target.value; setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.testimonials = copy.testimonials || { ar: [], en: [] }; copy.testimonials.ar = [...(copy.testimonials.ar||[])]; copy.testimonials.ar[idx] = { ...(copy.testimonials.ar[idx]||{}), gender: v }; return copy; }); setHasChanges(true); }}>
                                  <option value="">Select Gender</option>
                                  <option value="male">Male</option>
                                  <option value="female">Female</option>
                                </select>
                              </div>
                              <div>
                                <div className="font-medium mb-2">EN #{idx+1}</div>
                                <textarea className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg dark:text-white text-gray-900 mb-2" rows={3} value={fullContent.testimonials.en?.[idx]?.text || ''} onChange={(e)=>{ const v=e.target.value; setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.testimonials = copy.testimonials || { ar: [], en: [] }; copy.testimonials.en = [...(copy.testimonials.en||[])]; copy.testimonials.en[idx] = { ...(copy.testimonials.en[idx]||{}), text: v }; return copy; }); setHasChanges(true); }} placeholder="text" />
                                <input className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg dark:text-white text-gray-900 mb-2" value={fullContent.testimonials.en?.[idx]?.name || ''} onChange={(e)=>{ const v=e.target.value; setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.testimonials = copy.testimonials || { ar: [], en: [] }; copy.testimonials.en = [...(copy.testimonials.en||[])]; copy.testimonials.en[idx] = { ...(copy.testimonials.en[idx]||{}), name: v }; return copy; }); setHasChanges(true); }} placeholder="name" />
                                <input className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg dark:text-white text-gray-900 mb-2" value={fullContent.testimonials.en?.[idx]?.title || ''} onChange={(e)=>{ const v=e.target.value; setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.testimonials = copy.testimonials || { ar: [], en: [] }; copy.testimonials.en = [...(copy.testimonials.en||[])]; copy.testimonials.en[idx] = { ...(copy.testimonials.en[idx]||{}), title: v }; return copy; }); setHasChanges(true); }} placeholder="title" />
                                <input className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg dark:text-white text-gray-900 mb-2" type="color" value={fullContent.testimonials.en?.[idx]?.iconColor || '#2a8891'} onChange={(e)=>{ const v=e.target.value; setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.testimonials = copy.testimonials || { ar: [], en: [] }; copy.testimonials.en = [...(copy.testimonials.en||[])]; copy.testimonials.en[idx] = { ...(copy.testimonials.en[idx]||{}), iconColor: v }; return copy; }); setHasChanges(true); }} placeholder="Icon Color" />
                                <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg dark:text-white text-gray-900 mb-2" value={fullContent.testimonials.en?.[idx]?.gender || ''} onChange={(e)=>{ const v=e.target.value; setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.testimonials = copy.testimonials || { ar: [], en: [] }; copy.testimonials.en = [...(copy.testimonials.en||[])]; copy.testimonials.en[idx] = { ...(copy.testimonials.en[idx]||{}), gender: v }; return copy; }); setHasChanges(true); }}>
                                  <option value="">Select Gender</option>
                                  <option value="male">Male</option>
                                  <option value="female">Female</option>
                                </select>
                                <div className="mt-2">
                                  <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => { setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.testimonials = copy.testimonials || { ar: [], en: [] }; copy.testimonials.ar = [...(copy.testimonials.ar||[])]; copy.testimonials.en = [...(copy.testimonials.en||[])]; copy.testimonials.ar.splice(idx,1); copy.testimonials.en.splice(idx,1); return copy; }); setHasChanges(true); }}>{language==='ar'?'حذف':'Remove'}</button>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div>
                            <button className="px-4 py-2 bg-teal text-white rounded" onClick={()=>{ setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.testimonials = copy.testimonials || { ar: [], en: [] }; copy.testimonials.ar = [...(copy.testimonials.ar||[]), { text:'', name:'', title:'', iconColor:'#2a8891', gender:'male' }]; copy.testimonials.en = [...(copy.testimonials.en||[]), { text:'', name:'', title:'', iconColor:'#2a8891', gender:'male' }]; return copy; }); setHasChanges(true); }}>{language==='ar'?'إضافة':'Add Testimonial'}</button>
                          </div>
                        </div>
                      ) : sectionId === 'whyChoose' && fullContent?.whyChoose && typeof fullContent.whyChoose === 'object' ? (
                        <div className="space-y-4">
                          <h4 className="font-semibold">Why Choose Me (AR / EN)</h4>
                          {Array.from({ length: Math.max((fullContent.whyChoose.ar||[]).length, (fullContent.whyChoose.en||[]).length) }, (_, idx) => idx).map((idx) => (
                            <div key={idx} className="grid md:grid-cols-2 gap-4 p-3 border rounded">
                              <div>
                                <div className="font-medium mb-2">AR #{idx+1}</div>
                                <input className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg text-white mb-2" value={fullContent.whyChoose.ar?.[idx]?.text || ''} onChange={(e)=>{ const v=e.target.value; setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.whyChoose = copy.whyChoose || { ar: [], en: [] }; copy.whyChoose.ar = [...(copy.whyChoose.ar||[])]; copy.whyChoose.ar[idx] = { ...(copy.whyChoose.ar[idx]||{}), text: v }; return copy; }); setHasChanges(true); }} placeholder="text" />
                                <input className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg text-white" value={fullContent.whyChoose.ar?.[idx]?.icon || ''} onChange={(e)=>{ const v=e.target.value; setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.whyChoose = copy.whyChoose || { ar: [], en: [] }; copy.whyChoose.ar = [...(copy.whyChoose.ar||[])]; copy.whyChoose.ar[idx] = { ...(copy.whyChoose.ar[idx]||{}), icon: v }; return copy; }); setHasChanges(true); }} placeholder="icon" />
                              </div>
                              <div>
                                <div className="font-medium mb-2">EN #{idx+1}</div>
                                <input className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg text-white mb-2" value={fullContent.whyChoose.en?.[idx]?.text || ''} onChange={(e)=>{ const v=e.target.value; setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.whyChoose = copy.whyChoose || { ar: [], en: [] }; copy.whyChoose.en = [...(copy.whyChoose.en||[])]; copy.whyChoose.en[idx] = { ...(copy.whyChoose.en[idx]||{}), text: v }; return copy; }); setHasChanges(true); }} placeholder="text" />
                                <input className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg text-white" value={fullContent.whyChoose.en?.[idx]?.icon || ''} onChange={(e)=>{ const v=e.target.value; setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.whyChoose = copy.whyChoose || { ar: [], en: [] }; copy.whyChoose.en = [...(copy.whyChoose.en||[])]; copy.whyChoose.en[idx] = { ...(copy.whyChoose.en[idx]||{}), icon: v }; return copy; }); setHasChanges(true); }} placeholder="icon" />
                                <div className="mt-2">
                                  <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => { setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.whyChoose = copy.whyChoose || { ar: [], en: [] }; copy.whyChoose.ar = [...(copy.whyChoose.ar||[])]; copy.whyChoose.en = [...(copy.whyChoose.en||[])]; copy.whyChoose.ar.splice(idx,1); copy.whyChoose.en.splice(idx,1); return copy; }); setHasChanges(true); }}>{language==='ar'?'حذف':'Remove'}</button>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div>
                            <button className="px-4 py-2 bg-teal text-white rounded" onClick={()=>{ setFullContent((prev:any)=>{ const copy={...(prev||{})}; copy.whyChoose = copy.whyChoose || { ar: [], en: [] }; copy.whyChoose.ar = [...(copy.whyChoose.ar||[]), { text:'', icon:'' }]; copy.whyChoose.en = [...(copy.whyChoose.en||[]), { text:'', icon:'' }]; return copy; }); setHasChanges(true); }}>{language==='ar'?'إضافة':'Add'}</button>
                          </div>
                        </div>
                      ) : sectionId === 'stats' && fullContent?.stats && typeof fullContent.stats === 'object' ? (
                        <div className="space-y-4">
                          <h4 className="font-semibold">Stats</h4>
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Arabic Stats */}
                            <div className="space-y-4">
                              <h5 className="font-medium text-sm">Arabic Stats</h5>
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-sm mb-1">Sessions</label>
                                  <input 
                                    type="number" 
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg dark:text-white text-gray-900" 
                                    value={fullContent.stats.ar?.sessions || 0} 
                                    onChange={(e)=>{ 
                                      const v = Number(e.target.value) || 0; 
                                      setFullContent((prev:any)=>{ 
                                        const copy={...(prev||{})}; 
                                        copy.stats = copy.stats || { ar: {}, en: {} }; 
                                        copy.stats.ar = { ...(copy.stats.ar||{}), sessions: v }; 
                                        return copy; 
                                      }); 
                                      setHasChanges(true); 
                                    }} 
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm mb-1">Consultations</label>
                                  <input 
                                    type="number" 
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg dark:text-white text-gray-900" 
                                    value={fullContent.stats.ar?.consultations || 0} 
                                    onChange={(e)=>{ 
                                      const v = Number(e.target.value) || 0; 
                                      setFullContent((prev:any)=>{ 
                                        const copy={...(prev||{})}; 
                                        copy.stats = copy.stats || { ar: {}, en: {} }; 
                                        copy.stats.ar = { ...(copy.stats.ar||{}), consultations: v }; 
                                        return copy; 
                                      }); 
                                      setHasChanges(true); 
                                    }} 
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm mb-1">Beneficiaries</label>
                                  <input 
                                    type="number" 
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg dark:text-white text-gray-900" 
                                    value={fullContent.stats.ar?.beneficiaries || 0} 
                                    onChange={(e)=>{ 
                                      const v = Number(e.target.value) || 0; 
                                      setFullContent((prev:any)=>{ 
                                        const copy={...(prev||{})}; 
                                        copy.stats = copy.stats || { ar: {}, en: {} }; 
                                        copy.stats.ar = { ...(copy.stats.ar||{}), beneficiaries: v }; 
                                        return copy; 
                                      }); 
                                      setHasChanges(true); 
                                    }} 
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm mb-1">Years</label>
                                  <input 
                                    type="number" 
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg dark:text-white text-gray-900" 
                                    value={fullContent.stats.ar?.years || 0} 
                                    onChange={(e)=>{ 
                                      const v = Number(e.target.value) || 0; 
                                      setFullContent((prev:any)=>{ 
                                        const copy={...(prev||{})}; 
                                        copy.stats = copy.stats || { ar: {}, en: {} }; 
                                        copy.stats.ar = { ...(copy.stats.ar||{}), years: v }; 
                                        return copy; 
                                      }); 
                                      setHasChanges(true); 
                                    }} 
                                  />
                                </div>
                              </div>
                              
                              {/* Arabic Labels */}
                              <div className="mt-4">
                                <h6 className="text-sm font-medium mb-2">Arabic Labels</h6>
                                <div className="space-y-2">
                                  {Object.keys(fullContent.stats.ar?.labels || {}).map((key: string) => (
                                    <div key={key} className="flex gap-2 items-center">
                                      <span className="text-xs text-gray-500 w-20">{key}:</span>
                                      <input 
                                        className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg dark:text-white text-gray-900" 
                                        value={fullContent.stats.ar.labels[key] || ''} 
                                        onChange={(e)=>{ 
                                          const v = e.target.value; 
                                          setFullContent((prev:any)=>{ 
                                            const copy={...(prev||{})}; 
                                            copy.stats = copy.stats || { ar: {}, en: {} }; 
                                            copy.stats.ar = { 
                                              ...(copy.stats.ar||{}), 
                                              labels: { ...(copy.stats.ar?.labels||{}), [key]: v } 
                                            }; 
                                            return copy; 
                                          }); 
                                          setHasChanges(true); 
                                        }} 
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* English Stats */}
                            <div className="space-y-4">
                              <h5 className="font-medium text-sm">English Stats</h5>
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-sm mb-1">Sessions</label>
                                  <input 
                                    type="number" 
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg dark:text-white text-gray-900" 
                                    value={fullContent.stats.en?.sessions || 0} 
                                    onChange={(e)=>{ 
                                      const v = Number(e.target.value) || 0; 
                                      setFullContent((prev:any)=>{ 
                                        const copy={...(prev||{})}; 
                                        copy.stats = copy.stats || { ar: {}, en: {} }; 
                                        copy.stats.en = { ...(copy.stats.en||{}), sessions: v }; 
                                        return copy; 
                                      }); 
                                      setHasChanges(true); 
                                    }} 
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm mb-1">Consultations</label>
                                  <input 
                                    type="number" 
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg dark:text-white text-gray-900" 
                                    value={fullContent.stats.en?.consultations || 0} 
                                    onChange={(e)=>{ 
                                      const v = Number(e.target.value) || 0; 
                                      setFullContent((prev:any)=>{ 
                                        const copy={...(prev||{})}; 
                                        copy.stats = copy.stats || { ar: {}, en: {} }; 
                                        copy.stats.en = { ...(copy.stats.en||{}), consultations: v }; 
                                        return copy; 
                                      }); 
                                      setHasChanges(true); 
                                    }} 
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm mb-1">Beneficiaries</label>
                                  <input 
                                    type="number" 
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg dark:text-white text-gray-900" 
                                    value={fullContent.stats.en?.beneficiaries || 0} 
                                    onChange={(e)=>{ 
                                      const v = Number(e.target.value) || 0; 
                                      setFullContent((prev:any)=>{ 
                                        const copy={...(prev||{})}; 
                                        copy.stats = copy.stats || { ar: {}, en: {} }; 
                                        copy.stats.en = { ...(copy.stats.en||{}), beneficiaries: v }; 
                                        return copy; 
                                      }); 
                                      setHasChanges(true); 
                                    }} 
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm mb-1">Years</label>
                                  <input 
                                    type="number" 
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg dark:text-white text-gray-900" 
                                    value={fullContent.stats.en?.years || 0} 
                                    onChange={(e)=>{ 
                                      const v = Number(e.target.value) || 0; 
                                      setFullContent((prev:any)=>{ 
                                        const copy={...(prev||{})}; 
                                        copy.stats = copy.stats || { ar: {}, en: {} }; 
                                        copy.stats.en = { ...(copy.stats.en||{}), years: v }; 
                                        return copy; 
                                      }); 
                                      setHasChanges(true); 
                                    }} 
                                  />
                                </div>
                              </div>
                              
                              {/* English Labels */}
                              <div className="mt-4">
                                <h6 className="text-sm font-medium mb-2">English Labels</h6>
                                <div className="space-y-2">
                                  {Object.keys(fullContent.stats.en?.labels || {}).map((key: string) => (
                                    <div key={key} className="flex gap-2 items-center">
                                      <span className="text-xs text-gray-500 w-20">{key}:</span>
                                      <input 
                                        className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg dark:text-white text-gray-900" 
                                        value={fullContent.stats.en.labels[key] || ''} 
                                        onChange={(e)=>{ 
                                          const v = e.target.value; 
                                          setFullContent((prev:any)=>{ 
                                            const copy={...(prev||{})}; 
                                            copy.stats = copy.stats || { ar: {}, en: {} }; 
                                            copy.stats.en = { 
                                              ...(copy.stats.en||{}), 
                                              labels: { ...(copy.stats.en?.labels||{}), [key]: v } 
                                            }; 
                                            return copy; 
                                          }); 
                                          setHasChanges(true); 
                                        }} 
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : sectionId === 'meta' && fullContent?.meta && typeof fullContent.meta === 'object' ? (
                        <div className="space-y-3">
                          <input className="w-full px-3 py-2" value={fullContent.meta.generatedFrom || ''} onChange={(e)=>{ setFullContent((prev:any)=>({ ...(prev||{}), meta: { ...(prev.meta||{}), generatedFrom: e.target.value } })); setHasChanges(true); }} placeholder="generatedFrom" />
                          <input className="w-full px-3 py-2" value={fullContent.meta.lastUpdated || ''} onChange={(e)=>{ setFullContent((prev:any)=>({ ...(prev||{}), meta: { ...(prev.meta||{}), lastUpdated: e.target.value } })); setHasChanges(true); }} placeholder="lastUpdated" />
                        </div>
                      ) : fullContent?.[sectionId] && fullContent[sectionId].ar && fullContent[sectionId].en && typeof fullContent[sectionId].ar === 'object' && typeof fullContent[sectionId].en === 'object' ? (
                        <div className="space-y-6">
                          {(Object.keys({ ...(fullContent[sectionId].ar || {}), ...(fullContent[sectionId].en || {}) })).map((key) => (
                            <div key={key} className="grid md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{key} — العربية</label>
                                {Array.isArray(fullContent[sectionId].ar[key]) ? (
                                  // array of strings
                                  <textarea
                                    rows={4}
                                    value={Array.isArray(fullContent[sectionId].ar[key]) ? (fullContent[sectionId].ar[key] as string[]).join('\n') : ''}
                                    onChange={(e) => {
                                      // preserve blank lines so admins can press Enter to create a new empty item
                                      const newArr = e.target.value.split('\n');
                                      setFullContent((prev: any) => ({
                                        ...prev,
                                        [sectionId]: { ...prev[sectionId], ar: { ...prev[sectionId].ar, [key]: newArr } }
                                      }));
                                      setHasChanges(true);
                                    }}
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg text-right"
                                  />
                                ) : typeof fullContent[sectionId].ar[key] === 'string' ? (
                                  <input
                                    type="text"
                                    value={fullContent[sectionId].ar[key] || ''}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setFullContent((prev: any) => ({
                                        ...prev,
                                        [sectionId]: { ...prev[sectionId], ar: { ...prev[sectionId].ar, [key]: val } }
                                      }));
                                      setHasChanges(true);
                                    }}
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg text-right"
                                  />
                                ) : (
                                  // complex type fallback to JSON input
                                  <textarea
                                    rows={4}
                                    value={JSON.stringify(fullContent[sectionId].ar[key] || '', null, 2)}
                                    onChange={(e) => {
                                      try {
                                        const parsed = JSON.parse(e.target.value);
                                        setFullContent((prev: any) => ({
                                          ...prev,
                                          [sectionId]: { ...prev[sectionId], ar: { ...prev[sectionId].ar, [key]: parsed } }
                                        }));
                                        setHasChanges(true);
                                      } catch {
                                        // ignore until valid JSON
                                      }
                                    }}
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg text-right font-mono"
                                  />
                                )}
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{key} — English</label>
                                {Array.isArray(fullContent[sectionId].en[key]) ? (
                                  <textarea
                                    rows={4}
                                    value={Array.isArray(fullContent[sectionId].en[key]) ? (fullContent[sectionId].en[key] as string[]).join('\n') : ''}
                                    onChange={(e) => {
                                      // preserve blank lines so admins can press Enter to create a new empty item
                                      const newArr = e.target.value.split('\n');
                                      setFullContent((prev: any) => ({
                                        ...prev,
                                        [sectionId]: { ...prev[sectionId], en: { ...prev[sectionId].en, [key]: newArr } }
                                      }));
                                      setHasChanges(true);
                                    }}
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg"
                                  />
                                ) : typeof fullContent[sectionId].en[key] === 'string' ? (
                                  <input
                                    type="text"
                                    value={fullContent[sectionId].en[key] || ''}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setFullContent((prev: any) => ({
                                        ...prev,
                                        [sectionId]: { ...prev[sectionId], en: { ...prev[sectionId].en, [key]: val } }
                                      }));
                                      setHasChanges(true);
                                    }}
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg"
                                  />
                                ) : (
                                  <textarea
                                    rows={4}
                                    value={JSON.stringify(fullContent[sectionId].en[key] || '', null, 2)}
                                    onChange={(e) => {
                                      try {
                                        const parsed = JSON.parse(e.target.value);
                                        setFullContent((prev: any) => ({
                                          ...prev,
                                          [sectionId]: { ...prev[sectionId], en: { ...prev[sectionId].en, [key]: parsed } }
                                        }));
                                        setHasChanges(true);
                                      } catch {
                                        // ignore until valid JSON
                                      }
                                    }}
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg font-mono"
                                  />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{language === 'ar' ? 'تحرير هذا القسم كـ JSON' : 'Edit this section as JSON'}</p>
                          <textarea
                            value={JSON.stringify(fullContent?.[sectionId], null, 2) || ''}
                            onChange={(e) => {
                              try {
                                const parsed = JSON.parse(e.target.value);
                                setFullContent((prev: any) => ({ ...prev, [sectionId]: parsed }));
                                setHasChanges(true);
                              } catch {
                                // ignore parse errors while typing
                              }
                            }}
                            rows={12}
                            className="w-full font-mono text-sm p-3 bg-gray-50 dark:bg-gray-700 border rounded-lg"
                          />
                        </div>
                      )}
                    </div>

                    {/* Profile image upload (global) */}
                    {sectionId === 'about' && (
                      <div className="pt-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{language === 'ar' ? 'صورة الملف الشخصي' : 'Profile Image'}</h4>
                        <div className="flex items-center gap-4">
                          <input id="admin-profile-file" type="file" accept="image/*" className="hidden" onChange={async (e) => {
                            const selectedFile = e.target.files?.[0];
                            if (!selectedFile) return;
                            setProfileImageFileName(selectedFile.name);

                            const readAsDataUrl = (f: File) => new Promise<string>((resolve, reject) => {
                              const fr = new FileReader();
                              fr.onload = () => resolve(String(fr.result));
                              fr.onerror = () => reject(new Error('file read error'));
                              fr.readAsDataURL(f);
                            });

                            try {
                              // Upload to server which will store in Supabase images bucket and return a public URL
                              const form = new FormData();
                              form.append('file', selectedFile);
                              // ask server to store this upload as the canonical profile image filename so
                              // each upload replaces the previous object in the public images bucket.
                              form.append('target', 'Profile_image.png');

                              const res = await fetch('/api/images', {
                                method: 'POST',
                                body: form,
                                headers: {
                                  'x-admin-key': process.env.NEXT_PUBLIC_ADMIN_API_KEY || ''
                                }
                              });

                              if (res.ok) {
                                const json = await res.json().catch(() => ({}));
                                const publicUrl = json?.publicUrl as string | undefined;
                                if (publicUrl) {
                                  // preview and update content (no localStorage)
                                  setProfileImageDataUrl(publicUrl);
                                  setFullContent((prev: any) => {
                                    const copy = { ...(prev || {}) };
                                    if (!copy.about) copy.about = {};
                                    if (!copy.about.ar) copy.about.ar = {};
                                    if (!copy.about.en) copy.about.en = {};
                                    copy.about.ar.image = publicUrl;
                                    copy.about.en.image = publicUrl;
                                    return copy;
                                  });
                                  setHasChanges(true);
                                  (e.target as HTMLInputElement).value = '';

                                  // Build an updated content object (avoid relying on possibly stale fullContent state)
                                  try {
                                    const updated = (() => {
                                      try {
                                        const copy = JSON.parse(JSON.stringify(fullContent || {}));
                                        if (!copy.about) copy.about = {};
                                        if (!copy.about.ar) copy.about.ar = {};
                                        if (!copy.about.en) copy.about.en = {};
                                        copy.about.ar.image = publicUrl;
                                        copy.about.en.image = publicUrl;
                                        return copy;
                                      } catch {
                                        // fallback if cloning fails
                                        const copy: any = fullContent || {};
                                        if (!copy.about) copy.about = {};
                                        if (!copy.about.ar) copy.about.ar = {};
                                        if (!copy.about.en) copy.about.en = {};
                                        copy.about.ar.image = publicUrl;
                                        copy.about.en.image = publicUrl;
                                        return copy;
                                      }
                                    })();

                                    // update local state immediately
                                    setFullContent(updated);
                                    setProfileImageDataUrl(publicUrl);
                                    setHasChanges(false);

                                    // publish the updated content to Supabase so public site reads the new image
                                    const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_API_KEY || '';
                                    const publishRes = await fetch('/api/content', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-key': ADMIN_KEY }, body: JSON.stringify(updated) });
                                    const publishJson = await publishRes.json().catch(()=>({}));
                                    if (publishRes.ok) {
                                      setSaveStatus('saved');
                                      setRawJson(JSON.stringify(updated, null, 2));
                                      try { window.dispatchEvent(new Event('mohcareer_content_updated')); } catch {}
                                    } else {
                                      console.warn('Failed to publish content after image upload', publishJson);
                                      setSaveStatus('error');
                                    }
                                  } catch (err) {
                                    console.warn('Auto-publish failed', err);
                                    setSaveStatus('error');
                                  } finally {
                                    setTimeout(()=>setSaveStatus('idle'), 2000);
                                  }

                                  return;
                                }
                              }

                              // If we reach here, server upload failed or returned no publicUrl.
                              // Fall back to a local data-URL preview (no localStorage) so admin can still preview before manual save.
                              const dataUrl = await readAsDataUrl(selectedFile);
                              setProfileImageDataUrl(dataUrl);
                              setFullContent((prev: any) => {
                                const copy = { ...(prev || {}) };
                                if (!copy.about) copy.about = {};
                                if (!copy.about.ar) copy.about.ar = {};
                                if (!copy.about.en) copy.about.en = {};
                                copy.about.ar.image = dataUrl;
                                copy.about.en.image = dataUrl;
                                return copy;
                              });
                              setHasChanges(true);

                              // log server error body if available for debugging
                              try { const txt = await res.text().catch(()=>'' as any); if (txt) console.error('Image upload failed:', txt); } catch {}
                            } catch (err) {
                              // On unexpected errors, still provide a local preview and allow saving
                              console.error('upload error', err);
                              try {
                                const dataUrl = await readAsDataUrl(selectedFile);
                                setProfileImageDataUrl(dataUrl);
                                setFullContent((prev: any) => {
                                  const copy = { ...(prev || {}) };
                                  if (!copy.about) copy.about = {};
                                  if (!copy.about.ar) copy.about.ar = {};
                                  if (!copy.about.en) copy.about.en = {};
                                  copy.about.ar.image = dataUrl;
                                  copy.about.en.image = dataUrl;
                                  return copy;
                                });
                                setHasChanges(true);
                              } catch (readErr) {
                                // final fallback: do nothing but log
                                console.error('failed to create local preview', readErr);
                              }
                              }
                          }} />

                          <button className="px-6 py-3 border rounded-lg bg-transparent text-sm" onClick={() => { const inp = document.getElementById('admin-profile-file') as HTMLInputElement|null; inp?.click(); }}>
                            {language === 'ar' ? 'اختر ملف' : 'Choose File'}
                          </button>

                          <div className="text-sm text-gray-700 dark:text-gray-300">{profileImageFileName || (language === 'ar' ? 'لم يتم اختيار ملف' : 'No file chosen')}</div>

                          {profileImageDataUrl && (
                            // show preview (external URL or data url) — hardened to retry once if broken
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={profileImageDataUrl}
                              alt="profile"
                              className="w-24 h-24 object-cover rounded-lg border"
                              decoding="async"
                              crossOrigin="anonymous"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                const img = e.currentTarget as HTMLImageElement;
                                try {
                                  const src = img.src || '';
                                  if (!src.includes('cb=')) {
                                    const sep = src.includes('?') ? '&' : '?';
                                    img.src = `${src}${sep}cb=${Date.now()}`;
                                    return;
                                  }
                                } catch {}
                                if (img.src !== DEFAULT_PROFILE_IMAGE) img.src = DEFAULT_PROFILE_IMAGE;
                              }}
                            />
                          )}
                          
                          {/* Image position control */}
                          <div className="ml-4">
                            <label className="text-sm block mb-1">{language === 'ar' ? 'محاذاة الصورة' : 'Image Position'}</label>
                            <select value={fullContent?.about?.[language]?.imagePosition || fullContent?.about?.ar?.imagePosition || 'center'} onChange={(e) => {
                              const val = e.target.value;
                              setFullContent((prev: any) => {
                                const copy = { ...(prev || {}) };
                                if (!copy.about) copy.about = {};
                                if (!copy.about.ar) copy.about.ar = {};
                                if (!copy.about.en) copy.about.en = {};
                                copy.about.ar.imagePosition = val;
                                copy.about.en.imagePosition = val;
                                return copy;
                              });
                              setHasChanges(true);
                            }} className="text-sm p-2 rounded border bg-white dark:bg-gray-700">
                              <option value="center">{language === 'ar' ? 'مركز' : 'Center'}</option>
                              <option value="top">{language === 'ar' ? 'أعلى' : 'Top'}</option>
                              <option value="bottom">{language === 'ar' ? 'أسفل' : 'Bottom'}</option>
                              <option value="left">{language === 'ar' ? 'يسار' : 'Left'}</option>
                              <option value="right">{language === 'ar' ? 'يمين' : 'Right'}</option>
                            </select>
                          </div>
                        </div>

                        {/* About CTA link inputs removed — use hero or raw JSON to edit CTA links */}
                      </div>
                    )}

                    {/* Hero CTA link editor removed to avoid duplicate CTA inputs — edit CTAs from About or hero data in the JSON instead */}

                    {/* Raw JSON editor toggle */}
                    <div className="pt-4">
                      <label className="inline-flex items-center gap-2">
                        <input type="checkbox" checked={showRawEditor} onChange={(e) => setShowRawEditor(e.target.checked)} />
                        <span className="text-sm">{language === 'ar' ? 'محرر JSON الكامل' : 'Full JSON Editor'}</span>
                      </label>

                      {showRawEditor && (
                        <div className="mt-4">
                          <textarea value={rawJson} onChange={(e) => setRawJson(e.target.value)} rows={18} className="w-full font-mono text-sm p-3 bg-gray-50 dark:bg-gray-700 border rounded-lg" />
                          <p className="text-xs text-gray-500 mt-2">{language === 'ar' ? 'يمكنك تحرير كل كلمات ومحتويات المشروع هنا. احفظ لتطبيق التغييرات.' : 'Edit all site words and structure here. Save to apply.'}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
