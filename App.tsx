
import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Preview } from './components/Preview';
import { useCvData } from './hooks/useCvData';
import { CVData, ThemeSettings } from './types';
import { THEMES, FONTS, initialCVData } from './constants';
import { exportToPdf } from './services/pdfService';
import { DownloadIcon, UploadIcon, MoonIcon, SunIcon, MenuIcon, XIcon } from './components/Icons';

const App: React.FC = () => {
  const { cvData, setCvData, updateCvData, resetCvData } = useCvData(initialCVData);
  const [theme, setTheme] = useState<ThemeSettings>({
    color: THEMES[0].colors,
    font: FONTS[0].value,
    template: 'modern',
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const cvPreviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('cv-theme');
    if (savedTheme) {
      setTheme(JSON.parse(savedTheme));
    }
    const savedDarkMode = localStorage.getItem('cv-dark-mode');
    if (savedDarkMode) {
      const isDark = JSON.parse(savedDarkMode);
      setIsDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cv-theme', JSON.stringify(theme));
  }, [theme]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const isDark = !prev;
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('cv-dark-mode', JSON.stringify(isDark));
      return isDark;
    });
  };

  const handleJsonImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result;
          if (typeof content === 'string') {
            const importedData: CVData = JSON.parse(content);
            setCvData(importedData);
            alert('CV data imported successfully!');
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
          alert('Failed to import CV data. The file might be corrupted or in the wrong format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleJsonExport = () => {
    const jsonString = JSON.stringify(cvData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cv-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`font-${theme.font} transition-colors duration-300`}>
      <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-custom-gray-900 border-b border-custom-gray-200 dark:border-custom-gray-700 z-30 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md text-custom-gray-600 dark:text-custom-gray-300 hover:bg-custom-gray-100 dark:hover:bg-custom-gray-800 lg:hidden"
          >
            {isSidebarOpen ? <XIcon /> : <MenuIcon />}
          </button>
          <h1 className="text-xl font-bold text-custom-gray-800 dark:text-custom-gray-100">Modern CV Builder</h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <input type="file" id="import-json" className="hidden" accept=".json" onChange={handleJsonImport} />
          <label htmlFor="import-json" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-custom-gray-700 dark:text-custom-gray-200 bg-custom-gray-100 dark:bg-custom-gray-800 rounded-md hover:bg-custom-gray-200 dark:hover:bg-custom-gray-700 cursor-pointer transition-colors">
            <UploadIcon />
            <span className="hidden sm:inline">Import JSON</span>
          </label>
          <button onClick={handleJsonExport} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-custom-gray-700 dark:text-custom-gray-200 bg-custom-gray-100 dark:bg-custom-gray-800 rounded-md hover:bg-custom-gray-200 dark:hover:bg-custom-gray-700 transition-colors">
            <DownloadIcon />
            <span className="hidden sm:inline">Export JSON</span>
          </button>
          <button onClick={() => exportToPdf(cvPreviewRef, cvData.personal.name)} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
            <DownloadIcon />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
          <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-custom-gray-100 dark:hover:bg-custom-gray-800 text-custom-gray-600 dark:text-custom-gray-300 transition-colors">
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </header>

      <main className="flex pt-16 h-screen">
        <aside className={`fixed lg:relative top-16 lg:top-0 bottom-0 lg:h-auto z-20 w-80 lg:w-96 bg-white dark:bg-custom-gray-900 border-r border-custom-gray-200 dark:border-custom-gray-700 transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
          <Sidebar
            cvData={cvData}
            onUpdate={updateCvData}
            onReset={resetCvData}
            theme={theme}
            onThemeChange={setTheme}
          />
        </aside>
        <div className="flex-1 p-4 lg:p-10 overflow-y-auto bg-custom-gray-100 dark:bg-custom-gray-800">
           <div className="max-w-[8.5in] mx-auto">
                <Preview ref={cvPreviewRef} cvData={cvData} theme={theme} />
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;
