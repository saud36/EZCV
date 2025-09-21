
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CVData, ThemeSettings, PersonalInfo, Experience, Education, Skill, Language, Project, SocialLink, CustomSection } from '../types';
import { THEMES, FONTS, LANGUAGE_PROFICIENCY } from '../constants';
import { ChevronDownIcon, ChevronUpIcon, PlusIcon, TrashIcon, ResetIcon } from './Icons';

interface SidebarProps {
  cvData: CVData;
  onUpdate: <K extends keyof CVData, V extends CVData[K]>(section: K, value: V) => void;
  onReset: () => void;
  theme: ThemeSettings;
  onThemeChange: (theme: ThemeSettings) => void;
}

// Reusable Collapsible Section Component
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="border-b border-custom-gray-200 dark:border-custom-gray-700">
      <button
        className="w-full flex justify-between items-center p-4 text-left font-semibold text-custom-gray-700 dark:text-custom-gray-200 hover:bg-custom-gray-50 dark:hover:bg-custom-gray-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </button>
      {isOpen && <div className="p-4 space-y-4">{children}</div>}
    </div>
  );
};


const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-custom-gray-600 dark:text-custom-gray-300 mb-1">{label}</label>
    <input
      {...props}
      className="w-full px-3 py-2 bg-white dark:bg-custom-gray-800 border border-custom-gray-300 dark:border-custom-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
    />
  </div>
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-custom-gray-600 dark:text-custom-gray-300 mb-1">{label}</label>
      <textarea
        {...props}
        rows={4}
        className="w-full px-3 py-2 bg-white dark:bg-custom-gray-800 border border-custom-gray-300 dark:border-custom-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
      />
    </div>
);

// Editor components defined inside Sidebar.tsx
const PersonalInfoEditor: React.FC<{ data: PersonalInfo; onUpdate: (data: PersonalInfo) => void }> = ({ data, onUpdate }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...data, [e.target.name]: e.target.value });
  };
  return (
    <div className="space-y-4">
      <Input label="Full Name" name="name" value={data.name} onChange={handleChange} />
      <Input label="Job Title" name="jobTitle" value={data.jobTitle} onChange={handleChange} />
      <Input label="Email" name="email" type="email" value={data.email} onChange={handleChange} />
      <Input label="Phone" name="phone" type="tel" value={data.phone} onChange={handleChange} />
      <Input label="Website" name="website" value={data.website} onChange={handleChange} />
      <Input label="Photo URL" name="photo" value={data.photo} onChange={handleChange} />
    </div>
  );
};

const ExperienceEditor: React.FC<{ data: Experience[]; onUpdate: (data: Experience[]) => void }> = ({ data, onUpdate }) => {
    const handleChange = (id: string, field: keyof Experience, value: string) => {
        onUpdate(data.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
    };
    const addExperience = () => {
        onUpdate([...data, { id: uuidv4(), company: '', position: '', startDate: '', endDate: '', description: '' }]);
    };
    const removeExperience = (id: string) => {
        onUpdate(data.filter(exp => exp.id !== id));
    };
    return (
        <div className="space-y-4">
            {data.map((exp) => (
                <div key={exp.id} className="p-4 border rounded-md dark:border-custom-gray-600 space-y-3 relative">
                     <button onClick={() => removeExperience(exp.id)} className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700"><TrashIcon /></button>
                    <Input label="Company" value={exp.company} onChange={e => handleChange(exp.id, 'company', e.target.value)} />
                    <Input label="Position" value={exp.position} onChange={e => handleChange(exp.id, 'position', e.target.value)} />
                    <div className="flex gap-4">
                        <Input label="Start Date" value={exp.startDate} onChange={e => handleChange(exp.id, 'startDate', e.target.value)} />
                        <Input label="End Date" value={exp.endDate} onChange={e => handleChange(exp.id, 'endDate', e.target.value)} />
                    </div>
                    <Textarea label="Description" value={exp.description} onChange={e => handleChange(exp.id, 'description', e.target.value)} />
                </div>
            ))}
            <button onClick={addExperience} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                <PlusIcon /> Add Experience
            </button>
        </div>
    );
};

const EducationEditor: React.FC<{ data: Education[]; onUpdate: (data: Education[]) => void }> = ({ data, onUpdate }) => {
  const handleChange = (id: string, field: keyof Education, value: string) => {
    onUpdate(data.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
  };
  const addEducation = () => {
    onUpdate([...data, { id: uuidv4(), institution: '', degree: '', graduationDate: '' }]);
  };
  const removeEducation = (id: string) => {
    onUpdate(data.filter(edu => edu.id !== id));
  };
  return (
    <div className="space-y-4">
      {data.map((edu) => (
        <div key={edu.id} className="p-4 border rounded-md dark:border-custom-gray-600 space-y-3 relative">
          <button onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700"><TrashIcon /></button>
          <Input label="Institution" value={edu.institution} onChange={e => handleChange(edu.id, 'institution', e.target.value)} />
          <Input label="Degree" value={edu.degree} onChange={e => handleChange(edu.id, 'degree', e.target.value)} />
          <div className="flex gap-4">
            <Input label="Graduation Date" value={edu.graduationDate} onChange={e => handleChange(edu.id, 'graduationDate', e.target.value)} />
            <Input label="GPA (Optional)" value={edu.gpa || ''} onChange={e => handleChange(edu.id, 'gpa', e.target.value)} />
          </div>
        </div>
      ))}
      <button onClick={addEducation} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
          <PlusIcon /> Add Education
      </button>
    </div>
  );
};


const SkillsEditor: React.FC<{ skills: Skill[]; languages: Language[]; onUpdateSkills: (data: Skill[]) => void; onUpdateLangs: (data: Language[]) => void; }> = ({ skills, languages, onUpdateSkills, onUpdateLangs }) => {
    const handleSkillChange = (id: string, field: keyof Skill, value: string | number) => {
        onUpdateSkills(skills.map(s => s.id === id ? { ...s, [field]: value } : s));
    };
    const addSkill = () => { onUpdateSkills([...skills, { id: uuidv4(), name: '', level: 50 }]); };
    const removeSkill = (id: string) => { onUpdateSkills(skills.filter(s => s.id !== id)); };

    const handleLangChange = (id: string, field: keyof Language, value: string) => {
        onUpdateLangs(languages.map(l => l.id === id ? { ...l, [field]: value } : l));
    };
    const addLang = () => { onUpdateLangs([...languages, { id: uuidv4(), name: '', proficiency: 'Intermediate' }]); };
    const removeLang = (id: string) => { onUpdateLangs(languages.filter(l => l.id !== id)); };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="font-semibold mb-2 dark:text-custom-gray-200">Technical Skills</h3>
                <div className="space-y-2">
                    {skills.map(skill => (
                        <div key={skill.id} className="flex items-center gap-2">
                            <Input label="" placeholder="Skill name" value={skill.name} onChange={e => handleSkillChange(skill.id, 'name', e.target.value)} className="flex-grow"/>
                            <input type="range" min="0" max="100" value={skill.level} onChange={e => handleSkillChange(skill.id, 'level', parseInt(e.target.value, 10))} className="w-24"/>
                            <span className="text-sm w-8">{skill.level}%</span>
                            <button onClick={() => removeSkill(skill.id)} className="p-1 text-red-500 hover:text-red-700"><TrashIcon /></button>
                        </div>
                    ))}
                </div>
                 <button onClick={addSkill} className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    <PlusIcon /> Add Skill
                </button>
            </div>
             <div>
                <h3 className="font-semibold mb-2 dark:text-custom-gray-200">Languages</h3>
                <div className="space-y-2">
                     {languages.map(lang => (
                        <div key={lang.id} className="flex items-center gap-2">
                            <Input label="" placeholder="Language" value={lang.name} onChange={e => handleLangChange(lang.id, 'name', e.target.value)} className="flex-grow"/>
                            <select value={lang.proficiency} onChange={e => handleLangChange(lang.id, 'proficiency', e.target.value)} className="px-3 py-2 bg-white dark:bg-custom-gray-800 border border-custom-gray-300 dark:border-custom-gray-600 rounded-md">
                                {LANGUAGE_PROFICIENCY.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                            <button onClick={() => removeLang(lang.id)} className="p-1 text-red-500 hover:text-red-700"><TrashIcon /></button>
                        </div>
                    ))}
                </div>
                 <button onClick={addLang} className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    <PlusIcon /> Add Language
                </button>
            </div>
        </div>
    );
};

export const Sidebar: React.FC<SidebarProps> = ({ cvData, onUpdate, onReset, theme, onThemeChange }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto text-sm text-custom-gray-800 dark:text-custom-gray-200">
        <Section title="Design & Template">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-custom-gray-600 dark:text-custom-gray-300 mb-1">Template</label>
                    <select value={theme.template} onChange={e => onThemeChange({...theme, template: e.target.value as 'modern' | 'classic'})} className="w-full px-3 py-2 bg-white dark:bg-custom-gray-800 border border-custom-gray-300 dark:border-custom-gray-600 rounded-md">
                        <option value="modern">Modern</option>
                        <option value="classic">Classic</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-custom-gray-600 dark:text-custom-gray-300 mb-1">Color Scheme</label>
                    <div className="grid grid-cols-3 gap-2">
                        {THEMES.map(t => (
                            <button key={t.name} onClick={() => onThemeChange({...theme, color: t.colors})} className={`p-2 rounded-md border-2 ${theme.color.primary === t.colors.primary ? 'border-blue-500' : 'border-transparent'}`}>
                                <div className="flex items-center gap-1">
                                    <span style={{ backgroundColor: t.colors.primary }} className="w-4 h-4 rounded-full"></span>
                                    <span className="text-xs">{t.name}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-custom-gray-600 dark:text-custom-gray-300 mb-1">Font Family</label>
                    <select value={theme.font} onChange={e => onThemeChange({...theme, font: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-custom-gray-800 border border-custom-gray-300 dark:border-custom-gray-600 rounded-md">
                        {FONTS.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                    </select>
                </div>
            </div>
        </Section>
        <Section title="Personal Information">
            <PersonalInfoEditor data={cvData.personal} onUpdate={(data) => onUpdate('personal', data)} />
        </Section>
        <Section title="Professional Summary">
            <Textarea label="" value={cvData.summary} onChange={(e) => onUpdate('summary', e.target.value)} />
        </Section>
        <Section title="Work Experience">
            <ExperienceEditor data={cvData.experience} onUpdate={(data) => onUpdate('experience', data)} />
        </Section>
        <Section title="Education">
            <EducationEditor data={cvData.education} onUpdate={(data) => onUpdate('education', data)} />
        </Section>
        <Section title="Skills & Languages">
            <SkillsEditor 
              skills={cvData.skills} 
              languages={cvData.languages} 
              onUpdateSkills={(data) => onUpdate('skills', data)} 
              onUpdateLangs={(data) => onUpdate('languages', data)}
            />
        </Section>
      </div>
      <div className="p-4 border-t border-custom-gray-200 dark:border-custom-gray-700">
        <button onClick={onReset} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
          <ResetIcon /> Reset All Data
        </button>
      </div>
    </div>
  );
};
