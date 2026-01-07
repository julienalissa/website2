"use client";

import { useState } from "react";
import { SimpleRichTextEditor } from "../SimpleRichTextEditor";

interface PageEditorProps {
  pageSlug: string;
  pageTitle: string;
  sections: Array<{
    key: string;
    label: string;
    type: "text" | "html" | "image";
    value: string;
    placeholder?: string;
  }>;
  onSave: (sections: Record<string, string>) => Promise<void>;
}

export function PageEditor({ pageSlug, pageTitle, sections, onSave }: PageEditorProps) {
  const [editedSections, setEditedSections] = useState<Record<string, string>>(
    sections.reduce((acc, section) => {
      acc[section.key] = section.value;
      return acc;
    }, {} as Record<string, string>)
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(editedSections);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{pageTitle}</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Sauvegarde...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Sauvegarder les modifications
            </>
          )}
        </button>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.key} className="border-b pb-6 last:border-b-0">
            <label className="block text-sm font-semibold mb-3 text-gray-700">
              {section.label}
            </label>
            {section.type === "html" ? (
              <SimpleRichTextEditor
                value={editedSections[section.key] || ""}
                onChange={(value) => {
                  setEditedSections({ ...editedSections, [section.key]: value });
                }}
                placeholder={section.placeholder || "Écrivez votre contenu..."}
              />
            ) : section.type === "image" ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editedSections[section.key] || ""}
                  onChange={(e) => {
                    setEditedSections({ ...editedSections, [section.key]: e.target.value });
                  }}
                  placeholder="URL de l'image (ex: https://...)"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
                {editedSections[section.key] && (
                  <div className="relative h-48 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={editedSections[section.key]}
                      alt="Aperçu"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <textarea
                value={editedSections[section.key] || ""}
                onChange={(e) => {
                  setEditedSections({ ...editedSections, [section.key]: e.target.value });
                }}
                placeholder={section.placeholder || "Écrivez votre texte..."}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
